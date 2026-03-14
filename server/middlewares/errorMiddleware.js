// errorMiddleware.js
const errorMiddleware = (err, req, res, next) => {
  console.error(err); // log the error for debugging

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      error: messages
    });
  }

  // Mongoose duplicate key error
  if (err.code && err.code === 11000) {
    const field = Object.keys(err.keyValue);
    return res.status(400).json({
      success: false,
      error: `Duplicate value for field: ${field}`
    });
  }

  // Mongoose cast error (invalid ObjectId, etc.)
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      error: `Invalid ${err.path}: ${err.value}`
    });
  }

  // Default to 500 server error
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Server Error"
  });
};

export default errorMiddleware;