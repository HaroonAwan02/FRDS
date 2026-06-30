import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { useEffect, useState } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
ChartJS.register(Filler);
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend
);
const AnalyticsDashboard = () => {
const [ngoData,setNgoData]=useState({});
const [monthlyData,setMonthlyData]=useState({});
const [successData,setSuccessData]=useState({});
const [volunteerData,setVolunteerData]=useState({});
   useEffect(()=>{
    fetchData();
   },[]);
    const fetchData=async()=>{
      try {
       const res=await fetch("https://frds.onrender.com/api/donations");
       const raw=await res.json();
        console.log("analytics api responses",raw);
        const data=Array.isArray(raw)?raw:raw.data||[];
        const ngoMap={};
        data.forEach(d=> {
          const ngo=d.assignedNgo ||"Unassigned";
          ngoMap[ngo]=(ngoMap[ngo]||0)+1;
        });
      setNgoData({
        labels:Object.keys(ngoMap),
        datasets:[{
          label:"Donations",
          data:Object.values(ngoMap),
          borderRadius:8,
          backgroundColor:"#4f46e5"
        },
      ],
      });
      const months=["Jan","Feb","Mar","Apr","May","June","July","Aug","Sep","Oct","Nov","Dec"];
      const monthMap={};
      months.forEach(m=>monthMap[m]=0);
       const extractNumber=(str)=>{
          if(!str) return 0;
          const match=str.match(/\d+/);
          return match ? parseInt(match[0]):0;
        };
      data.forEach(d=>{
          const qty=extractNumber(d.quantity);
          if(!qty) return;
          if(!d.createdAt) return;
          const date=new Date(d.createdAt);
          if(isNaN(date.getTime())) return;
        const month=date.toLocaleString("default",{month:"short"});
        monthMap[month]=(monthMap[month]||0)+qty;
      });
      console.log("Month map",monthMap);
      setMonthlyData({
      labels:months,
      datasets:[{
        label:"Food Rescued",
        data:months.map(m=>monthMap[m]),
        borderColor:"#22c55e",
        backgroundColor:"rgba(34,197,94,0.25)",
        tension:0.4,
        fill:true,
      },
      ],
   });
   let success=0;
   let failed=0;
   data.forEach(d=>{
    if(d.status==="completed")
    success++;
  else failed++;
   });
    setSuccessData({
      labels:["completed","others"],
      datasets:[{
        data:[success,failed],
      backgroundColor:["#22c55e","#ef4444"]
      },
    ],
    });
    const volMap={};
    console.log("Volunteer field:",data.map(d=>d.assignedNVolunteer));
    data.forEach((d)=>{
      console.log("full data",d);
      if(d.status==="completed"){
     const vol=d.volunteer?.Name || d.assignedNVolunteer || "unassigned";
      volMap[vol]=(volMap[vol]||0)+1;
      }
    });
    setVolunteerData({
      labels:Object.keys(volMap),
      datasets:[{
        label:"Tasks",
        data:Object.values(volMap),
        backgroundColor:"#38bdf8",
        borderRadius:8,
      },
    ],
    });
  }catch(err){
   console.log("Analytics error:",err);
  }
};
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <div style={styles.Page}>
      {/* NAVBAR */}
      <div style={styles.Navbar}>
        <h2 style={styles.navTitle}>Analytics Dashboard</h2>
      </div>

      {/* GRID */}
      <div style={styles.row}>
        {/* ROW 1 */}
        <div style={styles.card}>
          <h4 style={styles.cardTitle}>Donations per NGO</h4>
          <div style={styles.chartBox}>
           {ngoData.labels && <Bar data={ngoData} options={options} /> }
          </div>
        </div>

        <div style={styles.card}>
          <h4 style={styles.cardTitle}>Food Rescued Per Month</h4>
          <div style={styles.chartBox}>
          {monthlyData.labels &&  <Line data={monthlyData} options={options} />}
          </div>
        </div>

        {/* ROW 2 */}
        <div style={styles.card}>
          <h4 style={styles.cardTitle}>Delivery Success Rate</h4>
          <div style={styles.pietBox}>
            {successData.labels &&<Pie data={successData} />}
          </div>
        </div>

        <div style={styles.card}>
          <h4 style={styles.cardTitle}>Volunteer Performance</h4>
          <div style={styles.chartBox}>
            {volunteerData.labels &&<Bar data={volunteerData} options={options} />}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------------- STYLES ---------------- */

const styles = {
  Page: {
    padding:"20px",
    display:"flex",
    flexDirection:"column",
    gap:"20px",
    background:"#d0e5faff",
    minHeight:"100vh"
  },

  Navbar: {
    height: "64px",
    background: "#16223fff",
    display: "flex",
    alignItems: "center",
    padding: "0 32px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
  },

  navTitle: {
    color: "#ffffff",
    fontSize: "22px",
    fontWeight: 600,
  },

  row: {
    display:"flex",
    gap:"24px",
    flexWrap:"wrap",
    justifyContent:"space-between"
  },

  card: {
    flex:"1 1 calc(50% - 20px)",
    minWidth:"300px",
    background:"#ffffff",
    borderRadius:"14px",
    padding:"18px",
    boxShadow:"0 8px 24px rgba(0,0,0,0.08)",
  },

  cardTitle: {
    fontSize: "15px",
    fontWeight: "600",
    marginBottom: "12px",
    color: "#0f172a",
  },

  chartBox: {
    height: "220px",
  },
  pietBox: {
    width:"100%",
    height:"220px",
    display:"flex",
    alignItems:"center",
    justifyContent:"center",
  },
};

export default AnalyticsDashboard;

