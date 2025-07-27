const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { sendVerificationEmail } = require("../services/emailService");

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password required" });

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(409).json({ error: "User already exists" });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password_hash: hash });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    await sendVerificationEmail(user.email, token);

    res
      .status(201)
      .json({ message: "Signup successful. Check your email to confirm." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password required" });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    if (!user.is_verified) {
      return res.status(403).json({
        error: "Please confirm your email before logging in.",
      });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.confirmEmail = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).send("Token missing");

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.userId);
    if (!user) return res.status(404).send("User not found");

    if (user.is_verified) return res.send("Email already confirmed.");

    user.is_verified = true;
    await user.save();

    res.send("✅ Email confirmed. You can now log in.");
  } catch (err) {
    res.status(400).send("Invalid or expired token");
  }
};

exports.getMe = async (req, res) => {
  const user = req.user;
  res.json({
    email: user.email,
    daily_usage_count: user.daily_usage_count,
    daily_reset_at: user.daily_reset_at,
    max_quota: 20
  });
};
