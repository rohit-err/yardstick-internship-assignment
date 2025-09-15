const jwt = require("jsonwebtoken");
const EXPIRES_IN = "1h"; 

function generateToken(user, res) {
  
  const payload = {
    userId: user._id,
    tenantId: user.tenantId,
    role: user.role,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: EXPIRES_IN });
 
  res.cookie("token", token, {
    httpOnly: true,      
    secure: process.env.NODE_ENV === "production", 
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",  
    maxAge: 1000 * 60 * 60, 
  });
}

module.exports = generateToken;
