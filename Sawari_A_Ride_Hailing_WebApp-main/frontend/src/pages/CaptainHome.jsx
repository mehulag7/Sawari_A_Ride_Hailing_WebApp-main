import React, { useState } from "react";
import { Link } from "react-router-dom";
import CaptainDetails from "../components/CaptainDetails";
import RidePopUp from "../components/RidePopUp";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ConfirmRidePopUp from "../components/ConfirmRidePopUp";
import { useEffect, useContext } from "react";
import { SocketContext } from "../context/SocketContext";
import { CaptainDataContext } from "../context/captainContext";
import axios from "axios";
import LiveTracking from "../components/LiveTracking";

const CaptainHome = () => {
  const [RidePopUpPanel, setRidePopUpPanel] = useState(false);
  const RidePopUpPanelRef = React.useRef(null);
  const [ConfirmRidePopUpPanel, setConfirmRidePopUpPanel] = useState(false);
  const ConfirmRidePopUpPanelRef = React.useRef(null);
  const [ride, setRide] = useState(null);

  const { socket, sendMessage } = useContext(SocketContext);
  const { captain } = useContext(CaptainDataContext);

  useEffect(() => {
    if (captain?._id) {
      sendMessage("join", { userType: "captain", userId: captain._id });

      const updateLocation = () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            console.log({
              userId: captain._id,
              location: {
                ltd: position.coords.latitude,
                lng: position.coords.longitude,
              },
            });

            sendMessage("update-location-captain", {
              userId: captain._id,
              location: {
                ltd: position.coords.latitude,
                lng: position.coords.longitude,
              },
            });
          });
        }
      };

      const locationInterval = setInterval(updateLocation, 10000);
      updateLocation();

      return () => clearInterval(locationInterval);
    }
  }, [captain?._id]);

  useEffect(() => {
    if (!socket) return;

    const handleNewRide = (data) => {
      console.log("New ride received:", data);
      setRide(data);
      setRidePopUpPanel(true);
    };

    socket.on("new-ride", handleNewRide);

    return () => {
      socket.off("new-ride", handleNewRide);
    };
  }, [socket]);

  useGSAP(
    function () {
      if (RidePopUpPanel) {
        gsap.to(RidePopUpPanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(RidePopUpPanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [RidePopUpPanel]
  );

  useGSAP(
    function () {
      if (ConfirmRidePopUpPanel) {
        gsap.to(ConfirmRidePopUpPanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(ConfirmRidePopUpPanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [ConfirmRidePopUpPanel]
  );

  async function confirmRide() {
    const reponse = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/rides/confirm`,
      {
        rideId: ride._id,
        captainId: captain._id,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    setRidePopUpPanel(false), setConfirmRidePopUpPanel(true);
  }

  return (
    <div className="h-screen">
      <div className="flex items-center justify-between w-screen fixed p-6 top-0">
        <img
          className="w-14 l-5"
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
      <div className="h-3/5 z-[-1] relative">
        <LiveTracking></LiveTracking>
      </div>
      <div className="h-2/5 p-6">
        <CaptainDetails></CaptainDetails>
      </div>
      <div
        ref={RidePopUpPanelRef}
        className="fixed w-full z-10 rounded-t-2xl translate-y-full bg-white bottom-0 px-3 py-6"
      >
        <RidePopUp
          ride={ride}
          setRidePopUpPanel={setRidePopUpPanel}
          setConfirmRidePopUpPanel={setConfirmRidePopUpPanel}
          confirmRide={confirmRide}
        ></RidePopUp>
      </div>
      <div
        ref={ConfirmRidePopUpPanelRef}
        className="fixed w-full z-10 rounded-t-2xl translate-y-full h-screen bg-white bottom-0 px-3 py-6"
      >
        <ConfirmRidePopUp
          setConfirmRidePopUpPanel={setConfirmRidePopUpPanel}
          setRidePopUpPanel={setRidePopUpPanel}
          ride={ride}
        ></ConfirmRidePopUp>
      </div>
    </div>
  );
};

export default CaptainHome;
