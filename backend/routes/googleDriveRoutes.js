// routes/googleDriveRoutes.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const Admin = require("../models/Admin");
const verifyToken = require("../middleware/auth");
const { getAuthUrl, exchangeCodeForTokens } = require("../utils/googleDrive");

// GET /api/admin/google/connect  - called via axios, so Authorization header IS present
router.get("/connect", verifyToken, (req, res) => {
  // pass the admin's raw JWT (from the header, not just req.admin) through as `state`
  const token = req.headers.authorization.split(" ")[1];
  const url = getAuthUrl(token);
  res.json({ url });
});

// GET /api/admin/google/callback  - hit directly by Google's redirect, NO Authorization header
// So we do NOT use verifyToken here. Instead we verify the JWT we get back via `state`.
router.get("/callback", async (req, res) => {
  const { code, state } = req.query;

  let adminId;
  try {
    const decoded = jwt.verify(state, process.env.JWT_SECRET);
    adminId = decoded.id; // adjust to match whatever field verifyToken/login puts in the JWT payload
  } catch (err) {
    return res.redirect(
      `${process.env.FRONTEND_URL}/dashboard/settings?drive=error`,
    );
  }

  try {
    const tokens = await exchangeCodeForTokens(code);

    if (!tokens.refresh_token) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/dashboard/settings?drive=already_connected_reauth_needed`,
      );
    }

    await Admin.findByIdAndUpdate(adminId, {
      googleDrive: { connected: true, refreshToken: tokens.refresh_token },
    });

    res.redirect(
      `${process.env.FRONTEND_URL}/dashboard/settings?drive=connected`,
    );
  } catch (err) {
    console.error("Google OAuth callback error:", err.message);
    res.redirect(`${process.env.FRONTEND_URL}/dashboard/settings?drive=error`);
  }
});

// GET /api/admin/google/status
router.get("/status", verifyToken, async (req, res) => {
  const admin = await Admin.findById(req.admin.id).select(
    "googleDrive.connected",
  );
  res.json({ connected: !!admin?.googleDrive?.connected });
});

module.exports = router;
