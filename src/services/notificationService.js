import socket from "./socket.js";
export const sendDonationNotification=(donation)=> {
    socket.emit("donation:new",donation);
};
export const listenNotification=(callback)=>{
    socket.on("donation:notify",callback);
};