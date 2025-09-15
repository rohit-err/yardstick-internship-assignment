const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["admin", "member"], required: true },
  tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", required: true },
});

module.exports = mongoose.model("User", userSchema);
