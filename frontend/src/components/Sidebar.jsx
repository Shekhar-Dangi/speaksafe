import { useState, useEffect } from "react";
import { useUser } from "../context/UserProvider.jsx";
import Message from "./Message.jsx";
import { ERROR_MESSAGES, DEFAULT_VALUES } from "../constants/app.js";
import { userAPI } from "../utils/api.js";
import { LoadingState, ErrorState, EmptyState } from "./common/index.jsx";

/**
 * Sidebar Component - Messages Navigation Panel
 *
 * Displays a list of active matches in a sidebar layout.
 * Hidden on mobile devices, visible on desktop for better UX.
 * Shows real user matches from the API with ability to start conversations.
 *
 * Features:
 * - Responsive design (hidden on mobile, visible on desktop)
 * - Real matches fetched from API
 * - Loading and error states
 * - Direct navigation to specific conversations
 * - Match count display
 *
 * @returns {JSX.Element} The sidebar component
 */
function Sidebar() {
  // ==================== AUTHENTICATION ====================

  /** Get user data from context */
  const { user } = useUser();

  // ==================== STATE MANAGEMENT ====================

  /** Array of user's matches with recent messages */
  const [matches, setMatches] = useState([]);

  /** Loading state */
  const [isLoading, setIsLoading] = useState(true);

  /** Error state */
  const [error, setError] = useState(null);

  // ==================== EFFECTS ====================

  useEffect(() => {
    if (user) {
      fetchMatches();
    }
  }, [user]);

  // ==================== API CALLS ====================

  /**
   * Fetches user's matches from the API
   */
  const fetchMatches = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await userAPI.getMatches();
      setMatches(data.matches || []);
    } catch (error) {
      console.error("Error fetching matches:", error);
      setError(ERROR_MESSAGES.MATCHES_LOAD_FAILED);
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== EVENT HANDLERS ====================

  /**
   * Handles clicking on a match to start a conversation
   * @param {Object} match - The selected match object
   */
  const handleMatchClick = (match) => {
    // Dispatch custom event to navigate to messages with specific match
    window.dispatchEvent(
      new CustomEvent("navigateToMessages", {
        detail: { matchId: match._id },
      })
    );
  };

  if (!user) {
    return null;
  }

  return (
    <div className="w-64 md:w-80 bg-gray-800 border-r border-gray-700 flex flex-col h-full">
      {/* Header */}
      <div className="p-3 md:p-4 border-b border-gray-700">
        <h2 className="text-base md:text-lg font-semibold text-white">
          Messages
        </h2>
        <p className="text-xs md:text-sm text-gray-400">Your matches</p>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
            <p className="text-sm text-gray-400">Loading matches...</p>
          </div>
        ) : error ? (
          <div className="p-4 text-center">
            <p className="text-sm text-red-400">{error}</p>
            <button
              onClick={fetchMatches}
              className="mt-2 text-xs text-blue-400 hover:text-blue-300"
            >
              Try again
            </button>
          </div>
        ) : matches.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-sm text-gray-400">No matches yet</p>
            <p className="text-xs text-gray-500 mt-1">
              Get matching with someone to start chatting!
            </p>
          </div>
        ) : (
          matches.map((match) => (
            <Message
              key={match._id}
              message={{
                id: match._id,
                name: match.name,
                lastMessage: "Start a conversation",
                time: "now",
                avatar: match.profilePic,
                unread: false,
              }}
              onClick={() => handleMatchClick(match)}
            />
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-3 md:p-4 border-t border-gray-700">
        <div className="flex items-center justify-between text-xs md:text-sm text-gray-400">
          <span>0 unread</span>
          <span>{matches.length} matches</span>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
