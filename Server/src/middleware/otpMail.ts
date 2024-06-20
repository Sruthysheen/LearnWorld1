import {Response} from "express-serve-static-core";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();


const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS
    },
    
});
interface EmailResponse { 
    status: boolean;
    otp?: number;
}


const sendMail = (receiverMail:string,res: Response)=>{
        const otp = parseInt((Math.random()*1000000).toString(),10);
        const appState = otp;

        console.log(otp,'/000000');
        
        const mailInfo = {
            from: process.env.AUTH_EMAIL,
            to: receiverMail,
            subject: "Verify your account",
            html: `<h3>Your OTP is</h3><h1 style='font-weight:bold;'>${otp}</h1>`,
            text: "A simple message in text format"
        };

        transporter.sendMail(mailInfo, (error: Error | null) =>{
            if(error) {
              res.status(500).json({message: "Email sending failed"});
            }

            else{

               
                res.status(200).json({message: "Email sent successfully"});
            }
        });
        return appState;
        
    };



export {sendMail}