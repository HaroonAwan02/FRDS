import Notification from "../models/Notification.js";
export const getNotifications = async (req,res)=>{
    try{
         const city = req.params.city;
    const notifications = await Notification
    .find({
        city,
        isRead:false
    })
    .sort({createdAt: -1}).limit(5);
    res.json(notifications);
    }catch(err){
        console.log(err);
        res.status(500).json({mesage:"server error"});
    }
};