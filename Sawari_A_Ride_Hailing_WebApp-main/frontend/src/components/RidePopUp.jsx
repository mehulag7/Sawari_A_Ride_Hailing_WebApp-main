import React from "react";

const RidePopUp = (props) => {
  return (
    <div>
      <div className="flex items-cols justify-between relative">
        <h2 className="text-2xl font-semibold mb-5">New Ride Available!</h2>
        <h5
          onClick={() => {
            props.setRidePopUpPanel(false);
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
          <h2 className="text-lg font-medium">
            {props.ride?.user.fullname.firstname +
              " " +
              props.ride?.user.fullname.firstname}
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

        <button
          onClick={() => {
            props.setConfirmRidePopUpPanel(true);
            props.confirmRide();
          }}
          className="w-full mt-5 bg-green-700 text-white text-lg font-semibold p-3 rounded-lg"
        >
          Accept
        </button>
        <button
          onClick={() => {
            props.setRidePopUpPanel(false);
          }}
          className="w-full mt-1 bg-gray-300 text-gray-700 text-lg font-semibold p-3 rounded-lg"
        >
          Ignore
        </button>
      </div>
    </div>
  );
};

export default RidePopUp;
