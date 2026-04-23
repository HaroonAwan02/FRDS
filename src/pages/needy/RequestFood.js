/*import { useState } from "react";
import needyBanner from "../../assets/images/Fooddonation.jpg";
import "./RequestFood.css";

const RequestFood = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    type: "",
    familyMembers: "",
    urgency: "",
    reason: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Request submitted successfully");
  };

  return (
    <div className="needy-container">
      <form className="needy-form" onSubmit={handleSubmit}>
        <div className="needy-banner">
         <img src={needyBanner} alt="Needy Request" />
        <h2>Needy Request Form</h2>
      </div>
      <label>Name</label>
        <div className="row">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="lastName"
            Placeholder="Last Name"
            onChange={handleChange}
            required
          />
        </div>
        <label>Type</label>
        <select name="type" onChange={handleChange} required>
          <option value="">Request Type</option>
          <option value="food">Food</option>
        </select>
        <label>Family Members</label>
        <input
          Type="number"
          Name="familyMembers"
          Placeholder="Number of Family Members"
          onChange={handleChange}
          required
        />
         <label>Urgency level</label>
        <select name="urgency" onChange={handleChange} required>
          <option value="">Urgency Level</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <label>Reason</label>
        <textarea
          Name="reason"
          Placeholder="Reason for request"
          Rows="3"
          onChange={handleChange}
          required
        />

        <button type="submit">Submit Request</button>
      </form>
    </div>
  );
};

export default RequestFood;
*/
import { useEffect, useState } from "react";
import needyBanner from "../../assets/images/Fooddonation.jpg";
import "./RequestFood.css";

const RequestFood = () => {

const [tab,setTab]=useState("form");
const [requests,setRequests]=useState([]);
const [activeTab,setActiveTab]=useState("form");
const user=JSON.parse(localStorage.getItem("user"));

const [form,setForm]=useState({
firstName:"",
lastName:"",
type:"",
familyMembers:"",
urgency:"",
reason:"",
status:"pending"
});

const handleChange=(e)=>{
setForm({...form,[e.target.name]:e.target.value});
};

const handleSubmit=async(e)=>{
e.preventDefault();
try {
  const userId=localStorage.getItem("userId");
  const res=await fetch("http://localhost:5000/api/requests",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
  needyId:userId,
  firstName:form.firstName,
  lastName:form.lastName,
  familyMembers:form.familyMembers,
  urgency:form.urgency,
  reason:form.urgency
})
  });
  const data = await res.json();
  if(!res.ok){
    alert(data.message);
    return;
  }
  alert("request submitted");
  }catch(err){
    console.log(err);
  }
};
const loadMyRequests=async()=>{
  const userId=localStorage.getItem("userId");
  const res=await fetch(`http://localhost:5000/api/requests/${userId}`);
  const data = await res.json();
  setRequests(data);
 }
useEffect(()=>{
  loadMyRequests();
},[]);
 
return(
<div className="needy-container">

{activeTab==="form" && (

<form className="needy-form" onSubmit={handleSubmit}>

<div className="needy-banner">
<img src={needyBanner} alt="Needy Request"/>
<h2>Needy Request Form</h2>
</div>
<div className="tabs">
<button
className={tab==="form"?"active":""}
onClick={()=>setActiveTab("form")}
>
Request Food
</button>

<button
className={tab==="myrequests"?"active":""}
onClick={()=>setActiveTab("my")}
>
My Requests
</button>
</div>
<label>Name</label>

<div className="row">

<input
type="text"
name="firstName"
placeholder="First Name"
onChange={handleChange}
required
/>

<input
type="text"
name="lastName"
placeholder="Last Name"
onChange={handleChange}
required
/>

</div>

<label>Type</label>

<select name="type" onChange={handleChange} required>
<option value="">Request Type</option>
<option value="food">Food</option>
</select>

<label>Family Members</label>

<input
type="number"
name="familyMembers"
placeholder="Number of Family Members"
onChange={handleChange}
required
/>

<label>Urgency level</label>

<select name="urgency" onChange={handleChange} required>
<option value="">Urgency Level</option>
<option value="low">Low</option>
<option value="medium">Medium</option>
<option value="high">High</option>
</select>

<label>Reason</label>

<textarea
name="reason"
placeholder="Reason for request"
rows="3"
onChange={handleChange}
required
/>

<button type="submit">Submit Request</button>

</form>
)}

{activeTab==="my" && (

<div className="myrequests">

<h2>My Requests</h2>

<table>

<thead>
<tr>
<th>Name</th>
<th>Members</th>
<th>Urgency</th>
<th>Status</th>
</tr>
</thead>

<tbody>

{requests.length===0 && (
<tr>
<td colSpan="4">No requests yet</td>
</tr>
)}

{requests.map(r=>(
<tr key={r._id}>
<td>{r.firstName} {r.lastName}</td>
<td>{r.familyMembers}</td>
<td>{r.urgency}</td>
<td>{r.status}</td>
</tr>
))}

</tbody>

</table>

</div>
)}

</div>
);
};

export default RequestFood;
