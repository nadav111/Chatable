import { login } from '../api/api.js';

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
    alert('Username or password is invalid.');
    return;
  }

  setButtonLoading(loginBtn, true);

  try {
    const response = await login(username, password);

    console.log(response);

    if (response.token) {
      localStorage.setItem('userToken', response.token);
      window.location.href = 'home.html';
    } else {
      // alert only the error message from server
      alert(response.error || 'Login failed.');
      setButtonLoading(loginBtn, false);
    }
  } catch (err) {
    console.error('Login error:', err);
    alert(err.message || 'Server error. Try again later.');
    setButtonLoading(loginBtn, false);
  }
}

function setButtonLoading(button, loading) {
  button.disabled = loading;
  button.style.opacity = loading ? '0.7' : '1';
  button.innerText = loading ? 'Logging in...' : 'Login';
}