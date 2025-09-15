const Tenant = require("../models/tenant");
const User = require("../models/user")
const bcrypt = require("bcryptjs");

const upgradeTenantPlan = async (req, res) => {
  try {
    const { slug } = req.params;
    const tenant = await Tenant.findOne({ slug });
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }


    if (tenant._id.toString() !== req.user.tenantId._id) {
      return res.status(403).json({ message: "Access denied: Not your tenant" });
    }


    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }


    tenant.plan = "pro";
    await tenant.save();


    return res.status(200).json({ message: "Tenant upgraded to Pro" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
const inviteUser = async (req, res) => {
  const { slug } = req.params;
  const { email, role } = req.body;
 

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Only admins can invite users" });
  }

  const tenant = await Tenant.findOne({ slug });
  if (!tenant) {
    return res.status(404).json({ message: "Tenant not found" });
  }

  if (tenant._id.toString() !== req.user.tenantId._id) {
    return res.status(403).json({ message: "Access denied: Not your tenant" });
  }
  const hashedPassword = await bcrypt.hash("password", 10);

  const newUser = await User.create({
    email,
    role: role || "member",
    tenantId: tenant.id,
    passwordHash: hashedPassword
  });

  return res.json({ message: "User invited", newUser });
};
module.exports = { upgradeTenantPlan, inviteUser };
