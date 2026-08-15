/**
 * Centralized User-Friendly Error Handler Middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error(`[Server Error] ${err.stack || err.message}`);

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Translation service is temporarily unavailable. Please try again.';

  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Resource not found or invalid format.';
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(val => val.message).join(', ');
  }

  res.status(statusCode).json({
    success: false,
    message: message,
  });
};

module.exports = errorHandler;
