const getHostUrl = () => {
    const hostname =
        typeof window !== "undefined" ? window.location.hostname : "localhost";

    const isLocal =
        hostname === "localhost" ||
        hostname === "127.0.0.1" ||
        hostname === "::1" ||
        hostname.startsWith("192.168.") ||
        hostname.startsWith("10.");

    if (isLocal) return "http://localhost:3000";

    const protocol = window.location.protocol; // "http:" or "https:"
    return `${protocol}//${hostname}`;
};

const socket = io(getHostUrl(), {
    auth: (cb) => {
        cb({ token: localStorage.getItem("userToken") });
    },
    autoConnect: true,
});

export default socket;