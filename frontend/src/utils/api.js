/**
 * API Utility Functions
 *
 * Centralized API communication utilities with error handling,
 * request/response interceptors, and consistent error formatting.
 */

import { API_CONFIG, ERROR_MESSAGES } from "../constants/app.js";

// ==================== BASE FETCH UTILITY ====================

/**
 * Enhanced fetch wrapper with error handling and credentials
 * @param {string} endpoint - API endpoint (relative to base URL)
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} API response data
 */
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;

  const defaultOptions = {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

    const response = await fetch(url, {
      ...defaultOptions,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(getErrorMessage(response.status));
    }

    return await response.json();
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Request timeout. Please try again.");
    }
    throw new Error(error.message || ERROR_MESSAGES.NETWORK);
  }
};

// ==================== HTTP METHODS ====================

export const api = {
  get: (endpoint) => apiRequest(endpoint),
  post: (endpoint, data) =>
    apiRequest(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  put: (endpoint, data) =>
    apiRequest(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (endpoint) =>
    apiRequest(endpoint, {
      method: "DELETE",
    }),
};

// ==================== SPECIFIC API CALLS ====================

export const userAPI = {
  fetchFeed: () => api.get("/users/feed"),
  likeUser: (userId) => api.post(`/users/${userId}/like`),
  getMatches: () => api.get("/users/matches"),
  getLiked: () => api.get("/users/liked"),
  getLikedBy: () => api.get("/users/likedby"),
  getMessages: (userId) => api.get(`/users/${userId}/messages`),
  updateProfile: (data) => api.put("/users/profile", data),
};

export const authAPI = {
  logout: () => api.get("/auth/logout"),
  getProfile: () => api.get("/auth/profile"),
};

// ==================== ERROR HANDLING ====================

/**
 * Maps HTTP status codes to user-friendly error messages
 * @param {number} status - HTTP status code
 * @returns {string} User-friendly error message
 */
const getErrorMessage = (status) => {
  switch (status) {
    case 401:
      return ERROR_MESSAGES.AUTH_REQUIRED;
    case 403:
      return "Access denied. Please check your permissions.";
    case 404:
      return "Resource not found.";
    case 429:
      return "Too many requests. Please wait a moment.";
    case 500:
      return "Server error. Please try again later.";
    default:
      return ERROR_MESSAGES.GENERIC;
  }
};

// ==================== WEBSOCKET UTILITIES ====================

/**
 * Creates a WebSocket connection with automatic reconnection
 * @param {string} url - WebSocket URL
 * @param {Object} handlers - Event handlers
 * @returns {WebSocket} WebSocket instance
 */
export const createWebSocket = (
  url = API_CONFIG.WEBSOCKET_URL,
  handlers = {}
) => {
  const ws = new WebSocket(url);

  ws.onopen = (event) => {
    console.log("WebSocket connected");
    handlers.onOpen?.(event);
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      handlers.onMessage?.(data);
    } catch (error) {
      console.error("Failed to parse WebSocket message:", error);
    }
  };

  ws.onclose = (event) => {
    console.log("WebSocket disconnected");
    handlers.onClose?.(event);
  };

  ws.onerror = (error) => {
    console.error("WebSocket error:", error);
    handlers.onError?.(error);
  };

  return ws;
};
