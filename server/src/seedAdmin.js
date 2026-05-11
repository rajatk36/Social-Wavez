require("dotenv").config();
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const User = require("./models/User");

const seedAdmin = async () => {
  try {
    await connectDB();

    const email = (process.env.ADMIN_EMAIL ).toLowerCase().trim();
    const name = process.env.ADMIN_NAME ;
    const password = process.env.ADMIN_PASSWORD ;

    const existing = await User.findOne({ email });
    if (existing) {
      existing.name = name;
      existing.role = "admin";
      existing.password = await bcrypt.hash(password, 10);
      await existing.save();
      console.log("Admin account updated");
    } else {
      await User.create({
        name,
        email,
        password: await bcrypt.hash(password, 10),
        role: "admin"
      });
      console.log("Admin account created");
    }

    process.exit(0);
  } catch (error) {
    console.error("Failed to seed admin:", error.message);
    process.exit(1);
  }
};

seedAdmin();
