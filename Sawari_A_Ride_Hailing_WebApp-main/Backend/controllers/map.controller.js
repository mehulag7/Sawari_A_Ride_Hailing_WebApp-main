const mapService = require('../services/maps.service');
const { validationResult } = require('express-validator');

module.exports.getCoordinates = async (req, res, next) => {
    const { address } = req.query;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    if (!address) {
        return res.status(400).json({ error: 'Address query parameter is required.' });
    }
    try {
        const coords = await mapService.getAddressCoordinate(address);
        res.status(200).json(coords);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

module.exports.getDistanceTime = async (req, res, next) => {
    const { origin, destination } = req.query;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    if (!origin || !destination) {
        return res.status(400).json({ error: 'Origin and destination query parameters are required.' });
    }

    try {
        const result = await mapService.getDistanceTime(origin, destination);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports.getAutoCompleteSuggestions = async (req, res, next) => {
    const { input } = req.query;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    if (!input) {
        return res.status(400).json({ error: 'Input query parameter is required.' });
    }

    try {
        const suggestions = await mapService.getAutoCompleteSuggestions(input);
        res.status(200).json(suggestions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};