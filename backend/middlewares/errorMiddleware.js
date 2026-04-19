// errorMiddleware.js
const errorMiddleware = (err, req, res, next) => {
  console.error(err); // log the error for debugging
 
  const msg = err.message || "Server Error";
  console.log("Error message:", msg);

   if (err.status === 401) {
    return res.status(401).json({
      success: false,
      error: err.message || "Unauthorized"
    });
  }

  if (msg.includes("not found")) {
    return res.status(404).json({
      success: false,
      error: msg
    });
  }

  // Default to 500 server error
  return res.status(err.status || 500).json({
    success: false,
    error: err.message || "Server Error"
  });
};

export default errorMiddleware;