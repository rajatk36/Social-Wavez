const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const contactRoutes = require("./routes/contact");
const newsletterRoutes = require("./routes/newsletter");
const quoteRoutes = require("./routes/quote");
const adminRoutes = require("./routes/admin");

const app = express();

const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5500";
const allowAllOrigins = clientOrigin === "*" || !clientOrigin;

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests from static file previews (origin can be null/undefined)
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
  res.json({ message: "Server is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/quote", quoteRoutes);
app.use("/api/admin", adminRoutes);

module.exports = app;
