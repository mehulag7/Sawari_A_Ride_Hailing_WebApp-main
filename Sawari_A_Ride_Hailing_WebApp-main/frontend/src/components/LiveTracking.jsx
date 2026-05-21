import React, { useEffect, useState } from "react";
import { LoadScript, GoogleMap, Marker } from "@react-google-maps/api";

// Map container styling
const containerStyle = {
  width: "100%",
  height: "100%",
};

const LiveTracking = () => {
  const [userPosition, setUserPosition] = useState(null);

  // Get location every 10 seconds
  useEffect(() => {
    const updatePosition = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserPosition({ lat: latitude, lng: longitude });
          },
          (error) => {
            console.error("Error getting location:", error);
          },
          { enableHighAccuracy: true }
        );
      } else {
        alert("Geolocation is not supported by this browser.");
      }
    };

    updatePosition(); // Initial call
    const intervalId = setInterval(updatePosition, 10000); // Every 10 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  const center = userPosition || { lat: 20.5937, lng: 78.9629 }; // Default center (India)

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={15}>
        {userPosition && <Marker position={userPosition} />}
      </GoogleMap>
    </LoadScript>
  );
};

export default LiveTracking;
