import { useEffect, useState } from "react";
import "./Rating.css";
export default function RateDonor() {
  const [search, setSearch] = useState("");
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [open, setOpen] = useState(false);
  const [donors,setDonors]=useState([]);
   useEffect(()=>{
      fetch("http://localhost:5000/api/users/donors").then(res=>res.json()).then(data=>{
        setDonors(data);
      }).catch(err=>console.log(err));
    },[]);
  const filteredDonors = donors.filter(d =>
    d.Name.toLowerCase().includes(search.toLowerCase())  
  );
    const handleSubmit=async()=>{
      try {
        const res=await fetch("http://localhost:5000/api/ratings",{
          method:"POST",
          headers:{
            "Content-Type":"application/json",
          },
          body:JSON.stringify({
            donorId:selectedDonor._id,
            rating,
            comment,
          }),
        });
        const data =await res.json();
        if(!res.ok){
          alert(data.message);
          return;
        }
        alert("Review submitted succesffully");
        setRating(0);
        setComment("");
        setSearch("");
        setSelectedDonor(null);
      }catch(err){
        console.log(err);
        alert("Server error");
      }
    };
  return (
    <div className="rate-container">
      <div className="rate-card">
        <h2>Rate Donor</h2>
        {/* Searchable Dropdown */}
        <label>Select Donor</label>
        <div className="dropdown">
          <input
            type="text"
            placeholder="Search donor..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}/>
            
          {open && (
            <ul className="dropdown-list">
              {filteredDonors.length > 0 ? (
                filteredDonors.map((donor) => (
                  <li
                    key={donor._id}
                    onClick={() => {
                      setSelectedDonor(donor);
                      setSearch(donor.Name);
                      setOpen(false);
                    }}
                  >
                    {donor.Name}
                  </li>
                ))
              ) : (
                <li className="empty">No donor found</li>
              )}
            </ul>
          )}
        </div>

        {/* Star Rating */}
        <label>Rate Your Experience</label>
        <div className="stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              Key={star}
              className={
                star <= (hover || rating) ? "star filled" : "star"
              }
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
            >
              ★
            </span>
          ))}
        </div>

        {/* Comment */}
        <label>Your Feedback</label>
        <textarea
          placeholder="Write your comments here..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        {/* Submit */}
        <button className="rating-btn"
          disabled={!selectedDonor || rating === 0}
          onClick={handleSubmit}
        >
          Submit Review
        </button>

        <p className="note">
          Your feedback helps improve donor collaboration.
        </p>
      </div>
    </div>
  );
}
