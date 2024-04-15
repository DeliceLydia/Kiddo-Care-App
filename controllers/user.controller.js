const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const crypto = require("crypto");
const sendDocumentToOwner = require("../utils/emailAttachement");
const sendVerificationEmail = require("../utils/emailVerification");
const sendPasswordResetEmail = require("../utils/forgotPassword");

const register = async (req, res, next) => {
  // const document = req.files["document"][0].path;
  // const avatar = req.files["avatar"][0].path;
  const { avatar,firstname, lastname, country, phoneNumber, gender, email, password, document } =
    req.body;
  try {
    const haspassword = await bcrypt.hash(password, 10);

    const user = new User({
      avatar,
      firstname,
      lastname,
      country,
      phoneNumber,
      gender,
      email,
      password: haspassword,
      document
    });

    await sendDocumentToOwner(email, document);
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

const login = async (req, res, next) => {
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
