import mongoose from "mongoose";
const DonationSchema=new mongoose.Schema(
    {
        donorName:String,
        foodType:String,
        quantity:String,
        expiryTime:String,
        locationText:String,
        lat:Number,
        lang:Number,
        status:{
            type:String,
            enum:["pending","accepted","assigned","completed"],
            default:"pending"
        },
       volunteer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
        
       },
       user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
       },
        quantity:{
        type:String,
         unit:"kg"
           
         },
       assignedNgo: {
        type:String,
        default:"Edhi"
       },
       assignedVolunteer: {
        type:String,
        default:"Unassigned"
       },
    },

    {timestamps:true}

);
export default mongoose.model("Donation",DonationSchema);
