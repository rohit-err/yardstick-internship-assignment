const User = require("../models/user");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");




const login = async (req, res) => {
  try {
    const { email, password } = req.body;


    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }


    const user = await User.findOne({ email }).populate('tenantId');

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }


    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }


    generateToken(user, res)


    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        tenant: {
          id: user.tenantId._id,
          name: user.tenantId.name,
          slug: user.tenantId.slug,
          plan: user.tenantId.plan,
          freeNotesUsed: user.tenantId.freeNotesUsed
        }
      }
    });


  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};


const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate("tenantId");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        tenant: {
          id: user.tenantId._id,
          name: user.tenantId.name,
          slug: user.tenantId.slug,
          plan: user.tenantId.plan,
          freeNotesUsed: user.tenantId.freeNotesUsed
        },
      },
    });
  } catch (error) {
    console.error("CheckAuth error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};



module.exports = { login, checkAuth, logout };
