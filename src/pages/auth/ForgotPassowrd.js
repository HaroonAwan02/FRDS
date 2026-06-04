import { useState } from "react";
import "./ResetPassword.css";
 function ForgotPassword(){
    const [email,setEmail]=useState("");
    const [message,setMessage]=useState("");
    const handleSubmit=async(e)=>{
      e.preventDefault();
      const res=await fetch("https://frds.onrender.com/api/users/forgot-password",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({email})
      });
      const data=await res.json();
      setMessage(data.message);
    };
    return (
        <div className="forgot-container">
          <div className="forgot-card">
            <h2 className="forgot-header">Forgot Password</h2>
            <form onSubmit={handleSubmit} className="forgot-form">
              <label>Email:</label>
                <input type="email" placeholder="Enter your email" value={email} onChange={(e)=>setEmail(e.target.value)}required/>
                <button type="submit" className="forgot-btn">Send Reset Link</button>
            </form>
            {message && <p>{message}</p>}
            </div>
        </div>
    );
 }
 export default ForgotPassword;