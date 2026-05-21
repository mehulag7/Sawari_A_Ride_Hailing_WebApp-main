const VehiclePanelSearch = (props) => {
  const fare = props.fare || {};
  return (
    <div>
      <div className="flex items-cols justify-between relative">
        <h2 className="text-2xl font-semibold mb-5">Choose a Vehicle</h2>
        <h5
          onClick={() => {
            props.setVehiclePanel(false);
          }}
          className="text-3xl text-gray-500 cursor-pointer opacity-100"
        >
          <i className="ri-arrow-down-wide-fill absolute top-0.7 right-5 "></i>
        </h5>
      </div>
      <div
        onClick={() => {
          props.setRidePanel(true);
          props.selectVehicle("car");
        }}
        className="flex w-full mb-2 border-2 border-gray-200 active:border-black rounded-2xl items-center p-3 justify-between"
      >
        <img
          className="h-10"
          src="https://swyft.pl/wp-content/uploads/2023/05/can-1-person-use-uberx.jpg"
          alt=""
        />
        <div className="ml-2 w-1/2">
          <h4 className="font-medium text-lg">
            UberGo{" "}
            <span>
              <i className="ri-user-3-fill"></i>4
            </span>
          </h4>
          <h5 className="font-medium text-md">2 mins away</h5>
          <p className="font-medium text-xs">Affordable compact rides</p>
        </div>
        <h2 className="text-xl font-semibold">
          ₹{typeof fare.car === "number" ? fare.car.toFixed(2) : "--"}
        </h2>
      </div>
      <div
        onClick={() => {
          props.setRidePanel(true);
          props.selectVehicle("motorcycle");
        }}
        className="flex w-full mb-2 border-2 border-gray-200 active:border-black rounded-2xl items-center p-3 justify-between"
      >
        <img
          className="h-12"
          src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png"
          alt=""
        />
        <div className="ml-2 w-1/2">
          <h4 className="font-medium text-lg">
            Moto{" "}
            <span>
              <i className="ri-user-3-fill"></i>1
            </span>
          </h4>
          <h5 className="font-medium text-md">3 mins away</h5>
          <p className="font-medium text-xs">Affordable Motorcycle rides</p>
        </div>
        <h2 className="text-xl font-semibold">
          ₹
          {typeof fare.motorcycle === "number"
            ? fare.motorcycle.toFixed(2)
            : "--"}
        </h2>
      </div>
      <div
        onClick={() => {
          props.setRidePanel(true);
          props.selectVehicle("auto");
        }}
        className="flex w-full mb-2 border-2 border-gray-200 active:border-black rounded-2xl items-center p-3 justify-between"
      >
        <img
          className="h-12"
          src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png"
          alt=""
        />
        <div className="ml-2 w-1/2">
          <h4 className="font-medium text-lg">
            UberAuto{" "}
            <span>
              <i className="ri-user-3-fill"></i>3
            </span>
          </h4>
          <h5 className="font-medium text-md">5 mins away</h5>
          <p className="font-medium text-xs">Affordable Rickshaw rides</p>
        </div>
        <h2 className="text-xl font-semibold">
          ₹{typeof fare.auto === "number" ? fare.auto.toFixed(2) : "--"}
        </h2>
      </div>
    </div>
  );
};

export default VehiclePanelSearch;
