import client from "prom-client";

// Create a registry for metrics
const register = new client.Registry();

// Default metrics (CPU, memory, etc.)
client.collectDefaultMetrics({ register });

// Custom metrics - HTTP
const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.1, 0.5, 1, 2, 5],
  registers: [register],
});

const httpRequestTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
  registers: [register],
});

// Custom metrics - Socket.IO
const socketConnections = new client.Gauge({
  name: "socket_io_connections",
  help: "Number of active Socket.IO connections",
  registers: [register],
});

const socketConnectionsTotal = new client.Counter({
  name: "socket_io_connections_total",
  help: "Total number of Socket.IO connections established",
  registers: [register],
});

const socketMessagesTotal = new client.Counter({
  name: "socket_io_messages_total",
  help: "Total number of Socket.IO messages",
  labelNames: ["event"],
  registers: [register],
});

// Custom metrics - Database
const dbQueryDuration = new client.Histogram({
  name: "db_query_duration_seconds",
  help: "Duration of database queries in seconds",
  labelNames: ["query_type"],
  buckets: [0.01, 0.05, 0.1, 0.5, 1],
  registers: [register],
});

const dbQueryErrors = new client.Counter({
  name: "db_query_errors_total",
  help: "Total number of database query errors",
  labelNames: ["query_type"],
  registers: [register],
});

// Custom metrics - Application Stats
const activeSessions = new client.Gauge({
  name: "active_sessions",
  help: "Number of active user sessions",
  registers: [register],
});

const messagesProcessed = new client.Counter({
  name: "messages_processed_total",
  help: "Total number of messages processed",
  labelNames: ["type"],
  registers: [register],
});

const chatsCreated = new client.Counter({
  name: "chats_created_total",
  help: "Total number of chats created",
  registers: [register],
});

const getStats = () => {
    return {
        timestamp: new Date().toISOString(),
        metrics: {
            http_requests_total: httpRequestTotal,
            socket_io_connections: socketConnections,
            messages_processed_total: messagesProcessed,
            chats_created_total: chatsCreated,
            active_sessions: activeSessions,
        }
    };
}

// Helper functions to record metrics
const recordHttpRequest = (method, route, statusCode, duration) => {
  httpRequestDuration
    .labels(method, route, statusCode)
    .observe(duration);
  httpRequestTotal.labels(method, route, statusCode).inc();
};

const recordSocketConnection = () => {
  socketConnections.inc();
  socketConnectionsTotal.inc();
};

const recordSocketDisconnection = () => {
  socketConnections.dec();
};

const recordSocketMessage = (event) => {
  socketMessagesTotal.labels(event).inc();
};

const recordDbQuery = (queryType, duration, error = false) => {
  dbQueryDuration.labels(queryType).observe(duration);
  if (error) {
    dbQueryErrors.labels(queryType).inc();
  }
};

const setActiveSessions = (count) => {
  activeSessions.set(count);
};

const recordMessage = (type = "general") => {
  messagesProcessed.labels(type).inc();
};

const recordChatCreated = () => {
  chatsCreated.inc();
};

// Get metrics in Prometheus format
const getMetrics = () => {
  return register.metrics();
};

// Get metrics content type
const getMetricsContentType = () => {
  return register.contentType;
};

export {
  getStats,
  recordHttpRequest,
  recordSocketConnection,
  recordSocketDisconnection,
  recordSocketMessage,
  recordDbQuery,
  setActiveSessions,
  recordMessage,
  recordChatCreated,
  getMetrics,
  getMetricsContentType,
};
