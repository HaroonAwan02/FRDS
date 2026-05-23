import express from "express";
import {
    donationPerNGO,
    foodPerMonth,
    successRate,
    volunteerPerformance
} from "../controllers/analyticscontroller.js";
const router=express.Router();
router.get("/ngo",donationPerNGO);
router.get("/monthly",foodPerMonth);
router.get("/success",successRate);
router.get("/volunteers",volunteerPerformance);
export default router;