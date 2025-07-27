require("dotenv").config();
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const timeout = require("connect-timeout");
const errorHandler = require("./middleware/errorHandler");
require("./models");

const app = express();
const PORT = process.env.PORT || 3000;

const authRoutes = require("./routes/auth");
const summarizeRoutes = require("./routes/summarize");

app.use(
  cors({
    origin: process.env.FRONTEND_URL, // change to prod frontend later
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(timeout("15s")); // Ensure LLM requests timeout cleanly
app.use((req, res, next) => (!req.timedout ? next() : undefined));

const limiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Rate limit exceeded. Try again in a minute.",
});

app.use("/auth", authRoutes);
app.use("/summarize", limiter, summarizeRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`✅ API running at http://localhost:${PORT}`);
});
