import express from "express";
import { getNotifications } from "../controllers/notificationController.js";
import Notification from "../models/Notification.js";
const router = express.Router();

    router.get("/:city",getNotifications);
    router.put("/mark-read/:city",async(req,res)=>{
        try{
            await Notification.updateMany(
                {
                    city:req.params.city, isRead:false
                },
                {$set:{isRead:true}}
            );
            res.json({message:"Marrk as read"});
        }catch(err){
            res.status(500).json({mesage:"Error updating notification"})
        }
    });


export default router;
