import Message from './Message.jsx'

/**
 * Sidebar Component - Messages Navigation Panel
 * 
 * Displays a list of active conversations in a sidebar layout.
 * Hidden on mobile devices, visible on desktop for better UX.
 * Shows message previews, unread indicators, and conversation stats.
 * 
 * Features:
 * - Responsive design (hidden on mobile, visible on desktop)
 * - Message preview with avatars and timestamps
 * - Unread message indicators
 * - Conversation statistics
 * - Click handlers for message navigation
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onMessageClick - Callback when a message is clicked
 * @returns {JSX.Element} The sidebar component
 */
function Sidebar({ onMessageClick }) {
  // ==================== MOCK DATA ====================
  
  /**
   * Mock conversation data for development
   * In production, this would be fetched from a backend API
   * Uses nature/animal images to maintain anonymity
   */
  const messages = [
    { 
      id: 1, 
      name: 'Anonymous1', 
      lastMessage: 'Hey there!', 
      time: '2m ago', 
      avatar: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=150&h=150&fit=crop&crop=center', 
      unread: true 
    },
    { 
      id: 2, 
      name: 'Anonymous2', 
      lastMessage: 'How are you feeling today?', 
      time: '5m ago', 
      avatar: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=150&h=150&fit=crop&crop=center', 
      unread: false 
    },
    { 
      id: 3, 
      name: 'Anonymous3', 
      lastMessage: 'Thanks for listening', 
      time: '10m ago', 
      avatar: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=150&h=150&fit=crop&crop=center', 
      unread: false 
    },
    { 
      id: 4, 
      name: 'Anonymous4', 
      lastMessage: 'I understand what you mean', 
      time: '1h ago', 
      avatar: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=150&h=150&fit=crop&crop=center', 
      unread: true 
    },
    { 
      id: 5, 
      name: 'Anonymous5', 
      lastMessage: 'Hope you feel better soon', 
      time: '2h ago', 
      avatar: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=150&h=150&fit=crop&crop=center', 
      unread: false 
    },
    { 
      id: 6, 
      name: 'Anonymous6', 
      lastMessage: 'We got this together', 
      time: '5h ago', 
      avatar: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=150&h=150&fit=crop&crop=center', 
      unread: false 
    },
  ]

  return (
    <div className="w-64 md:w-80 bg-gray-800 border-r border-gray-700 flex flex-col h-full">
      {/* Header */}
      <div className="p-3 md:p-4 border-b border-gray-700">
        <h2 className="text-base md:text-lg font-semibold text-white">Messages</h2>
        <p className="text-xs md:text-sm text-gray-400">Anonymous conversations</p>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto">
        {messages.map((message) => (
          <Message 
            key={message.id} 
            message={message} 
            onClick={() => onMessageClick && onMessageClick()}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="p-3 md:p-4 border-t border-gray-700">
        <div className="flex items-center justify-between text-xs md:text-sm text-gray-400">
          <span>{messages.filter(m => m.unread).length} unread</span>
          <span>{messages.length} total</span>
        </div>
      </div>
    </div>
  )
}

export default Sidebar