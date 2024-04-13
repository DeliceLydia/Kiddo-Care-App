const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "kiddoapp2@gmail.com",
    pass: "hiok mkuc qusm jeaj"
  },
});

const sendVerificationEmail = async (email) => {
  let mailOptions = {
    from: "kiddoapp2@gmail.com",
    to: email,
    subject: "Email Verification",
    text: `Click the link to confirm your email: https://kiddo-care-app.onrender.com/api/confirm/${email}`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendVerificationEmail;