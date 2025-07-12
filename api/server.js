require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
require("./config/passport");
const session = require("express-session");
const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const setupWebSocket = require("./ws/server");
const MongoStore = require("connect-mongo");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));

const sessionStore = MongoStore.create({ mongoUrl: process.env.MONGO_URI });

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || "secret",
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    secure: process.env.NODE_ENV === "production", // true in production
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
});

app.use(sessionMiddleware);

app.use(passport.initialize());
app.use(passport.session());

// Basic route
app.get("/", (req, res) => {
  res.send("Mental Health Social Matching Backend Running");
});

app.use("/auth", authRoutes);
app.use("/users", usersRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

setupWebSocket(server, sessionStore);
