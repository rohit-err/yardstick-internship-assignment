const express = require("express")
const verifyToken = require("../middlewares/authMiddleware");
const { upgradeTenantPlan,inviteUser } = require("../controllers/tenantController");
const tenantRoutes = express.Router()

tenantRoutes.post("/:slug/upgrade", verifyToken, upgradeTenantPlan);
tenantRoutes.post("/:slug/invite", verifyToken, inviteUser);


module.exports=tenantRoutes