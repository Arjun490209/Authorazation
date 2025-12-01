// import nodemailer from "nodemailer";
// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from "url"

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// export const sendOtpMail = async (email, otp) => {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.APP_EMAIL,
//       pass: process.env.APP_PASS,
//     },
//   });

//   // Load HTML Template
//     const filePath = path.join(__dirname, "reset-password.html");
//     let htmlTemplate = fs.readFileSync(filePath, "utf-8");

//     // Replace Dynamic Data
//     htmlTemplate = htmlTemplate.replace("{{OTP}}", otp);

//   const mailOptions = {
//     from: process.env.APP_EMAIL,
//     to: email,
//     subject: "password reset otp.",
//     html: htmlTemplate,
//   };

//   await transporter.sendMail(mailOptions);
// };

import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const sendOtpMail = async (email, otp) => {

  // Brevo SMTP Transport
  const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false, // Port 587 → secure = false
    auth: {
      user: "9cec4e001@smtp-brevo.com", // Ye hi login rahega
      pass: process.env.BREVO_SMTP_KEY, // .env me jo key hai
    },
    tls: {
      rejectUnauthorized: false, // Certificate wali errors avoid karega
    },
  });

  // Load HTML Template
  const filePath = path.join(__dirname, "reset-password.html");
  let htmlTemplate = fs.readFileSync(filePath, "utf-8");

  // Replace Dynamic Data
  htmlTemplate = htmlTemplate.replace("{{OTP}}", otp);

  const mailOptions = {
    from: process.env.BREVO_EMAIL,
    to: email,
    subject: "Password Reset OTP",
    html: htmlTemplate,
  };

  await transporter.sendMail(mailOptions);
  console.log("OTP Mail Sent Successfully!");
};
