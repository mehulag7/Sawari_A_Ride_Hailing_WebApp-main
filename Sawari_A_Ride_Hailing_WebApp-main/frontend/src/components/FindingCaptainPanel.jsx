import React from "react";

const FindingCaptainPanel = (props) => {
  const vehicleImages = {
    car: "https://swyft.pl/wp-content/uploads/2023/05/can-1-person-use-uberx.jpg",
    motorcycle:
      "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png",
    auto: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png",
  };

  const imageUrl = vehicleImages[props.vehicleType] || vehicleImages.car;

  return (
    <div>
      <div className="flex items-cols justify-between relative">
        <h2 className="text-2xl font-semibold mb-5">Looking for a Driver</h2>
      </div>
      <div className="flex gap-4 mt-1 justify-between items-center flex-col">
        <img className="h-20" src={imageUrl} alt="" />
        <div className="w-full  flex flex-col gap-4 mt-3">
          <div className="flex items-center gap-5 border-b-2 border-gray-100 pb-4">
            <h5 className="text-3xl ml-1">
              <i className="ri-map-pin-fill"></i>
            </h5>
            <div className="flex flex-col justify-center">
              <h2 className="text-2xl font-semibold">Start Point</h2>
              <p className="text-gray-600 text-md font-medium">
                {props.pickup}
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
                {props.destination}
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
                ₹{typeof props.fare === "number" ? props.fare.toFixed(2) : "--"}
              </p>
            </div>
          </div>
        </div>

        {/* <button className='w-full mt-5 bg-green-700 text-white text-lg font-semibold p-3 rounded-lg'>Confirm</button> */}
      </div>
    </div>
  );
};

export default FindingCaptainPanel;
