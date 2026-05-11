const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth");
const contactRoutes = require("./routes/contact");
const newsletterRoutes = require("./routes/newsletter");
const quoteRoutes = require("./routes/quote");
const adminRoutes = require("./routes/admin");

const app = express();

const clientOrigin = process.env.CLIENT_ORIGIN || "https://social-wavez.vercel.app";
const allowAllOrigins = clientOrigin === "*" || !clientOrigin;

app.use(
  cors({
    origin: (origin, callback) => {
      
      if (!origin || origin === "null" || allowAllOrigins) {
        return callback(null, true);
      }
      if (origin === clientOrigin) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    }
  })
);
app.use(express.json());

app.get("/api/health", (req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;
  res.status(dbConnected ? 200 : 503).json({
    status: dbConnected ? "healthy" : "unhealthy",
    message: dbConnected ? "Server and database are running" : "Database connection failed",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/quote", quoteRoutes);
app.use("/api/admin", adminRoutes);

module.exports = app;
