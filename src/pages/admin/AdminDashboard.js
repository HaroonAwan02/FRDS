import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import {
  Blocks,
  Eye,
  Home,
  LogOut,
  User
} from "lucide-react";
import { useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import { Link, useNavigate } from "react-router-dom";
import "./AdminDashboard.css";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);
export default function AdminDashboard() {
  const [sidebarOpen,setSidebarOpen]=useState(false);
  const [stats,setStats]=useState({});
  const [chartData,setChartData]=useState([]);
  const [monthlyData,setMonthlyData]=useState([]);
  const [users,setUsers]=useState([]);
  const [currentPage,setCurrentPage]=useState(1);
  const usersPerPage=4;
  const months=["Jan","Feb","Mar","Apr","May","Jun","July","Aug","Sep","Oct","Nov","Dec"];
  const monthlyCounts=new Array(12).fill(0);
  if(Array.isArray(monthlyData)){
    monthlyData.forEach(item=>{
      monthlyCounts[item._id - 1]=item.count;
    });
  }
  const navigate=useNavigate();
  useState(()=>{
    fetch("http://localhost:5000/api/admin/stats").then(res=>res.json()).then(data=>setStats(data));
    fetch("http://localhost:5000/api/admin/analytics").then(res=>res.json()).then(data=>setChartData(data));
    fetch("http://localhost:5000/api/admin/monthly").then(res=>res.json()).then(data=>setMonthlyData(data));
    fetch("http://localhost:5000/api/users").then(res=>res.json()).then(data=>{if(Array.isArray(data)){
      setUsers(data)
    }else {
      setUsers(data.users||[]);
    }
  });
  },[]);
   const handleLogout=()=>{
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    navigate("/login");
   }
   const handleReport=async(id)=>{
    try {
     const res= await fetch(`http://localhost:5000/api/users/report/${id}`,{
        method: "PUT",
      });
       const updatedUser=await res.json();
       console.log(updatedUser);
      setUsers(prev=>prev.map(user=>user._id===id ? {...user,isReported:true}:user
      ));
    }catch(err){
    console.error(err);
    }
   }
   const handleUnblock=async(id)=>{
    const res= await fetch(`http://localhost:5000/api/users/unreport/${id}`,{
      method: "PUT",
    });
    const updatedUser= await res.json();
    console.log(updatedUser);
    setUsers(prev=>prev.map(user=>user._id===id ? {...user,isReported:false}:user
    )
  );
   };
   const indexOfLast=currentPage*usersPerPage;
   const indexOfFirst=indexOfLast-usersPerPage;
   const currentUsers=users.slice(indexOfFirst,indexOfLast);
   const totalPages=Math.ceil(users.length/usersPerPage);
  return (
    <div className="admin-layout">
      {sidebarOpen && (
        <div className="mobile-overlay" onClick={()=>setSidebarOpen(false)}/>
      )}
      {/* SIDEBAR */}
      <aside className={`sidebar ${sidebarOpen ? "open" : " "}`}>
        <h2 className="logo">Admin</h2>
        <ul className="menu">
          <li><Home size={24}/> Dashboard</li>
          <li><Eye size={24}/> Donations</li>
          <li><User size={24}/> Users</li>
          <li><Blocks size={24}/> Reports</li>
          <li><Link to="/login" onClick={handleLogout}><LogOut size={20}/>Logout</Link></li>
        </ul>
        
      </aside>

      {/* MAIN */}
      <main className="admin-main">
        {/* TOP BAR */}
        <div className="topbar">
           <div
            className="hamburger"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </div>
          <h3>Welcome back, Admin</h3>
          <button className="generate-report-btn" onClick={()=>{
          window.open("http://localhost:5000/api/admin/report", "_blank");
        }}>Generate Report</button>
        </div>

        {/* STATS */}
        <section className="admin-stats">
          <Stat title="Total Donations" value={stats.totalDonations||0}  variant="green"/>
          <Stat title="Requests Fulfilled" value={stats.completedDonations||0} variant="purple"/>
          <Stat title="Registered Users" value={stats.totalUsers||0} variant="red"/>
          <Stat title="Reported Users" value={stats.reportedUsers||0} variant="orange"/>
        </section>
        {/* CHARTS */}
        <div className="charts">
          <div className="chart-card">
            <h4>Donation Analytics</h4>
            <Bar 
              data={{
               labels:Array.isArray(chartData)?chartData.map(item=>item._id):[],
               datasets:[
                {
                  label:"Donations",
                  data:Array.isArray(chartData)?chartData.map(item=>item.count):[],
                  backgroundColor:["#4f46e5","#06b6d4","#22c55e"],
                },
               ],
              }}
            />
          </div>

          <div className="chart-card">
            <h4>Performance Analytics</h4>
            <Line
              data={{
               labels:months,
               datasets:[
                {
                  label:"Monthly Donations",
                  data:monthlyCounts,
                  borderColor:"#10b981",
                  tension:0.4,
                },
               ],
              }}
            />
          </div>
        </div>
        <div className="user-section">
          <h3>Manage User</h3>
        <div className="user-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map(user=>(
                <tr key={user._id}>
                  <td>{user.Name}</td>
                  <td>{user.Email}</td>
                  <td>{user.role}</td>
                  <td>
                    {user.isReported?(<span className="blocked">Blocked</span>
                    ) : (
                      <span className="active">Active</span>
                    )}
                  </td>
                  <td>
                    {user.isReported ? (
                      <button className="unblock-btn" onClick={()=>handleUnblock(user._id)}>Unblock</button>
                    ) : (
                      <button className="report-btn" onClick={()=>handleReport(user._id)}>Report</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            {Array.from({length:totalPages},(_,i)=> (
              <button key={i} className={currentPage===i + 1 ? "active-page" : ""} onClick={()=>setCurrentPage(i+1)}>{i+1}</button>
            ))}
          </div>
        </div>
        </div>
        {/* FOOTER */}
        <div className="footer">
          Technology is most powerful when it brings people together to help those in need
        </div>
      </main>
    </div>
  );
}
function Stat({ title, value, change, variant }) {
  return (
    <div className={`stat-card ${variant}`}>
      <p>{title}</p>
      <h2>{value}</h2>
      {change && <span className="positive">{change}</span>}
    </div>
  );
}