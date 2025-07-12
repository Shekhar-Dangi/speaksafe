# SafeSpeak 🗣️

A modern, anonymous mental health support platform that connects people facing similar struggles in a safe, judgment-free environment.

![SafeSpeak Banner](https://via.placeholder.com/800x200/1f2937/ffffff?text=SafeSpeak+-+Anonymous+Mental+Health+Support)

## 🌟 Features

### 🔒 **Anonymous Connections**
- Connect with others without revealing personal identity
- Share struggles and experiences safely
- Build meaningful support networks

### 💬 **Real-time Messaging**
- End-to-end encrypted conversations
- Anonymous chat with matched users
- Supportive community interactions

### 🎯 **Smart Matching**
- Algorithm-based matching by shared struggles
- Tinder-style interface for easy connections
- Filter by mental health challenges

### 📱 **Responsive Design**
- Mobile-first approach
- Seamless experience across all devices
- Touch-friendly interface

### 🎨 **Modern UI/UX**
- Clean, intuitive design
- Smooth animations and transitions
- Accessibility-focused interface

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/safespeak.git
   cd safespeak
   ```

2. **Navigate to frontend directory**
   ```bash
   cd frontend/safespeak
   ```

3. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

4. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

### 🖥️ **Running the Application**

#### **For Windows Users:**
```powershell
# Navigate to the correct directory
cd "C:\Users\YourUsername\path\to\safespeak\frontend\safespeak"

# Install dependencies (first time only)
npm install

# Start the development server
npm run dev
```

#### **For Mac/Linux Users:**
```bash
# Navigate to the correct directory
cd /path/to/safespeak/frontend/safespeak

# Install dependencies (first time only)
npm install

# Start the development server
npm run dev
```

#### **Important Notes:**
- ⚠️ **Make sure you're in the `frontend/safespeak` directory**, not the root `safespeak` directory
- 🔍 The `package.json` file should be in the directory where you run `npm` commands
- 🌐 The app will automatically open at `http://localhost:5173`
- 🔄 Hot reload is enabled - changes will automatically refresh the browser

#### **Troubleshooting:**
If you get an error like "Could not read package.json":
```bash
# Check if you're in the right directory
pwd  # (Mac/Linux) or cd (Windows)

# You should see: .../safespeak/frontend/safespeak
# If not, navigate to the correct directory:
cd frontend/safespeak
```

## 📁 Project Structure

```
safespeak/
├── frontend/
│   └── safespeak/
│       ├── public/
│       │   └── index.html
│       ├── src/
│       │   ├── components/
│       │   │   ├── Sidebar.jsx      # Messages sidebar component
│       │   │   └── Message.jsx      # Individual message component
│       │   ├── App.jsx              # Main application component
│       │   ├── Sign.jsx             # Authentication component
│       │   ├── Profile.jsx          # User profile management
│       │   ├── Messages.jsx         # Chat interface
│       │   ├── main.jsx             # Application entry point
│       │   └── index.css            # Global styles
│       ├── package.json
│       ├── vite.config.js
│       └── tailwind.config.js
└── README.md
```

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **JavaScript (ES6+)** - Modern JavaScript features

### Key Libraries
- **React Hooks** - State management and lifecycle
- **Unsplash API** - High-quality placeholder images
- **CSS Grid & Flexbox** - Responsive layouts

## 📱 Components Overview

### 🏠 **App.jsx**
Main application component that handles:
- Route management and view switching
- User navigation state
- Scroll-based user browsing
- Responsive layout orchestration

### 🔐 **Sign.jsx**
Authentication interface featuring:
- Google OAuth integration
- Facebook OAuth integration
- Responsive sign-in forms
- Loading states and error handling

### 👤 **Profile.jsx**
User profile management with:
- Mental health struggles tracking
- Anonymous profile customization
- Privacy controls
- Statistics dashboard

### 💬 **Messages.jsx** vs **Message.jsx** - Important Distinction

#### **`Messages.jsx`** (Plural) - Full Chat Interface
- **Location**: `src/Messages.jsx`
- **Purpose**: Complete chat screen/page component
- **Features**:
  - Full-screen chat interface
  - Message history display
  - Message input and sending
  - Chat header with user info
  - Back navigation
  - Real-time messaging simulation

#### **`Message.jsx`** (Singular) - Individual Message Preview
- **Location**: `src/components/Message.jsx`
- **Purpose**: Small preview component for the sidebar
- **Features**:
  - Shows conversation preview in sidebar
  - Displays last message snippet
  - Shows unread indicators
  - User avatar and timestamp
  - Click handler to open full chat

**Analogy**: Think of it like email:
- **`Messages.jsx`** = The full email reading/writing interface (like Gmail's main view)
- **`Message.jsx`** = The email preview in your inbox list (like the email snippets in Gmail's sidebar)

### 📋 **Sidebar.jsx**
Navigation and messages overview:
- Active conversations list
- Unread message indicators
- User status indicators
- Responsive sidebar behavior

## 🎨 Design System

### Color Palette
```css
/* Primary Colors */
--gray-900: #111827;    /* Main background */
--gray-800: #1f2937;    /* Card backgrounds */
--gray-700: #374151;    /* Secondary elements */

/* Accent Colors */
--blue-600: #2563eb;    /* Primary actions */
--green-500: #10b981;   /* Success states */
--red-500: #ef4444;     /* Destructive actions */
--yellow-400: #fbbf24;  /* Warning states */
```

### Typography
- **Headings**: Inter font family, bold weights
- **Body**: System font stack for optimal readability
- **Responsive**: Scales from mobile to desktop

### Spacing
- **Mobile**: Compact spacing (p-3, gap-2)
- **Desktop**: Generous spacing (p-6, gap-4)
- **Consistent**: 4px base unit system

## 🔧 Key Features Implementation

### 🎯 **Tinder-Style Matching**
```javascript
// Smooth scroll-based navigation
const handleWheel = (e) => {
  // Debounced scroll handling
  // Smooth card transitions
  // User index management
}
```

### 📱 **Responsive Design**
```css
/* Mobile-first approach */
.card {
  @apply w-full max-w-sm;     /* Mobile */
  @apply md:w-[70%];          /* Desktop */
}
```

### 🔄 **Smooth Animations**
```javascript
// CSS transitions with React state
const [isAnimating, setIsAnimating] = useState(false);
// Transform-based slide animations
// Opacity transitions for smooth UX
```

## 🚀 Development Guidelines

### Code Style
- **ES6+ Features**: Arrow functions, destructuring, template literals
- **React Hooks**: Functional components with hooks
- **Tailwind Classes**: Utility-first styling approach
- **Component Structure**: Single responsibility principle

### File Naming
- **Components**: PascalCase (e.g., `UserProfile.jsx`)
- **Utilities**: camelCase (e.g., `formatDate.js`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_ENDPOINTS.js`)

### State Management
- **Local State**: useState for component-specific state
- **Shared State**: Props drilling for simple data flow
- **Future**: Consider Context API or Redux for complex state

---

**Made with ❤️ for mental health awareness and support**

*SafeSpeak - Because everyone deserves to be heard*