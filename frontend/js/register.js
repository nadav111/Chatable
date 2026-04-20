import { register } from '../lib/api.js';
import { showError, showSuccess, showWarning } from "../lib/toast.js";

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    registerForm.addEventListener('submit', handleRegisterSubmit);
});

async function handleRegisterSubmit(e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const registerBtn = document.getElementById('registerSubmit');

    if (!username || password.length < 4) {
        showWarning('Username must be valid and password at least 4 characters.');
        return;
    }

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        showWarning('Please enter a valid email address.');
        return;
    }

    if (password !== confirmPassword) {
        showWarning('Passwords do not match.');
        return;
    }

    setButtonLoading(registerBtn, true);

    try {
        await register(username, email, password);
        showSuccess('Registration successful! Please login.');
        window.location.href = './login.html';
    } catch (err) {
        showError(err);
    } finally {
        setButtonLoading(registerBtn, false);
    }
}

function setButtonLoading(button, loading) {
    button.disabled = loading;
    button.style.opacity = loading ? '0.7' : '1';
    button.innerText = loading ? 'Creating account...' : 'Register';
}