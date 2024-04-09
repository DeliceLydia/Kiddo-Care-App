const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const register = async (req, res, next) => {
  const { firstname, lastname, country, phoneNumber, gender, email, password } =
    req.body;
  try {
    const haspassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstname,
      lastname,
      country,
      phoneNumber,
      gender,
      email,
      password: haspassword,
    });
    const generateUniqueToken = () => {
      return crypto.randomBytes(20).toString("hex");
    };

    const verificationToken = generateUniqueToken();
    await sendVerificationEmail(email, verificationToken);
    await user.save();
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });
    res.status(201).json({
      message: "Account created successfully",
      token,
    });
  } catch (error) {
    next(error);
  }
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "barefootnomad771@gmail.com",
    pass: "eqtt kcci jtda scxw",
  },
});

const sendVerificationEmail = async (email) => {
  let mailOptions = {
    from: "barefootnomad771@gmail.com",
    to: email,
    subject: "Email Verification",
    text: `Click the link to confirm your email: https://kiddo-care-app.vercel.app/api/confirm/${email}`
  };

  await transporter.sendMail(mailOptions);
};

const sendPasswordResetEmail = (email, resetToken) => {
  const mailOptions = {
    from: "barefootnomad771@gmail.com",
    to: email,
    subject: 'Password Reset',
    text: `To reset your password, click the link: https://kiddo-care-app.vercel.app/api/reset-password?token=${resetToken}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}


const login = async (req, res, next) => {;
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send({ message: "Invalid login credentials" });
    }
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });
    res.status(200).send({ message: "Logged in successfully", token });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, sendPasswordResetEmail };
