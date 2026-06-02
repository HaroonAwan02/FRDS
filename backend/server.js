import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import adminRoutes from "./routes/adminRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import authRoutes from "./routes/auth.js";
import donatioRoutes from "./routes/donationRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import ratingRoutes from "./routes/ratingRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { socketHandler } from "./socket/socket.js";
dotenv.config();
connectDB();
const app=express();
app.use(cors());
app.use(express.json());
 app.post("/api/chat",async(req,res)=> {
   try {
     const {message}=req.body;
     const response=await  fetch("https://api.groq.com/openai/v1/chat/completions",
      {
         method:"POST",
         headers:{
            "Content-Type":"application/json",
            "Authorization":`Bearer ${process.env.GROQ_API_KEY}`,
           
         },
         body:JSON.stringify({
            model:"llama-3.1-8b-instant",
            messages:[
               {
                  role:"system",
                  content:`You are frds(food rescue and donation system) Bot, a helpul assistant for FRDS and Ans about food donations,pickup,NGOs,volunteer,needy and  food waste in Pakistan
                  Rules:
                 1: After Hi hello if question is not related to frds then ans: "Sorry! i can only answer about frds".
                 2: give answer short and to the point.
                 3: if user ask "donate","pickup","volunteer", then answer step by step.
                 4: Dont give a wrong answer if you dont know the answer of user ask question then say "sorry i will check it and the answer you.`
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
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: { origin: "https://frds-p1l6.vercel.app",
        methods: ["GET","POST"],
    },
});
socketHandler(io);
app.set("io",io);
const PORT = 5000;
httpServer.listen( PORT , () => {
    console.log("Server runing on port", PORT);
});