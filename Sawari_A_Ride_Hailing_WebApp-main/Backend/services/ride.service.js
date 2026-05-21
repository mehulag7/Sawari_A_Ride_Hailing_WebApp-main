const rideModel= require('../models/ride.model');
const { sendMessageToSocketId } = require('../socket');
const mapService=require('./maps.service');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

function getOtp(num){
    let otp = '';
    while (otp.length < num) {
        const byte = crypto.randomInt(0, 10);
        otp += byte.toString();
    }
    otp = otp.slice(0, num);

    const salt = bcrypt.genSaltSync(10);
    const hashedOtp = bcrypt.hashSync(otp, salt);

    return { otp, hashedOtp };
}

module.exports.createRide = async ({ user, pickup, destination, vehicleType }) => {
    if (!user || !pickup || !destination || !vehicleType) {
        throw new Error('All fields are required');
    }

    const { fares, distanceInKm } = await getFare(pickup, destination);

    const ride = await rideModel.create({
        user,
        pickup,
        destination,
        fare: fares[vehicleType],
        distance: distanceInKm,
        otp: getOtp(6).otp
    });

    return ride;
};


async function getFare(pickup, destination) {
    if (!pickup || !destination) {
        throw new Error('Pickup and destination are required');
    }

    const distanceTime = await mapService.getDistanceTime(pickup, destination);
    const { distance, duration } = distanceTime;

    if (!distance || !duration || typeof distance.value !== 'number' || typeof duration.value !== 'number') {
        throw new Error('Invalid distance or duration data from Google Maps API');
    }

    const distanceInKm = distance.value / 1000;
    const durationInMin = duration.value / 60;

    const fareRates = {
        car: { base: 50, perKm: 15, perMin: 2 },
        motorcycle: { base: 30, perKm: 8, perMin: 1 },
        auto: { base: 40, perKm: 10, perMin: 1.5 }
    };

    const fares = {};
    for (const type in fareRates) {
        const rate = fareRates[type];
        fares[type] = rate.base + (distanceInKm * rate.perKm) + (durationInMin * rate.perMin);
    }

    return { fares, distanceInKm, durationInMin };
}


module.exports.getFare=getFare;

module.exports.confirmRide = async ({ rideId, captain }) => {
    if (!rideId || !captain || !captain._id) {
        throw new Error('Ride ID and captain are required');
    }

    await rideModel.findOneAndUpdate(
        { _id: rideId },
        {
            status: 'accepted',
            captain: captain._id
        }
    );

    const ride = await rideModel.findOne({ _id: rideId }).populate('user').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    return ride;
};

module.exports.startRide=async({rideId,otp,captain})=>{
    if(!rideId || !otp){
        throw new Error('Ride Id and Otp are required');
    }

    const ride=await rideModel.findOne({
        _id:rideId
    }).populate('user').populate('captain').select('+otp');

    if(!ride){
        throw new Error('Ride not Found');
    }

    if(ride.status!== 'accepted'){
        throw new Error('Ride not accepted');
    }

    if(ride.otp!== otp){
        throw new Error('Invalid OTP');
    }

    await rideModel.findOneAndUpdate({
        _id:rideId
    },{
        status:'ongoing'
    })

    sendMessageToSocketId(ride.user.socketId,{
        event:'ride-started',
        data:ride
    })
    return ride;
}

module.exports.endRide = async ({ rideId, captain }) => {
    if (!rideId) {
        throw new Error('Ride id is required');
    }

    const ride = await rideModel.findOne({
        _id: rideId,
        captain: captain._id
    }).populate('user').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    if (ride.status !== 'ongoing') {
        throw new Error('Ride not ongoing');
    }
    ride.status = 'completed';
    await ride.save();
    return ride;
};


