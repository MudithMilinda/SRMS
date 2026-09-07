const express = require("express");
const multer = require("multer");
const Assignment = require("../models/Assignment");
const verifyToken = require("../middleware/auth");
const { uploadFileToDrive, deleteFileFromDrive } = require("../utils/googleDrive");

const router = express.Router();

// The file is never written to disk - it's only kept in memory and forwarded to Drive
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: (req, file, cb) => {
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Only PDF or DOCX files are allowed"));
    }
    cb(null, true);
  },
});

// GET /api/assignments -> all assignments belonging to the logged-in admin, with class details
router.get("/", verifyToken, async (req, res) => {
  try {
    const assignments = await Assignment.find({ createdBy: req.admin.id })
      .populate("class", "name class teacher")
      .sort({ createdAt: -1 });
    res.json({ assignments });
  } catch (error) {
    console.error("Get assignments error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/assignments -> upload file to Drive, then save the link in the DB
router.post("/", verifyToken, upload.single("file"), async (req, res) => {
  try {
    const { title, class: classId, dueDate, instructions } = req.body;

    if (!title || !classId || !dueDate || !instructions) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "A file must be uploaded" });
    }

    // Upload to Google Drive
    const { driveFileId, fileUrl } = await uploadFileToDrive(req.file);

    const assignment = await Assignment.create({
      title,
      class: classId,
      dueDate,
      instructions,
      fileUrl,
      fileName: req.file.originalname,
      driveFileId,
      createdBy: req.admin.id,
    });

    const populated = await assignment.populate("class", "name class teacher");

    res.status(201).json({ message: "Assignment uploaded successfully", assignment: populated });
  } catch (error) {
    console.error("Create assignment error:", error.message);
    res.status(500).json({ message: error.message || "Server error" });
  }
});

// DELETE /api/assignments/:id -> delete the Drive file and the DB record
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const assignment = await Assignment.findOne({ _id: req.params.id, createdBy: req.admin.id });
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    await deleteFileFromDrive(assignment.driveFileId);
    await assignment.deleteOne();

    res.json({ message: "Assignment deleted successfully" });
  } catch (error) {
    console.error("Delete assignment error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;