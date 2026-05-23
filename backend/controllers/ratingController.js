import Rating from "../models/Rating.js";
export const createRating = async(req,res)=>{
    try {
        const {donorId,rating,comment}=req.body;
        const newRating=await Rating.create({
            donorId,
            rating,
            comment
        });
        res.status(201).json(newRating);
    }catch(err){
        res.status(500).json({message:"Server error"});
    }
}
/*export const getRatingByDonor=async(req,res)=>{
    try{
        const {donorId}=req.params;
        const ratings=await Rating.find({donorId:req.params.donorId});
        res.json(ratings);
    }catch(err){
        res.status(500).json({message:"server error"})
    }
};
*/
export const getRatingByDonor=async(req,res)=>{
    try{
    const {donorId}=req.params;
    const page=parseInt(req.query.page)||1;
    const limit=3;
    const skip=(page-1)*limit;
    const ratings=await Rating.find({donorId}).sort({createdAt:-1}).skip(skip).limit(limit);
    const total=await Rating.countDocuments({donorId});
    res.json({
        ratings,
        total,
        page,
        totalPages:Math.ceil(total/limit)
    });
}catch(err){
    res.status(500).json({mesage:"Server eror"});
}
};