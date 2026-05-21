import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ConfirmRidePopUp = (props) => {
  const [otp, setotp] = useState("");
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/rides/start-ride`,
      {
        params: { rideId: props.ride._id, otp: otp },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    if (response.status === 200) {
      props.setConfirmRidePopUpPanel(false);
      props.setRidePopUpPanel(false);
      navigate("/captain-riding", { state: { ride: props.ride } });
    }
  };

  return (
    <div>
      <div className="flex items-cols justify-between relative">
        <h2 className="text-2xl font-bold mb-5">Confirm this Ride to Start</h2>
        <h5
          onClick={() => {
            props.setConfirmRidePopUpPanel(false);
          }}
          className="text-3xl text-gray-500 cursor-pointer opacity-100"
        >
          <i className="ri-arrow-down-wide-fill absolute top-0.7 right-5 "></i>
        </h5>
      </div>
      <div className="flex items-center justify-between p-3 bg-yellow-400 rounded-xl">
        <div className="flex items-center gap-3">
          <img
            className="h-15 object-cover w-15 rounded-full"
            src="https://img.etimg.com/thumb/width-420,height-315,imgsize-9870,resizemode-75,msid-112069891/news/politics-and-nation/rahul-gandhis-inner-circle-a-mix-of-fresh-and-seasoned-leaders.jpg"
            alt=""
          />
          <h2 className="text-lg font-medium capitalize">
            {props.ride?.user.fullname.firstname +
              " " +
              props.ride?.user.fullname.lastname}
          </h2>
        </div>
        <h5 className="text-lg font-semibold">
          {typeof props.ride?.distance === "number"
            ? `${props.ride.distance.toFixed(2)} km`
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
                {props.ride?.pickup}
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
                {props.ride?.destination}
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
                {typeof props.ride?.fare === "number"
                  ? props.ride?.fare.toFixed(2)
                  : "--"}
              </p>
            </div>
          </div>
        </div>
        <form
          onSubmit={(e) => {
            submitHandler(e);
          }}
        >
          <input
            value={otp}
            onChange={(e) => setotp(e.target.value)}
            type="number"
            className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-3 placeholder:font-mono"
            placeholder="Enter OTP"
          />
          <div className="mt-6">
            <button className="w-full mt-5 flex justify-center bg-green-700 text-white text-lg font-semibold p-3 rounded-lg">
              Confirm Ride
            </button>
            <button
              type="button"
              onClick={() => {
                props.setConfirmRidePopUpPanel(false);
                props.setRidePopUpPanel(false);
              }}
              className="w-full mt-1 bg-red-500 text-white text-lg font-semibold p-3 rounded-lg"
            >
              Cancel Ride
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfirmRidePopUp;
