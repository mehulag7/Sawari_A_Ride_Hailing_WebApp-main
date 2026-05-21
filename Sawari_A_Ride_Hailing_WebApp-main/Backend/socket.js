const { Server } = require("socket.io");
const userModel=require('./models/user.model');
const CaptainModel=require('./models/captain.model');
const captainModel = require("./models/captain.model");


let io = null;

/**
 * Initializes the Socket.IO server.
 * @param {http.Server} server - The HTTP server instance.
 */
function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on('join',async(data)=>{
        const{userId,userType}=data;
        console.log(`User ${userId} joined as ${userType}`);
        if(userType==='user'){
            await userModel.findByIdAndUpdate(userId,{socketId:socket.id});
        }
        else if(userType==='captain'){
            await captainModel.findByIdAndUpdate(userId,{socketId:socket.id});
        }
    });

    socket.on('update-location-captain',async(data)=>{
      const {userId,location} =data;

      if(!location || !location.ltd || !location.lng){
        return socket.emit('error',{
          message:'Invalid location data'
        })
      }

      await captainModel.findByIdAndUpdate(userId,{location:{
        ltd:location.ltd,
        lng:location.lng
      }});
    })

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
}

/**
 * Sends a message to a specific socket ID.
 * @param {string} socketId - The socket ID to send the message to.
 * @param {string} event - The event name.
 * @param {any} data - The data to send.
 */
function sendMessageToSocketId(socketId,messageObject) {
  if (io) {
    io.to(socketId).emit(messageObject.event, messageObject.data);
  }
}

module.exports = {
  initializeSocket,
  sendMessageToSocketId,
};