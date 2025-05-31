const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const xss = require("xss"); // ✅ Add this
const User = require("../models/User");

// ---------------------- REGISTER ------------------------

const register = asyncHandler(async (req, res) => {
  let username = xss(req.body.username?.trim());
  let email = xss(req.body.email?.trim().toLowerCase());
  let password = xss(req.body.password);

  if (!username || !email || !password) {
    return res.status(400).json({ status: false, message: "All fields are required" });
  }

  if (username.length < 3) {
    return res.status(400).json({ status: false, message: "Username must be at least 3 characters" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ status: false, message: "Invalid email address" });
  }

  if (password.length < 8) {
    return res.status(400).json({ status: false, message: "Password must be at least 8 characters" });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(409).json({ status: false, message: "Email already registered" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const TRIAL_DAYS = 7;
  const trialExpire = new Date(Date.now() + TRIAL_DAYS * 24 * 60 * 60 * 1000);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    trailActive: true,
    trailExpire,
    subscription: "Trail"
  });

  await newUser.save();

  res.status(201).json({
    status: true,
    message: "Registration successful",
    user: {
      username: newUser.username,
      email: newUser.email,
    },
  });
});


// ! ------------------------- Login -----------------------------

// ! ------------------------- Logout -----------------------------

// ! ------------------------- Check user Auth Status -----------------------------






module.exports = { register };