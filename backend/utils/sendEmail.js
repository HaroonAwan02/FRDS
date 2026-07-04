import nodemailer from "nodemailer";
const sendEmail = async (options) =>{
    console.log("email_User",process.env.EMAIL_USER);
    console.log("Email pass exisit",!!process.env.EMAIL_PASS);
    const transporter = nodemailer.createTransport({
        auth: {
            user: process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS,
        },
    });
    try {
    console.log("smtp connected");
     const mailOptions={
        from :`FRDS <${process.env.EMAIL_USER}>`,
        to:options.email,
        subject:options.subject,
        html:options.message,
     };
     await transporter.sendMail(mailOptions);
    }catch(err) {
        console.log("smtp", err);
        throw err;
    }
};
export default sendEmail;