import { login } from '../lib/api.js';
import { showError, showWarning } from "../lib/toast.js";

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  loginForm.addEventListener('submit', handleLoginSubmit);
});

async function handleLoginSubmit(e) {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const loginBtn = document.querySelector('.login-btn');

  if (!username || password.length < 4) {
    showWarning('Username or password is invalid.');
    return;
  }

  setButtonLoading(loginBtn, true);

  try {
    const response = await login(username, password);

    localStorage.setItem('userToken', response.token);
    window.location.href = './index.html';
  } catch (err) {
    console.error('Login error:', err);
    showError(err.message || 'Server error. Try again later.');
    setButtonLoading(loginBtn, false);
  }
}

function setButtonLoading(button, loading) {
  button.disabled = loading;
  button.style.opacity = loading ? '0.7' : '1';
  button.innerText = loading ? 'Logging in...' : 'Login';
}