const express = require("express");
const rateLimit = require("express-rate-limit");
const { register } = require("../controllers/userController");
const { validateRegister } = require("../middlewares/validators");

const router = express.Router();

const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { status: false, message: "Too many registration attempts. Try later." }
});

router.post("/register", registerLimiter, validateRegister, register);

module.exports = router;
