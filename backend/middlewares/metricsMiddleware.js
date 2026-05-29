import metricsService from '../services/metrics.service.js';

const metricsMiddleware = (req, res, next) => {
  const start = Date.now();

  // Capture the original end function
  const originalEnd = res.end;

  // Override the end function
  res.end = function (...args) {
    const duration = (Date.now() - start) / 1000; // Convert to seconds
    const method = req.method;
    const route = req.route?.path || req.path || "unknown";
    const statusCode = res.statusCode;

    metricsService.recordHttpRequest(method, route, statusCode, duration);

    // Call the original end function
    originalEnd.apply(res, args);
  };

  next();
}

export default metricsMiddleware;
