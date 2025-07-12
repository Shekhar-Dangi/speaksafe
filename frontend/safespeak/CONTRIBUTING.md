# Contributing to SafeSpeak 🤝

Thank you for your interest in contributing to SafeSpeak! This document provides guidelines and information for contributors to help maintain code quality and project consistency.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Style Guidelines](#code-style-guidelines)
- [Component Guidelines](#component-guidelines)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing Guidelines](#testing-guidelines)
- [Documentation Standards](#documentation-standards)

## 🤝 Code of Conduct

SafeSpeak is committed to providing a safe, inclusive, and welcoming environment for all contributors. We expect all participants to:

- **Be respectful** and considerate in all interactions
- **Be inclusive** and welcoming to people of all backgrounds
- **Be patient** with newcomers and those learning
- **Focus on mental health awareness** and sensitivity
- **Maintain confidentiality** regarding any personal information shared

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Git for version control
- Code editor (VS Code recommended)

### Development Setup

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/safespeak.git
   cd safespeak
   ```

2. **Install dependencies**
   ```bash
   cd frontend/safespeak
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 🔄 Development Workflow

### Branch Naming Convention

- **Feature branches**: `feature/description-of-feature`
- **Bug fixes**: `fix/description-of-bug`
- **Documentation**: `docs/description-of-changes`
- **Refactoring**: `refactor/description-of-changes`

### Example Workflow

```bash
# Create and switch to feature branch
git checkout -b feature/add-group-chat

# Make your changes
# ... code changes ...

# Stage and commit changes
git add .
git commit -m "feat: add group chat functionality"

# Push to your fork
git push origin feature/add-group-chat

# Create pull request on GitHub
```

## 🎨 Code Style Guidelines

### JavaScript/React Standards

#### File Organization
```javascript
// 1. Imports (external libraries first, then internal)
import { useState, useEffect } from 'react'
import ComponentName from './ComponentName'

// 2. Component documentation
/**
 * Component description
 * @param {Object} props - Component props
 * @returns {JSX.Element} Component JSX
 */

// 3. Component definition
function ComponentName({ prop1, prop2 }) {
  // 4. State declarations
  const [state, setState] = useState(initialValue)
  
  // 5. Event handlers
  const handleEvent = () => {
    // handler logic
  }
  
  // 6. JSX return
  return (
    <div>
      {/* Component JSX */}
    </div>
  )
}

// 7. Export
export default ComponentName
```

#### Naming Conventions

- **Components**: PascalCase (`UserProfile.jsx`)
- **Functions**: camelCase (`handleSubmit`)
- **Variables**: camelCase (`userName`)
- **Constants**: UPPER_SNAKE_CASE (`API_ENDPOINTS`)
- **CSS Classes**: kebab-case (via Tailwind utilities)

#### Code Formatting

```javascript
// ✅ Good: Destructured props
function Component({ user, onUpdate }) {
  return <div>{user.name}</div>
}

// ❌ Bad: Props object
function Component(props) {
  return <div>{props.user.name}</div>
}

// ✅ Good: Arrow functions for simple handlers
const handleClick = () => setCount(count + 1)

// ✅ Good: Function declarations for complex logic
function handleComplexOperation() {
  // complex logic here
}
```

### CSS/Tailwind Guidelines

#### Responsive Design Pattern
```javascript
// Mobile-first approach
className="text-sm md:text-base lg:text-lg"

// Consistent spacing
className="p-3 md:p-4 lg:p-6"

// Responsive layouts
className="flex flex-col md:flex-row"
```

#### Component Styling Structure
```javascript
return (
  <div className="container-styles">
    {/* Layout wrapper */}
    <div className="layout-styles">
      {/* Content wrapper */}
      <div className="content-styles">
        {/* Individual elements */}
        <button className="button-styles">
          Button Text
        </button>
      </div>
    </div>
  </div>
)
```

## 🧩 Component Guidelines

### Component Structure

Every component should follow this structure:

```javascript
/**
 * Component Name - Brief Description
 * 
 * Detailed description of what the component does,
 * its main features, and how it fits into the app.
 * 
 * Features:
 * - Feature 1
 * - Feature 2
 * - Feature 3
 * 
 * @param {Object} props - Component props
 * @param {Type} props.propName - Description of prop
 * @returns {JSX.Element} Description of returned JSX
 */
function ComponentName({ propName }) {
  // ==================== STATE MANAGEMENT ====================
  
  /** Description of state variable */
  const [state, setState] = useState(initialValue)
  
  // ==================== EVENT HANDLERS ====================
  
  /**
   * Description of what the handler does
   * @param {Type} param - Parameter description
   */
  const handleEvent = (param) => {
    // handler logic
  }
  
  // ==================== RENDER ====================
  
  return (
    <div className="component-container">
      {/* Component content */}
    </div>
  )
}

export default ComponentName
```

### Props Validation

While we don't use PropTypes in this project, document props clearly:

```javascript
/**
 * @param {Object} props - Component props
 * @param {string} props.title - The title to display
 * @param {Function} props.onClick - Click handler function
 * @param {boolean} [props.disabled=false] - Whether button is disabled
 * @param {Array<Object>} props.items - Array of item objects
 */
```

### State Management Guidelines

```javascript
// ✅ Good: Descriptive state names
const [isLoading, setIsLoading] = useState(false)
const [userMessages, setUserMessages] = useState([])
const [currentUserIndex, setCurrentUserIndex] = useState(0)

// ❌ Bad: Unclear state names
const [loading, setLoading] = useState(false)
const [data, setData] = useState([])
const [index, setIndex] = useState(0)

// ✅ Good: State updates with proper dependencies
useEffect(() => {
  fetchUserData()
}, [userId]) // Clear dependency

// ❌ Bad: Missing or incorrect dependencies
useEffect(() => {
  fetchUserData()
}, []) // Missing userId dependency
```

## 📝 Commit Message Guidelines

### Commit Message Format

```
type(scope): description

[optional body]

[optional footer]
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples

```bash
# Feature addition
git commit -m "feat(auth): add Google OAuth integration"

# Bug fix
git commit -m "fix(messages): resolve scroll animation glitch"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Style changes
git commit -m "style(components): improve responsive design"

# Refactoring
git commit -m "refactor(utils): extract common helper functions"
```

## 🔍 Pull Request Process

### Before Submitting

1. **Test your changes** thoroughly
2. **Update documentation** if needed
3. **Follow code style** guidelines
4. **Write descriptive** commit messages
5. **Ensure responsive** design works

### Pull Request Template

```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring
- [ ] Other (please describe)

## Testing
- [ ] Tested on desktop
- [ ] Tested on mobile
- [ ] Tested all user flows
- [ ] No console errors

## Screenshots
Include screenshots for UI changes.

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes
```

### Review Process

1. **Automated checks** must pass
2. **At least one review** from maintainer
3. **All conversations** must be resolved
4. **No merge conflicts** with main branch

## 🧪 Testing Guidelines

### Manual Testing Checklist

#### Responsive Design
- [ ] Mobile (320px - 768px)
- [ ] Tablet (768px - 1024px)
- [ ] Desktop (1024px+)

#### User Flows
- [ ] Sign-in process
- [ ] User browsing (scroll/click navigation)
- [ ] Message sending/receiving
- [ ] Profile editing
- [ ] Navigation between views

#### Browser Compatibility
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Component Testing

```javascript
// Example test structure (when implementing tests)
describe('ComponentName', () => {
  test('renders correctly', () => {
    // Test implementation
  })
  
  test('handles user interaction', () => {
    // Test implementation
  })
  
  test('displays error states', () => {
    // Test implementation
  })
})
```

## 📚 Documentation Standards

### Code Comments

#### Component Documentation
```javascript
/**
 * Component Name - Brief Description
 * 
 * Detailed description explaining:
 * - What the component does
 * - How it fits into the application
 * - Key features and functionality
 * 
 * Features:
 * - List key features
 * - Include important behaviors
 * - Mention responsive aspects
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Prop description
 * @returns {JSX.Element} Return description
 */
```

#### Function Documentation
```javascript
/**
 * Function description explaining what it does
 * 
 * @param {Type} paramName - Parameter description
 * @returns {Type} Return value description
 */
const functionName = (paramName) => {
  // Function implementation
}
```

#### Inline Comments
```javascript
// ==================== SECTION HEADERS ====================

/** Single line state description */
const [state, setState] = useState(value)

// Explain complex logic
if (complexCondition) {
  // Why this condition exists
  doSomething()
}
```

### README Updates

When adding features, update the README.md:

1. **Features section** - Add new functionality
2. **Installation** - Update if dependencies change
3. **Usage examples** - Show how to use new features
4. **API documentation** - Document new props/methods

## 🐛 Issue Reporting

### Bug Reports

Include the following information:

```markdown
**Bug Description**
Clear description of the bug.

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected Behavior**
What you expected to happen.

**Screenshots**
Add screenshots if applicable.

**Environment**
- OS: [e.g. iOS, Windows]
- Browser: [e.g. chrome, safari]
- Version: [e.g. 22]
- Device: [e.g. iPhone6, Desktop]
```

### Feature Requests

```markdown
**Feature Description**
Clear description of the feature.

**Problem Statement**
What problem does this solve?

**Proposed Solution**
How should this feature work?

**Alternatives Considered**
Other solutions you've considered.

**Additional Context**
Any other context or screenshots.
```

## 🏷️ Release Process

### Version Numbering

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist

- [ ] All tests pass
- [ ] Documentation updated
- [ ] Version number bumped
- [ ] Changelog updated
- [ ] Release notes prepared

## 🤔 Questions and Support

### Getting Help

- **GitHub Discussions**: For general questions
- **GitHub Issues**: For bugs and feature requests
- **Code Review**: For implementation questions

### Mental Health Considerations

When working on SafeSpeak, please:

- **Be mindful** of mental health terminology
- **Use inclusive** language
- **Consider accessibility** for users with different needs
- **Respect privacy** and anonymity features
- **Test with empathy** for users in vulnerable states

## 🙏 Recognition

Contributors will be recognized in:

- **README.md** contributors section
- **Release notes** for significant contributions
- **GitHub contributors** page

Thank you for contributing to SafeSpeak and helping create a safer space for mental health support! 💙

---

**Remember**: Every contribution, no matter how small, makes a difference in someone's mental health journey.