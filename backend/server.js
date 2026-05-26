import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import adminRoutes from "./routes/adminRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import authRoutes from "./routes/auth.js";
import donatioRoutes from "./routes/donationRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import ratingRoutes from "./routes/ratingRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import userRoutes from "./routes/userRoutes.js";
dotenv.config();
connectDB();
const app=express();
app.use(cors({
   origin: "https://frds-9ayg.vercel.app",
   methods: ["GET","POST"]
}));
app.use(express.json());
 app.post("/api/chat",async(req,res)=> {
   try {
     const {message}=req.body;
     const response=await  fetch("https://api.groq.com/openai/v1/chat/completions",
      {
         method:"POST",
         headers:{
            "Content-Type":"application/json",
            "Authorization":"Bearer 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",
           
         },
         body:JSON.stringify({
            model:"llama-3.1-8b-instant",
            messages:[
               {
                  role:"user",
                  content:`Your are FRDS Bot, a helpul assistant for FRDS - Food Rescue &  Donation System
                  Rules for your
                  1. Answer about food donation,food pickup,NGOs,volunteers,Needy people  and food waste in pakistan
                  2. if user ask that are not related to frds then politely say: "I can answer about FRDS"
                  3. if donor want to donate food then say:"Register as donor then in Dashboard click on donate and click on Donations to view your Donations"
                  4. if some need food then say:"Register as needy selecet NGO and then request for food wait untill request approved from NGO"
                  5. if some want to register as NGO the say:"Register as NGO and then NGO Dashboard you can see Donations,Volunteers,Needy Requests etc".
                  6. FRDS ka vision to save extra Food and deliver it to needy.`
               }
            ]
         }),
      })
      const data=await response.json();
      console.log("full groq ",data);
      const reply=data?.choices?.[0]?.message?.content ||"No response from ai";
      res.json({reply});
   }catch(error){
      console.error("chat error",error);
      res.status(500).json({
         reply:"ai not responding,try again"
      });
   }
});
app.use("/api/donations",donatioRoutes);
app.use("/api/users",userRoutes);
app.use("/api/users",authRoutes);
app.use("/api/notifications",notificationRoutes);
app.use("/api/requests",requestRoutes);
app.use("/api/ratings",ratingRoutes);
app.use("/api/analytics",analyticsRoutes);
app.use("/api/admin",adminRoutes);
app.use("/reports",express.static("reports"));
/*const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: { origin: "https://frds-p1l6.vercel.app",
        methods: ["GET","POST"],
    },
});
socketHandler(io);
app.set("io",io);*/
const PORT = 5000;
module.exports=app;
