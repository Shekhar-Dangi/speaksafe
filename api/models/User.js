const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  type: String, // e.g., 'match', 'message'
  content: String,
  date: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
});

const MessageSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  to: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  content: String,
  date: { type: Date, default: Date.now },
});

const UserSchema = new mongoose.Schema(
  {
    googleId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    profilePic: String,
    tags: [String], // e.g., ['anxiety', 'depression']
    bio: String,
    likedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // users this user liked
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // users who liked this user
    matches: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // mutual matches
    notifications: [NotificationSchema],
    messages: [MessageSchema], // all messages sent/received
    isOnline: { type: Boolean, default: false },
    lastSeen: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
