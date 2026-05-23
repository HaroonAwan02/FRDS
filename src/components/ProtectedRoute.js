import { Navigate } from "react-router-dom";
const ProtectedRoute=({role,children})=>{
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");
    if (!token) {
        return <Navigate to="/login"/>
    }
    if(
        role && 
        (
        (Array.isArray(role) && !role.includes(userRole)) || (!Array.isArray(role) && userRole !==role))) {
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
