import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    Name: { type: String, required: true},
    Email: { type: String, required: true},
    Password: {type: String, required: true},
    city: {type: String, required: true},
    contact: {type: String, required: true},
    role: {type: String,
        enum: ["ngo", "donor", "volunteer", "needy"],
        required: true
    },
    ngo: {type: String},
    status:{
        type:String,
        enum:["available","assigned","Not Assigned"],
        default:"available"
    },
    isReported: {
        type:Boolean,
        default:false
    },
    resetPasswordToken:{
        type:String
    },
    resetPasswordExpire:{
        type:Date}
        ,
}, {timestamps: true});
export default mongoose.model("User", userSchema);