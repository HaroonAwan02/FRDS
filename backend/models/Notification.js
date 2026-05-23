import mongoose from "mongoose";
const notificationSchema = new mongoose.Schema({
    city:String,
    message:String,
    donationId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Donation"
    },
    isRead:{
       type:Boolean,
       default:false
    }
},{timestamps:true});
export default mongoose.model("Notification",notificationSchema);
