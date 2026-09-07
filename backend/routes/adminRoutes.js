const express = require("express");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const verifyToken = require("../middleware/auth");

const router = express.Router();

// POST /api/admin/login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: "Username or password wrong" });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Username or password wrong" });
    }

    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.json({
      message: "Login successful",
      token,
      admin: { id: admin._id, username: admin.username },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/admin/profile (protected)
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("-password");
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json({ admin });
  } catch (error) {
    console.error("Get profile error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/admin/profile (protected)
router.put("/profile", verifyToken, async (req, res) => {
  try {
    const { name, email, phone, topBarName } = req.body;

    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    if (name !== undefined) admin.name = name;
    if (email !== undefined) admin.email = email;
    if (phone !== undefined) admin.phone = phone;
    if (topBarName !== undefined) admin.topBarName = topBarName;

    await admin.save();

    res.json({
      message: "Profile updated successfully",
      admin: {
        id: admin._id,
        username: admin.username,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        topBarName: admin.topBarName,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/admin/change-password (protected)
router.put("/change-password", verifyToken, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Old password and new password are required" });
    }

    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await admin.comparePassword(oldPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    admin.password = newPassword;
    await admin.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
