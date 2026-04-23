import {
  Eye,
  FileText,
  HandHeart,
  HelpingHand, Home, LogOut,
  User
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import socket from "../../services/socket.js";
import "./NGODashboard.css";
const NGODashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
   const [notifications,setNotifications] =useState([]);
   const [volunteers,setVolunteers]=useState([]);
     const [selectedDonationStatus,setSelectedDonationStatus]=useState("pending");
 /* const [count,setCount]=useState(0);*/
   const [show,setShow]=useState(false);
   const [donations,setDonations]=useState([]);
   const [selectedDonation,setSelectedDonation]=useState(localStorage.getItem("acceptedDonationId"));
   const [needyRequests,setNeedyRequests]=useState([]);
   const assignedDonation=localStorage.getItem("assignedDonation");
   localStorage.getItem("selectedDonation");
  useEffect(()=>{
    socket.onAny((event,...args)=>{
      console.log("event recieved",event,args);
    });
    const ngo = localStorage.getItem("ngo");
    console.log("ngo from storage",ngo);
    if(!ngo){
      console.error("ngo not found");
      return;
    }
    fetch(`http://localhost:5000/api/users/volunteers/${ngo.toLowerCase()}`).then(res=>res.json()).then(data=>{
      console.log("volunteer reicded",data);
      setVolunteers(data);
      fetch ("http://localhost:5000/api/requests").then(res=>res.json()).then(data=>{setNeedyRequests(data);

      });
  });
    const city=localStorage.getItem("city");
    if(city){
      const formattedCity=city.trim().toLowerCase();
      fetch(`http://localhost:5000/api/notifications/${formattedCity}`)
      .then(res=>res.json())
      .then(data=>{
        if(Array.isArray(data)){
          setNotifications(data);
        }else{
        setNotifications([]);
        }
      });
      fetch("http://localhost:5000/api/donations").then(res=>res.json()).then(data=>setDonations(data));
      /*console.log("joiinig room",formattedCity);*/
      socket.emit("joinCity",formattedCity);
    }
    socket.on("newDonation",(donation)=>{
      console.log("new donation recieved",donation);
      /*setNotifications(prev=>[{donorName:donation.donorName},...prev]);*/
      setNotifications(prev=>{ if(!Array.isArray(prev))
       return [donation];
       return [donation,...prev]
    });
      const accepted=donations.find(d=>d._id===selectedDonation);
      if(accepted){
        setSelectedDonationStatus(accepted.status);
      }
      fetch("http://localhost:5000/api/requests")
    .then(res=>res.json()).then(data=>setNeedyRequests(data));
  });
  return ()=>{
    socket.off("newDonation");
  }
 },[]);

  const navigate=useNavigate();
  const handleLogout=()=>{
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/login");
  }
   const acceptDonation =async(id)=>{
    await fetch(`http://localhost:5000/api/donations/accept/${id}`,{
      method:"PUT"
    });
    setDonations(prev=>prev.map(d=>
      d._id===id?{...d,status:"accepted"}:d
    ));
    setSelectedDonation(id);
    console.log("selected",id);
  };
  const assignVolunteer=async(donationId,volunteerId)=>{
    const acceptDonation=donations.find(d=>d.status==="accepted");
    if(!acceptedDonations){
      alert("please accept donation first");
      return;
    }
     donationId=acceptDonation._id;
    try {
      console.log("sending",{donationId,volunteerId});
      console.log("selectedDonation",selectedDonation);
      const res= await fetch("http://localhost:5000/api/donations/assign",{
        method:"PUT",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({donationId,volunteerId})
      }
    );
    const data = await res.json()
    if(!res.ok){
      alert(data.message);
      return;
    }
    setSelectedDonationStatus("assigned");
    setDonations(prev=>prev.map(d=>d._id===donationId?{...d,status:"assigned",volunteer:volunteerId}:d
    )
  );
  setVolunteers(prev=>prev.map(v=>v._id===volunteerId?{...v,status:"assigned"}:v)
);
   localStorage.setItem("assignedDonation",donationId);
    }catch(err){
      console.log(err);
    }
    
  };
  const toggleNotification=async()=>{
    setShow(!show);
    const city=localStorage.getItem("city")?.toLowerCase();
    if(!show){
      try{
        const res=await fetch(`http://localhost:5000/api/notifications/mark-read/${city}`,{
        method:"PUT"
      });
      }catch(err){
        console.log(err);
      }
    }
  };
  const approveRequest=async(id)=>{
    await fetch(`http://localhost:5000/api/requests/approve/${id}`,{
      method:"PUT"
    });
    setNeedyRequests(prev=>prev.map(r=>r._id===id?{...r,status:"approved"}:r
      
    )
  );
  };
  const visibleDonations=donations.filter(d=>d.status==="pending"||d.status==="accepted");
  const pendingDonations =donations.filter(d=>(d.status||"").toLowerCase()==="pending").length;
  const acceptedDonations=donations.filter(d=>d.status==="accepted").length;
  return (
    <div className="ngo-layout">
      {sidebarOpen && (<div className="mobile-overlay" onClick={()=>setSidebarOpen(false)}/>
  )}
      <aside className={`sidebar ${sidebarOpen ? "open" :""}`} onClick={(e)=>e.stopPropagation()} style={{ backgroundColor: "#aae6e3ff" }}>
        <h2>NGO Dashboard</h2>
        <ul className="menu">
          <li className="active"><Link to="/" className="menu-link"><Home size={20}/><span>Dashboard</span></Link></li>
          <li><Link to="/components/viewDonation" className="menu-link"><Eye size={24}/><span>Donations</span></Link></li>
          <li><Link to="/needy/RequestFood" className="menu-link"><HelpingHand size={24}/><span>Requests</span></Link></li>
          <li><Link to="/Volunteer/VolunteerList" className="menu-link"><User size={24}/><span>Volunteers</span></Link></li>
          <li><Link to="/login" className="menu-link" onClick={handleLogout}><LogOut size={24}/><span>Logout</span></Link></li>
        </ul>
      </aside>
      <main className="main">
        <header className="topbar">
          <div className="hamburger" onClick={()=>setSidebarOpen(true)}>
            ☰
            </div>
          <h3>Welcome, Helping Hands NGO!</h3>
          <div className="top-icons">
            <div style={{position:"relative"}}>
              <span onClick={toggleNotification}
              style={{cursor:"pointer"}}>🔔{notifications.length}</span>
              {show && (
                <div style={{
                  position:"absolute",
                  right:"0",
                  top:"35px",
                  background:"white",
                  color:"black",
                  width:"260px",
                  maxHeight:"300px",
                  overflowY:"auto",
                  boxShadow:"0 5px 15px rgba(0,0,0,0.2)",
                  padding:"10px",
                  borderRadius:"6px",
                  zIndex:9999
                }}>
                 <div className="notification-dropdown">
                  {notifications.length===0?(
                    <p>No New Donation</p>
                  ):(
                    (Array.isArray(notifications)?notifications:[]).map((n,index)=>(
                      <p key={index}>
                       {n.message?n.message: `New donation from ${n.donorName}`}
                      </p>
                    ))
                  )}
                  </div>
                  </div>
              )}
              </div>
            <span>✉️</span>
            <span>Admin</span>
          </div>
        </header>
        <section className="NGO-stats">
          <div className="card blue">
            
            <div>
              <h4><HandHeart size={34}/>New Donations</h4>
              <p>{pendingDonations}Pending</p>
            </div>
          </div>

          <div className="card green">
            
            <div>
              <h4><User size={34}/>Volunteers</h4>
              <p>{volunteers.length}</p>
            </div>
          </div>

          <div className="card orange">
            
            <div>
              <h4><HelpingHand size={34}/>Needy Requests</h4>
              <p>{needyRequests.length}</p>
            </div>           
          </div>

          <div className="card dark">
            
            <div>
              <h4><FileText size={34}/>Reports</h4>
              <p>{acceptedDonations} Alerts</p>
            </div>
          </div>
        </section>

        
        <section className="content">
          
          
          <div className="box large donation-table">
            <h3>Recent Donations</h3>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {(!volunteers ||volunteers.length===0)&&(
                <tr>
                  <td colSpan="5">No volunteers </td></tr>
                )}
                {volunteers.map((v)=>(
                  <tr key={v._id}>
                    <td>{v.Name}</td>
                  <td>{v.contact}</td>
                  <td>{v.Email}</td>
                  <td>{v.status==="assigned"? "Assigned":"Available"}</td>
                   <td>
                      <button className="assign-btn" onClick={()=>assignVolunteer(selectedDonation,v._id)}
                      disabled={v.status==="assigned"}
                      style={{
                        background:v.status==="assigned"?"red":"green",
                        color:"#fff",
                        border:"none",
                        padding:"6px 12px",
                        borderRadius:"5px",
                        cursor:v.status==="assigned"?"not-allowed":"pointer"
                      }}
                      >{v.status==="assigned"?"Assigned":"Assign"}</button>
                   </td>
                </tr>
                ))}
              </tbody>
            </table>
          </div>

          
          <div className="side-panels">
           
              <h3>Needy Requests</h3>
              <div className="needy-scroll">
                <tabel>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Members</th>
                      <th>Urgency</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
               
                <tbody>
                  {needyRequests.map(n=>(
                    <tr key={n._id}>
                    <td>{n.firstName}{n.lastName}</td>
                    <td>{n.familyMembers}</td>
                    <td>{n.urgency}</td>
                    <td>{n.status}</td>
                    <td>{n.status==="pending" &&(
                      <button disabled={n.status==="approved"} className="approve-btn" onClick={()=>approveRequest(n._id)}>Approve</button>
                    )}
                    {n.status==="approved" &&"Approved"}</td>
                    </tr>
                  ))}
                </tbody>
                 </tabel>
              </div>
          </div>

        </section>
       <footer className="footer">
            <p>Technology is most powerful when its brings people togather to help those in need</p>
          </footer>
      </main>
    </div>
  );
};
export default NGODashboard;
