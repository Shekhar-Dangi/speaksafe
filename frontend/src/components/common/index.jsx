/**
 * Common UI Components
 *
 * Reusable UI components to maintain consistency and reduce duplication.
 */

import { LoadingSpinner, CloseIcon } from "../icons/index.jsx";

// ==================== LOADING STATES ====================

/**
 * Loading state component with spinner and message
 * @param {Object} props - Component props
 * @param {string} props.message - Loading message
 * @param {string} props.className - Additional CSS classes
 */
export const LoadingState = ({ message = "Loading...", className = "" }) => (
  <div className={`flex items-center justify-center p-8 ${className}`}>
    <div className="text-center">
      <LoadingSpinner className="h-12 w-12 mx-auto mb-4" />
      <p className="text-white">{message}</p>
    </div>
  </div>
);

/**
 * Inline loading spinner for buttons and small components
 * @param {Object} props - Component props
 * @param {string} props.size - Size variant ('sm', 'md', 'lg')
 */
export const LoadingSpinnerInline = ({ size = "md" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return <LoadingSpinner className={sizeClasses[size]} />;
};

// ==================== ERROR STATES ====================

/**
 * Error state component with retry functionality
 * @param {Object} props - Component props
 * @param {string} props.message - Error message
 * @param {Function} props.onRetry - Retry callback function
 * @param {string} props.retryText - Retry button text
 * @param {string} props.className - Additional CSS classes
 */
export const ErrorState = ({
  message,
  onRetry,
  retryText = "Try Again",
  className = "",
}) => (
  <div className={`text-center p-4 ${className}`}>
    <p className="text-red-400 mb-4">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition-colors text-white"
      >
        {retryText}
      </button>
    )}
  </div>
);

/**
 * Dismissible error notification
 * @param {Object} props - Component props
 * @param {string} props.message - Error message
 * @param {Function} props.onDismiss - Dismiss callback
 */
export const ErrorNotification = ({ message, onDismiss }) => (
  <div className="mb-3 p-2 bg-red-500/20 border border-red-500/30 rounded text-red-300 text-sm">
    {message}
    {onDismiss && (
      <button
        onClick={onDismiss}
        className="float-right text-red-400 hover:text-red-300"
      >
        <CloseIcon className="w-4 h-4" />
      </button>
    )}
  </div>
);

// ==================== EMPTY STATES ====================

/**
 * Empty state component for when no data is available
 * @param {Object} props - Component props
 * @param {string} props.message - Main message
 * @param {string} props.subtitle - Optional subtitle
 * @param {Function} props.onAction - Optional action callback
 * @param {string} props.actionText - Action button text
 * @param {string} props.className - Additional CSS classes
 */
export const EmptyState = ({
  message,
  subtitle,
  onAction,
  actionText = "Refresh",
  className = "",
}) => (
  <div className={`text-center p-8 ${className}`}>
    <p className="text-gray-400 mb-2">{message}</p>
    {subtitle && <p className="text-sm text-gray-500 mb-4">{subtitle}</p>}
    {onAction && (
      <button
        onClick={onAction}
        className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg transition-colors text-white"
      >
        {actionText}
      </button>
    )}
  </div>
);

// ==================== AVATAR COMPONENT ====================

/**
 * User avatar component with fallback
 * @param {Object} props - Component props
 * @param {string} props.src - Avatar image URL
 * @param {string} props.alt - Alt text
 * @param {string} props.size - Size variant ('sm', 'md', 'lg', 'xl')
 * @param {string} props.fallback - Fallback character/emoji
 * @param {string} props.className - Additional CSS classes
 */
export const Avatar = ({
  src,
  alt = "User avatar",
  size = "md",
  fallback = "👤",
  className = "",
}) => {
  const sizeClasses = {
    sm: "w-6 h-6 text-sm",
    md: "w-10 h-10 text-lg",
    lg: "w-12 h-12 text-xl",
    xl: "w-20 h-20 text-3xl",
  };

  return (
    <div
      className={`bg-gray-600 rounded-full flex items-center justify-center overflow-hidden ${sizeClasses[size]} ${className}`}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "flex";
          }}
        />
      ) : null}
      <span
        className={`${
          src ? "hidden" : "flex"
        } items-center justify-center w-full h-full`}
      >
        {fallback}
      </span>
    </div>
  );
};

// ==================== BUTTON COMPONENTS ====================

/**
 * Primary action button with loading state
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Button content
 * @param {boolean} props.loading - Loading state
 * @param {boolean} props.disabled - Disabled state
 * @param {string} props.variant - Button variant ('primary', 'secondary', 'danger')
 * @param {string} props.size - Button size ('sm', 'md', 'lg')
 * @param {Function} props.onClick - Click handler
 * @param {string} props.className - Additional CSS classes
 */
export const Button = ({
  children,
  loading = false,
  disabled = false,
  variant = "primary",
  size = "md",
  onClick,
  className = "",
  ...props
}) => {
  const baseClasses =
    "font-semibold rounded-lg transition-all duration-300 flex items-center justify-center";

  const variantClasses = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white",
    danger: "bg-red-500 hover:bg-red-600 text-white",
    success: "bg-green-500 hover:bg-green-600 text-white",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  const isDisabled = disabled || loading;

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <>
          <LoadingSpinnerInline size="sm" />
          <span className="ml-2">Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};
