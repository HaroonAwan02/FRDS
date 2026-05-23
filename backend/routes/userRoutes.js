import express from "express";
import { reportedUsers, unreportUser } from "../controllers/adminController.js";
import { loginUser, registerUser } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
const router = express.Router();
router.post("/assign/:id",async(req,res)=>{
    try {
        const volunteer=await User.findById(req.params.id);
        if(!volunteer){
            return res.status(404).json({message:"volunteer not found"});
        }
        volunteer.status="Assigned";
        await volunteer.save();
        await Notification.create({
            userId:volunteer._id,
            message:"You have beeen assigned"
        });
        res.json({message:"Assigned successfully"});
    }catch(error){
        console.error(error);
        res.status(500).json({message:"server error"});
    }
});
router.get("/volunteers/:ngo",async(req,res)=>{
    try{
       const ngo=req.params.ngo.toLowerCase();
    const volunteers = await User.find({
        role:"volunteer",
        ngo:ngo
    });
     res.json(volunteers);
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Server error"});
    }
});
router.get("/volunteer/me/:id",async(req,res)=> {
    try {
        const volunteer=await User.findById(req.params.id);
        if(!volunteer){
            return res.status(404).json({message:"User not found"});
        }
        res.json(volunteer);
    }catch (error){
        res.status(500).json({message:"server error"});
    }
});
router.get("/donors",async(req,res)=>{
    try{
        const donors=await User.find({role:"donor"});
        res.json(donors);
    }catch(error){
        console.log(error);
        res.status(500).json({message:"Server error"})
    }
});
router.get("/",async(req,res)=>{
    try {
        const users=await User.find();
        res.json(users);
    }catch(err) {
        res.status(500).json({message:"Server error"});
    }
});
router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/report/:id",reportedUsers);
router.put("/unreport/:id",unreportUser);
router.get("/AdminDashboard",protect,(req, res) => {
    res.json({message:"Admin Dashboard data"});
});
router.get("/NGODashboard",protect,(req, res) => {
    res.json({message:"NGO Dashboard data"}); 
});
router.get("/DonorDashboard",protect,(req, res) => {
    res.json({message:"Donor Dashboard data"});
});
router.get("/RequestFood",protect,(req, res) => {
    res.json({message:"Needy data"});
});
router.get("/VolunteerList",protect,(req, res) => {
    res.json({message:"Volunteer data"});
});

export default router;