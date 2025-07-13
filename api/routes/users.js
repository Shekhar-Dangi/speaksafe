const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");

// Middleware to ensure user is authenticated
function ensureAuth(req, res, next) {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  res.status(401).json({ error: "Unauthorized" });
}

/**
 * @route POST /users/:id/like
 * @desc Like a user. If mutual, creates a match.
 * @access Private
 */
router.post("/:id/like", ensureAuth, async (req, res) => {
  const userId = req.user._id;
  const targetId = req.params.id;
  if (!targetId.match(/^[a-fA-F0-9]{24}$/))
    return res.status(400).json({ error: "Invalid user ID" });
  if (userId.toString() === targetId)
    return res.status(400).json({ error: "Cannot like yourself" });
  try {
    const [user, target] = await Promise.all([
      User.findById(userId),
      User.findById(targetId),
    ]);
    if (!user || !target)
      return res.status(404).json({ error: "User not found" });
    const alreadyMatched =
      user.matches.includes(targetId) || target.matches.includes(userId);
    if (alreadyMatched) {
      return res.status(200).json({ message: "Already matched" });
    }
    const targetLikesUser = target.likedUsers.includes(userId);
    if (targetLikesUser) {
      if (!user.matches.includes(targetId)) user.matches.push(targetId);
      if (!target.matches.includes(userId)) target.matches.push(userId);
      user.likedUsers = user.likedUsers.filter(
        (id) => id.toString() !== targetId
      );
      user.likedBy = user.likedBy.filter((id) => id.toString() !== targetId);
      console.log(target.likedUsers);
      target.likedUsers = target.likedUsers.filter(
        (id) => id.toString() !== userId.toString()
      );
      console.log(target.likedUsers);
      target.likedBy = target.likedBy.filter((id) => id.toString() !== userId);
      user.notifications.push({
        type: "match",
        content: `You matched with ${target.name}`,
      });
      target.notifications.push({
        type: "match",
        content: `You matched with ${user.name}`,
      });
    } else {
      if (!user.likedUsers.includes(targetId)) user.likedUsers.push(targetId);
      if (!target.likedBy.includes(userId)) target.likedBy.push(userId);
    }
    await Promise.all([user.save(), target.save()]);
    res.json({ success: true, matched: targetLikesUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
// Get users you liked
router.get("/liked", ensureAuth, async (req, res) => {
  const user = await User.findById(req.user._id).populate(
    "likedUsers",
    "name profilePic tags bio"
  );
  res.json({ users: user.likedUsers });
});

// Get users who liked you
router.get("/likedby", ensureAuth, async (req, res) => {
  const user = await User.findById(req.user._id).populate(
    "likedBy",
    "name profilePic tags bio"
  );
  res.json({ users: user.likedBy });
});

// Get mutual matches
router.get("/matches", ensureAuth, async (req, res) => {
  const user = await User.findById(req.user._id).populate(
    "matches",
    "name profilePic tags bio isOnline lastSeen"
  );
  res.json({ matches: user.matches });
});

/**
 * @route GET /users/:id/messages
 * @desc Get chat history with a specific user (only if matched)
 * @access Private
 */
router.get("/:id/messages", ensureAuth, async (req, res) => {
  const userId = req.user._id;
  const otherId = req.params.id;
  if (!otherId.match(/^[a-fA-F0-9]{24}$/))
    return res.status(400).json({ error: "Invalid user ID" });
  const user = await User.findById(userId);
  if (!user.matches.includes(otherId)) {
    return res.status(403).json({ error: "Not a mutual match" });
  }
  const messages = user.messages
    .filter((m) => m.from.toString() === otherId || m.to.toString() === otherId)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  res.json({ messages });
});

/**
 * @route GET /users/notifications
 * @desc Get all notifications for the user
 * @access Private
 */
router.get("/notifications", ensureAuth, async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ notifications: user.notifications });
});

/**
 * @route POST /users/notifications/:notificationId/read
 * @desc Mark a notification as read
 * @access Private
 */
router.post(
  "/notifications/:notificationId/read",
  ensureAuth,
  async (req, res) => {
    const user = await User.findById(req.user._id);
    const notification = user.notifications.id(req.params.notificationId);
    if (!notification)
      return res.status(404).json({ error: "Notification not found" });
    notification.read = true;
    await user.save();
    res.json({ success: true });
  }
);

/**
 * @route GET /users/feed
 * @desc Get a feed of users to swipe/like (prioritizes tag matches)
 * @access Private
 */
router.get("/feed", ensureAuth, async (req, res) => {
  const user = await User.findById(req.user._id);
  const excludeIds = [user._id, ...user.likedUsers, ...user.matches];
  let feed = await User.find({
    _id: { $nin: excludeIds },
    tags: { $in: user.tags, $ne: [] },
  })
    .select("name profilePic tags bio")
    .limit(20);
  if (feed.length === 0) {
    feed = await User.aggregate([
      { $match: { _id: { $nin: excludeIds } } },
      { $sample: { size: 20 } },
      { $project: { name: 1, profilePic: 1, tags: 1, bio: 1 } },
    ]);
  }
  res.json({ feed });
});

/**
 * @route GET /users/me/tags
 * @desc Get current user's tags
 * @access Private
 */
router.get("/me/tags", ensureAuth, async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ tags: user.tags });
});

/**
 * @route POST /users/me/tags
 * @desc Add tags (merge with existing)
 * @access Private
 */
router.post(
  "/me/tags",
  ensureAuth,
  body("tags").isArray(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ error: "Tags must be an array" });
    const { tags } = req.body;
    const user = await User.findById(req.user._id);
    user.tags = Array.from(new Set([...user.tags, ...tags]));
    await user.save();
    res.json({ tags: user.tags });
  }
);

/**
 * @route PUT /users/me/tags
 * @desc Replace all tags
 * @access Private
 */
router.put("/me/tags", ensureAuth, body("tags").isArray(), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ error: "Tags must be an array" });
  const { tags } = req.body;
  const user = await User.findById(req.user._id);
  user.tags = tags;
  await user.save();
  res.json({ tags: user.tags });
});

/**
 * @route DELETE /users/me/tags
 * @desc Remove specific tags
 * @access Private
 */
router.delete(
  "/me/tags",
  ensureAuth,
  body("tags").isArray(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ error: "Tags must be an array" });
    const { tags } = req.body;
    const user = await User.findById(req.user._id);
    user.tags = user.tags.filter((tag) => !tags.includes(tag));
    await user.save();
    res.json({ tags: user.tags });
  }
);

/**
 * @route PUT /users/me
 * @desc Update user profile (bio, etc.)
 * @access Private
 */
router.put("/me", ensureAuth, async (req, res) => {
  try {
    const { bio } = req.body;
    const user = await User.findById(req.user._id);

    if (bio !== undefined) {
      user.bio = bio;
    }

    await user.save();
    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        profilePic: user.profilePic,
        bio: user.bio,
        tags: user.tags,
      },
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
