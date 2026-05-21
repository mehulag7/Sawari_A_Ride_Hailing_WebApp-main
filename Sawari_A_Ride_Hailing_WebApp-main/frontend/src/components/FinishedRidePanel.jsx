import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FinishRidePanel = (props) => {
  const navigate = useNavigate();
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
    <div>
      <div className="flex items-cols justify-between relative">
        <h2 className="text-2xl font-bold mb-5">Finish this Ride</h2>
        <h5
          onClick={() => {
            props.setFinishRidePanel(false);
          }}
          className="text-3xl text-gray-500 cursor-pointer opacity-100"
        >
          <i className="ri-arrow-down-wide-fill absolute top-0.7 right-5 "></i>
        </h5>
      </div>
      <div className="flex items-center justify-between border-2 bg-gray-100 p-3 border-yellow-400 rounded-xl">
        <div className="flex items-center gap-3">
          <img
            className="h-15 object-cover w-15 rounded-full"
            src="https://img.etimg.com/thumb/width-420,height-315,imgsize-9870,resizemode-75,msid-112069891/news/politics-and-nation/rahul-gandhis-inner-circle-a-mix-of-fresh-and-seasoned-leaders.jpg"
            alt=""
          />
          <h2 className="text-lg font-medium">
            {props.rideData?.user.fullname.firstname}
          </h2>
        </div>
        <h5 className="text-lg font-semibold">
          {typeof props.rideData?.distance === "number"
            ? `${props.rideData.distance.toFixed(2)} km`
            : "--"}
        </h5>
      </div>
      <div className="flex gap-4 mt-1 justify-between items-center flex-col">
        <div className="w-full  flex flex-col gap-4 mt-3">
          <div className="flex items-center gap-5 border-b-2 border-gray-100 pb-4">
            <h5 className="text-3xl ml-1">
              <i className="ri-map-pin-fill"></i>
            </h5>
            <div className="flex flex-col justify-center">
              <h2 className="text-2xl font-semibold">Start Point</h2>
              <p className="text-gray-600 text-md font-medium">
                {props.rideData?.pickup}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 border-b-2 border-gray-100 pb-4">
            <h5 className="text-3xl ml-1">
              <i className="ri-map-pin-range-fill"></i>
            </h5>
            <div className="flex flex-col justify-center">
              <h2 className="text-2xl font-semibold">End Point</h2>
              <p className="text-gray-600 text-md font-medium">
                {props.rideData?.destination}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 border-b-2 border-gray-100 pb-4">
            <h5 className="text-3xl ml-1">
              <i className="ri-cash-line"></i>
            </h5>
            <div className="flex flex-col justify-center">
              <h2 className="text-2xl font-semibold">Cash</h2>
              <p className="text-gray-600 text-md font-medium">
                ₹
                {typeof props.rideData?.fare === "number"
                  ? props.rideData?.fare.toFixed(2)
                  : "--"}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-6 w-full">
          <button
            onClick={endRide}
            className="w-full mt-5 flex justify-center bg-green-700 text-white text-lg font-semibold p-3 rounded-lg"
          >
            Finish Ride
          </button>
          <p className="text-red-500 text-sm mt-4">
            click on finish ride if you have completed payment
          </p>
        </div>
      </div>
    </div>
  );
};

export default FinishRidePanel;
