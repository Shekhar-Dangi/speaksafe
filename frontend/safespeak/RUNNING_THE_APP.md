# 🖥️ **How to Run SafeSpeak**

## **For Windows Users:**
```powershell
# Navigate to the correct directory
cd "C:\Users\YourUsername\path\to\safespeak\frontend\safespeak"

# Install dependencies (first time only)
npm install

# Start the development server
npm run dev
```

## **For Mac/Linux Users:**
```bash
# Navigate to the correct directory
cd /path/to/safespeak/frontend/safespeak

# Install dependencies (first time only)
npm install

# Start the development server
npm run dev
```

## **Important Notes:**
- ⚠️ **Make sure you're in the `frontend/safespeak` directory**, not the root `safespeak` directory
- 🔍 The `package.json` file should be in the directory where you run `npm` commands
- 🌐 The app will automatically open at `http://localhost:5173`
- 🔄 Hot reload is enabled - changes will automatically refresh the browser

## **Troubleshooting:**
If you get an error like "Could not read package.json":
```bash
# Check if you're in the right directory
pwd  # (Mac/Linux) or cd (Windows)

# You should see: .../safespeak/frontend/safespeak
# If not, navigate to the correct directory:
cd frontend/safespeak
```

---

# 🧩 **Component Architecture Explanation**

## **Understanding Message vs Messages Components**

We have **two different components** that serve **different purposes**:

### **`Messages.jsx`** (Plural) - Full Chat Interface
- **Location**: `src/Messages.jsx`
- **Purpose**: Complete chat screen/page component
- **Features**:
  - Full-screen chat interface
  - Message history display
  - Message input and sending
  - Chat header with user info
  - Back navigation
  - Real-time messaging simulation

### **`Message.jsx`** (Singular) - Individual Message Preview
- **Location**: `src/components/Message.jsx`
- **Purpose**: Small preview component for the sidebar
- **Features**:
  - Shows conversation preview in sidebar
  - Displays last message snippet
  - Shows unread indicators
  - User avatar and timestamp
  - Click handler to open full chat

## **Analogy**
Think of it like email:
- **`Messages.jsx`** = The full email reading/writing interface (like Gmail's main view)
- **`Message.jsx`** = The email preview in your inbox list (like the email snippets in Gmail's sidebar)

## **Component Hierarchy**
```
App.jsx
├── Sign.jsx (authentication)
├── Profile.jsx (user profile)
└── Main Layout
    ├── Sidebar.jsx (contains multiple Message.jsx components)
    └── Messages.jsx (full chat interface)
```

## **Data Flow**
1. **Sidebar.jsx** renders multiple **Message.jsx** components (conversation previews)
2. When a **Message.jsx** is clicked, it triggers navigation to **Messages.jsx** (full chat)
3. **Messages.jsx** displays the complete conversation with message history and input

## **Why This Architecture?**
- **Separation of Concerns**: Each component has a single responsibility
- **Reusability**: Message.jsx can be reused in different contexts
- **Performance**: Only load full chat when needed
- **User Experience**: Quick preview in sidebar, detailed view when needed