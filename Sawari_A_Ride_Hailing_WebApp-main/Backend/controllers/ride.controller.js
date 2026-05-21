const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');
const mapService=require('../services/maps.service');
const {sendMessageToSocketId} = require('../socket');
const rideModel = require('../models/ride.model');

module.exports.createRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { userId, pickup, destination, vehicleType,distance } = req.body;

    try {
        // 1. Get pickup coordinates
        const pickupCoordinates = await mapService.getAddressCoordinate(pickup);
        console.log(pickupCoordinates);

        // 2. Get nearby captains
        const radiusInKm = 2;
        const captainsInRadius = await mapService.getCaptainsInRadius(
            pickupCoordinates.lat,
            pickupCoordinates.lng,
            radiusInKm
        );

        // 3. Create ride
        const ride = await rideService.createRide({
            user: req.user._id,
            pickup,
            destination,
            vehicleType,
            distance
        });

        
        const rideForCaptain = {
            ...ride.toObject(),
            otp: '',
        };

        const rideWithUser=await rideModel.findOne({_id:ride._id}).populate('user');
        // 5. Notify captains
        captainsInRadius.forEach(captain => {
            sendMessageToSocketId(captain.socketId, {
                event: 'new-ride',
                data: rideWithUser
            });
        });

        // 6. Respond to client
        res.status(201).json(ride);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message });
    }
};



module.exports.getFare = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { pickup, destination } = req.query;

    try {
        const fares = await rideService.getFare(pickup, destination);
        return res.status(200).json(fares);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports.confirmRide=async (req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors:errors.array()
        });
    }
    const {rideId}=req.body;
    try{
        const ride=await rideService.confirmRide({rideId,captain:req.captain});
        sendMessageToSocketId(ride.user.socketId,{
            event:'ride-confirmed',
            data:ride
        })
        return res.status(200).json(ride);
    }catch(err){
        return res.status(500).json({
            message:err.message
        });
    }
}

module.exports.startRide=async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const {rideId,otp}=req.query;
    try{
        const ride=await rideService.startRide({
            rideId,otp,captain:req.captain
        });
        sendMessageToSocketId(ride.user.socketId,{
            event:'ride-started',
            data:ride
        })
        return res.status(200).json(ride);
    }catch(err){
        return res.status(500).json({message:err.message});
    }
}

module.exports.endRide=async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const {rideId}=req.body;
    try{
        const ride=await rideService.endRide({
            rideId,captain:req.captain
        })

        sendMessageToSocketId(ride.user.socketId,{
            event:'ride-ended',
            data:ride
        })
        return res.status(200).json(ride);
    }
    catch(err){
        return res.status(500).json({message:err.message});
    }
}