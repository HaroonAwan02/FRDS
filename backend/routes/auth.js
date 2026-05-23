import { forgotPassword, resetPassword } from "../controllers/authController.js";
import router from "./userRoutes.js";
router.post("/forgot-password",forgotPassword);
router.put("/reset-password/:token",resetPassword);
export default router;