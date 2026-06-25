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
const connectDB=async()=> {
   try {
      await mongoose.connect(process.env.MONGO_URL);
      console.log("mongo conected");
   }catch (error) {
      console.log("mongoDb connection error",error);
      process.exit(1);
   }
};
const app=express();
app.use(
   cors({
      origin: [
         "https://localhost:3000",
         "https://frds.p1l6.vercel.app"
      ],
      credentials: true,
   })
);
app.use(express.json());
 app.post("/api/chat",async(req,res)=> {
   try {
     const {message}=req.body;
     const response=await  fetch("https://api.groq.com/openai/v1/chat/completions",
      {
         method:"POST",
         headers:{
            "Content-Type":"application/json",
            "Authorization":`Bearer ${GROQ_API_KEY}`,
           
         },
         body:JSON.stringify({
            model:"llama-3.1-8b-instant",
            messages:[
               {
                  role:"system",
                  content:`You are frds.ans only about food donation/pickup/NGOs/volunteers/food waste in Pakistan.
                  No greeting,no intro,no "i am bot".Give direct step by step answer only.`
               },
               {
                  role:"user",
                  content:message
               }
            ],
            temperature:0.1
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
const PORT = process.env.PORT||5000;
httpServer.listen( PORT , () => {
    console.log("Server runing on port", PORT);
});