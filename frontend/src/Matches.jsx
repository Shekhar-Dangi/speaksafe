import { useState, useEffect } from "react";
import { useUser } from "./context/UserProvider.jsx";

/**
 * Matches Component - Display Mutual Matches
 *
 * Shows all users who have mutually liked each other.
 * Allows users to view their matches and start conversations.
 *
 * Features:
 * - Display all mutual matches
 * - Profile preview for each match
 * - Message button to start conversations
 * - Responsive grid layout
 * - Loading states and error handling
 *
 * @param {Object} props - Component props
 * @param {Function} props.onBack - Callback to return to previous view
 * @returns {JSX.Element} The matches display interface
 */
function Matches({ onBack }) {
  // ==================== AUTHENTICATION ====================

  /** Get user data from context */
  const { user } = useUser();

  // ==================== STATE MANAGEMENT ====================

  /** Array of user's matches */
  const [matches, setMatches] = useState([]);

  /** Loading state for API calls */
  const [isLoading, setIsLoading] = useState(true);

  /** Error state */
  const [error, setError] = useState(null);

  // ==================== EFFECTS ====================

  useEffect(() => {
    fetchMatches();
  }, []);

  // ==================== API CALLS ====================

  /**
   * Fetches user's matches from the API
   */
  const fetchMatches = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `${import.meta.env.VITE_API_URI}/users/matches`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch matches");
      }

      const data = await response.json();
      setMatches(data.matches || []);
    } catch (error) {
      console.error("Error fetching matches:", error);
      setError("Failed to load matches. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== EVENT HANDLERS ====================

  /**
   * Opens a conversation with a match
   * @param {string} matchId - ID of the match to message
   */
  const handleMessage = (matchId) => {
    // Navigate to messages view - this could be enhanced to pass the specific match
    window.dispatchEvent(
      new CustomEvent("navigateToMessages", { detail: { matchId } })
    );
  };

  // ==================== RENDER GUARD ====================

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 p-3 md:p-4 flex justify-between items-center">
        <button
          onClick={onBack}
          className="text-gray-400 hover:text-white text-sm md:text-base"
        >
          ← Back
        </button>
        <h1 className="text-lg md:text-xl font-bold">Your Matches</h1>
        <div className="w-16"></div> {/* Spacer for centering */}
      </header>

      <div className="max-w-4xl mx-auto p-4 md:p-6">
        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Loading matches...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-8">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={fetchMatches}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && matches.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💔</div>
            <h2 className="text-xl md:text-2xl font-bold mb-2">
              No matches yet
            </h2>
            <p className="text-gray-400 mb-6">
              Keep swiping to find people who share your experiences!
            </p>
            <button
              onClick={onBack}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors"
            >
              Continue Browsing
            </button>
          </div>
        )}

        {/* Matches Grid */}
        {!isLoading && !error && matches.length > 0 && (
          <>
            <div className="mb-6">
              <p className="text-gray-400 text-center">
                You have {matches.length} mutual{" "}
                {matches.length === 1 ? "match" : "matches"}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {matches.map((match) => (
                <div
                  key={match._id}
                  className="bg-gray-800 rounded-lg p-4 md:p-6"
                >
                  {/* Profile Picture */}
                  <div className="text-center mb-4">
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-600 rounded-full mx-auto mb-3 flex items-center justify-center overflow-hidden">
                      {match.profilePic ? (
                        <img
                          src={match.profilePic}
                          alt={match.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl md:text-3xl">👤</span>
                      )}
                    </div>
                    <h3 className="text-lg md:text-xl font-bold mb-1">
                      {match.name}
                    </h3>
                  </div>

                  {/* Bio */}
                  {match.bio && (
                    <div className="mb-4">
                      <p className="text-gray-300 text-sm text-center italic">
                        "{match.bio}"
                      </p>
                    </div>
                  )}

                  {/* Tags */}
                  {match.tags && match.tags.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1 justify-center">
                        {match.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                        {match.tags.length > 3 && (
                          <span className="bg-gray-600 text-gray-300 text-xs px-2 py-1 rounded-full">
                            +{match.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <button
                    onClick={() => handleMessage(match._id)}
                    className="w-full bg-green-600 hover:bg-green-700 py-2 md:py-3 rounded-lg transition-colors font-semibold"
                  >
                    Send Message
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Matches;
