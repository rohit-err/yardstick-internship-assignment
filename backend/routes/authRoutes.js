const express = require("express")
const authRoutes = express.Router()
const {login,checkAuth,logout} = require("../controllers/authController")
const verifyToken = require("../middlewares/authMiddleware")

authRoutes.post("/login",login)
authRoutes.get("/checkAuth",verifyToken,checkAuth)
authRoutes.post("/logout", logout);


module.exports=authRoutes