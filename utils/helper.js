import nodemailer from "nodemailer";
import dotenv from "dotenv";


dotenv.config();

export const createError = (msg, status) => {
  const err = new Error(msg);
  if (status) err.status = status;
  return err;
};

export const sendEmail = async (user, token) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.HOST,
      port: 465,
      secure: true, 
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL,
      to: user.email,
      subject: "Please verify Your Account! 😊",
      html: emailTemplate(user.firstName, token, user._id),
    });

    console.log("Email sent:", info.response); 

  } catch (error) {
    console.error("Error sending email:", error);
    throw createError("Error sending email", 500); 
  }
};

export const emailTemplate = (name, token, userId) => {
  const link = `https://localhost:5000/register/${token}/${userId}`; 

  return `
    <div>
      <h3>Dear ${name},</h3>
      <p>Thank you for registering with our Blog! To complete your registration, please verify your email address by clicking the link below:</p>
      <p><a href="${link}">Verify Email Address</a></p>
      <p>If the button above does not work, please copy and paste the following URL into your web browser:</p>
      <p><a href="${link}">${link}</a></p>
      <p>This link will expire in 24 hours, so please complete your verification as soon as possible.</p>
      <p>If you did not create an account with us, please ignore this email.</p>
      <p>Thank you!</p>
      <p>Best regards,</p>
    </div>
  `;
};
