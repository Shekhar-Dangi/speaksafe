/**
 * WebSocket message format:
 * {
 *   type: 'message',
 *   to: '<recipientUserId>',
 *   content: '<text>'
 * }
 * Only mutual matches can send messages.
 */
const WebSocket = require("ws");
const cookie = require("cookie");
const mongoose = require("mongoose");
const User = require("../models/User");
const passport = require("passport");

// This function will be called from server.js after Express is set up
function setupWebSocket(server, sessionStore) {
  const wss = new WebSocket.Server({ server });
  const clients = new Map(); // userId -> ws

  // Helper to parse session from cookie
  function parseSession(ws, req, cb) {
    const cookies = cookie.parse(req.headers.cookie || "");
    let sessionId = cookies["connect.sid"];
    if (!sessionId) return cb(null);
    // Remove 's:' or 's%3A' prefix if present
    if (sessionId.startsWith("s:")) sessionId = sessionId.slice(2);
    if (sessionId.startsWith("s%3A")) sessionId = sessionId.slice(4);
    // Remove signature (everything after the first dot)
    sessionId = sessionId.split(".")[0];
    sessionStore.get(sessionId, (err, session) => {
      if (err || !session || !session.passport || !session.passport.user)
        return cb(null);
      cb(session.passport.user);
    });
  }

  wss.on("connection", (ws, req) => {
    parseSession(ws, req, async (userId) => {
      if (!userId) {
        ws.close();
        return;
      }
      clients.set(userId, ws);
      ws.userId = userId;

      ws.on("message", async (message) => {
        try {
          const data = JSON.parse(message).data[0];
          if (data.type === "message") {
            const { to, content } = data;
            // Check if users are mutual matches
            const user = await User.findById(userId);
            if (!user.matches.includes(to)) {
              ws.send(JSON.stringify({ error: "Not a mutual match" }));
              return;
            }
            // Save message to both users
            const msgObj = {
              from: userId,
              to,
              content,
              date: new Date(),
            };

            try {
              const res1 = await User.updateOne(
                { _id: userId },
                { $push: { messages: msgObj } }
              );
              const res2 = await User.updateOne(
                { _id: to },
                { $push: { messages: msgObj } }
              );
            } catch (err) {
              console.error("Error storing message:", err);
            }
            // Send to recipient if online
            const recipientWs = clients.get(to);
            if (recipientWs) {
              recipientWs.send(
                JSON.stringify({
                  type: "message",
                  from: userId,
                  content,
                  date: msgObj.date,
                })
              );
            } else {
              // Add notification for offline user
              await User.updateOne(
                { _id: to },
                {
                  $push: {
                    notifications: {
                      type: "message",
                      content: `New message from ${user.name}`,
                    },
                  },
                }
              );
            }
          }
        } catch (err) {
          ws.send(JSON.stringify({ error: "Invalid message format" }));
        }
      });

      ws.on("close", () => {
        clients.delete(userId);
      });
    });
  });
}

module.exports = setupWebSocket;
