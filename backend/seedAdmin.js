// Meka run karanna one-time witharai, first admin account eka hadaganna
// Terminal eke: node seedAdmin.js

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
      console.log(`⚠️  "${USERNAME}" kiyana admin ekak dængeම tියෙනවා. Seed karanne nehe.`);
      process.exit(0);
    }

    const admin = new Admin({ username: USERNAME, password: PASSWORD });
    await admin.save(); // password eka model eke pre-save hook eken hash wenawa

    console.log("✅ Admin account hadala ivarai!");
    console.log(`   Username: ${USERNAME}`);
    console.log(`   Password: ${PASSWORD}`);
    console.log("   (Login unata passe Settings ekata gihin password eka change karaganna.)");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error.message);
    process.exit(1);
  }
}

seed();