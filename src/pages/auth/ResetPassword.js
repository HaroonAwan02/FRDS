import axios from "axios";
import { useState } from "react";
import { useParams } from "react-router-dom";
export default function ResetPassword(){
    const {token}=useParams();
    const [password,setPassword]=useState("");
    const handleSubmit=async(e)=>{
        e.preventDefault();
        await axios.post(`http://192.168.1.8:5000/api/users/reset-password/${token}`,{password}
           );
        alert("Password updated");
    };
    return(
        <form onSubmit={handleSubmit}>
            <h2>Reset Password</h2>
            <input type="password" placeholder="New Password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
            <button type="submit">Reset Password</button>
        </form>
    );
}