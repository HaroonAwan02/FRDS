import nodemailer from "nodemailer";
const sendEmail = async (options) =>{
    console.log("email_User",process.env.EMAIL_USER);
    console.log("Email pass exisit",!!process.env.EMAIL_PASS);
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
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
      console.log("beforee email sent");
     const info = await transporter.sendMail(mailOptions);
     console.log("email sent seccessfully");
     console.log(info);
    }catch(err) {
        console.log("smtp", err);
        throw err;
    }
};
export default sendEmail;