import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";
export const forgotPassword=async(req,res)=>{
    let user;
    try {
        console.log("1. forgot api hit");
         user = await User.findOne({Email:req.body.email});
         console.log("2. user found:",user ? user.Email:"not found");
        if(!user) {
            return res.status(404).json({message:"User not found with this email"});
        }
        const resetToken=crypto.randomBytes(20).toString('hex');
        console.log("3. token generated",resetToken);
        const hashedToken=crypto.createHash('sha256').update(resetToken).digest('hex');
        console.log("hashed for db",hashedToken);
        await User.updateOne(
            {
                _id:user._id
            },
            {
                resetPasswordToken:hashedToken,
                resetPasswordExpire:Date.now()+10*60*1000
            }
        );
        console.log("4.:user saved with token");
        const resetUrl=`https://frds-blush.vercel.app/reset-password/${resetToken}`;
        console.log("5.: result url",resetUrl);
        const message=`<h1>You requested a password reset</h1>
        <p>Please click on the link given below to reset your password</p>
        <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
        <p>This link will expire in 10 minutes/<p>`;
        try {
        await sendEmail({
            email:user.Email,
            subject:'FRDS Password Reset Requested',
            message
        });
        console.log("email sent");
    }catch(emailerror){
     console.log("email error",emailerror.message);
     console.log("full error",emailerror);
    }
    }catch(error){
        console.log("===catch block error");
        console.log("error name:",error.name);
        console.log("error message:",error.message);
        console.log("full error",error);
        console.log("==================");
        if(user){
        user.resetPasswordToken=undefined;
        user.resetPasswordExpire=undefined;
        await user.save();
        }
        res.status(500).json({mesage:"email colud not ve sent"});
    }
};
export const resetPassword=async(req,res)=>{
    try {
        console.log("1. raw token from url:",req.params.token);
        const resetPasswordToken=crypto.createHash('sha256').update(req.params.token).digest('hex');
        console.log("2:Hasehed token",resetPasswordToken);
        console.log("3: current time",Date.now());
        const user = await User.findOne({
            resetPasswordToken:resetPasswordToken,
            resetPasswordExpire:{$gt:Date.now()}
           
        });
         console.log("4: user found",user ? user.Email:"Null");
         if(user){
            console.log("5: token expire time",user.resetPasswordExpire);
            console.log("is expired?",user.resetPasswordExpire<Date.now());
         }
        if(!user){
            return res.status(400).json({message:"Invalid or expiry token"});
        }
        const salt =await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(req.body.password,salt);
        
        await User.updateOne(
            {_id:user._id},
            {
                Password:hashedPassword,
                resetPasswordToken:undefined,
                resetPasswordExpire:undefined
            }
        );
        res.status(200).json({message:"Pasword reset successfully"});
    }catch(error) {
        res.status(500).json({message:error.message});
    }
};