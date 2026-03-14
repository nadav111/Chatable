const BASE_URL = 'http://localhost:3000';

// Handle API responses
const handleResponse = async (response) => {
    const data = await response.json().catch(() => null);

    if (!response.ok) {
        const errorMessage = data?.error || 'Something went wrong';
        throw new Error(errorMessage);
    }

    return data;
};

// Helper to get headers with token
const getHeaders = () => {
    const token = localStorage.getItem("userToken"); // your JWT
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // send token in headers
    };
};

// GET request
const getData = async (endpoint) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: getHeaders(),
    });

    return handleResponse(response);
};

// POST request
const postData = async (endpoint, body) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(body),
    });

    return handleResponse(response);
};

export { getData, postData };