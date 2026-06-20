const express = require("express");
const {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser
} = require("../controllers/auth.controller");
const { requireAuth } = require("../middlewares/auth.middleware");
const asyncHandler = require("../utils/asyncHandler");

const authRouter = express.Router();

authRouter.post("/register", asyncHandler(registerUser));
authRouter.post("/login", asyncHandler(loginUser));
authRouter.get("/me", requireAuth, asyncHandler(getCurrentUser));
authRouter.post("/logout", requireAuth, asyncHandler(logoutUser));

module.exports = authRouter;