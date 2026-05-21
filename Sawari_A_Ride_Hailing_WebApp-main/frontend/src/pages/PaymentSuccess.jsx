import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";

const PaymentSuccess = (props) => {
  const [searchParams] = useSearchParams();
  const rideId = searchParams.get("rideId");
  const navigate = useNavigate();
  const { state } = useLocation();
  const rideData = state?.rideData;
  console.log("Sending rideId:", rideData?._id);
  console.log("Token:", localStorage.getItem("token"));
  async function endRide() {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/rides/end-ride`,
      {
        rideId: props.rideData?._id,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (response.status === 200) {
      navigate("/captain-home");
    }
  }

  return (
    <div className="h-screen flex flex-col justify-center items-center text-center px-6">
      <h1 className="text-4xl font-bold text-green-600 mb-4">
        Payment Successful
      </h1>
      <p className="text-lg text-gray-700 mb-6">
        Thank you! Your ride payment has been completed.
      </p>
      <Link
        to="/home"
        className="bg-green-700 text-white py-2 px-5 rounded-lg text-lg font-semibold"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default PaymentSuccess;
