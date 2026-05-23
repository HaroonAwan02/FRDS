import express from "express";
import { acceptDonation, assignVolunteer, completeDonation, createDonation, getDonations } from "../controllers/donationController.js";
import { protect } from "../middleware/authMiddleware.js";
import Donation from "../models/Donation.js";
const router=express.Router();
router.post("/",createDonation);
router.get("/",getDonations);
router.put("/accept/:id",protect,(req,res,next)=>{
    if(req.user.role!=="ngo"){
        return res.status(403).json({message:"Only NGO can accept donation"});
    }
    next();
    
},acceptDonation);
router.put("/assign",assignVolunteer);
router.put("/completed/:id",completeDonation);
router .get("/my-donations/:userId",async(req,res)=>{
    try {
        const donations=await Donation.find({user: req.params.id});
        res.json(donations);
    }catch(err){
        res.status(500).json({message:"Error"});
    }
});
router.get("/volunteer/:id",async(req,res)=>{
    try {
        const donation=await Donation.findOne({
            volunteer:req.params.id,
            status:"assigned"
        });
        res.json(donation||null);
    }catch(error){
        res.status(500).json({message:"Error fetching donation"});
    }
});
export default router;