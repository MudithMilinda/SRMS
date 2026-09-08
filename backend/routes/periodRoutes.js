const express = require("express");
const router = express.Router();

const Period = require("../models/Period");
const verifyToken = require("../middleware/auth");

// GET /api/periods?from&to -> every recurring period, plus one-time periods inside the range
router.get("/", verifyToken, async (req, res) => {
  try {
    const { from, to } = req.query;
    const orConditions = [{ recurring: true }];

    const dateFilter = {};
    if (from) dateFilter.$gte = new Date(from);
    if (to) dateFilter.$lte = new Date(to);
    orConditions.push(
      Object.keys(dateFilter).length ? { recurring: false, date: dateFilter } : { recurring: false }
    );

    const periods = await Period.find({ $or: orConditions })
      .populate("class", "name teacher class type status")
      .sort({ dayOfWeek: 1, date: 1, start: 1 });

    res.json({ periods });
  } catch (error) {
    console.error("Get periods error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/periods
router.post("/", verifyToken, async (req, res) => {
  try {
    const { classId, start, end, recurring, dayOfWeek, date } = req.body;

    if (!classId || start === undefined || end === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (Number(end) <= Number(start)) {
      return res.status(400).json({ message: "End time must be after start time" });
    }

    const isRecurring = recurring !== false;
    const periodData = {
      class: classId,
      start: Number(start),
      end: Number(end),
      recurring: isRecurring,
      createdBy: req.admin.id,
    };

    let conflictQuery;

    if (isRecurring) {
      if (dayOfWeek === undefined || dayOfWeek === null) {
        return res.status(400).json({ message: "A day of week is required for a recurring period" });
      }
      periodData.dayOfWeek = Number(dayOfWeek);
      // Conflicts with any other recurring period for this class on the same weekday
      conflictQuery = { class: classId, recurring: true, dayOfWeek: Number(dayOfWeek) };
    } else {
      if (!date) {
        return res.status(400).json({ message: "A date is required for a one-time extra class" });
      }
      periodData.date = new Date(date);
      const dayStart = new Date(periodData.date); dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(periodData.date); dayEnd.setHours(23, 59, 59, 999);
      const jsDay = periodData.date.getDay();
      const mondayBasedDay = jsDay === 0 ? 6 : jsDay - 1;
      // A one-time class conflicts with whatever actually lands on that same date:
      // recurring periods on that weekday, or other one-time periods on that exact date
      conflictQuery = {
        class: classId,
        $or: [
          { recurring: true, dayOfWeek: mondayBasedDay },
          { recurring: false, date: { $gte: dayStart, $lte: dayEnd } },
        ],
      };
    }

    const existing = await Period.find(conflictQuery);
    const hasConflict = existing.some((p) => Number(start) < p.end && p.start < Number(end));
    if (hasConflict) {
      return res.status(409).json({ message: "This class already has a period during the selected time." });
    }

    const period = await Period.create(periodData);
    const populated = await period.populate("class", "name teacher class type status");
    res.status(201).json({ period: populated });
  } catch (error) {
    console.error("Create period error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const period = await Period.findByIdAndDelete(req.params.id);
    if (!period) return res.status(404).json({ message: "Period not found" });
    res.json({ message: "Period deleted successfully" });
  } catch (error) {
    console.error("Delete period error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;