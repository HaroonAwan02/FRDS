import Donation from "../models/Donation.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
export const createDonation = async (req, res) => {
    try {
        const {
            donorName,
            foodType,
            quantity,
            expiryTime,
            locationText,
            lat,
            lang
        } = req.body;
        if(!donorName||donorName.trim()==="")
            return res.status(400).json({message:"donor name required"})
        const donation = await Donation.create({
            donorName:donorName.trim(),
            foodType,
            quantity,
            expiryTime,
            locationText,
            lat,
            lang
        });
        console.log("RAW locationText",donation.locationText);
        console.log("donor name in controller",donation.donorName);
        const cityRoom=donation.locationText.split(" ").pop().trim().toLowerCase();
        const notification = await Notification.create({
            city:cityRoom,
            donorName:donation.donorName,
            message:`New food donation from ${donation.donorName}`,
            donationId:donation._id,
            isRead:false
        });
        console.log("donation created",cityRoom)
        const io =req.app.get("io");
        io.to(cityRoom).emit("newDonation",{
            donorName:donation.donorName,
          foodType:donation.foodType});
        console.log("emitting to room",cityRoom);
        res.status(201).json(donation);
    }catch (error) {
        console.log("error", error.message);
        res.status(500).json({ message: error.message});
    }
    
    };
    export const acceptDonation = async(req,res)=>{
        try {
        const donation = await Donation.findById( req.params.id)
            if(!donation) {
                return res.status(404).json({message:"Donation not found"});
            }
            if(donation.status==="accepted"){
                return res.status(400).json({message:"Already accepted"});
            }
            donation.assignedNgo=req.user.name;
            donation.status="accepted";
            await donation.save();
            res.json({message:"Donation accepted",donation});
        }catch(error){
            console.log(error);
            res.status(500).json({message:"Server error"});
        }
    };
    export const completeDonation= async(req,res)=>{
        try {
            const donation = await Donation.findById(req.params.id);
            if(!donation) {
                return res.status(404).json({message:"Donation noot found"});
            }
            donation.status="completed";
            await donation.save();
            if(donation.volunteer){
                const volunteer=await User.findById(donation.volunteer);
                if(volunteer){
                    volunteer.status="available";
                    await volunteer.save();
                }
            }
            res.json({message:"Donation completed"});
        }catch(err){
            console.log(err);
            res.status(500).json({message:"server error"});
        }
    };
    export const getDonations = async (req, res) => {
        try {
            const donations = await Donation.find().populate("volunteer");
            res.status(200).json(donations);
        } catch (error) {
            console.log("error", error.message);
            res.status(500).json({message: error.message});
        }
    };
    export const assignVolunteer=async(req,res)=>{
        try{
          const {donationId,volunteerId}=req.body; 
          console.log("donationId",donationId);
          console.log("volunteerid",volunteerId);
          if(!donationId||!volunteerId){
            return res.status(400).json({message:"Missing donation or volunteer"});
          }
         const donation=await Donation.findById(donationId);
         const volunteer =await User.findById(volunteerId);
        if(!donation){
            return res.status(404).json({message:"Donation not found"});
        }
        if(!volunteer){
            return res.status(404).json({message:"volunteer not found"});
        }
        if(donation.status!=="accepted"){
            return res.status(400).json({message:"Accepted donation first"});
        }
        if(donation.status==="assigned") {
            return res.status(400).json({message:"This donation is already assigned"});
        }
         donation.assignedVolunteer=volunteer.Name;
         donation.volunteer=volunteerId;
         donation.status="assigned";
        donation.status="assigned";
        volunteer.status="assigned";
        await volunteer.save();
        await donation.save();
        
        res.json({message:"Volunteer assigned successfully"});
        }catch(err){
            console.log(err);
            res.status(500).json({message:"server error"});
        }
    };
