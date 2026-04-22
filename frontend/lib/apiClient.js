// Determine BASE_URL based on environment
const getBaseUrl = () => {
    const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
    
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1' || hostname.startsWith('192.168') || hostname.startsWith('10.')) {
        return 'http://localhost:3000/api';
    }
    
    return `http://${hostname}/api`;
};

const BASE_URL = getBaseUrl();

const handleResponse = async (response) => {
    const data = await response.json().catch(() => null);

    if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = './login.html';
        return;
    }

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