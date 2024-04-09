const express = require("express");
const User = require("../models/user.model");
const crypto = require("crypto");
const {
  register,
  login,
  sendPasswordResetEmail,
} = require("../controllers/user.controller");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/confirm/:email", async (req, res) => {
  try {
    const { email } = req.params;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send("User not found.");
    }

    user.confirmed = true;
    await user.save();

    res.redirect("/api/login");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error confirming email.");
  }
});
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send("User not found.");
    }

    const generateResetToken = () => {
      return crypto.randomBytes(20).toString("hex");
    };

    const resetToken = generateResetToken();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    sendPasswordResetEmail(email, resetToken);

    res.send("Password reset instructions sent to your email.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error resetting password.");
  }
});

module.exports = router;
