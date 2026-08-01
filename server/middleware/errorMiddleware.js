import ApiError from '../utils/ApiError.js';

/**
 * Global Error Handling Middleware for Express
 * Prevents server crashes and guarantees structured, secure JSON error responses to the client.
 */
const errorMiddleware = (err, req, res, next) => {
  let error = err;

  // Handle non-ApiError exceptions (e.g. Mongoose validation, JWT invalid, CastError)
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || (error.name === 'ValidationError' ? 400 : 500);
    const message = error.message || 'Something went wrong';

    // Mongoose Duplicate Key Error
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue || {})[0] || 'field';
      error = ApiError.conflict(`Duplicate value entered for ${field}`);
    }
    // Mongoose Validation Error
    else if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors || {}).map((el) => el.message);
      error = ApiError.badRequest('Validation Failed', errors);
    }
    // Mongoose Cast Error (Invalid ObjectId)
    else if (error.name === 'CastError') {
      error = ApiError.notFound(`Invalid format for field: ${error.path}`);
    }
    // JsonWebToken Error
    else if (error.name === 'JsonWebTokenError') {
      error = ApiError.unauthorized('Invalid security token');
    }
    // Token Expired Error
    else if (error.name === 'TokenExpiredError') {
      error = ApiError.unauthorized('Security token has expired');
    }
    else {
      error = new ApiError(statusCode, message, error.errors || [], err.stack);
    }
  }

  const response = {
    success: false,
    message: error.message,
    ...(error.errors && error.errors.length > 0 && { errors: error.errors }),
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  };

  // Log non-operational / critical errors in production
  if (process.env.NODE_ENV !== 'test' && !error.isOperational) {
    console.error('[CRITICAL UNHANDLED ERROR]:', err);
  }

  return res.status(error.statusCode || 500).json(response);
};

export default errorMiddleware;
