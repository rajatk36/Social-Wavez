const express = require("express");
const { auth, adminOnly } = require("../middleware/auth");
const Contact = require("../models/Contact");
const User = require("../models/User");
const Quote = require("../models/Quote");
const Newsletter = require("../models/Newsletter");

const router = express.Router();

router.use(auth, adminOnly);

router.get("/contacts", async (req, res) => {
  const contacts = await Contact.find().sort({ createdAt: -1 });
  return res.json({ contacts });
});

router.delete("/contacts/:id", async (req, res) => {
  const { id } = req.params;
  const deleted = await Contact.findByIdAndDelete(id);
  if (!deleted) {
    return res.status(404).json({ message: "Contact submission not found" });
  }
  return res.json({ message: "Contact submission deleted" });
});

router.get("/users", async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  return res.json({ users });
});

router.get("/quotes", async (req, res) => {
  const quotes = await Quote.find().sort({ createdAt: -1 });
  return res.json({ quotes });
});

router.get("/newsletters", async (req, res) => {
  const newsletters = await Newsletter.find().sort({ subscribedAt: -1 });
  return res.json({ newsletters });
});

module.exports = router;
