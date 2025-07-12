/**
 * Message Component - Individual Message Preview
 * 
 * Displays a single conversation preview in the sidebar.
 * Shows user avatar, name, last message, timestamp, and unread status.
 * Responsive design with hover effects and click handling.
 * 
 * Features:
 * - User avatar with fallback
 * - Message preview with truncation
 * - Unread indicator badge
 * - Responsive sizing
 * - Hover effects
 * - Click handling for navigation
 * 
 * @param {Object} props - Component props
 * @param {Object} props.message - Message data object
 * @param {string} props.message.id - Unique message identifier
 * @param {string} props.message.name - Anonymous user name
 * @param {string} props.message.lastMessage - Preview of last message
 * @param {string} props.message.time - Formatted timestamp
 * @param {string} props.message.avatar - User avatar image URL
 * @param {boolean} props.message.unread - Unread status
 * @param {Function} props.onClick - Click handler for message selection
 * @returns {JSX.Element} The message preview component
 */
function Message({ message, onClick }) {
  return (
    <div 
      className="p-3 md:p-4 hover:bg-gray-700 cursor-pointer border-b border-gray-700 transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center space-x-2 md:space-x-3">
        {/* User Avatar with Fallback */}
        <div className="relative">
          {/* Primary avatar image */}
          <img 
            src={message.avatar} 
            alt={message.name}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover bg-gray-600"
            onError={(e) => {
              // Hide failed image and show fallback
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          
          {/* Fallback avatar (hidden by default) */}
          <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-600 rounded-full flex items-center justify-center text-base md:text-lg text-white hidden">
            👤
          </div>
          
          {/* Unread indicator badge */}
          {message.unread && (
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 md:w-3 md:h-3 bg-blue-500 rounded-full"></div>
          )}
        </div>
        
        {/* Message Content */}
        <div className="flex-1 min-w-0">
          {/* Header: Name and Timestamp */}
          <div className="flex justify-between items-center mb-1">
            <h3 className={`font-medium truncate text-sm md:text-base ${message.unread ? 'text-white' : 'text-gray-300'}`}>
              {message.name}
            </h3>
            <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
              {message.time}
            </span>
          </div>
          
          {/* Message Preview */}
          <p className={`text-xs md:text-sm truncate ${message.unread ? 'text-gray-200' : 'text-gray-400'}`}>
            {message.lastMessage}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Message
