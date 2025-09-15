const Note = require("../models/note");
const Tenant = require("../models/tenant");

const checkPlan = async (req, res, next) => {
  try {
    const tenantId = req.user.tenantId;

  
    const tenant = await Tenant.findById(tenantId);
    if (!tenant) return res.status(404).json({ message: "Tenant not found" });

   
    const noteCount = await Note.countDocuments({ tenantId });

   
    if (tenant.plan === "free" && noteCount >= 3) {
      return res.status(403).json({ message: "Free plan limit reached. Upgrade to Pro." });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = checkPlan;
