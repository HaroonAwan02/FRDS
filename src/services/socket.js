import { io } from "socket.io-client";
const socket = io("https://frds.onrender.com",{
    autoConnect:true,
});
socket.on("connect",()=>{
    console.log("socket connected",socket.id)
});
export default socket;