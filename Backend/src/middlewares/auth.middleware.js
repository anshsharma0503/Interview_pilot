const jwt = require("jsonwebtoken");
const TokenBlacklist = require("../models/tokenBlacklist.model");

async function requireAuth(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication required"
    });
  }

  try {
    const blacklistedToken = await TokenBlacklist.findOne({ token });

    if (blacklistedToken) {
      return res.status(401).json({
        success: false,
        message: "Session has expired. Please log in again."
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id,
      username: decoded.username
    };

    next();
    
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
}

module.exports = {
  requireAuth
};
