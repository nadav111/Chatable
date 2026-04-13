// Determine BASE_URL based on environment
const getBaseUrl = () => {
    // In production (deployed), use chatable.local/api
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
        return 'http://chatable.local/api';
    }
    // In development, use localhost:3000
    return 'http://localhost:3000';
};

const BASE_URL = getBaseUrl();
console.log(`API Client initialized with BASE_URL: ${BASE_URL}`);

const handleResponse = async (response) => {
    const data = await response.json().catch(() => null);

    if (!response.ok) {
        const errorMessage = data?.error || data?.message || 'Something went wrong';
        throw new Error(errorMessage);
    }

    return data;
};

const getData = async (endpoint, headers = {}) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...headers
        },
    });

    return handleResponse(response);
};

const postData = async (endpoint, body, headers = {}) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...headers
        },
        body: JSON.stringify(body),
    });

    return handleResponse(response);
};

const deleteData = async (endpoint, headers = {}) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            ...headers
        },
    });

    return handleResponse(response);
};

export { getData, postData, deleteData };