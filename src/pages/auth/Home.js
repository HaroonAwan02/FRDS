import { BarChart3, Heart, MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from 'react-router-dom';
import chaticon from "../../assets/images/robot.png";
import './Home.css';
const FoodRescueLanding = () => {
  const {t,i18n}=useTranslation();
  const location=useLocation();
  const changeLanguage=(lng)=>{
    console.log("buton clicked",lng);
    i18n.changeLanguage(lng);
    localStorage.setItem('frds_lang',lng);
    if(location.pathname.startsWith("/admin")) {
      document.body.dir="ltr";
    } else{
    document.body.dir=lng==='ur' ? 'rtl' : 'ltr';
  }
}
  const navigate=useNavigate();
  const [chatOpen,setChatOpen]=useState(false);
  const [input,setInput]=useState("");
  const [loading,setLoading]=useState(false);
  const [reports,setReports]=useState([]);
  const [messages,setMessages]=useState([
    {text:"Hi Ask me about food donation!", sender:"bot"}
  ]);;
  useEffect(()=>{
    fetch("http://localhost:5000/api/admin/reports").then(res=>res.json()).then(data=>setReports(data));
  },[]);
  const handleSend=async()=> {
    if(!input.trim()) return;
    const userMsg={text:input,sender:"user"};
     setMessages(prev=>[...prev,userMsg]);
      setInput("");
      setLoading(true);
      try {
         console.log("sending",input);
         const res=await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers:{
        "Content-Type":"application/json",
      },
      body: JSON.stringify({message:input}),
     });
        console.log("status",res.status);
      if(!res.ok){
        throw new Error ("server error");
      }
        const data = await res.json();
        setTimeout(()=>{
          setMessages(prev=>[...prev,{text:data.reply,sender:"bot"}]);
        },800);
      }catch(error){
        console.error(error);
        setMessages((prev)=>[...prev,{sender:"bot",text:"Something went wrong.Try again."},

        ]);
      }finally {
        setLoading(false);
      }
  };
  const handleDownload=async()=> {
    const response = await fetch("http://localhost:5000/api/admin/report");
    const blob=await response.blob();
    const url=window.URL.createObjectURL(blob);
    const a=document.createElement("a");
    a.href=url;
    a.download="Food Rescue Report.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };
  return (
    <div className="container">
      <div className="download-report">
      {reports.length > 0 &&(
          <button onClick={handleDownload} className="download-btn">{t('Download Report')}</button>
      )}
      <button  className="download-btn" onClick={()=>changeLanguage('en')}>{t('English')}</button>
        <button className="download-btn" onClick={()=>changeLanguage('ur')}>{t('اردو')}</button>
      </div>
      {/*<div className="bg-glow-top"></div>
      <div className="bg-glow-bottom"></div>*/}
      <main className="content-wrapper">
        <div className="badge">
          {t('Welcome to Food Rescue Platform')}
        </div>
        <h1 className="headline">
           {t('Empowering Food Rescue')} <br />
          {t('With Smart Solutions')}
        </h1>

        <p className="subheadline">
          {t('Streamline food donation and distribution with AI-powered forecasting,Matching and real-time analytics')}
        </p>
        <div className="button-group">
          <button className="btn btn-primary" onClick={()=>navigate("/register")}>
            {t('Get Started')}
          </button>
          <button className="btn btn-secondary" onClick={()=>navigate("/Analyticsdashboard")}>
            {t('Analytics')}
          </button>
        </div>
        <div className="icon-row">
          <div className="icon-circle">
            <Heart className="icon-svg" />
          </div>
          
          <div className="icon-circle">
            <BarChart3 className="icon-svg" />
          </div>

          <div className="icon-circle">
            <MessageCircle className="icon-svg" />
          </div>
        </div>

      </main>
       <div className="chatbot-btn" onClick={()=>setChatOpen(!chatOpen)}><img src={chaticon} alt="chat" className='chat-img'></img></div>
    {chatOpen && (
      <div className="chatbox">
        <div className="chat-header">{t('Food Rescue Bot')}</div>
        <div className="chat-body">
          {loading && <div className="bot-msg">{t('Typing...')}</div>}
          {messages.map((msg,index)=>(
            <div key={index} className={msg.sender==="user"? "user-msg" :"bot-msg"}>{msg.text}</div>
          ))}
        </div>
      <div className="chat-footer">
        <input value={input} onChange={(e)=>setInput(e.target.value)} placeholder="Ask something..."/>
        <button onClick={handleSend}>{t('Send')}</button>
        </div>
      </div>
    )}
    </div>
  );
};
export default FoodRescueLanding;