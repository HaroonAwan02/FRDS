import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import needyBanner from "../../assets/images/Fooddonation.jpg";
import "./RequestFood.css";
const RequestFood = () => {
const {t}=useTranslation();
const [tab]=useState("form");
const [requests,setRequests]=useState([]);
const [activeTab,setActiveTab]=useState("form");
/*const user=JSON.parse(localStorage.getItem("user"));*/

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

</div>

<label>{t('Name')}</label>

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

<label>{t('Type')}</label>

<select name="type" onChange={handleChange} required>
<option value="">{t('Request Type')}</option>
<option value="food">{t('Food')}</option>
</select>

<label>{t('Family Members')}</label>

<input
type="number"
name="familyMembers"
placeholder="Number of Family Members"
onChange={handleChange}
required
/>

<label>{t('Urgency level')}</label>

<select name="urgency" onChange={handleChange} required>
<option value="">{t('Urgency Level')}</option>
<option value="low">{t('Low')}</option>
<option value="medium">{t('Medium')}</option>
<option value="high">{t('High')}</option>
</select>

<label>{t('Reason')}</label>

<textarea
name="reason"
placeholder="Reason for request"
rows="3"
onChange={handleChange}
required
/>
<div className="tabs">
<button type="submit">{t('Submit Request')}</button>
<button
className={tab==="myrequests"?"active":""}
onClick={()=>setActiveTab("my")}
>
{t('My Requests')}
</button>
</div>
</form>
)}

{activeTab==="my" && (

<div className="myrequests">

<h2>{t('My Requests')}</h2>

<table>

<thead>
<tr>
<th>{t('Name')}</th>
<th>{t('Members')}</th>
<th>{t('Urgency')}</th>
<th>{t('Status')}</th>
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
