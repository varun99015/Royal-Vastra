class AppError extends Error {
  constructor(message, statusCode, details) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

const notFound = (req, res, next) => {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
};

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal server error';

  const payload = {
    success: false,
    error: message,
  };

  if (err.details) payload.details = err.details;
  if (process.env.NODE_ENV === 'development') {
    payload.stack = err.stack;
  }

  res.status(statusCode).json(payload);
};

module.exports = { AppError, notFound, errorHandler };
