const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      default: "Admin User",
    },
    email: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    topBarName: {
      type: String,
      default: "Admin",
    },
    googleDrive: {
      connected: { type: Boolean, default: false },
      refreshToken: { type: String, default: null }, // consider encrypting at rest, see note below
      connectedEmail: { type: String, default: null }, // which Google account authorized this
    },
  },
  { timestamps: true },
);

// Hash the password before saving it.
adminSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare passwords during login and password changes.
adminSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("Admin", adminSchema);
