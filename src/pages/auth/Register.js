import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../../assets/images/nature2.jpg";
import Notification from "../../components/Notification.js";
const Register = () => {
  const [form, setForm] = useState({
    Name: "",
    Email: "",
    Password: "",
    confirmPassword: "",
    city: "",
    contact: "",
    role: "",
    ngo: "",
  });

  const [error, setError] = useState("");
  const [success,setSuccess]=useState("");
  const navigate = useNavigate();
  const handleChange = (e) =>{
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.Name ||
      !form.Email ||
      !form.Password ||
      !form.confirmPassword ||
      !form.city ||
      !form.contact ||
      !form.role
    ) {
      setError("All fields are required");
      return;
    }

    if (form.Password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
      if((form.role==="ngo"||form.role==="volunteer"||form.role==="needy")&& !form.ngo)
        {
          setError("please select NGO");
          return;
    }
   try {
    
      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body:JSON.stringify(form)
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message);
        return;
      }
      setSuccess("Registered Successfully");
      /*setError("");*/
      setTimeout(()=> {navigate("/login");
      },1500);
    } catch (err) {
      setError("Server error");
    }
  };
  return (
    
    <div style={styles.Container}>
      <div style={styles.FormWrapper}>
        <Notification message={error} type="error" onClose={() => {setError("");}} />
          <Notification message={success} type="success" onClose={() => {setSuccess("");}} />
           
        <form style={styles.Form} onSubmit={handleSubmit}>
          <h2 style={styles.Title}>Create Your Account</h2>
          <p style={styles.Tagline}>Join our mission to save food and fight hunger</p>
          <input name="Name" value={form.Name} placeholder="Name" onChange={handleChange} style={styles.Input} />
          <input name="Email" value={form.Email} placeholder="Email" onChange={handleChange} style={styles.Input} />
          <input type="Password" value={form.Password} name="Password" placeholder="Password" onChange={handleChange} style={styles.Input} />
          <input type="Password"  value={form.confirmPassword}name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} style={styles.Input} />
          <input name="city" value={form.city}placeholder="City" onChange={handleChange} style={styles.Input} />
          <input name="contact" value={form.contact} placeholder="Contact" onChange={handleChange} style={styles.Input} />

          <select name="role" value={form.role} onChange={handleChange} style={styles.Input}>
            <option  value="">Select Role</option>
            <option value="ngo">NGO</option>
            <option value="donor">Donor</option>
            <option value="volunteer">Volunteer</option>
            <option value="needy">Needy</option>
          </select>

          {(form.role === "volunteer" || form.role === "needy" || form.role==="ngo") && (
            <select name="ngo" value={form.ngo} onChange={handleChange} style={styles.Input}>
              <option value="">Select NGO</option>
              <option value="edhi">Edhi Foundation</option>
              <option value="saylani">Saylani Welfare</option>
              <option value="akhuwat">Akhuwat</option>
            </select>
          )}

          <button type="submi" style={styles.Button}>Register Now</button>

          <p style={styles.Link}>
            Already have an account?{" "} <a href="/login" style={{color:"#4caf50",fontWeight:"100"}}>Login</a>
          </p>
        </form>
      </div>
    </div>
  );
};

const styles = {
  Container: {
    minheight:"100dvh",
    background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${bgImage}) center/cover no-repeat`,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "58px 15px",
    boxSizing:"border-box"
  },
  FormWrapper: {
    position: "relative", // 🔑 REQUIRED FOR POPUP
    width: "100%",
    maxWidth: "470px",
  },

  Form: {
    background: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(15px)",
    padding: "30px",
    borderRadius: "20px",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
    animation: "fadeIn 0.8s ease",
    width: "100%",
    maxWidth: "550px",
    boxSizing:"border-box"
  },

  Title: { textAlign: "center", color: "#fff", marginBottom: "25px" },

  Input: {
    width:"100%",
    boxSizing:"border-box",
    marginBottom: "15px",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    outline: "none",
    fontSize: "16px",
    background: "rgba(255,255,255,0.2)",
    color: "#0f0f0fff",
  },

  Button: {
    padding: "12px",
    height:"40px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#4caf50",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },
   Tagline:{
   textAlign:"center",
   color:"#ddd",
   fontSize:"18px",
   marginBottom:"25px",
   marginTop:"-10px"
   },
  Link: { marginTop: "15px", textAlign: "center", color: "#fff" },
};
export default Register;

