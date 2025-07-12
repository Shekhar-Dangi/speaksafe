import { useState } from 'react'

/**
 * Profile Component - User Profile Management
 * 
 * Allows users to view and edit their anonymous profile information.
 * Features mental health struggles management, statistics display,
 * and privacy controls. Responsive design for all devices.
 * 
 * Features:
 * - Anonymous profile display with avatar and stats
 * - Mental health struggles management (add/remove)
 * - Edit mode for profile customization
 * - Privacy notice and data protection info
 * - Responsive design for mobile and desktop
 * - Connection and struggle statistics
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onBack - Callback to return to previous view
 * @returns {JSX.Element} The profile management interface
 */
function Profile({ onBack }) {
  // ==================== STATE MANAGEMENT ====================
  
  /** Controls whether the profile is in edit mode */
  const [isEditing, setIsEditing] = useState(false)
  
  /** Array of user's mental health struggles */
  const [struggles, setStruggles] = useState(['Anxiety', 'Depression', 'Social Anxiety'])
  
  /** Input value for adding new struggles */
  const [newStruggle, setNewStruggle] = useState('')

  // ==================== MOCK DATA ====================
  
  /**
   * Mock user profile data
   * In production, this would be fetched from user's account
   */
  const user = {
    handle: 'anonymous_soul',
    avatar: '😔',
    joinDate: 'January 2024',
    connectionsCount: 12
  }

  // ==================== EVENT HANDLERS ====================

  /**
   * Adds a new mental health struggle to the user's profile
   * Validates input and prevents duplicates
   */
  const handleAddStruggle = () => {
    if (newStruggle.trim() && !struggles.includes(newStruggle.trim())) {
      setStruggles([...struggles, newStruggle.trim()])
      setNewStruggle('')
    }
  }

  /**
   * Removes a mental health struggle from the user's profile
   * 
   * @param {string} struggleToRemove - The struggle to remove from the list
   */
  const handleRemoveStruggle = (struggleToRemove) => {
    setStruggles(struggles.filter(struggle => struggle !== struggleToRemove))
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
          onClick={() => setIsEditing(!isEditing)}
          className="text-blue-400 hover:text-blue-300 text-sm md:text-base"
        >
          {isEditing ? 'Save' : 'Edit'}
        </button>
      </header>

      <div className="max-w-2xl mx-auto p-4 md:p-6">
        {/* Profile Card */}
        <div className="bg-gray-800 rounded-lg p-4 md:p-6 mb-4 md:mb-6">
          <div className="text-center mb-4 md:mb-6">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-600 rounded-full mx-auto mb-3 md:mb-4 flex items-center justify-center text-3xl md:text-4xl">
              {user.avatar}
            </div>
            <h2 className="text-xl md:text-2xl font-bold mb-2">{user.handle}</h2>
            <p className="text-gray-400 text-sm md:text-base">Member since {user.joinDate}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
            <div className="bg-gray-700 rounded-lg p-3 md:p-4 text-center">
              <div className="text-xl md:text-2xl font-bold text-blue-400">{user.connectionsCount}</div>
              <div className="text-xs md:text-sm text-gray-400">Connections</div>
            </div>
            <div className="bg-gray-700 rounded-lg p-3 md:p-4 text-center">
              <div className="text-xl md:text-2xl font-bold text-green-400">{struggles.length}</div>
              <div className="text-xs md:text-sm text-gray-400">Shared Struggles</div>
            </div>
          </div>
        </div>

        {/* Mental Struggles Section */}
        <div className="bg-gray-800 rounded-lg p-4 md:p-6">
          <div className="flex justify-between items-center mb-3 md:mb-4">
            <h3 className="text-base md:text-lg font-semibold">Mental Struggles</h3>
            {isEditing && (
              <button className="text-blue-400 hover:text-blue-300 text-xs md:text-sm">
                + Add New
              </button>
            )}
          </div>

          {/* Struggles List */}
          <div className="space-y-2 md:space-y-3 mb-3 md:mb-4">
            {struggles.map((struggle, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-700 rounded-lg p-2 md:p-3">
                <span className="text-gray-200 text-sm md:text-base">{struggle}</span>
                {isEditing && (
                  <button
                    onClick={() => handleRemoveStruggle(struggle)}
                    className="text-red-400 hover:text-red-300 text-xs md:text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add New Struggle */}
          {isEditing && (
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <input
                type="text"
                value={newStruggle}
                onChange={(e) => setNewStruggle(e.target.value)}
                placeholder="Enter a new struggle..."
                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-sm md:text-base text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
              />
              <button
                onClick={handleAddStruggle}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors text-sm md:text-base"
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
            Your mental health struggles are shared anonymously to help you connect with others who understand your journey. You can edit or remove them at any time.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Profile