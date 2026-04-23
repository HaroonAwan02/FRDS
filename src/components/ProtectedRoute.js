import { Navigate } from "react-router-dom";
const ProtectedRoute=({role,children})=>{
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");
    if (!token) {
        return <Navigate to="/login"/>
    }
    if(userRole&&role !==role) {
        return <Navigate to="/login"/>
    }
    return children;
};
export const authorizeRole = (...roles)=> {
        return (req,res,next)=> {
            if(!roles.includes(req.user.role)) {
                return res.status(403).json({
                    message:"Access denied"
                });
            }
            next();
        };
    };
export default ProtectedRoute;
