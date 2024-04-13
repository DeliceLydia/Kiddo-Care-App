const nodemailer = require("nodemailer");

const sendDocumentToOwner = async (userEmail, documentPath) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "kiddoapp2@gmail.com",
        pass: "hiok mkuc qusm jeaj",
      },
    });

    const mailOptions = {
      from: "kiddoapp2@gmail.com",
      to: "barefootnomad771@gmail.com",
      subject: "New User Registration - Document Attached",
      text: `A new user has registered with the following email: ${userEmail}. Document is attached.`,
      attachments: [
        {
          filename: "uploaded_document.pdf",
          path: documentPath,
          contentType: "application/pdf",
        },
      ],
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error("Failed to send document to application owner");
  }
};

module.exports = sendDocumentToOwner;
