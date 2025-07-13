import { useState, useEffect } from "react";
import { useUser } from "./context/UserProvider.jsx";

/**
 * Profile Component - User Profile Management
 *
 * Allows users to view and edit their profile information.
 * Features mental health tags management, statistics display,
 * and privacy controls. Responsive design for all devices.
 *
 * Features:
 * - Real user profile display with avatar and stats
 * - Mental health tags management (add/remove)
 * - Edit mode for profile customization
 * - Privacy notice and data protection info
 * - Responsive design for mobile and desktop
 * - Connection and tag statistics
 *
 * @param {Object} props - Component props
 * @param {Function} props.onBack - Callback to return to previous view
 * @returns {JSX.Element} The profile management interface
 */
function Profile({ onBack }) {
  // ==================== AUTHENTICATION ====================

  /** Get user data from context */
  const { user } = useUser();

  // ==================== STATE MANAGEMENT ====================

  /** Controls whether the profile is in edit mode */
  const [isEditing, setIsEditing] = useState(false);

  /** Array of user's mental health tags */
  const [tags, setTags] = useState(user?.tags || []);

  /** Input value for adding new tags */
  const [newTag, setNewTag] = useState("");

  /** User's bio */
  const [bio, setBio] = useState(user?.bio || "");

  /** Loading state for API calls */
  const [isLoading, setIsLoading] = useState(false);

  // ==================== EFFECTS ====================

  useEffect(() => {
    if (user) {
      setTags(user.tags || []);
      setBio(user.bio || "");
      console.log(user);
    }
  }, [user]);

  // ==================== EVENT HANDLERS ====================

  /**
   * Adds a new mental health tag to the user's profile
   * Validates input and prevents duplicates
   */
  const handleAddTag = async () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const updatedTags = [...tags, newTag.trim()];
      setTags(updatedTags);
      setNewTag("");

      if (!isEditing) {
        await updateTags(updatedTags);
      }
    }
  };

  /**
   * Removes a mental health tag from the user's profile
   *
   * @param {string} tagToRemove - The tag to remove from the list
   */
  const handleRemoveTag = async (tagToRemove) => {
    const updatedTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(updatedTags);

    if (!isEditing) {
      await updateTags(updatedTags);
    }
  };

  /**
   * Updates tags on the server
   * @param {Array} newTags - Array of tags to update
   */
  const updateTags = async (newTags) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URI}/users/me/tags`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ tags: newTags }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update tags");
      }
    } catch (error) {
      console.error("Error updating tags:", error);
      // Revert tags on error
      setTags(user?.tags || []);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Saves profile changes
   */
  const handleSave = async () => {
    try {
      setIsLoading(true);

      // Update tags
      await updateTags(tags);

      // Update bio if it changed
      if (bio !== (user?.bio || "")) {
        const response = await fetch(
          `${import.meta.env.VITE_API_URI}/users/me`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ bio }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update bio");
        }
      }

      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      // Revert changes on error
      setBio(user?.bio || "");
      setTags(user?.tags || []);
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== RENDER GUARD ====================

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading profile...</p>
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
        <h1 className="text-lg md:text-xl font-bold">Profile</h1>
        <button
          onClick={isEditing ? handleSave : () => setIsEditing(!isEditing)}
          className="text-blue-400 hover:text-blue-300 text-sm md:text-base disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : isEditing ? "Save" : "Edit"}
        </button>
      </header>

      <div className="max-w-2xl mx-auto p-4 md:p-6">
        {/* Profile Card */}
        <div className="bg-gray-800 rounded-lg p-4 md:p-6 mb-4 md:mb-6">
          <div className="text-center mb-4 md:mb-6">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-600 rounded-full mx-auto mb-3 md:mb-4 flex items-center justify-center overflow-hidden">
              {user.profilePic ? (
                <img
                  src={user.profilePic}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl md:text-4xl">👤</span>
              )}
            </div>
            <h2 className="text-xl md:text-2xl font-bold mb-2">{user.name}</h2>
            <p className="text-gray-400 text-sm md:text-base">
              Member since{" "}
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })
                : "Recently"}
            </p>
          </div>

          {/* Bio Section */}
          {isEditing ? (
            <div className="mb-4 md:mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell others about yourself..."
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm md:text-base text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 resize-none"
                rows={3}
              />
            </div>
          ) : bio ? (
            <div className="mb-4 md:mb-6 text-center">
              <p className="text-gray-300 text-sm md:text-base italic">
                "{bio}"
              </p>
            </div>
          ) : null}

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
            <div className="bg-gray-700 rounded-lg p-3 md:p-4 text-center">
              <div className="text-xl md:text-2xl font-bold text-blue-400">
                {user.matches?.length || 0}
              </div>
              <div className="text-xs md:text-sm text-gray-400">Matches</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-3 md:p-4 text-center">
              <div className="text-xl md:text-2xl font-bold text-green-400">
                {tags.length}
              </div>
              <div className="text-xs md:text-sm text-gray-400">Tags</div>
            </div>
          </div>
        </div>

        {/* Mental Health Tags Section */}
        <div className="bg-gray-800 rounded-lg p-4 md:p-6">
          <div className="flex justify-between items-center mb-3 md:mb-4">
            <h3 className="text-base md:text-lg font-semibold">
              Mental Health Tags
            </h3>
          </div>

          {/* Tags List */}
          <div className="space-y-2 md:space-y-3 mb-3 md:mb-4">
            {tags.length > 0 ? (
              tags.map((tag, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-700 rounded-lg p-2 md:p-3"
                >
                  <span className="text-gray-200 text-sm md:text-base">
                    {tag}
                  </span>
                  {isEditing && (
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="text-red-400 hover:text-red-300 text-xs md:text-sm"
                      disabled={isLoading}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-400">
                <p className="text-sm md:text-base">No tags added yet</p>
                {!isEditing && (
                  <p className="text-xs md:text-sm">
                    Add tags to help others find you
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Add New Tag */}
          {isEditing && (
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                placeholder="Enter a new tag..."
                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm md:text-base text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                disabled={isLoading}
              />
              <button
                onClick={handleAddTag}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors text-sm md:text-base disabled:opacity-50"
                disabled={isLoading}
              >
                Add
              </button>
            </div>
          )}
        </div>

        {/* Privacy Notice */}
        <div className="bg-gray-800 rounded-lg p-3 md:p-4 mt-4 md:mt-6">
          <div className="flex items-center space-x-2 text-yellow-400">
            <span>⚠️</span>
            <span className="text-xs md:text-sm">Privacy Notice</span>
          </div>
          <p className="text-gray-400 text-xs md:text-sm mt-2">
            Your mental health tags are used to help you connect with others who
            share similar experiences. You can edit or remove them at any time.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Profile;
