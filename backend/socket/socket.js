export const socketHandler = (io) => {
    io.on("connection", (socket) => {
        console.log("user connected",socket.id);
        socket.on("joinCity",(city)=>{
            if(!city)
                return;
           const room = city.trim().toLowerCase();
            socket.join(room);
            console.log("NGO joined room",room);
           /* io.to(room).emit("newDonation",
                {test:"socket working"
        });*/
        });
        socket.on("disconnect",()=> {
            console.log("user disconnected",socket.id);
        });
    });
};