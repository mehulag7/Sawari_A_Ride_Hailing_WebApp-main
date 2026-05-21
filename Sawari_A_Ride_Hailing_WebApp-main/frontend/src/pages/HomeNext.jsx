import React, { useState, useRef, useContext, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "remixicon/fonts/remixicon.css";
import LocationSearchPanel from "../components/LocationSearchPanel";
import VehiclePanelSearch from "../components/VehiclePanelSearch";
import ConfirmRidePanel from "../components/ConfirmRidePanel";
import FindingCaptainPanel from "../components/FindingCaptainPanel";
import WaitingForCaptainPanel from "../components/WaitingForCaptainPanel";
import { SocketContext } from "../context/SocketContext";
import { UserDataContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import LiveTracking from "../components/LiveTracking";

import axios from "axios";

const HomeNext = () => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [activeField, setActiveField] = useState(""); // "pickup" or "destination"
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [suggestionError, setSuggestionError] = useState("");
  const panelRef = useRef(null);
  const panelCloseRef = useRef(null);
  const VehiclePanelRef = useRef(null);
  const [VehiclePanel, setVehiclePanel] = useState(false);
  const RidePanelRef = useRef(null);
  const [RidePanel, setRidePanel] = useState(false);
  const VehicleFoundRef = useRef(null);
  const [VehicleFound, setVehicleFound] = useState(false);
  const [waitingForDriver, setwaitingForDriver] = useState(false);
  const waitingForDriverRef = useRef(null);
  const [Fare, setFare] = useState({});
  const [vehicleType, setVehicleType] = useState(null);
  const [ride, setRide] = useState(null);
  const { socket, sendMessage, recieveMessage } = useContext(SocketContext);
  const navigate = useNavigate();

  const { user, setUser } = useContext(UserDataContext);

  useEffect(() => {
    if (user?._id) {
      console.log(user);
      sendMessage("join", { userType: "user", userId: user._id });
    }
  }, [user?._id]);

  socket.on("ride-confirmed", (ride) => {
    setVehicleFound(false);
    setwaitingForDriver(true);
    setRide(ride);
  });

  useGSAP(() => {
    if (panelOpen) {
      gsap.to(panelRef.current, {
        height: "70%",
        duration: 0.5,
        ease: "power2.inOut",
        padding: 24,
      });
      gsap.to(panelCloseRef.current, {
        opacity: 1,
      });
    } else {
      gsap.to(panelRef.current, {
        height: "0%",
        duration: 0.5,
        ease: "power2.inOut",
        padding: 0,
      });
      gsap.to(panelCloseRef.current, {
        opacity: 0,
      });
    }
  }, [panelOpen]);

  useGSAP(
    function () {
      if (VehiclePanel) {
        gsap.to(VehiclePanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(VehiclePanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [VehiclePanel]
  );

  useGSAP(
    function () {
      if (RidePanel) {
        gsap.to(RidePanelRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(RidePanelRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [RidePanel]
  );

  useGSAP(
    function () {
      if (VehicleFound) {
        gsap.to(VehicleFoundRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(VehicleFoundRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [VehicleFound]
  );

  useGSAP(
    function () {
      if (waitingForDriver) {
        gsap.to(waitingForDriverRef.current, {
          transform: "translateY(0)",
        });
      } else {
        gsap.to(waitingForDriverRef.current, {
          transform: "translateY(100%)",
        });
      }
    },
    [waitingForDriver]
  );

  async function findTrip() {
    setVehiclePanel(true);
    setPanelOpen(false);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/rides/get-fare`,
        {
          params: {
            pickup,
            destination,
          },
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      setFare(response.data.fares);
    } catch (err) {
      // Optionally handle error
    }
  }

  async function createRide() {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/rides/create`,
      {
        pickup,
        destination,
        vehicleType,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    console.log(response.data);
  }

  // Fetch suggestions from backend
  const fetchSuggestions = async (input) => {
    if (!input || input.length < 3) {
      setSuggestions([]);
      setSuggestionError("");
      return;
    }
    setLoadingSuggestions(true);
    setSuggestionError("");
    try {
      const token = localStorage.getItem("token"); // Adjust if you store JWT elsewhere
      const res = await axios.get(
        `${
          import.meta.env.VITE_BASE_URL
        }/maps/get-suggestions?input=${encodeURIComponent(input)}`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      setSuggestions(res.data || []);
    } catch (err) {
      setSuggestionError(
        err?.response?.data?.message ||
          "Failed to fetch suggestions. Please try again."
      );
      setSuggestions([]);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  // Handle input focus/click to open panel and set active field
  const handleInputFocus = (field) => {
    setPanelOpen(true);
    setActiveField(field);
    if (field === "pickup") {
      fetchSuggestions(pickup);
    } else if (field === "destination") {
      fetchSuggestions(destination);
    }
  };

  // Handle input change and fetch suggestions
  const handleInputChange = (field, value) => {
    if (field === "pickup") {
      setPickup(value);
      setActiveField("pickup");
      fetchSuggestions(value);
    } else if (field === "destination") {
      setDestination(value);
      setActiveField("destination");
      fetchSuggestions(value);
    }
  };

  // When user clicks a suggestion, set the field and close panel
  const handleSuggestionClick = (desc) => {
    if (activeField === "pickup") {
      setPickup(desc);
    } else if (activeField === "destination") {
      setDestination(desc);
    }
    setSuggestions([]);
    setSuggestionError("");
  };

  const submitHandler = (e) => {
    e.preventDefault();
  };

  socket.on("ride-started", (ride) => {
    setwaitingForDriver(false);
    navigate("/riding", { state: { ride } });
  });

  return (
    <div className="h-screen relative overflow-hidden">
      <img
        className="w-16 absolute left-3/5 top-5 z-10"
        src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
        alt=""
      />
      <div className="h-screen w-screen ">
        <LiveTracking></LiveTracking>
      </div>
      <div className="flex flex-col justify-end h-screen absolute top-0 w-full">
        <div className="h-[30%] p-5 bg-white relative rounded-t-2xl">
          <h4 className="text-3xl font-semibold">Find a Trip</h4>
          <h5
            ref={panelCloseRef}
            className="absolute opacity-0 top-5 right-5 text-3xl text-gray-500 cursor-pointer"
            onClick={() => {
              setPanelOpen(false);
              setSuggestions([]);
              setSuggestionError("");
            }}
          >
            <i className="ri-arrow-down-wide-line"></i>
          </h5>
          <form
            action=""
            onSubmit={(e) => {
              submitHandler(e);
            }}
          >
            <div className="rounded-full absolute h-3 w-3 top-22.75 left-9 bg-black"></div>
            <div className="rounded-full absolute h-3 w-3 top-37.75 left-9 bg-black"></div>
            <div className="line absolute h-17.5 w-1 top-23 left-10 bg-black"></div>
            <input
              onClick={() => handleInputFocus("pickup")}
              value={pickup}
              onChange={(e) => handleInputChange("pickup", e.target.value)}
              className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-5"
              type="text"
              placeholder="Add a pick-up location"
              autoComplete="off"
            />
            <input
              onClick={() => handleInputFocus("destination")}
              value={destination}
              onChange={(e) => handleInputChange("destination", e.target.value)}
              className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-3"
              type="text"
              placeholder="Enter your destination"
              autoComplete="off"
            />
          </form>
          <button
            onClick={findTrip}
            className="bg-black text-white w-full px-4 py-2 mt-3 rounded-xl"
          >
            Find trip
          </button>
        </div>
        <div ref={panelRef} className="h-0 bg-white">
          <LocationSearchPanel
            suggestions={suggestions}
            onSuggestionClick={handleSuggestionClick}
            loading={loadingSuggestions}
            error={suggestionError}
          />
        </div>
      </div>
      <div
        ref={VehiclePanelRef}
        className="fixed w-full z-10 translate-y-full rounded-t-2xl bg-white bottom-0 px-3 py-8"
      >
        <VehiclePanelSearch
          setRidePanel={setRidePanel}
          setVehiclePanel={setVehiclePanel}
          selectVehicle={setVehicleType}
          fare={Fare}
        ></VehiclePanelSearch>
      </div>
      <div
        ref={RidePanelRef}
        className="fixed w-full z-10 translate-y-full rounded-t-2xl bg-white bottom-0 px-3 py-6"
      >
        <ConfirmRidePanel
          setVehicleFound={setVehicleFound}
          setRidePanel={setRidePanel}
          createRide={createRide}
          pickup={pickup}
          destination={destination}
          fare={Fare[vehicleType]}
          vehicleType={vehicleType}
        ></ConfirmRidePanel>
      </div>
      <div
        ref={VehicleFoundRef}
        className="fixed w-full z-10 translate-y-full rounded-t-2xl bg-white bottom-0 px-3 py-6"
      >
        <FindingCaptainPanel
          setVehicleFound={setVehicleFound}
          pickup={pickup}
          destination={destination}
          fare={Fare[vehicleType]}
          vehicleType={vehicleType}
        ></FindingCaptainPanel>
      </div>
      <div
        ref={waitingForDriverRef}
        className="fixed w-full z-10 rounded-t-2xl bg-white bottom-0 px-3 py-6"
      >
        <WaitingForCaptainPanel
          setwaitingForDriver={setwaitingForDriver}
          ride={ride}
        />
      </div>
    </div>
  );
};

export default HomeNext;
