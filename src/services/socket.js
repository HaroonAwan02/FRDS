import { io } from "socket.io-client";
const socket = io("http://localhost:5000",{
    autoConnect:true,
});
socket.on("connect",()=>{
    console.log("socket connected",socket.id)
});
export default socket;