/**
 * Higher-order function to wrap asynchronous Express route handlers.
 * Eliminates repetitive try-catch blocks and ensures unhandled promise rejections
 * are cleanly forwarded to the global error middleware.
 *
 * @param {Function} requestHandler - Asynchronous Express middleware/controller function
 * @returns {Function} Express middleware function
 */
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export default asyncHandler;
