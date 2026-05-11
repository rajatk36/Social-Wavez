const express = require("express");
const Newsletter = require("../models/Newsletter");

const router = express.Router();
const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

router.post("/subscribe", async (req, res) => {
  try {
    const { email = "" } = req.body;
    if (!isEmailValid(email)) {
      return res.status(400).json({ message: "Please enter a valid email address" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await Newsletter.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(400).json({ message: "You are already subscribed" });
    }

    await Newsletter.create({ email: normalizedEmail });
    return res.status(201).json({ message: "Subscribed successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to subscribe" });
  }
});

module.exports = router;
