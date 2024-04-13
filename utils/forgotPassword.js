const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "kiddoapp2@gmail.com",
    pass: "hiok mkuc qusm jeaj"
  },
});

const sendPasswordResetEmail = (email, resetToken) => {
  const mailOptions = {
    from: "kiddoapp2@gmail.com",
    to: email,
    subject: "Password Reset",
    text: `To reset your password, click the link: https://kiddo-care-app.onrender.com/api/reset-password?token=${resetToken}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = sendPasswordResetEmail;
