import nodemailer from "nodemailer";
const sendEmail = async (options) =>{
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port:587,
        secure:false,
        auth: {
            user: process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS,
        },
        family:4
    });
     const mailOptions={
        from :`FRDS <${process.env.EMAIL_USER}>`,
        to:options.email,
        subject:options.subject,
        html:options.message,
     };
     await transporter.sendMail(mailOptions);
};
export default sendEmail;