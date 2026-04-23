import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import "./VolunteerList.css";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});
const VolunteersList = () => {
const [volunteer,setVolunteer]=useState(null);
const [donation,setDonation]=useState(null);
const userId=localStorage.getItem("userId");
useEffect(()=>{
  const fetchData=()=>{
  fetch(`http://localhost:5000/api/users/volunteer/me/${userId}`).then((res)=>res.json()).then((data)=>setVolunteer(data));
  fetch(`http://localhost:5000/api/donations/volunteer/${userId}`).then((res)=>res.json()).then((data)=>setDonation(data));
  };
  fetchData();
  const interval=setInterval(fetchData,3000);
  return()=>clearInterval(interval);
},[userId]);
if(!volunteer){
  return <div className="loading">Loading...</div>
}
const FixMap=()=>{
  const map=useMap();
  useEffect(()=>{
    setTimeout(()=>{
      map.invalidateSize();
    },500);
  },[map]);
  return null;
};
  return (
    <div className="volunteer-page">
      <div className="volunteer-container">
        <h2>My Profile</h2>
        <div className="info">
          <p><strong>Name:</strong>{volunteer.Name}</p>
          <p><strong>Email:</strong>{volunteer.Email}</p>
          <p><strong>Contact:</strong>{volunteer.contact}</p>
          <p><strong>City:</strong>{volunteer.city}</p>
        </div>
        <div className={`status-box ${volunteer.status==="assigned" ? "assigned" : "assign"}`}>{volunteer.status==="assigned" ? "you are assigned to a task" : "Not assigned yet"}</div>
        {donation ?(
          <div className="donation-box">
            <h3>Assigned Donation</h3>
            <p><strong>Food Type:</strong>{donation.foodType}</p>
            <p><strong>Quantity:</strong>{donation.quantity}</p>
            <p><strong>Expiry time</strong>{donation.expiryTime}</p>
            <p><strong>Pickup location:</strong>{donation.locationText}</p>
            {donation?.lat !=null && donation?.lang !=null &&(
              <div className="map-box">
                <h3>Pickup location</h3>
                <MapContainer center={[donation.lat,donation.lang]}
                zoom={13}
                scrollWheelZoom={false}
                style={{height:"300px",width:"100%"}}
                className="map">
                  <FixMap/>
                  <TileLayer attribution="&copy; openStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                  <Marker position={[donation.lat,donation.lang]}>
                    <Popup>{donation.address||"Pickup location"}</Popup>
                  </Marker>
                </MapContainer>
                <a href={`https://www.google.com/maps?q=${donation.lat},${donation.lang}`} target="_blank" rel="noreferrer" className="map-btn">Open in Google Maps</a>
                </div>
            )}
            </div>
            ) : (
              <p className="no-task">No active task asign</p>
            )}
      </div>
    </div>
  );
};
export default VolunteersList;
