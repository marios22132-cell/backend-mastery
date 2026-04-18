import Mailgen from "mailgen";
import nodemailer from "nodemailer";

const sendEmail = async (options) => {
    const mailGen = new Mailgen({
        theme: "default",
        product: {
            name: "Task Management App",
            link: process.env.FRONTEND_URL || "http://localhost:8000"
        }
    })
    const emailTextual = mailGen.generatePlaintext(options.mailgenContent);
    const emailHTML = mailGen.generate(options.mailgenContent);
    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_SMTP_HOST,
        port: process.env.MAILTRAP_SMTP_PORT,
        secure: process.env.MAILTRAP_SMTP_SECURE === "true",
        auth: {
            user: process.env.MAILTRAP_SMTP_USER,
            pass: process.env.MAILTRAP_SMTP_PASSWORD
        }
    });

    
    const mail = {
        from: "marios1522@hotmail.com",
        to: options.to,
        subject: options.subject,
        text: emailTextual,
        html: emailHTML 
    }
    try{
        await transporter.sendMail(mail);
    }catch(error){
        console.error("Error sending email:", error);
    }
}


const mailGen = (username, verificationUrl) => {
    return{
        body: {
            name: username,
            intro: "Welcome to the Task Management App",
            action: {
                instructions: "To verify your email, please click the button below:",
                button: { 
                    color: "#22BC66",
                    text: "Verify Email",
                    link: verificationUrl
                }
    },         outro: "If you did not create an account, no further action is required."
        }
}
}

const forgotPasswordMailGen = (username, verificationUrl) => {
    return{
        body: {
            name: username,
            intro: "You have requested to reset your password for the Task Management App",
            action: {
                instructions: "To reset your password, please click the button below:",
                button: { 
                    color: "#22BC66",
                    text: "Reset Password",
                    link: verificationUrl
                }
    },         outro: "If you did not create an account, no further action is required."
        }
}
}

export {
    mailGen,
    forgotPasswordMailGen,
    sendEmail
    };