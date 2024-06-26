import nodemailer from "nodemailer";


export const sendEmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: true,
            service: "gmail",
            auth: {
                user: "reg.nstraining@gmail.com",
                pass: "gqig pscg bpmg rsri",
            },
        });
       const a = await transporter.sendMail({
        from: "reg.nstraining@gmail.com",
            to: email.email,
            subject: email.subject,
            text: email.text,
        });
        console.log(a);
        console.log("Email sent successfully");
    } catch (error) {
        console.log("Error sending email", error);
    }
};