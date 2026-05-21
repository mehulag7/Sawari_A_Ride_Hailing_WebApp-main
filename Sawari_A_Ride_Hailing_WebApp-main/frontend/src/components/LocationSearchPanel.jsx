import React from "react";

const LocationSearchPanel = ({
  suggestions = [],
  onSuggestionClick,
  loading,
  error,
}) => {
  return (
    <div>
      {loading && (
        <div className="text-gray-500 p-3">Loading suggestions...</div>
      )}
      {error && <div className="text-red-500 p-3">{error}</div>}
      {!loading && suggestions.length === 0 && (
        <div className="text-gray-400 p-3">No suggestions found.</div>
      )}
      {suggestions.map((elem, idx) => (
        <div
          key={elem.place_id || idx}
          onClick={() => onSuggestionClick(elem.description)}
          className="flex gap-4 rounded-xl p-3 border-2 border-gray-200 active:border-black items-center justify-start my-2 cursor-pointer"
        >
          <h2 className="bg-[#eee] h-10 w-10 flex items-center justify-center rounded-full">
            <i className="ri-map-pin-fill"></i>
          </h2>
          <h4 className="font-medium">{elem.description}</h4>
        </div>
      ))}
    </div>
  );
};

export default LocationSearchPanel;
