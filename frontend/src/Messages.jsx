import { useState, useEffect, useRef } from "react";
import { useUser } from "./context/UserProvider.jsx";
import {
  ERROR_MESSAGES,
  ANIMATION_TIMINGS,
  DEFAULT_VALUES,
} from "./constants/app.js";
import { userAPI } from "./utils/api.js";
import { ArrowLeftIcon, SendIcon } from "./components/icons/index.jsx";
import {
  LoadingState,
  ErrorState,
  EmptyState,
  ErrorNotification,
  Avatar,
  Button,
} from "./components/common/index.jsx";

/**
 * Messages Component - Real-time Chat Interface
 *
 * Provides a full-screen chat interface with real WebSocket integration.
 * Features message history, real-time sending, and responsive design.
 * Integrates with backend WebSocket server for live messaging.
 *
 * Features:
 * - Real-time WebSocket messaging
 * - Message history from backend API
 * - Match selection from user's matches
 * - Message input with keyboard shortcuts
 * - User avatars and timestamps
 * - Responsive design for mobile and desktop
 * - Connection status indicators
 *
 * @param {Object} props - Component props
 * @param {Function} props.onBack - Callback to return to previous view
 * @param {string} props.selectedMatchId - ID of match to open conversation with
 * @param {boolean} props.hideSidebar - Whether to hide the matches sidebar
 * @returns {JSX.Element} The chat interface component
 */
function Messages({ onBack, selectedMatchId, hideSidebar = false }) {
  // ==================== AUTHENTICATION ====================

  /** Get user data from context */
  const { user } = useUser();

  // ==================== STATE MANAGEMENT ====================

  /** Current message being typed by the user */
  const [message, setMessage] = useState("");

  /** Array of all messages in the current conversation */
  const [messages, setMessages] = useState([]);

  /** Currently selected match for conversation */
  const [selectedMatch, setSelectedMatch] = useState(null);

  /** Array of user's matches */
  const [matches, setMatches] = useState([]);

  /** Loading states */
  const [isLoadingMatches, setIsLoadingMatches] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  /** WebSocket connection */
  const [ws, setWs] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  /** Error states */
  const [error, setError] = useState(null);

  // ==================== REFS ====================

  /** Reference to messages container for auto-scrolling */
  const messagesEndRef = useRef(null);

  /** Reference to current selected match for WebSocket callbacks */
  const selectedMatchRef = useRef(null);

  // ==================== EFFECTS ====================

  useEffect(() => {
    fetchMatches();
    setupWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (selectedMatch) {
      selectedMatchRef.current = selectedMatch;
      fetchMessages(selectedMatch._id);
    }
  }, [selectedMatch]);

  // Handle selectedMatchId prop from parent component
  useEffect(() => {
    if (selectedMatchId && matches.length > 0) {
      const match = matches.find((m) => m._id === selectedMatchId);
      if (match) {
        setSelectedMatch(match);
      }
    }
  }, [selectedMatchId, matches]);

  // ==================== API CALLS ====================

  /**
   * Fetches user's matches from the API
   */
  const fetchMatches = async () => {
    try {
      setIsLoadingMatches(true);
      setError(null);

      const data = await userAPI.getMatches();
      setMatches(data.matches || []);

      // Auto-select first match if available
      if (data.matches && data.matches.length > 0) {
        setSelectedMatch(data.matches[0]);
        selectedMatchRef.current = data.matches[0];
      }
    } catch (error) {
      console.error("Error fetching matches:", error);
      setError(ERROR_MESSAGES.MATCHES_LOAD_FAILED);
    } finally {
      setIsLoadingMatches(false);
    }
  };

  /**
   * Fetches message history with a specific match
   * @param {string} matchId - ID of the match to fetch messages for
   */
  const fetchMessages = async (matchId) => {
    try {
      setIsLoadingMessages(true);
      setError(null);

      const data = await userAPI.getMessages(matchId);
      setMessages(data.messages || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setError("Failed to load messages. Please try again.");
    } finally {
      setIsLoadingMessages(false);
    }
  };

  // ==================== WEBSOCKET SETUP ====================

  /**
   * Sets up WebSocket connection for real-time messaging
   */
  const setupWebSocket = () => {
    try {
      // Construct WebSocket URL from API URI
      const apiUri = import.meta.env.VITE_API_URI || "http://localhost:3000";
      const wsProtocol = apiUri.startsWith("https") ? "wss:" : "ws:";
      const wsUrl = apiUri.replace(/^https?:/, wsProtocol);

      const websocket = new WebSocket(wsUrl);

      websocket.onopen = () => {
        setIsConnected(true);
        setWs(websocket);
      };

      websocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === "message") {
            // Add received message to current conversation if it's from the selected match
            const currentSelectedMatch = selectedMatchRef.current;
            if (
              currentSelectedMatch &&
              data.from === currentSelectedMatch._id
            ) {
              const newMessage = {
                _id: Date.now().toString(),
                from: data.from,
                to: user._id,
                content: data.content,
                date: data.date,
              };
              setMessages((prev) => [...prev, newMessage]);
            }
            // TODO: Add notification for messages from other matches
          } else if (data.error) {
            console.error("WebSocket error:", data.error);
            setError(data.error);
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      websocket.onclose = () => {
        setIsConnected(false);
        setWs(null);

        // Attempt to reconnect after 3 seconds
        setTimeout(() => {
          if (!ws || ws.readyState === WebSocket.CLOSED) {
            setupWebSocket();
          }
        }, ANIMATION_TIMINGS.RECONNECT_DELAY);
      };

      websocket.onerror = (error) => {
        console.error("WebSocket error:", error);
        setError(ERROR_MESSAGES.WEBSOCKET_FAILED);
      };
    } catch (error) {
      console.error("Failed to setup WebSocket:", error);
      setError(ERROR_MESSAGES.WEBSOCKET_FAILED);
    }
  };

  // ==================== EVENT HANDLERS ====================

  /**
   * Handles sending a new message via WebSocket
   */
  const handleSendMessage = () => {
    if (!message.trim() || !selectedMatch || !ws || !isConnected) {
      return;
    }

    try {
      // Send message via WebSocket (format expected by your backend)
      const messageData = {
        data: [
          {
            type: "message",
            to: selectedMatch._id,
            content: message.trim(),
          },
        ],
      };

      console.log("Sending message:", messageData);
      ws.send(JSON.stringify(messageData));

      // Add message to local state immediately for better UX
      const newMessage = {
        _id: Date.now().toString(),
        from: user._id,
        to: selectedMatch._id,
        content: message.trim(),
        date: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, newMessage]);
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message. Please try again.");
    }
  };

  /**
   * Handles keyboard shortcuts in the message input
   * Enter = Send message, Shift+Enter = New line
   *
   * @param {KeyboardEvent} e - The keyboard event
   */
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  /**
   * Handles match selection
   * @param {Object} match - The selected match object
   */
  const handleMatchSelect = (match) => {
    setSelectedMatch(match);
    setMessages([]); // Clear current messages
  };

  /**
   * Scrolls to bottom of messages container
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // ==================== HELPER FUNCTIONS ====================

  /**
   * Formats message timestamp
   * @param {string} date - ISO date string
   * @returns {string} Formatted time string
   */
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /**
   * Checks if message is from current user
   * @param {Object} msg - Message object
   * @returns {boolean} True if message is from current user
   */
  const isMyMessage = (msg) => {
    return msg.from.toString() === user._id.toString();
  };

  // ==================== RENDER GUARDS ====================

  if (!user) {
    return (
      <div className="h-full bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // ==================== RENDER ====================

  return (
    <div className="h-full bg-gray-900 text-white flex">
      {/* Matches Sidebar - Conditionally shown */}
      {!hideSidebar && (
        <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Messages</h2>
              <div
                className={`w-3 h-3 rounded-full ${
                  isConnected ? "bg-green-500" : "bg-red-500"
                }`}
                title={isConnected ? "Connected" : "Disconnected"}
              ></div>
            </div>
          </div>

          {/* Matches List */}
          <div className="flex-1 overflow-y-auto">
            {isLoadingMatches ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                <p className="text-sm text-gray-400">Loading matches...</p>
              </div>
            ) : matches.length === 0 ? (
              <div className="p-4 text-center">
                <p className="text-gray-400 mb-2">No matches yet</p>
                <p className="text-xs text-gray-500">
                  Get matching with someone to start chatting!
                </p>
              </div>
            ) : (
              matches.map((match) => (
                <div
                  key={match._id}
                  onClick={() => handleMatchSelect(match)}
                  className={`p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors ${
                    selectedMatch?._id === match._id ? "bg-gray-700" : ""
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center overflow-hidden">
                      {match.profilePic ? (
                        <img
                          src={match.profilePic}
                          alt={match.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xl">👤</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{match.name}</h3>
                      {match.tags && match.tags.length > 0 && (
                        <p className="text-xs text-gray-400 truncate">
                          {match.tags.slice(0, 2).join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedMatch ? (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-gray-800 border-b border-gray-700 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={onBack}
                  className="md:hidden text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                </button>
                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center overflow-hidden">
                  {selectedMatch.profilePic ? (
                    <img
                      src={selectedMatch.profilePic}
                      alt={selectedMatch.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-lg">👤</span>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">{selectedMatch.name}</h3>
                  <p className="text-xs text-gray-400">
                    {isConnected ? "Online" : "Connecting..."}
                  </p>
                </div>
              </div>
              <button
                onClick={onBack}
                className="hidden md:flex items-center space-x-2 text-gray-400 hover:text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                <span className="text-sm">Back</span>
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {isLoadingMessages ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                  <p className="text-sm text-gray-400">Loading messages...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-2">No messages yet</p>
                  <p className="text-sm text-gray-500">
                    Send a message to start the conversation!
                  </p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`flex ${
                      isMyMessage(msg) ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        isMyMessage(msg)
                          ? "bg-blue-600 text-white"
                          : "bg-gray-700 text-gray-100"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          isMyMessage(msg) ? "text-blue-200" : "text-gray-400"
                        }`}
                      >
                        {formatTime(msg.date)}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 bg-gray-800 border-t border-gray-700">
              {error && (
                <div className="mb-3 p-2 bg-red-500/20 border border-red-500/30 rounded text-red-300 text-sm">
                  {error}
                  <button
                    onClick={() => setError(null)}
                    className="float-right text-red-400 hover:text-red-300"
                  >
                    ×
                  </button>
                </div>
              )}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={
                    isConnected ? "Type a message..." : "Connecting..."
                  }
                  disabled={!isConnected}
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 disabled:opacity-50"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || !isConnected}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-2 rounded-lg transition-colors font-semibold"
                >
                  Send
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Press Enter to send •{" "}
                {isConnected ? "Connected" : "Reconnecting..."}
              </p>
            </div>
          </>
        ) : (
          /* No Match Selected */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-xl font-semibold mb-2">
                Select a match to start chatting
              </h3>
              <p className="text-gray-400">
                Choose someone from your matches to begin a conversation
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Messages;
