import rateLimit from 'express-rate-limit';

/**
 * General API Rate Limiter
 * Applies to all API endpoints — prevents abuse and DDoS.
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15-minute window
  max: 200, // Max 200 requests per window per IP
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` legacy headers
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
});

/**
 * Strict Auth Rate Limiter
 * Applies to login/register/refresh endpoints — brute force protection.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15-minute window
  max: 10, // Max 10 auth attempts per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Only count failed attempts
  message: {
    success: false,
    message: 'Too many authentication attempts. Please wait 15 minutes before trying again.',
  },
});

/**
 * Upload Rate Limiter
 * Applies to file upload endpoints — prevents storage abuse.
 */
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1-hour window
  max: 10, // Max 10 uploads per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Upload limit reached. Please try again later.',
  },
});
