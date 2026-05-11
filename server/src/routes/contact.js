const express = require("express");
const Contact = require("../models/Contact");

const router = express.Router();

const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

router.post("/", async (req, res) => {
  try {
    const { name = "", email = "", phone = "", subject = "", message = "" } = req.body;

    if (name.trim().length < 2 || !isEmailValid(email) || subject.trim().length < 2 || message.trim().length < 20) {
      return res.status(400).json({ message: "Please fill all required fields correctly" });
    }

    await Contact.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      subject: subject.trim(),
      message: message.trim()
    });

    return res.status(201).json({ message: "Contact form submitted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to save contact form" });
  }
});

module.exports = router;
