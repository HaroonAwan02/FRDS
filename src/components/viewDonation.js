import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { acceptDonationAPI, getDonations } from "../services/donationService.js";
import "./viewDonation.css";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function ViewDonation() {

  const [donations, setDonations] = useState([]);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const res = await getDonations();
      setDonations(res.data);
    } catch (error) {
      console.log(error);
    }
  };
    const acceptDonation=async(id)=>{
      try{
        const res=await acceptDonationAPI(id);
        setDonations(prev=>
          prev.map(d=>
            d._id===id?{...d,status:"accepted"}:d
          )
        );
        await fetchDonations();
      }catch(error){
        console.log("full error",error.response?.data);
      }
    }
    const completeDonation=async(id)=>{
      try{
        const res=await fetch(`http://localhost:5000/api/donations/completed/${id}`,{
        method:"PUT"
      });
      const data=await res.json();
      if(!res.ok){
        alert(data.message);
        return;
      }
       setDonations(prev=>prev.map(d=>d._id===id?{...d,status:"completed"}:d
      )
    );
    }catch(err){
      console.log(err);
    }
    await fetchDonations();
  }
  return (
    <div className="vd-page">
      <h2 className="vd-title">View Donations</h2>

      <div className="vd-grid">
        {donations.map((d) => (
          <div className="vd-card" key={d._id}>

            <div className="vd-card-header">
              <h3>{d.foodType}</h3>
              <span className={`vd-status ${d.status?.toLowerCase() || "pending"}`}>
                {d.status || "Pending"}
              </span>
            </div>

            <div className="vd-card-body">
              <div className="vd-info">
                <p><b>Quantity:</b> {d.quantity}</p>
                <p><b>Expiry:</b> {d.expiryTime}</p>
                <p><b>Pickup Location:</b> {d.locationText}</p>
              </div>
               {d.lat !=null && d.lang !=null &&(
              <div className="vd-map">
                <MapContainer
                  center={[Number(d.lat),Number( d.lang)]}
                  zoom={14}
                  scrollWheelZoom={false}
                  style={{ height: "200px", width: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[Number(d.lat),Number(d.lang)]} />
                </MapContainer>
              </div>
                )}
                {d.status==="pending"&& localStorage.getItem("role")==="ngo" &&(
                  <button className="vd-accept-btn" onClick={()=>acceptDonation(d._id)}>Accept Donation</button>
                )}
                {d.status==="accepted"&&(
                  <p className="vd-accept-msg">Acept by NGO</p>
                )}
                {d.status==="assigned" &&(
                  <button className="vd-complete-btn" onClick={()=>completeDonation(d._id)}>Mark completed</button>
                )}
                {d.status==="completed" &&(
                  <p className="vd-complete-msg">Donation completed</p>
                )}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
