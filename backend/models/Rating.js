import mongoose from "mongoose";
const ratingSchema=new mongoose.Schema({
    donorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    rating:Number,
    comment:String
},{timestamps:true});
export default mongoose.model("Rating",ratingSchema)