import {
  BarChart,
  CheckCircle,
  Eye,
  HandHeart,
  Home,
  LogOut,
  Star
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";
export default function DonorDashboard() {
  const [sidebarOpen,setSidebarOpen]=useState(false);
  const [donations,setDonations]=useState([]);
  const [reviews,setReviews]=useState([]);
  const [avgRating,setAvgRating]=useState(0);
  const [page,setPage]=useState(1);
  const [TotalPages,setTotalPages]=useState(1);
  const navigate=useNavigate();
  const reviewsPerPage=2;
  const reviewStart=(page-1)*reviewsPerPage;
  const paginatedReviews=reviews.slice(reviewStart,reviewStart+reviewsPerPage);
  const totalReviewPages=Math.ceil(reviews.length/reviewsPerPage);
   const itemsPerPage=4;
    const handleLogout=()=>{
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("user");
      navigate("/login");
    }
    useEffect(()=>{
      fetchDonations();
      fetchReviews(page);
      const interval=setInterval(fetchDonations,3000);
      return()=>clearInterval(interval);
    },[page]);
    const fetchDonations=async()=>{
      try{
        const user= JSON.parse(localStorage.getItem("user"));
        const res = await fetch(`http://localhost:5000/api/donations/my-donations/${user._id}`

        );
        const data=await res.json();
        setDonations(data);
      }catch(err){
        console.log(err);
      }
    }
    const fetchReviews=async()=> {
      try {
        const user=JSON.parse(localStorage.getItem("user"));
        const res=await fetch(`http://localhost:5000/api/ratings/${user._id}`);
        const data=await res.json();
        setReviews(data.ratings||[]);
         setTotalPages(data.TotalPages|| 1);
         setPage(data.page||1);
        const avg=data.ratings.length > 0 ? data.ratings.reduce((acc,r)=>acc+r.rating,0)/data.ratings.length:0;
        setAvgRating(avg.toFixed(1));
      }catch(err){
        console.log(err);
      }
    }
    const total=donations.length;
    const pending= donations.filter(d=>d.status==="pending").length;
    const completed=donations.filter(d=>d.status==="completed").length;
    const successRate=total===0?0:((completed/total)*100).toFixed(2);
     const start=(page-1)*itemsPerPage;
  const paginationDate=donations.slice(start,start+itemsPerPage);
  return (
    <div className="donor-page">
    <div className="dashboard-container">
      {sidebarOpen&&(
        <div className="mobile-overlay" onClick={()=>setSidebarOpen(false)}/>
      )}
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen?"open" :""}`} onClick={(e)=>e.stopPropagation()}>
        <div className="logo">💧 Donate</div>
        <ul className="menu">
          <li className="active"><Link to="/" className="menu-link"><Home size={20}/><span>Dashboard</span></Link></li>
          <li><Link to="/donor/AddDonation" className="menu-link"><HandHeart size={20}/><span>Donate</span></Link></li>
          <li><Link to="/components/viewDonation" className="menu-link"><Eye size={20}/><span>Donations</span></Link></li>
          <li><Link to="/login" className="menu-link" onClick={handleLogout}><LogOut size={20}/><span>Logout</span></Link></li>
        </ul>
      </aside>
      {/* Main Area */}      <main className="main-content">
        {/* Topbar */}
        <div className="topbar">
          <div className="hamburger" onClick={()=>setSidebarOpen(!sidebarOpen)}>
            ☰
          </div>
          <h2>❤️ CareShare</h2>
          <div className="top-icons">
            <span>🔔</span>
            <span>📩</span>  
              <span>John Doe</span>
          </div>
        </div>

        {/* Dashboard Title */}
        <h2 className="title">Welcome Donor</h2>

        {/* Stats Cards */}
        <div className="stats">
          <div className="card green">
            <h3><HandHeart size={34}/>{total}</h3>
            <p>Total Donations</p>
          </div>
          <div className="card red">
            <h3><BarChart size={34}/>{pending}</h3>
            <p>Pending Pickups</p>
          </div>
          <div className="card purple">
            <h3><CheckCircle size={34}/>{completed}</h3>
            <p>Completed</p>
          </div>
          <div className="card blue">
            <h3><Star size={34}/>{successRate}%</h3>
            <p>Success Rate</p>
          </div>
        </div>
         <div className="rating-card">
          <h3>Your Rating</h3>
          <div className="rating-summary">
            <h2>★{avgRating||0}/5</h2>
            <p>{avgRating>=4?"Trusted donor":avgRating>=3?"Good Donor":"Need improment"}</p>
          </div>
          <div className="review-list">
            {Array.isArray(reviews)&&reviews.length===0?(
              <p>No review yet</p>
            ):(
            paginatedReviews.slice(0,3).map((r)=>(
              <div key={r._id} className="review-item">
                <span className="review-star">★{r.rating}</span>
                <span className="review-text">{r.comment}</span>
                </div>
            ))
          )}
          
          <div className="pagination">
                <button onClick={()=>setPage(page-1)} disabled={page===1}>
                  prev
                </button>
                 <button className="active">{page}</button>
                <button onClick={()=>setPage(page+1)} disabled={page===totalReviewPages}>Next</button>
                </div>
          </div>
         </div>
        {/* Table */}
        <div className="table-card">
          <div className="table-header">
            <h3>Donor List</h3>
          </div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Food</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {paginationDate.length===0?(
                <tr><td colSpan="4">No Donations</td>
                </tr>
              ):(
                paginationDate.map((d)=>(
                  <tr key={d._id}>
                  <td>{d.donorName||"You"}</td>
                  <td>{d.email||"N/A"}</td>
                  <td>{d.foodType}({d.quantity})</td>
                  <td>{new Date(d.createdAt).toLocaleDateString()}</td>
                  <td><span className={`status ${d.status}`}>{d.status}</span></td>
                </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="pagination">
            <button onClick={()=>setPage(page-1)} disabled={page===1}>{"<"}</button>
            <button className="active">{page}</button>
            <button onClick={()=>setPage(page+1)} disabled={start+itemsPerPage>=donations.length}>{">"}</button>
          </div>
        </div>
        <footer className="footer">
            <p>The smallest act of kindness is worth more than the grandest intention</p>
          </footer>
      </main>
    </div>
    </div>
  );
}
