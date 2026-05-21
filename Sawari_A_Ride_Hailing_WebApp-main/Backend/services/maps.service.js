const axios = require('axios');
const { listIndexes } = require('../models/user.model');
const captainModel=require('../models/captain.model');

module.exports.getAddressCoordinate = async (address) => {
  const apiKey = process.env.GOOGLE_MAPS_API; // Make sure to set this in your environment variables
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    const results = response.data.results;

    if (results && results.length > 0) {
      const location = results[0].geometry.location;
      return {
        lat: location.lat,
        lng: location.lng,
      };
    } else {
      throw new Error('No results found for the given address.');
    }
  } catch (error) {
    throw new Error('Failed to fetch coordinates: ' + error.message);
  }
};

module.exports.getDistanceTime = async (origin, destination) => {
  if (!origin || !destination) {
    throw new Error('origin or destination are required');
  }

  const apiKey = process.env.GOOGLE_MAPS_API;
  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    const routes = response.data.routes;

    if (routes && routes.length > 0) {
      const leg = routes[0].legs[0];
      return {
        distance: leg.distance,   // returns { text: "...", value: ... }
        duration: leg.duration,   // returns { text: "...", value: ... }
        status: response.data.status
      };
    } else {
      throw new Error('No route found for the given origin and destination.');
    }
  } catch (error) {
    throw new Error('Failed to fetch distance and time: ' + error.message);
  }
};

module.exports.getAutoCompleteSuggestions = async (input) => {
  if (!input) {
    throw new Error('query is required');
  }
  const apiKey = process.env.GOOGLE_MAPS_API;
  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    if (response.data.status === "OK") {
      return response.data.predictions;
    } else {
      throw new Error('No suggestions found.');
    }
  } catch (error) {
    throw new Error('Failed to fetch suggestions: ' + error.message);
  }
};

module.exports.getCaptainsInRadius=async(ltd,lng,radius)=>{
  const captains=await captainModel.find({
    location:{
      $geoWithin:{
        $centerSphere:[[ltd,lng],radius/6371]
      }
    }
  });

  return captains;
}