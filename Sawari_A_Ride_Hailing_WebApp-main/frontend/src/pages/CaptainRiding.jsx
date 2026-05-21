import React, { useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import FinishedRidePanel from "../components/FinishedRidePanel";
import LiveTracking from "../components/LiveTracking";

const CaptainRiding = () => {
  const [FinishRidePanel, setFinishRidePanel] = useState(false);
  const FinishRidePanelRef = useRef(null);
  const location = useLocation();
  const rideData = location.state?.ride;
  useGSAP(
    function () {
      if (FinishRidePanel) {
        gsap.to(FinishRidePanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(FinishRidePanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [FinishRidePanel]
  );

  return (
    <div className="h-screen">
      <div className="flex items-center justify-between w-screen fixed p-6 top-0">
        <img
          className="w-14"
          src="https://pngimg.com/d/uber_PNG24.png"
          alt=""
        />
        <Link
          to="/captain-home"
          className="h-10 w-10 bg-white flex items-center justify-center rounded-full"
        >
          <i className="text-lg font-md ri-logout-box-line"></i>
        </Link>
      </div>
      <div className="h-4/5">
        <LiveTracking></LiveTracking>
      </div>
      <div
        onClick={() => {
          setFinishRidePanel(true);
        }}
        className="h-1/5 p-6 flex items-center justify-between relative bg-yellow-400"
      >
        <div>
          <h5
            onClick={() => {
              props.setRidePopUpPanel(false);
            }}
            className="text-4xl text-gray-900 cursor-pointer opacity-100 "
          >
            <i className="ri-arrow-down-wide-fill absolute top-2 rotate-180 left-[45%] "></i>
          </h5>
        </div>
        <h4 className="w-2/5 text-xl font-semibold">
          {typeof rideData?.distance === "number"
            ? `${rideData.distance.toFixed(2)} km`
            : "--"}
        </h4>
        <button className="w-3/5 mt-1 bg-green-700 text-white text-lg font-semibold p-3 rounded-lg">
          Complete Ride
        </button>
      </div>
      <div
        ref={FinishRidePanelRef}
        className="fixed w-full z-10 rounded-t-2xl translate-y-full bg-white bottom-0 px-3 py-6"
      >
        <FinishedRidePanel
          rideData={rideData}
          setFinishRidePanel={setFinishRidePanel}
        ></FinishedRidePanel>
      </div>
    </div>
  );
};

export default CaptainRiding;
