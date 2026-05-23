import fs from "fs";
import path from "path";
import PDFDocument from "pdfkit";
import Donation from "../models/Donation.js";
import Report from "../models/Report.js";
import User from "../models/User.js";
export const getAdminStats=async(req,res)=>{
    try {
        const totalDonations= await Donation.countDocuments();
        const completedDonations=await Donation.countDocuments({status:"completed"});
        const totalUsers=await User.countDocuments();
        const reportedUsers=await User.countDocuments({isReported:true});
        res.json({
            totalDonations,
            completedDonations,
            totalUsers,
            reportedUsers
        });
    }catch(err){
        res.status(500).json({message:"server error"});
    }
};
export const getDonationAnalytics=async(req,res)=>{
    try {
        const data = await Donation.aggregate([
            {
                $match: {status:"completed"}
            },
            {
                $group:{
                    _id:"$assignedNgo",
                    count:{$sum:1}
                }
            }
        ]);
        res.json(data);
    }catch(err){
            res.status(500).json({message:"server error"});
        }
    };
export const reportedUsers=async(req,res)=>{
   try {
     console.log("incoming id",req.params.id);
      const updatedUser=await User.findByIdAndUpdate(
        req.params.id,
        {isReported:true},
        {new:true}
      );
       res.json(updatedUser);
      console.log("blocked user",updatedUser);
}catch(err){
    console.error(err);
    res.status(500).json({message:"Error unblocking user"});
}
};
export const unreportUser=async(req,res)=> {
   try {
      const updatedUser=await User.findByIdAndUpdate(
        req.params.id,
        {isReported:false},
        {new:true}
      );
      res.json(updatedUser);
      console.log("unblocked user",updatedUser);
}catch(err){
    console.error(err);
    res.status(500).json({message:"Error unblocking user"});
}
};
export const getMonthlyDonations=async(req,res)=>{
    try {
        const data=await Donation.aggregate([
            {
                $group: {
                    _id:{$month:"$createdAt"},
                    count:{$sum:1}
                }
            },
            {$sort:{"_id":1}}
        ]);
        res.json(data);
    }catch(err){
        res.status(500).json({message:"server error"});
    }
};
export const getAllUsers=async(req,res)=> {
    try {
        const users=await User.find();
        res.json(users);
    }catch(err){
        res.status(500).json({message:"Server error"})
    }
};
export const generateReport=async(req,res)=>{
    try {
        const donations=await Donation.find();
        const fileName=`report-${Date.now()}.pdf`;
        const filePath=path.join("reports",fileName);
        const doc=new PDFDocument();
        doc.pipe(fs.createWriteStream(filePath));
        res.setHeader("Content-Type","application/pdf");
        res.setHeader("Conetnt-Disposition","attachment; filename=report.pdf");
        doc.pipe(res);
        doc.fontSize(20).text("Food Rescue System Report",{align:"center"});
        doc.moveDown();
        doc.fontSize(12).text(`Generated on: ${new Date().toLocaleString()}`);
        doc.moveDown();
        doc.fontSize(14).text("Donations List");
        doc.moveDown();
        donations.forEach((d,index)=>{
            const food=d.foodType || "N/A";
            const qty=d.quantity || "N/A";
            const ngo =d.assignedNgo || "Not Assigned";
            const status=d.status || "N/A";
            doc
            .fontSize(10)
            .text(
                `${index + 1}. Food: ${food} | Qty: ${qty} | NGO: ${ngo} | status: ${status}`
            );   
        });
        doc.end();
        await Report.create({
            fileUrl:`http://localhost:5000/reports/${fileName}`
        });
    } catch(err){
    console.error(err);
    res.status(500).json({message:"Error generating report"});
    }
};
export const getReports=async(req,res)=>{
    const reports=await Report.find().sort({createdAt:-1});
    res.json(reports);
};