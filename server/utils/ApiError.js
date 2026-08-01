/**
 * Custom Operational Error Class for DevTier Platform
 * Ensures standardized HTTP error structures across Express Controllers
 */
class ApiError extends Error {
  /**
   * @param {number} statusCode - HTTP status code (4xx, 5xx)
   * @param {string} message - Human-readable error message
   * @param {Array} errors - Detailed array of field/validation errors
   * @param {string} stack - Optional stack trace override
   */
  constructor(statusCode, message = 'An unexpected error occurred', errors = [], stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.success = false;
    this.errors = errors;
    this.isOperational = true;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  static badRequest(message = 'Bad Request', errors = []) {
    return new ApiError(400, message, errors);
  }

  static unauthorized(message = 'Unauthorized access') {
    return new ApiError(401, message);
  }

  static forbidden(message = 'Access forbidden') {
    return new ApiError(403, message);
  }

  static notFound(message = 'Resource not found') {
    return new ApiError(404, message);
  }

  static conflict(message = 'Resource conflict') {
    return new ApiError(409, message);
  }

  static unprocessable(message = 'Unprocessable Entity', errors = []) {
    return new ApiError(422, message, errors);
  }

  static internal(message = 'Internal Server Error') {
    return new ApiError(500, message);
  }
}

export default ApiError;
