import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import handlebars from "handlebars";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const verifyEmail = async (token, email, userName) => {
  const emailTemplateSource = fs.readFileSync(
    path.join(__dirname, "template.html"),
    "utf-8"
  );
  const template = handlebars.compile(emailTemplateSource);
  const htmlToSend = template({ 
    USER_NAME: userName,
    token: encodeURIComponent(token),
    YEAR: new Date().getFullYear(),
   });

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.APP_EMAIL,
      pass: process.env.APP_PASS,
    },
  });
  const mailConfiguration = {
    from: process.env.APP_EMAIL,
    to: email,
    subject: "Email verification. ",
    text: "Hi this is just a texting email", // plain‑text body
    html: htmlToSend,
  };

  transporter.sendMail(mailConfiguration, (error, info) => {
    if (error) {
      throw new Error(error);
    }
    console.log("Email send successfully");
    console.log(info);
  });
};
