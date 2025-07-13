import { useState, useRef, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Profile from "./Profile";
import Sign from "./Sign";
import Messages from "./Messages";
import Matches from "./Matches";
import Likes from "./Likes";
import { useUser } from "./context/UserProvider.jsx";
import {
  VIEW_STATES,
  ANIMATION_TIMINGS,
  ERROR_MESSAGES,
  DEFAULT_VALUES,
} from "./constants/app.js";
import { userAPI } from "./utils/api.js";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  HeartIcon,
  ThumbsUpIcon,
  MessageIcon,
} from "./components/icons/index.jsx";
import {
  LoadingState,
  ErrorState,
  EmptyState,
  Avatar,
  Button,
} from "./components/common/index.jsx";

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
  const [currentView, setCurrentView] = useState(VIEW_STATES.HOME);

  /** Selected match for messaging */
  const [selectedMatchId, setSelectedMatchId] = useState(null);

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

  /** Array of users from the feed API */
  const [users, setUsers] = useState([]);

  /** Loading state for fetching users */
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

  /** Error state for user fetching */
  const [userError, setUserError] = useState(null);

  // ==================== EFFECTS ====================

  useEffect(() => {
    // Listen for custom navigation events from Matches component
    const handleNavigateToMessages = (event) => {
      setSelectedMatchId(event.detail.matchId);
      setCurrentView("messages");
    };

    window.addEventListener("navigateToMessages", handleNavigateToMessages);

    return () => {
      window.removeEventListener(
        "navigateToMessages",
        handleNavigateToMessages
      );
    };
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserFeed();
    }
  }, [user]);

  // ==================== API CALLS ====================

  /**
   * Fetches user feed from the API
   */
  const fetchUserFeed = async () => {
    try {
      setIsLoadingUsers(true);
      setUserError(null);

      const data = await userAPI.fetchFeed();
      setUsers(data.feed || []);
    } catch (error) {
      console.error("Error fetching user feed:", error);
      setUserError(ERROR_MESSAGES.USER_FEED_FAILED);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  /**
   * Likes a user (swipe right)
   * @param {string} userId - ID of the user to like
   */
  const likeUser = async (userId) => {
    try {
      const data = await userAPI.likeUser(userId);

      // If it's a match, you could show a notification
      if (data.match) {
        // TODO: Show match notification
        console.log("It's a match!", data);
      }

      // Move to next user
      handleNextUser();
    } catch (error) {
      console.error("Error liking user:", error);
      setUserError(ERROR_MESSAGES.LIKE_FAILED);
    }
  };

  /**
   * Passes on a user (swipe left)
   */
  const passUser = () => {
    // Just move to next user without liking
    handleNextUser();
  };

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
      await userAPI.logout();
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
    setCurrentView(VIEW_STATES.PROFILE);
    setShowDropdown(false);
  };

  /**
   * Returns user to the main home/browsing view
   * Used by Profile and Messages components
   */
  const handleBackHome = () => {
    setCurrentView(VIEW_STATES.HOME);
  };

  /**
   * Navigates to the messages/chat view
   * Called from Sidebar or mobile navigation
   */
  const handleMessagesView = () => {
    setCurrentView(VIEW_STATES.MESSAGES);
  };

  /**
   * Navigates to the matches view
   * Shows all mutual matches
   */
  const handleMatchesView = () => {
    setCurrentView(VIEW_STATES.MATCHES);
  };

  /**
   * Navigates to the likes view
   * Shows all users you liked and who liked you
   */
  const handleLikesView = () => {
    setCurrentView(VIEW_STATES.LIKES);
  };

  /**
   * Advances to the next user in the browsing interface
   * Implements smooth animation with timing controls
   * Prevents multiple simultaneous animations
   */
  const handleNextUser = () => {
    if (isAnimating) return; // Prevent multiple animations

    setIsAnimating(true);

    // Start animation and change user after delay
    setTimeout(() => {
      setCurrentUserIndex((prev) => (prev + 1) % users.length);
    }, ANIMATION_TIMINGS.CARD_CHANGE_DELAY);

    // Reset animation state after total duration
    setTimeout(() => {
      setIsAnimating(false);
    }, ANIMATION_TIMINGS.CARD_TRANSITION);
  };

  /**
   * Goes back to the previous user in the browsing interface
   * Implements smooth animation with timing controls
   * Handles circular navigation (wraps to end when at beginning)
   */
  const handlePrevUser = () => {
    if (isAnimating) return; // Prevent multiple animations

    setIsAnimating(true);

    // Start animation and change user after delay
    setTimeout(() => {
      setCurrentUserIndex((prev) => (prev - 1 + users.length) % users.length);
    }, ANIMATION_TIMINGS.CARD_CHANGE_DELAY);

    // Reset animation state after total duration
    setTimeout(() => {
      setIsAnimating(false);
    }, ANIMATION_TIMINGS.CARD_TRANSITION);
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
    if (currentView !== VIEW_STATES.HOME || isAnimating) return;

    e.preventDefault(); // Prevent default scroll behavior
    e.stopPropagation(); // Stop event bubbling

    const now = Date.now();
    const timeSinceLastScroll = now - lastScrollTimeRef.current;

    // Clear any existing timeout to reset debounce
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Only process scroll if enough time has passed and scroll is significant
    if (
      timeSinceLastScroll > ANIMATION_TIMINGS.SCROLL_THRESHOLD &&
      Math.abs(e.deltaY) > ANIMATION_TIMINGS.SCROLL_DELTA_THRESHOLD
    ) {
      lastScrollTimeRef.current = now;

      // Debounce the scroll action
      scrollTimeoutRef.current = setTimeout(() => {
        if (!isAnimating) {
          if (e.deltaY > 0) {
            handleNextUser(); // Scroll down = next user
          } else {
            handlePrevUser(); // Scroll up = previous user
          }
        }
      }, ANIMATION_TIMINGS.SCROLL_DEBOUNCE);
    }
  };

  // ==================== COMPUTED VALUES ====================

  /** Currently displayed user object */
  const currentUser = users.length > 0 ? users[currentUserIndex] : null;

  /** Whether we have users available to display */
  const hasUsers = users.length > 0;

  // ==================== RENDER LOGIC ====================

  // Conditional rendering based on current view state
  if (currentView === VIEW_STATES.PROFILE) {
    return <Profile onBack={handleBackHome} />;
  }

  if (currentView === VIEW_STATES.MATCHES) {
    return <Matches onBack={handleBackHome} />;
  }

  if (currentView === VIEW_STATES.LIKES) {
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
          {" "}
          <button
            onClick={handleProfileClick}
            className="w-8 h-8 md:w-10 md:h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors"
            aria-label="Profile menu"
          >
            {DEFAULT_VALUES.USER_AVATAR}
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
          <Sidebar />
        </div>

        {/* Main Content - Conditional Rendering */}
        <div className="flex-1 relative overflow-hidden">
          {currentView === VIEW_STATES.MESSAGES ? (
            /* Messages View */
            <Messages
              onBack={handleBackHome}
              selectedMatchId={selectedMatchId}
              hideSidebar={true}
            />
          ) : (
            /* Tinder-style User Cards View */
            <div
              className="h-full relative overflow-hidden bg-gray-900 flex items-center justify-center p-2 md:p-6"
              onWheel={handleWheel}
            >
              {/* Navigation Arrows - Only show when we have users */}
              {hasUsers && !isLoadingUsers && !userError && (
                <>
                  <button
                    onClick={handlePrevUser}
                    className="absolute top-2 right-2 md:top-4 md:right-4 z-30 bg-black/30 hover:bg-black/50 p-1.5 md:p-2 rounded-full transition-all duration-300 backdrop-blur-sm"
                    disabled={isAnimating}
                    aria-label="Previous user"
                  >
                    <ArrowUpIcon className="w-3 h-3 md:w-4 md:h-4 text-white" />
                  </button>

                  <button
                    onClick={handleNextUser}
                    className="absolute top-8 right-2 md:top-12 md:right-4 z-30 bg-black/30 hover:bg-black/50 p-1.5 md:p-2 rounded-full transition-all duration-300 backdrop-blur-sm"
                    disabled={isAnimating}
                    aria-label="Next user"
                  >
                    <ArrowDownIcon className="w-3 h-3 md:w-4 md:h-4 text-white" />
                  </button>
                </>
              )}

              {/* Card Container - Responsive width */}
              <div className="w-full max-w-sm md:w-[70%] md:max-w-none h-[90%] md:h-[85%] relative rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl">
                {/* Loading State */}
                {isLoadingUsers ? (
                  <LoadingState message="Finding amazing people..." />
                ) : userError ? (
                  /* Error State */
                  <ErrorState
                    message={userError}
                    onRetry={fetchUserFeed}
                    className="absolute inset-0 bg-gray-800 flex items-center justify-center"
                  />
                ) : !hasUsers ? (
                  /* No Users State */
                  <EmptyState
                    message="No more users to show right now."
                    onAction={fetchUserFeed}
                    actionText="Refresh"
                    className="absolute inset-0 bg-gray-800 flex items-center justify-center"
                  />
                ) : (
                  /* Current Card */
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
                        src={currentUser.profilePic}
                        alt={currentUser.handle}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-4xl md:text-6xl text-white hidden">
                        {DEFAULT_VALUES.USER_AVATAR}
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
                          {currentUser.tags.map((struggle, index) => (
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
                        <Button
                          onClick={passUser}
                          disabled={isAnimating}
                          variant="danger"
                          className="flex-1 bg-red-500/80 hover:bg-red-500 backdrop-blur-sm border border-red-400/50"
                        >
                          Pass
                        </Button>
                        <Button
                          onClick={() => likeUser(currentUser._id)}
                          disabled={isAnimating}
                          variant="success"
                          className="flex-1 bg-green-500/80 hover:bg-green-500 backdrop-blur-sm border border-green-400/50"
                        >
                          Connect
                        </Button>
                      </div>
                    </div>

                    {/* User Counter */}
                    <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-black/30 px-2 md:px-3 py-1 rounded-full backdrop-blur-sm z-20">
                      <span className="text-xs text-white">
                        {currentUserIndex + 1} / {users.length}
                      </span>
                    </div>
                  </div>
                )}

                {/* Next Card Preview (for smooth animation) - only show if we have users */}
                {hasUsers && !isLoadingUsers && !userError && (
                  <div
                    className={`absolute inset-0 transition-all duration-400 ease-in-out ${
                      isAnimating
                        ? "transform translate-y-0 opacity-100"
                        : "transform translate-y-full opacity-0"
                    }`}
                  >
                    <div className="absolute inset-0">
                      <img
                        src={currentUser.profilePic}
                        alt={
                          users[(currentUserIndex + 1) % users.length].handle
                        }
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Bottom Navigation */}
              <div className="md:hidden absolute bottom-4 left-4 right-4 flex justify-center space-x-3 z-30">
                <button
                  onClick={handleMatchesView}
                  className="bg-black/30 hover:bg-black/50 p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
                  title="Matches"
                  aria-label="View matches"
                >
                  <HeartIcon className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={handleLikesView}
                  className="bg-black/30 hover:bg-black/50 p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
                  title="Likes"
                  aria-label="View likes"
                >
                  <ThumbsUpIcon className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={handleMessagesView}
                  className="bg-black/30 hover:bg-black/50 p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
                  title="Messages"
                  aria-label="View messages"
                >
                  <MessageIcon className="w-5 h-5 text-white" />
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
