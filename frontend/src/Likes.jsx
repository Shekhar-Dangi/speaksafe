import { useState, useEffect } from "react";
import { useUser } from "./context/UserProvider.jsx";

/**
 * Likes Component - Display Likes and Who Liked You
 *
 * Shows users you've liked and users who have liked you.
 * Helps users understand their activity and potential matches.
 *
 * Features:
 * - Two tabs: "You Liked" and "Liked You"
 * - Profile preview for each user
 * - Match indicators for mutual likes
 * - Responsive grid layout
 * - Loading states and error handling
 *
 * @param {Object} props - Component props
 * @param {Function} props.onBack - Callback to return to previous view
 * @returns {JSX.Element} The likes display interface
 */
function Likes({ onBack }) {
  // ==================== AUTHENTICATION ====================

  /** Get user data from context */
  const { user } = useUser();

  // ==================== STATE MANAGEMENT ====================

  /** Currently active tab */
  const [activeTab, setActiveTab] = useState("liked"); // 'liked' or 'likedBy'

  /** Array of users you liked */
  const [likedUsers, setLikedUsers] = useState([]);

  /** Array of users who liked you */
  const [likedByUsers, setLikedByUsers] = useState([]);

  /** Loading state for API calls */
  const [isLoading, setIsLoading] = useState(true);

  /** Error state */
  const [error, setError] = useState(null);

  // ==================== EFFECTS ====================

  useEffect(() => {
    fetchLikes();
  }, []);

  // ==================== API CALLS ====================

  /**
   * Fetches liked users and users who liked you from the API
   */
  const fetchLikes = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch users you liked
      const likedResponse = await fetch(
        `${import.meta.env.VITE_API_URI}/users/liked`,
        {
          credentials: "include",
        }
      );

      // Fetch users who liked you
      const likedByResponse = await fetch(
        `${import.meta.env.VITE_API_URI}/users/likedby`,
        {
          credentials: "include",
        }
      );

      if (!likedResponse.ok || !likedByResponse.ok) {
        throw new Error("Failed to fetch likes data");
      }

      const likedData = await likedResponse.json();
      const likedByData = await likedByResponse.json();

      setLikedUsers(likedData.users || []);
      setLikedByUsers(likedByData.users || []);
    } catch (error) {
      console.error("Error fetching likes:", error);
      setError("Failed to load likes. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== EVENT HANDLERS ====================

  /**
   * Switches between tabs
   * @param {string} tab - The tab to switch to ('liked' or 'likedBy')
   */
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // ==================== COMPUTED VALUES ====================

  /** Current data based on active tab */
  const currentData = activeTab === "liked" ? likedUsers : likedByUsers;

  /** Check if a user is a mutual match */
  const isMutualMatch = (userId) => {
    return user?.matches?.includes(userId);
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
        <h1 className="text-lg md:text-xl font-bold">Likes</h1>
        <div className="w-16"></div> {/* Spacer for centering */}
      </header>

      <div className="max-w-4xl mx-auto p-4 md:p-6">
        {/* Tab Navigation */}
        <div className="flex bg-gray-800 rounded-lg p-1 mb-6">
          <button
            onClick={() => handleTabChange("liked")}
            className={`flex-1 py-2 px-4 rounded-md text-sm md:text-base font-medium transition-colors ${
              activeTab === "liked"
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            You Liked ({likedUsers.length})
          </button>
          <button
            onClick={() => handleTabChange("likedBy")}
            className={`flex-1 py-2 px-4 rounded-md text-sm md:text-base font-medium transition-colors ${
              activeTab === "likedBy"
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Liked You ({likedByUsers.length})
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Loading likes...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-8">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={fetchLikes}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && currentData.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">
              {activeTab === "liked" ? "👍" : "❤️"}
            </div>
            <h2 className="text-xl md:text-2xl font-bold mb-2">
              {activeTab === "liked"
                ? "No likes yet"
                : "No one has liked you yet"}
            </h2>
            <p className="text-gray-400 mb-6">
              {activeTab === "liked"
                ? "Start browsing and like people you connect with!"
                : "Keep your profile updated and stay active to get more likes!"}
            </p>
            <button
              onClick={onBack}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors"
            >
              Continue Browsing
            </button>
          </div>
        )}

        {/* Likes Grid */}
        {!isLoading && !error && currentData.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {currentData.map((person) => (
              <div
                key={person._id}
                className="bg-gray-800 rounded-lg p-4 md:p-6 relative"
              >
                {/* Match Badge */}
                {isMutualMatch(person._id) && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                    MATCH!
                  </div>
                )}

                {/* Profile Picture */}
                <div className="text-center mb-4">
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-600 rounded-full mx-auto mb-3 flex items-center justify-center overflow-hidden">
                    {person.profilePic ? (
                      <img
                        src={person.profilePic}
                        alt={person.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl md:text-3xl">👤</span>
                    )}
                  </div>
                  <h3 className="text-lg md:text-xl font-bold mb-1">
                    {person.name}
                  </h3>
                </div>

                {/* Bio */}
                {person.bio && (
                  <div className="mb-4">
                    <p className="text-gray-300 text-sm text-center italic">
                      "{person.bio}"
                    </p>
                  </div>
                )}

                {/* Tags */}
                {person.tags && person.tags.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1 justify-center">
                      {person.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {person.tags.length > 3 && (
                        <span className="bg-gray-600 text-gray-300 text-xs px-2 py-1 rounded-full">
                          +{person.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Status */}
                <div className="text-center">
                  {isMutualMatch(person._id) ? (
                    <div className="text-green-400 text-sm font-semibold">
                      🎉 It's a Match!
                    </div>
                  ) : (
                    <div className="text-gray-400 text-sm">
                      {activeTab === "liked"
                        ? "Waiting for response..."
                        : "Likes you!"}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Likes;
