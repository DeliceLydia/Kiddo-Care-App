const express = require("express");
const multer = require("multer");
const nodemailer = require("nodemailer");
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

const File = require("../models/file.model");

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { filename, path } = req.file;

    const file = new File({
      name: filename,
      path: path,
    });
    await file.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "barefootnomad771@gmail.com",
        pass: "eqtt kcci jtda scxw",
      },
    });

    const mailOptions = {
      from: "barefootnomad771@gmail.com",
      to: "vanessakidocare@gmail.com",
      subject: "New File Uploaded",
      text: `A new file (${filename}) has been uploaded.`,
      attachments: [
        {
          filename: filename,
          path: path,
        },
      ],
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    res.status(200).send("File uploaded successfully");
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).send("Failed to upload file");
  }
});

module.exports = router;
