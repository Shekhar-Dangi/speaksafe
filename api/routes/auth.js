const express = require("express");
const passport = require("passport");
const router = express.Router();

// Start Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL}/login?error=auth_failed`,
  }),
  (req, res) => {
    // Redirect to frontend with success
    res.redirect(`${process.env.CLIENT_URL}/dashboard?auth=success`);
  }
);

// Logout
router.get("/logout", (req, res) => {
  req.logout(() => {
    res.json({ message: "Logged out" });
  });
});

// Get current user
router.get("/me", (req, res) => {
  if (!req.user) return res.status(401).json({ user: null });
  res.json({ user: req.user });
});

// Check if user is authenticated
router.get("/status", (req, res) => {
  res.json({
    authenticated: !!req.user,
    user: req.user || null,
  });
});

module.exports = router;
