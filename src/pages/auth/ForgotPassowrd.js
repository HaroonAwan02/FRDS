import { useState } from "react";
export default function ForgotPassword(){
    const [email,setEmail]=useState("");
    const handleSubmit = async(e)=>{
        e.preventDefault();
        await fetch("http://192.168.1.8:5000/api/users/forgot-password",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({email})
        });
        alert("Reset link sent to your email");
    };
    return(
    <form onSubmit={handleSubmit}>
        <h2>Forgot Passowrd</h2>
        <input type="email" placeholder="Enter email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
        <button type="submit">Send Reset Link</button>
    </form>
    );
}