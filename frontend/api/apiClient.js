const BASE_URL = 'http://localhost:3000';

const handleResponse = async (response) => {
    const data = await response.json().catch(() => null);

    if (!response.ok) {
        const errorMessage = data?.error || 'Something went wrong';
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

export { getData, postData };