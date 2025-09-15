

const mongoose = require("mongoose");

const tenantSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  plan: { type: String, enum: ["free", "pro"], default: "free" },
  freeNotesUsed: { type: Number, default: 0 } 
});

module.exports = mongoose.model("Tenant", tenantSchema);