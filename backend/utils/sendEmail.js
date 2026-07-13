/*import nodemailer from "nodemailer";
const sendEmail = async (options) =>{
    console.log("email_User",process.env.EMAIL_USER);
    console.log("Email pass exisit",!!process.env.EMAIL_PASS);
    const transporter = nodemailer.createTransport({
        service:"gmail",
        secure:false,
        requireTLS: true,
        family:4,
        auth: {
            user: process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS,
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 10000,
    });
    try {
    console.log("smtp connected");
     const mailOptions={
        from :`FRDS <${process.env.EMAIL_USER}>`,
        to:options.email,
        subject:options.subject,
        html:options.message,
     };
      console.log("before email sent");
      console.log("mailOptions",mailOptions);
     const info = await transporter.sendMail(mailOptions);
     console.log("email sent seccessfully");
     console.log(info);
    }catch(err) {
        console.log("smtp error", err.message);
        console.log("smpt full error",err);
        throw err;
    }
};
export default sendEmail;
*/
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);
const sendEmail=async (options)=> {
    console.log("before email send");
    const { data,error}=await resend.emails.send({
        from : 'FRDS <onboarding@resend.dev>',
        to: [options.email],
        subject: options.subject,
            html: options.message,
        
    });
    if(error) {
        console.log("smtp error", error);
        throw error;
    }
    console.log("email sent succesfully",data);
};
export default sendEmail;