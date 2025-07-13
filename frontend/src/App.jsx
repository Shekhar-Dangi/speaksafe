import { useState, useRef } from "react";
import Sidebar from "./components/Sidebar";
import Profile from "./Profile";
import Sign from "./Sign";
import Messages from "./Messages";
import Matches from "./Matches";
import Likes from "./Likes";
import { useUser } from "./context/UserProvider.jsx";

/**
 * SafeSpeak - Main Application Component
 *
 * This is the root component that manages the entire application state and routing.
 * It handles user navigation, authentication flow, and the main Tinder-style
 * user browsing experience with smooth scroll animations.
 *
 * Features:
 * - View management (sign-in, home, profile, messages)
 * - Tinder-style user card browsing with scroll navigation
 * - Responsive design for mobile and desktop
 * - Smooth animations and transitions
 * - Authentication-based routing
 *
 * @returns {JSX.Element} The main application interface
 */
function App() {
  // ==================== AUTHENTICATION ====================

  /** Get user authentication state from context */
  const { user, loading } = useUser();

  // ==================== STATE MANAGEMENT ====================

  /** Current active view in the application */
  const [currentView, setCurrentView] = useState("home"); // 'home', 'profile', 'messages', 'matches', 'likes'

  /** Controls visibility of user profile dropdown menu */
  const [showDropdown, setShowDropdown] = useState(false);

  /** Index of currently displayed user in the browsing interface */
  const [currentUserIndex, setCurrentUserIndex] = useState(0);

  /** Prevents multiple simultaneous animations during user transitions */
  const [isAnimating, setIsAnimating] = useState(false);

  /** Ref for managing scroll event debouncing timeout */
  const scrollTimeoutRef = useRef(null);

  /** Ref for tracking last scroll event timestamp to prevent rapid firing */
  const lastScrollTimeRef = useRef(0);

  // ==================== LOADING STATE ====================

  /** Show loading spinner while checking authentication */
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // ==================== AUTHENTICATION CHECK ====================

  /** Redirect to sign-in if user is not authenticated */
  if (!user) {
    return <Sign />;
  }

  // ==================== MOCK DATA ====================

  /**
   * Mock user data for development and demonstration
   * In production, this would be fetched from a backend API
   * Each user represents someone seeking mental health support
   */
  const users = [
    {
      id: 1,
      handle: "anonymous_soul",
      struggles: ["Anxiety", "Depression"],
      avatar:
        "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=150&h=150&fit=crop&crop=face",
      bio: "Looking for someone to talk to...",
      age: "24",
      location: "Online",
    },
    {
      id: 2,
      handle: "quiet_mind",
      struggles: ["Social Anxiety", "Loneliness"],
      avatar:
        "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=150&h=150&fit=crop&crop=face",
      bio: "Here to listen and share",
      age: "19",
      location: "Online",
    },
    {
      id: 3,
      handle: "hopeful_heart",
      struggles: ["Grief", "Loss"],
      avatar:
        "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=150&h=150&fit=crop&crop=face",
      bio: "Finding strength in vulnerability",
      age: "31",
      location: "Online",
    },
    {
      id: 4,
      handle: "peaceful_warrior",
      struggles: ["PTSD", "Trauma"],
      avatar:
        "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=150&h=150&fit=crop&crop=face",
      bio: "Healing one day at a time",
      age: "28",
      location: "Online",
    },
    {
      id: 5,
      handle: "gentle_soul",
      struggles: ["Eating Disorder", "Self-esteem"],
      avatar:
        "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=150&h=150&fit=crop&crop=face",
      bio: "Learning to love myself",
      age: "22",
      location: "Online",
    },
  ];

  // ==================== EVENT HANDLERS ====================

  /**
   * Toggles the visibility of the user profile dropdown menu
   */
  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };

  /**
   * Signs out the user and redirects to login
   * Also closes any open dropdown menus
   */
  const handleSignOut = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URI}/auth/logout`, {
        method: "GET",
        credentials: "include",
      });
      // The UserProvider will detect the logout and redirect to Sign component
      window.location.reload();
    } catch (error) {
      console.error("Logout error:", error);
    }
    setShowDropdown(false);
  };

  /**
   * Navigates to the user profile view
   * Closes the dropdown menu after navigation
   */
  const handleProfileView = () => {
    setCurrentView("profile");
    setShowDropdown(false);
  };

  /**
   * Returns user to the main home/browsing view
   * Used by Profile and Messages components
   */
  const handleBackHome = () => {
    setCurrentView("home");
  };

  /**
   * Navigates to the messages/chat view
   * Called from Sidebar or mobile navigation
   */
  const handleMessagesView = () => {
    setCurrentView("messages");
  };

  /**
   * Navigates to the matches view
   * Shows all mutual matches
   */
  const handleMatchesView = () => {
    setCurrentView("matches");
  };

  /**
   * Navigates to the likes view
   * Shows all users you liked and who liked you
   */
  const handleLikesView = () => {
    setCurrentView("likes");
  };

  /**
   * Advances to the next user in the browsing interface
   * Implements smooth animation with timing controls
   * Prevents multiple simultaneous animations
   */
  const handleNextUser = () => {
    if (isAnimating) return; // Prevent multiple animations

    setIsAnimating(true);

    // Start animation and change user after 150ms
    setTimeout(() => {
      setCurrentUserIndex((prev) => (prev + 1) % users.length);
    }, 150);

    // Reset animation state after 400ms (total animation duration)
    setTimeout(() => {
      setIsAnimating(false);
    }, 400);
  };

  /**
   * Goes back to the previous user in the browsing interface
   * Implements smooth animation with timing controls
   * Handles circular navigation (wraps to end when at beginning)
   */
  const handlePrevUser = () => {
    if (isAnimating) return; // Prevent multiple animations

    setIsAnimating(true);

    // Start animation and change user after 150ms
    setTimeout(() => {
      setCurrentUserIndex((prev) => (prev - 1 + users.length) % users.length);
    }, 150);

    // Reset animation state after 400ms (total animation duration)
    setTimeout(() => {
      setIsAnimating(false);
    }, 400);
  };

  /**
   * Handles mouse wheel events for user navigation
   * Implements debouncing to prevent rapid-fire scrolling
   * Only active on the home view and when not animating
   *
   * @param {WheelEvent} e - The wheel event object
   */
  const handleWheel = (e) => {
    // Only handle scroll on home view and when not animating
    if (currentView !== "home" || isAnimating) return;

    e.preventDefault(); // Prevent default scroll behavior
    e.stopPropagation(); // Stop event bubbling

    const now = Date.now();
    const timeSinceLastScroll = now - lastScrollTimeRef.current;

    // Clear any existing timeout to reset debounce
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Only process scroll if enough time has passed and scroll is significant
    if (timeSinceLastScroll > 100 && Math.abs(e.deltaY) > 30) {
      lastScrollTimeRef.current = now;

      // Debounce the scroll action with 50ms delay
      scrollTimeoutRef.current = setTimeout(() => {
        if (!isAnimating) {
          if (e.deltaY > 0) {
            handleNextUser(); // Scroll down = next user
          } else {
            handlePrevUser(); // Scroll up = previous user
          }
        }
      }, 50);
    }
  };

  // ==================== COMPUTED VALUES ====================

  /** Currently displayed user object */
  const currentUser = users[currentUserIndex];

  // ==================== RENDER LOGIC ====================

  // Conditional rendering based on current view state
  if (currentView === "profile") {
    return <Profile onBack={handleBackHome} />;
  }

  if (currentView === "matches") {
    return <Matches onBack={handleBackHome} />;
  }

  if (currentView === "likes") {
    return <Likes onBack={handleBackHome} />;
  }

  // Main application layout (home and messages views)
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 p-3 md:p-4 flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-bold">SafeSpeak</h1>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <button
            onClick={handleMatchesView}
            className="text-gray-300 hover:text-white px-3 py-2 rounded-lg transition-colors text-sm font-medium"
          >
            Matches
          </button>
          <button
            onClick={handleLikesView}
            className="text-gray-300 hover:text-white px-3 py-2 rounded-lg transition-colors text-sm font-medium"
          >
            Likes
          </button>
          <button
            onClick={handleMessagesView}
            className="text-gray-300 hover:text-white px-3 py-2 rounded-lg transition-colors text-sm font-medium"
          >
            Messages
          </button>
        </div>

        <div className="relative">
          <button
            onClick={handleProfileClick}
            className="w-8 h-8 md:w-10 md:h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors"
          >
            👤
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-40 md:w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50">
              <button
                onClick={handleProfileView}
                className="w-full px-3 md:px-4 py-2 text-left hover:bg-gray-700 text-sm md:text-base"
              >
                Profile
              </button>
              <button
                onClick={handleMatchesView}
                className="w-full px-3 md:px-4 py-2 text-left hover:bg-gray-700 text-sm md:text-base"
              >
                My Matches
              </button>
              <button
                onClick={handleLikesView}
                className="w-full px-3 md:px-4 py-2 text-left hover:bg-gray-700 text-sm md:text-base"
              >
                Likes
              </button>
              <button
                onClick={handleSignOut}
                className="w-full px-3 md:px-4 py-2 text-left hover:bg-gray-700 rounded-b-lg text-red-400 text-sm md:text-base"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="flex flex-col md:flex-row h-[calc(100vh-60px)] md:h-[calc(100vh-72px)]">
        {/* Sidebar - Hidden on mobile, shown on desktop */}
        <div className="hidden md:block">
          <Sidebar onMessageClick={handleMessagesView} />
        </div>

        {/* Main Content - Conditional Rendering */}
        <div className="flex-1 relative overflow-hidden">
          {currentView === "messages" ? (
            /* Messages View */
            <Messages onBack={handleBackHome} />
          ) : (
            /* Tinder-style User Cards View */
            <div
              className="h-full relative overflow-hidden bg-gray-900 flex items-center justify-center p-2 md:p-6"
              onWheel={handleWheel}
            >
              {/* Navigation Arrows */}
              <button
                onClick={handlePrevUser}
                className="absolute top-2 right-2 md:top-4 md:right-4 z-30 bg-black/30 hover:bg-black/50 p-1.5 md:p-2 rounded-full transition-all duration-300 backdrop-blur-sm"
                disabled={isAnimating}
              >
                <svg
                  className="w-3 h-3 md:w-4 md:h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              </button>

              <button
                onClick={handleNextUser}
                className="absolute top-8 right-2 md:top-12 md:right-4 z-30 bg-black/30 hover:bg-black/50 p-1.5 md:p-2 rounded-full transition-all duration-300 backdrop-blur-sm"
                disabled={isAnimating}
              >
                <svg
                  className="w-3 h-3 md:w-4 md:h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Card Container - Responsive width */}
              <div className="w-full max-w-sm md:w-[70%] md:max-w-none h-[90%] md:h-[85%] relative rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
                {/* Current Card */}
                <div
                  key={currentUser.id}
                  className={`absolute inset-0 transition-all duration-400 ease-in-out ${
                    isAnimating
                      ? "transform -translate-y-full opacity-0"
                      : "transform translate-y-0 opacity-100"
                  }`}
                >
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <img
                      src={currentUser.avatar.replace(
                        "w=150&h=150",
                        "w=800&h=1000"
                      )}
                      alt={currentUser.handle}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-4xl md:text-6xl text-white hidden">
                      👤
                    </div>
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>
                  </div>

                  {/* Content Overlay at Bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white z-20">
                    {/* User Info */}
                    <div className="mb-2 md:mb-3">
                      <h2 className="text-xl md:text-2xl font-bold mb-1">
                        {currentUser.handle}
                      </h2>
                      <p className="text-white/80 text-sm md:text-base">
                        {currentUser.age} • {currentUser.location}
                      </p>
                    </div>

                    {/* Bio */}
                    <div className="mb-2 md:mb-3">
                      <p className="text-white/90 text-xs md:text-sm italic">
                        "{currentUser.bio}"
                      </p>
                    </div>

                    {/* Struggles */}
                    <div className="mb-3 md:mb-4">
                      <div className="flex flex-wrap gap-1 md:gap-2">
                        {currentUser.struggles.map((struggle, index) => (
                          <span
                            key={index}
                            className="bg-white/20 text-white text-xs px-2 md:px-3 py-1 rounded-full backdrop-blur-sm"
                          >
                            {struggle}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2 md:space-x-3">
                      <button className="flex-1 bg-red-500/80 hover:bg-red-500 py-2 md:py-3 px-4 md:px-6 rounded-lg md:rounded-xl transition-all duration-300 font-semibold text-white backdrop-blur-sm border border-red-400/50 text-sm md:text-base">
                        Pass
                      </button>
                      <button className="flex-1 bg-green-500/80 hover:bg-green-500 py-2 md:py-3 px-4 md:px-6 rounded-lg md:rounded-xl transition-all duration-300 font-semibold text-white backdrop-blur-sm border border-green-400/50 text-sm md:text-base">
                        Connect
                      </button>
                    </div>
                  </div>

                  {/* User Counter */}
                  <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-black/30 px-2 md:px-3 py-1 rounded-full backdrop-blur-sm z-20">
                    <span className="text-xs text-white">
                      {currentUserIndex + 1} / {users.length}
                    </span>
                  </div>
                </div>

                {/* Next Card Preview (for smooth animation) */}
                <div
                  className={`absolute inset-0 transition-all duration-400 ease-in-out ${
                    isAnimating
                      ? "transform translate-y-0 opacity-100"
                      : "transform translate-y-full opacity-0"
                  }`}
                >
                  <div className="absolute inset-0">
                    <img
                      src={users[
                        (currentUserIndex + 1) % users.length
                      ].avatar.replace("w=150&h=150", "w=800&h=1000")}
                      alt={users[(currentUserIndex + 1) % users.length].handle}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>
                  </div>
                </div>
              </div>

              {/* Mobile Bottom Navigation */}
              <div className="md:hidden absolute bottom-4 left-4 right-4 flex justify-center space-x-3 z-30">
                <button
                  onClick={handleMatchesView}
                  className="bg-black/30 hover:bg-black/50 p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
                  title="Matches"
                >
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
                <button
                  onClick={handleLikesView}
                  className="bg-black/30 hover:bg-black/50 p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
                  title="Likes"
                >
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                    />
                  </svg>
                </button>
                <button
                  onClick={handleMessagesView}
                  className="bg-black/30 hover:bg-black/50 p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
                  title="Messages"
                >
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
