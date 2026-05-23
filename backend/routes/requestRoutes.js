import express from "express";
import {
    approveRequest,
    createRequest,
    getAllRequests,
    getMyRequests
} from "../controllers/requestController.js";
const router=express.Router();
router.post("/",createRequest);
router.get("/:needyId",getMyRequests);
router.get("/",getAllRequests);
router.put("/approve/:id",approveRequest);
export default router;