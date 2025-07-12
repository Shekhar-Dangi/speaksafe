import { useState } from 'react'

/**
 * Messages Component - Real-time Chat Interface
 * 
 * Provides a full-screen chat interface for anonymous conversations.
 * Features message history, real-time sending, and responsive design.
 * Includes privacy indicators and keyboard shortcuts.
 * 
 * Features:
 * - Real-time message display
 * - Message input with keyboard shortcuts
 * - User avatars and timestamps
 * - Responsive design for mobile and desktop
 * - Privacy and encryption indicators
 * - Back navigation to home view
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onBack - Callback to return to previous view
 * @returns {JSX.Element} The chat interface component
 */
function Messages({ onBack }) {
  // ==================== STATE MANAGEMENT ====================
  
  /** Current message being typed by the user */
  const [message, setMessage] = useState('')
  
  /** Array of all messages in the conversation */
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hey, I saw your profile and I'm also dealing with anxiety. Would love to chat.",
      sender: 'other',
      time: '2:30 PM',
      avatar: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=50&h=50&fit=crop&crop=face'
    },
    {
      id: 2,
      text: "Hi! Thanks for reaching out. It helps to know I'm not alone in this.",
      sender: 'me',
      time: '2:32 PM',
      avatar: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=50&h=50&fit=crop&crop=face'
    },
    {
      id: 3,
      text: "Absolutely! Some days are really tough. How do you usually cope?",
      sender: 'other',
      time: '2:35 PM',
      avatar: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=50&h=50&fit=crop&crop=face'
    },
    {
      id: 4,
      text: "I try meditation and journaling. Sometimes just talking helps a lot. What about you?",
      sender: 'me',
      time: '2:38 PM',
      avatar: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=50&h=50&fit=crop&crop=face'
    },
    {
      id: 5,
      text: "I've been trying breathing exercises. They help in the moment but it's hard to be consistent.",
      sender: 'other',
      time: '2:40 PM',
      avatar: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=50&h=50&fit=crop&crop=face'
    },
    {
      id: 6,
      text: "I totally get that. Consistency is the hardest part. Maybe we can check in with each other?",
      sender: 'me',
      time: '2:42 PM',
      avatar: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=50&h=50&fit=crop&crop=face'
    },
    {
      id: 7,
      text: "That sounds really helpful! I'd like that. It's nice to have someone who understands.",
      sender: 'other',
      time: '2:45 PM',
      avatar: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=50&h=50&fit=crop&crop=face'
    }
  ])

  // ==================== EVENT HANDLERS ====================

  /**
   * Handles sending a new message
   * Validates input, creates message object, updates state, and clears input
   */
  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: message,
        sender: 'me',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        avatar: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=50&h=50&fit=crop&crop=face'
      }
      setMessages([...messages, newMessage])
      setMessage('')
    }
  }

  /**
   * Handles keyboard shortcuts in the message input
   * Enter = Send message, Shift+Enter = New line
   * 
   * @param {KeyboardEvent} e - The keyboard event
   */
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="h-full bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 p-3 md:p-4 flex justify-between items-center border-b border-gray-700 flex-shrink-0">
        <div className="flex items-center space-x-2 md:space-x-3">
          <button 
            onClick={() => {
              console.log('Back button clicked')
              onBack && onBack()
            }}
            className="flex items-center space-x-1 md:space-x-2 text-gray-400 hover:text-white px-2 md:px-3 py-1 md:py-2 rounded-lg hover:bg-gray-700 transition-colors border border-gray-600"
          >
            <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-xs md:text-sm">Back</span>
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full overflow-hidden border border-gray-600">
              <img 
                src="https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=32&h=32&fit=crop&crop=face" 
                alt="Anonymous2"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden sm:block">
              <h2 className="font-semibold text-sm md:text-base">Anonymous2</h2>
              <p className="text-xs text-gray-400">Online</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-1 md:space-x-2">
          <button className="text-gray-400 hover:text-white p-1 md:p-2 text-sm md:text-base">
            📞
          </button>
          <button className="text-gray-400 hover:text-white p-1 md:p-2 text-sm md:text-base">
            ⚙️
          </button>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] sm:max-w-xs lg:max-w-md px-3 md:px-4 py-2 rounded-lg ${
              msg.sender === 'me' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-100'
            }`}>
              <div className="flex items-start space-x-2">
                {msg.sender === 'other' && (
                  <div className="w-5 h-5 md:w-6 md:h-6 rounded-full overflow-hidden flex-shrink-0 border border-gray-500">
                    <img 
                      src={msg.avatar} 
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-xs md:text-sm">{msg.text}</p>
                  <p className={`text-xs mt-1 ${
                    msg.sender === 'me' ? 'text-blue-200' : 'text-gray-400'
                  }`}>
                    {msg.time}
                  </p>
                </div>
                {msg.sender === 'me' && (
                  <div className="w-5 h-5 md:w-6 md:h-6 rounded-full overflow-hidden flex-shrink-0 border border-gray-500">
                    <img 
                      src={msg.avatar} 
                      alt="Me"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input - Fixed at bottom */}
      <div className="bg-gray-800 p-3 md:p-4 border-t border-gray-700 flex-shrink-0">
        <div className="flex space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 md:px-4 py-2 text-sm md:text-base text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-600 hover:bg-blue-700 px-4 md:px-6 py-2 rounded-lg transition-colors font-semibold text-sm md:text-base"
          >
            Send
          </button>
        </div>
        <div className="hidden md:flex items-center justify-between mt-2 text-xs text-gray-400">
          <p>Press Enter to send, Shift+Enter for new line</p>
          <p>End-to-end encrypted</p>
        </div>
      </div>
    </div>
  )
}

export default Messages