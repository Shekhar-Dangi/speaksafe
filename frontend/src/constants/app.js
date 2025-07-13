/**
 * Application Constants
 *
 * Centralized configuration and constants for the SafeSpeak application.
 * This helps maintain consistency and makes the app easier to configure.
 */

// ==================== API CONFIGURATION ====================

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URI,
  WEBSOCKET_URL: import.meta.env.VITE_WS_URI || "ws://localhost:3001",
  TIMEOUT: 10000, // 10 seconds
};

// ==================== ANIMATION TIMINGS ====================

export const ANIMATION_TIMINGS = {
  CARD_TRANSITION: 400, // milliseconds
  CARD_CHANGE_DELAY: 150, // milliseconds
  SCROLL_DEBOUNCE: 50, // milliseconds
  SCROLL_THRESHOLD: 100, // milliseconds between scrolls
  SCROLL_DELTA_THRESHOLD: 30, // minimum scroll delta
  RECONNECT_DELAY: 3000, // WebSocket reconnection delay
};

// ==================== VIEW STATES ====================

export const VIEW_STATES = {
  HOME: "home",
  PROFILE: "profile",
  MESSAGES: "messages",
  MATCHES: "matches",
  LIKES: "likes",
  SIGN: "sign",
};

// ==================== UI CONSTANTS ====================

export const UI_CONSTANTS = {
  MAX_MESSAGE_LENGTH: 500,
  MOBILE_BREAKPOINT: 768, // pixels
  SIDEBAR_WIDTH: {
    MOBILE: 0,
    DESKTOP: 320, // pixels
  },
  USER_COUNTER_MAX: 999, // max display number
};

// ==================== MESSAGE TYPES ====================

export const MESSAGE_TYPES = {
  TEXT: "text",
  SYSTEM: "system",
  NOTIFICATION: "notification",
};

// ==================== ERROR MESSAGES ====================

export const ERROR_MESSAGES = {
  NETWORK: "Network error. Please check your connection.",
  AUTH_REQUIRED: "Authentication required. Please sign in.",
  USER_FEED_FAILED: "Failed to load users. Please try again.",
  MESSAGE_SEND_FAILED: "Failed to send message. Please try again.",
  MATCHES_LOAD_FAILED: "Failed to load matches. Please try again.",
  WEBSOCKET_FAILED: "Failed to connect to messaging service.",
  LIKE_FAILED: "Failed to like user. Please try again.",
  GENERIC: "Something went wrong. Please try again.",
};

// ==================== SUCCESS MESSAGES ====================

export const SUCCESS_MESSAGES = {
  PROFILE_UPDATED: "Profile updated successfully!",
  MESSAGE_SENT: "Message sent!",
  MATCH_CREATED: "It's a match! 🎉",
  CONNECTION_RESTORED: "Connection restored.",
};

// ==================== DEFAULT VALUES ====================

export const DEFAULT_VALUES = {
  USER_AVATAR: "👤",
  LOADING_TEXT: "Loading...",
  NO_DATA_TEXT: "No data available",
  RETRY_TEXT: "Try Again",
  REFRESH_TEXT: "Refresh",
};
