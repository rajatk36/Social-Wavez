const express = require("express");
const Quote = require("../models/Quote");

const router = express.Router();
const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

router.post("/", async (req, res) => {
  try {
    const {
      name = "",
      email = "",
      phone = "",
      serviceRequired = "",
      budget = "",
      message = ""
    } = req.body;

    if (
      name.trim().length < 2 ||
      !isEmailValid(email) ||
      phone.trim().length < 7 ||
      serviceRequired.trim().length < 2 ||
      budget.trim().length < 2 ||
      message.trim().length < 10
    ) {
      return res.status(400).json({ message: "Please fill all quote fields correctly" });
    }

    await Quote.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      serviceRequired: serviceRequired.trim(),
      budget: budget.trim(),
      message: message.trim()
    });

    return res.status(201).json({ message: "Quote request submitted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to save quote request" });
  }
});

module.exports = router;
