import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
  needyId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },

  firstName:{
    type:String,
    required:true
  },

  lastName:{
    type:String,
    required:true
  },

  type:{
    type:String,
    default:"food"
  },

  familyMembers:{
    type:Number,
    required:true
  },

  urgency:{
    type:String,
    enum:["low","medium","high"],
    required:true
  },

  reason:{
    type:String
  },

  status:{
    type:String,
    enum:["pending","approved","rejected"],
    default:"pending"
  }
},{timestamps:true});
export default mongoose.model("Request",requestSchema);
