import React, { useContext, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SocketContext } from "../context/SocketContext";
import LiveTracking from "../components/LiveTracking";
import { loadStripe } from "@stripe/stripe-js";

const Riding = () => {
  const location = useLocation();
  const { ride } = location.state || {};
  const { socket } = useContext(SocketContext);
  const navigate = useNavigate();
  const makePayment = async () => {
    try {
      const stripe = await loadStripe(
        import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
      );

      const response = await fetch(
        "http://localhost:4000/api/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: ride?.fare || 100,
            rideId: ride?._id,
          }),
        }
      );

      const text = await response.text();
      console.log("Raw response text:", text);

      // Attempt to parse it as JSON
      const session = JSON.parse(text);

      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        console.error(result.error.message);
      }
    } catch (err) {
      console.error("Payment error:", err);
    }
  };

  useEffect(() => {
    if (!socket) return;

    const handleRideEnded = () => {
      navigate("/home");
    };

    socket.on("ride-ended", handleRideEnded);

    // Clean up on unmount to prevent memory leak
    return () => {
      socket.off("ride-ended", handleRideEnded);
    };
  }, [socket, navigate]);

  return (
    <div className="h-screen">
      <Link
        to="/home"
        className="fixed h-10 w-10 bg-white flex items-center justify-center rounded-full right-2 top-2"
      >
        <i className="text-lg font-md ri-home-4-fill"></i>
      </Link>
      <div className="h-1/2">
        <LiveTracking></LiveTracking>
      </div>
      <div className="h-1/2 p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <img
              className="h-12"
              src="https://swyft.pl/wp-content/uploads/2023/05/can-1-person-use-uberx.jpg"
              alt=""
            />
          </div>
          <div className="text-right">
            <h2 className="text-lg font-semibold mb-2">
              {ride?.captain.fullname.firstname +
                " " +
                ride?.captain.fullname.lastname}
            </h2>
            <h4 className="text-xl font-bold -mt-1">
              {ride?.captain.vehicle.plate}
            </h4>
            <p className="text-sm font-medium text-gray-600">
              Maruti Suzuki Alto
            </p>
          </div>
        </div>
        <div className="flex gap-4 mt-1 justify-between items-center flex-col">
          <div className="w-full  flex flex-col gap-4 mt-3">
            <div className="flex items-center gap-5 border-b-2 border-gray-100 pb-4">
              <h5 className="text-3xl ml-1">
                <i className="ri-map-pin-range-fill"></i>
              </h5>
              <div className="flex flex-col justify-center">
                <h2 className="text-2xl font-semibold">End Point</h2>
                <p className="text-gray-600 text-md font-medium">
                  {ride?.destination}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-5 border-b-2 border-gray-100 pb-1">
              <h5 className="text-3xl ml-1">
                <i className="ri-cash-line"></i>
              </h5>
              <div className="flex flex-col justify-center">
                <h2 className="text-2xl font-semibold">Cash</h2>
                <p className="text-gray-600 text-md font-medium">
                  ₹
                  {typeof ride?.fare === "number"
                    ? ride?.fare.toFixed(2)
                    : "--"}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={makePayment}
            rideData={rideData}
            className="w-full mt-1 bg-green-700 text-white text-lg font-semibold p-3 rounded-lg mb-3"
          >
            Make Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Riding;
