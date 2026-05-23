import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import { createDonation } from "../../services/donationService.js";
import "./Dashboard.css";
const DefaultIcon = L.icon({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});
L.Marker.prototype.options.icon = DefaultIcon;

function LocationPicker({ setCoords }) {
  useMapEvents({
    click(e) {
      setCoords({
        lat: e.latlng.lat,
        lang: e.latlng.lng,
      });
    },
  });
  return null;
}

export default function FoodDonation() {
  const [t]=useTranslation();
  const [coords, setCoords] = useState(null);

  const [form, setForm] = useState({
    donorName:"",
    foodType: "",
    quantity: "",
    expiryTime: "",
    locationText: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!coords) {
      alert("Please select location on map");
      return;
    }
      const user=JSON.parse(localStorage.getItem("user"));
    const donationData = {
      ...form,
      lat: coords.lat,
      lang: coords.lang,
      status: "pending",
      user:user._id
    };

    try {
      await createDonation(donationData);
      alert("Donation added successfully");
    } catch (error) {
      console.log(error);
      alert("Error saving donation");
    }
  };  
  return (
    <div className="fd-container">
      <div className="fd-card">
        <div className="fd-header">
          <h1>{t('Donate Food')}</h1>
          <p>{t('Select exact pickup location on map')}</p>
        </div>

        <form className="fd-form" onSubmit={handleSubmit}>
          <label>{t('Name')}</label>
          <input type="text" placeholder="Your Name" name="donorName" value={form.donorName} onChange={handleChange}/>
          <label>{t('Food Type')}</label>
          <select
            name="foodType"
            value={form.foodType}
            onChange={handleChange}
          >
            <option value="">{t('Select food type')}</option>
            <option>{t('Cooked Food')}</option>
            <option>{t('Raw Food')}</option>
            <option>{t('Packaged Food')}</option>
          </select>

          <label>{t('Quantity')}</label>
          <input
            type="text"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
          />

          <label>{t('Expiry Time')}</label>
          <input
            type="datetime-local"
            name="expiryTime"
            value={form.expiryTime}
            onChange={handleChange}
          />

          <label>{t('Pickup Address')}</label>
          <input
            type="text"
            name="locationText"
            value={form.locationText}
            onChange={handleChange}
          />

          <div style={{ height: "220px", marginTop: "20px" }}>
            <MapContainer
              center={[30.3753, 69.3451]}
              zoom={6}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <LocationPicker setCoords={setCoords} />

              {coords && (
                <Marker position={[coords.lat, coords.lang]} />
              )}
            </MapContainer>
          </div>
          <button type="submit">{t('Donate Food')}</button>
        </form>
      </div>
    </div>
  );
}



