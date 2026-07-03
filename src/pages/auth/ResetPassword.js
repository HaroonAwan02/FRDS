import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./ResetPassword.css";
function ResetPassword(){
    const [password,setPassword]=useState("");
    const [confirmPassword,setConfirmPassword]=useState("");
    const [message,setMessage]=useState("");
    const {token}=useParams();
    const navigate=useNavigate();
    const handleSubmit=async(e)=>{
        e.preventDefault();
        if(password !==confirmPassword){
            setMessage("Password do not match");
            return;
        }
        try {
        const res=await fetch (`https://frds-blush.vercel.app/api/users/reset-password/${token}`,{
            method:"PUT",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({password})
        });
        const data=await res.json();
        if(res.ok){
            setMessage("Password changed! Redirecting to login...");
            setTimeout(()=>navigate("/login"),2000);
        }else {
            setMessage(data.message);
        }
    } catch (err) {
        console.error("unable to conect");
    }
    };
    return (
        <div className="reset-container">
            <div className="reset-card">
            <h2 className="reset-header">Reset Password</h2>
            <form onSubmit={handleSubmit} className="reset-form">
                <label>New Password:</label>
                <input type="password" placeholder="New Password" value={password} onChange={(e)=>setPassword(e.target.value)}
                required
                />
                <label>Confrim New Password:</label>
                <input type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}
                required
                />
                <button type="submit" className="reset-btn">Reset Password</button>
            </form>
            {message &&<p>{message}</p>}
            </div>
        </div>
    );
}
export default ResetPassword;