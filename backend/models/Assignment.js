const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    dueDate: { type: Date, required: true },
    duration: { type: String, required: true },
    instructions: { type: String, required: true },

    // The file itself lives on Google Drive - only the link is stored here
    fileUrl: { type: String, required: true },
    fileName: { type: String, required: true },
    driveFileId: { type: String, required: true }, // needed later if we want to delete the file

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Assignment", assignmentSchema);
