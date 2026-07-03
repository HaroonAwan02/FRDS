import { useEffect } from "react";

const Notification = ({ message,type="error", onClose }) => {
  useEffect(()=>{
    if(message){
      const timer=setTimeout(()=>onClose(),2500);
      return ()=>clearTimeout(timer);
    }
  },[message,onClose]);
  if(!message)
    return null;
  const isSuccess=type==="success";
  return (
    <div style={popup(isSuccess)}>
      {message}
    </div>
  );
    
};
const popup =(isSuccess)=>( {
  position: "fixed",
  top: "50%",
  left: "52%",
  transform:"translateX(-50%)",
   minWidth:"280px",
   maxWidth:"90%",
   padding:"14px 20px",
   backgroundColor:isSuccess?"#1e7f4f":"#b00020",
   color:"#fff",
   fontSize:"14px",
   fontWight:"500",
   textAlign:"center",
   boxShadow:"0 10px 30px rgba(0,0,0,0.35)",
   zIndex:99999,
});
export default Notification;


