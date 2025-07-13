/**
 * Production Configuration
 *
 * Environment-specific settings and optimizations for production deployment.
 */

// ==================== PRODUCTION ENVIRONMENT VARIABLES ====================

export const PRODUCTION_CONFIG = {
  // API Configuration
  API_TIMEOUT: 15000, // Increased timeout for production
  API_RETRY_ATTEMPTS: 3,
  API_RETRY_DELAY: 1000,

  // Performance Settings
  ENABLE_SERVICE_WORKER: true,
  ENABLE_ANALYTICS: false, // Set to true when analytics are configured
  ENABLE_ERROR_REPORTING: false, // Set to true when error reporting is configured

  // Security Settings
  ENABLE_CSP: true,
  ENABLE_HSTS: true,
  SECURE_COOKIES: true,

  // Feature Flags
  ENABLE_PUSH_NOTIFICATIONS: false,
  ENABLE_OFFLINE_MODE: false,
  ENABLE_PWA: false,

  // Optimization Settings
  LAZY_LOAD_IMAGES: true,
  PREFETCH_ROUTES: true,
  COMPRESS_IMAGES: true,
};

// ==================== DEVELOPMENT OVERRIDES ====================

export const DEVELOPMENT_CONFIG = {
  ...PRODUCTION_CONFIG,
  API_TIMEOUT: 5000,
  ENABLE_SERVICE_WORKER: false,
  ENABLE_CSP: false,
  ENABLE_HSTS: false,
  SECURE_COOKIES: false,
  LAZY_LOAD_IMAGES: false,
  PREFETCH_ROUTES: false,
  COMPRESS_IMAGES: false,
};

// ==================== CURRENT CONFIG ====================

export const CONFIG = import.meta.env.PROD
  ? PRODUCTION_CONFIG
  : DEVELOPMENT_CONFIG;

// ==================== VALIDATION ====================

/**
 * Validates that all required environment variables are present
 * @returns {Object} Validation result
 */
export const validateEnvironment = () => {
  const required = ["VITE_API_URI"];
  const missing = required.filter((key) => !import.meta.env[key]);

  return {
    isValid: missing.length === 0,
    missing,
    warnings: [],
  };
};

// ==================== PERFORMANCE MONITORING ====================

/**
 * Performance monitoring utilities for production
 */
export const PerformanceMonitor = {
  /**
   * Measures and logs component render time
   * @param {string} componentName - Name of the component
   * @param {Function} renderFunction - Function to measure
   */
  measureRender: (componentName, renderFunction) => {
    if (!CONFIG.ENABLE_ANALYTICS) return renderFunction();

    const start = performance.now();
    const result = renderFunction();
    const end = performance.now();

    if (end - start > 16) {
      // Longer than one frame (60fps)
      console.warn(
        `Slow render detected in ${componentName}: ${end - start}ms`
      );
    }

    return result;
  },

  /**
   * Measures API call performance
   * @param {string} endpoint - API endpoint
   * @param {Promise} apiCall - API call promise
   */
  measureAPI: async (endpoint, apiCall) => {
    const start = performance.now();

    try {
      const result = await apiCall;
      const end = performance.now();

      if (end - start > 1000) {
        // Longer than 1 second
        console.warn(`Slow API call to ${endpoint}: ${end - start}ms`);
      }

      return result;
    } catch (error) {
      const end = performance.now();
      console.error(
        `Failed API call to ${endpoint} after ${end - start}ms:`,
        error
      );
      throw error;
    }
  },
};

// ==================== ERROR BOUNDARIES ====================

/**
 * Global error handler for production
 * @param {Error} error - The error that occurred
 * @param {Object} errorInfo - Additional error information
 */
export const handleGlobalError = (error, errorInfo) => {
  // Log error for debugging
  console.error("Global error caught:", error, errorInfo);

  // In production, send to error reporting service
  if (CONFIG.ENABLE_ERROR_REPORTING && import.meta.env.PROD) {
    // TODO: Integrate with error reporting service (e.g., Sentry)
    // errorReportingService.captureException(error, errorInfo);
  }

  // Return user-friendly error message
  return {
    message: "Something went wrong. Please refresh the page and try again.",
    shouldShowRetry: true,
    shouldShowReload: true,
  };
};
