const express = require("express");
const mongoose = require("mongoose"); // 1. Mongoose import karanna
const cors = require("cors");
require("dotenv").config();

const adminRoutes = require("./routes/adminRoutes"); // 2. Admin login/password routes

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// 3. MongoDB Connect karana eka
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully!");

    // 4. Database eka connect unata passe witharak Server eka start karanna
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error.message);
  });

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Backend is running successfully!",
  });
});

// 5. Admin routes eka mount karana eka
app.use("/api/admin", adminRoutes);