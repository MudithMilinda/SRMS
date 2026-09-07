// Run this once to create the first admin account.
// Command: node seedAdmin.js

require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("./models/Admin");

const USERNAME = process.env.SEED_ADMIN_USERNAME || "admin";
const PASSWORD = process.env.SEED_ADMIN_PASSWORD || "admin123";

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    const existing = await Admin.findOne({ username: USERNAME });
    if (existing) {
      console.log(
        `⚠️  An admin named "${USERNAME}" already exists. Skipping seed.`,
      );
      process.exit(0);
    }

    const admin = new Admin({ username: USERNAME, password: PASSWORD });
    await admin.save();

    console.log("✅ Admin account created successfully!");
    console.log(`   Username: ${USERNAME}`);
    console.log(`   Password: ${PASSWORD}`);
    console.log("   (Log in and change the password from Settings.)");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error.message);
    process.exit(1);
  }
}

seed();
