const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoUri = "mongodb+srv://rajatmw36:rajat123@cluster0.y6zwpxc.mongodb.net/?appName=Cluster0";
  if (!mongoUri) {
    throw new Error("MONGODB_URI is missing in environment variables");
  }

  await mongoose.connect(mongoUri);
  console.log("MongoDB connected");
};

module.exports = connectDB;
