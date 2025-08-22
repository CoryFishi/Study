import express from "express";
import bcrypt from "bcryptjs";
import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import { User } from "../models/User";
import { signToken } from "../middleware/token";

const authRouter = express.Router();

// POST /app/auth/register
authRouter.post("/register", async (req, res) => {
  const { email, password, name } = req.body || {};
  if (!email || !password)
    return res
      .status(400)
      .json({ code: "BAD_INPUT", message: "email & password required" });

  const exists = await User.findOne({ email });
  if (exists)
    return res
      .status(409)
      .json({ code: "EMAIL_TAKEN", message: "Email already registered" });

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ email, passwordHash, name });

  const token = signToken({ sub: String(user._id), email: user.email });
  res.json({
    token,
    user: { id: user._id, email: user.email, name: user.name },
  });
});

// POST /app/auth/login
authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password)
    return res
      .status(400)
      .json({ code: "BAD_INPUT", message: "email & password required" });

  const user = await User.findOne({ email });
  if (!user)
    return res
      .status(401)
      .json({ code: "INVALID_LOGIN", message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok)
    return res
      .status(401)
      .json({ code: "INVALID_LOGIN", message: "Invalid credentials" });

  const token = signToken({ sub: String(user._id), email: user.email });
  res.json({
    token,
    user: { id: user._id, email: user.email, name: user.name },
  });
});

export default authRouter;
