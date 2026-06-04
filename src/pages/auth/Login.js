import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../../assets/images/nature2.jpg";
import Notification from "../../components/Notification.js";
const Login = () => {
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.identifier || !form.password) {
      setError("Enter email/name and password");
      return;
    }
    try {
      const response = await fetch("https://frds.onrender.com/api/users/login", {
        method: "POST",
        headers: { "Content-Type":"application/json"},
        body: JSON.stringify({
          identifier: form.identifier, password: form.password
        })
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message);
        return;
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("role",data.user.role);
      localStorage.setItem("city",data.user.city);
       localStorage.setItem("ngo",data.user.ngo);
       localStorage.setItem("userId",data.user._id);
      localStorage.setItem("user",JSON.stringify(data.user));
      if(data.user.role === "ngo") {
        localStorage.setItem("ngo",data.user.ngo);
        navigate("/ngo/dashboard");
      } else if (data.user.role ==="donor") {
        navigate("/donor/dashboard")
      } else if (data.user.role ==="needy") {
        navigate("/needy/RequestFood");
      }
      else if (data.user.role==="volunteer") {
        navigate("/volunteer/VolunteerList")
      } else if(data.user.role==="admin"){
        navigate("/admin");
      }
    } catch (err) {
      setError("Server error");
    };
  };
  return (
    <div style={styles.Container}>
      <div style={styles.FormWrapper}>
        <Notification message={error} onClose={() => setError("")} />

        <form style={styles.Form} onSubmit={handleSubmit}>
          <h2 style={styles.Title}>Login</h2>

          <input name="identifier" placeholder="Name or Email" onChange={handleChange} style={styles.Input} />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} style={styles.Input} />

          <button type="submit" style={styles.Button}>Login</button>

          <p style={styles.Link}>
            Dont Know password? <a href="/forgot-password"  style={{color:"#4caf50",fontWeight:"100"}}>Forget Password</a>
          </p>
        </form>
      </div>
    </div>
  );
};

const styles = {
  Container: {
    minHeight: "93vh",
    height:"100vh",
    background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${bgImage}) center/cover no-repeat`,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "47px",
  },
  FormWrapper: {
    Position: "relative",
    Width: "100%",
    maxWidth: "420px",
  },

  Form: {
    Background: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(15px)",
    padding: "40px",
    borderRadius: "20px",
    display: "flex",
    flexDirection: "column",
    width: "100%",
    minWidth: "500px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
    animation: "fadeIn 0.8s ease",
  },
  Title: { textAlign: "center", color: "#fff", marginBottom: "25px" },
  Input: {
    marginBottom: "15px",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    outline: "none",
    fontSize: "16px",
    transition: "all 0.3s ease",
    background: "rgba(255,255,255,0.2)",
    color: "#0c0c0cff",
  },
  Button: {
    Padding: "12px",
    borderRadius: "10px",
    border: "none",
    backgroundColor: "#4caf50",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "all 0.3s ease",
    height:"40px",
  },
  Link: { marginTop: "15px", textAlign: "center", color: "#fff" },
};
export default Login;
