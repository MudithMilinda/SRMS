const mongoose = require("mongoose");

const periodSchema = new mongoose.Schema(
  {
    class: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
    recurring: { type: Boolean, default: true },
    dayOfWeek: { type: Number, min: 0, max: 6 }, // 0=Mon...6=Sun — required when recurring
    date: { type: Date }, // required when recurring=false (one-time extra class)
    start: { type: Number, required: true },
    end: { type: Number, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Period", periodSchema);