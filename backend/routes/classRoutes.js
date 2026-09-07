const express = require("express");
const Class = require("../models/Class");
const verifyToken = require("../middleware/auth");

const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
  try {
    const classes = await Class.find({ createdBy: req.admin.id })
      .select("name type status createdBy createdAt updatedAt")
      .sort({ createdAt: -1 });
    res.json({ classes });
  } catch (error) {
    console.error("Get classes error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", verifyToken, async (req, res) => {
  try {
    const { name, type, status } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const newClass = await Class.create({
      name,
      type: type || "Theory",
      status: status || "Active",
      createdBy: req.admin.id,
    });

    res
      .status(201)
      .json({ message: "Class added successfully", class: newClass });
  } catch (error) {
    console.error("Create class error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { name, type, status } = req.body;

    const existing = await Class.findOne({
      _id: req.params.id,
      createdBy: req.admin.id,
    });
    if (!existing) {
      return res.status(404).json({ message: "Class not found" });
    }

    if (name !== undefined) existing.name = name;
    if (type !== undefined) existing.type = type;
    if (status !== undefined) existing.status = status;

    await existing.save();

    res.json({ message: "Class updated successfully", class: existing });
  } catch (error) {
    console.error("Update class error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deleted = await Class.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.admin.id,
    });
    if (!deleted) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.json({ message: "Class deleted successfully" });
  } catch (error) {
    console.error("Delete class error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
