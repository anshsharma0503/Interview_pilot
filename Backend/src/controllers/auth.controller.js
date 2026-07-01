const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const TokenBlacklist = require("../models/tokenBlacklist.model");

function createAuthToken(user) {
  return jwt.sign(
    {
      id: user._id,
      username: user.username
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d"
    }
  );
}

function getCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000
  };
}

async function registerUser(req, res) {
  const { username, email: rawEmail, password } = req.body;
  const email = typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "";

  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Username, email, and password are required"
    });
  }

  if (username.trim().length < 3) {
    return res.status(400).json({
      success: false,
      message: "Username must be at least 3 characters"
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email address"
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters"
    });
  }

  const existingUser = await User.findOne({
    $or: [{ username }, { email }]
  });

  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: "An account with this username or email already exists"
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    email,
    password: hashedPassword
  });

  const token = createAuthToken(user);

  res.cookie("token", token, getCookieOptions());

  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    }
  });
}

async function loginUser(req, res) {
  const { email: rawEmail, password } = req.body;
  const email = typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "";

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required"
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email address"
    });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password"
    });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password"
    });
  }

  const token = createAuthToken(user);

  res.cookie("token", token, getCookieOptions());

  return res.status(200).json({
    success: true,
    message: "User logged in successfully",
    data: {
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    }
  });
}

async function getCurrentUser(req, res) {
  const user = await User.findById(req.user.id).select("-password");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  return res.status(200).json({
    success: true,
    message: "Current user fetched successfully",
    data: {
      user
    }
  });
}

async function logoutUser(req, res) {
  const token = req.cookies.token;

  if (token) {
    const decoded = jwt.decode(token);

    if (decoded && decoded.exp) {
      await TokenBlacklist.create({
        token,
        expiresAt: new Date(decoded.exp * 1000)
      });
    }
  }

  res.clearCookie("token", getCookieOptions());

  return res.status(200).json({
    success: true,
    message: "User logged out successfully"
  });
}

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser
};