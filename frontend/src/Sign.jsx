import { useState } from "react";

/**
 * Sign Component - Authentication Interface
 *
 * Provides OAuth-based authentication for users to sign into SafeSpeak.
 * Features Google OAuth integration with loading states.
 * Responsive design with proper accessibility and user feedback.
 *
 * Features:
 * - Google OAuth integration
 * - Loading states and user feedback
 * - Responsive design for all devices
 * - Terms of service and privacy policy links
 * - Accessible button design with proper contrast
 *
 * @returns {JSX.Element} The authentication interface
 */
function Sign() {
  // ==================== STATE MANAGEMENT ====================

  /** Loading state to prevent multiple simultaneous sign-in attempts */
  const [isLoading, setIsLoading] = useState(false);

  // ==================== EVENT HANDLERS ====================

  /**
   * Handles Google OAuth sign-in process
   * Redirects to the backend OAuth endpoint
   */
  const handleGoogleSignIn = () => {
    setIsLoading(true);
    window.location.href = `${import.meta.env.VITE_API_URI}/auth/google`;
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-8">
      <div className="max-w-sm md:max-w-md w-full">
        <div className="bg-gray-800 rounded-lg shadow-xl p-6 md:p-8">
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              SafeSpeak
            </h1>
            <p className="text-gray-300 text-sm md:text-base">
              Connect anonymously with others
            </p>
          </div>

          <div className="space-y-3 md:space-y-4">
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full bg-white text-gray-900 font-semibold py-2.5 md:py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 text-sm md:text-base"
            >
              <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>
                {isLoading ? "Signing in..." : "Continue with Google"}
              </span>
            </button>
          </div>

          <div className="mt-6 md:mt-8 text-center">
            <p className="text-gray-400 text-xs md:text-sm">
              By signing in, you agree to our Terms of Service and Privacy
              Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sign;
