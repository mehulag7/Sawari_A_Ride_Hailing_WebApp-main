import React, { createContext, useContext, useState } from "react";

export const CaptainDataContext = createContext();

export const CaptainContext = ({ children }) => {
  const [captain, setCaptain] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const updateCaptain = (newCaptain) => {
    setCaptain(newCaptain);
  };

  const value = {
    captain,
    setCaptain,
    error,
    setError,
    loading,
    setLoading,
    updateCaptain,
  };

  return (
    <CaptainDataContext.Provider value={value}>
      {children}
    </CaptainDataContext.Provider>
  );
};

export default CaptainContext;
