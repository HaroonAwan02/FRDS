import Donation from "../models/Donation.js";
export const donationPerNGO=async(req,res)=>{
    try {
        const data=await donationPerNGO.aggregate([
            {$match:{status:{$ne:"pending"}}},
            {
                $group:{
                    _id:"$assignedNgo",
                    count:{$sum:1}
                }
            }
        ]);
        res.json(data);
    }catch(err){
        res.status(500).json({message:"server error"})
    }
};
export const foodPerMonth=async(req,res)=>{
    try {
        const data=await Donation.aggregate([
            {
            $group:{
                _id:{$month:"$createdAt"},
                total:{$sum:"$quantity"}
            }
        },
        {$sort:{"_id":1}}
        ]);
        res.json(data);
    }catch(err){
        res.status(500).json({message:"server error"});
    }
};
export const successRate=async(req,res)=>{
    try {
        const total=await Donation.countDocuments();
        const completed=await Donation.countDocuments({status:"completed"});
        res.json({
            success:completed,
            failed:total-completed
        });
    }catch(err){
        res.status(500).json({message:"server error"});
    }
};
export const volunteerPerformance=async(req,res)=>{
    try {
        const data=await Donation.aggregate([
            {$match:{status:"completed"}},
            {
                $group:{
                    _id:"$assignedVolunteer",
                    count:{$sum:1}
                }
            }
        ]);
        res.json(data);
    }catch(err){
        res.status(500).json({message:"server error"})
    }
}