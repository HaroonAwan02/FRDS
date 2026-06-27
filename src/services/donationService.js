import axios from "axios";
export const createDonation = async (data) => {
    return await axios.post(
        "https://frds.onrender.com/api/donations",data
    );
};
const API="https://frds.onrender.com/api/donations";
export const getDonations =  () => {
    return  axios.get(API);
};
export const acceptDonationAPI=(id)=>{
    const token=localStorage.getItem("token");
     return axios.put(`${API}/accept/${id}`,{},{
        headers:{
            Authorization:`Bearer ${token}`
        },
     }
    );
};