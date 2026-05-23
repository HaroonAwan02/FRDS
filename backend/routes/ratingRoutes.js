import express from "express";
import { createRating, getRatingByDonor } from "../controllers/ratingController.js";
const router=express.Router();
router.post("/",createRating);
router.get("/:donorId",getRatingByDonor);
router.get("/:donorId",createRating);

export default router;