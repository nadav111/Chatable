import { register } from '/api/api.js';

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

  // Basic Validation
  if (!username || password.length < 4) {
    alert('Username must be valid and password at least 4 characters.');
    return;
  } else if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    alert('Please enter a valid email address.');
    return;
  } else if (password !== confirmPassword) {
    alert('Passwords do not match.');
    return;
  }

  setButtonLoading(registerBtn, true);

  try {
    // Assuming your api.js has a register function
    const response = await register(username, email, password);

    if (response.token) {
      alert('Registration successful! Please login.');
      window.location.href = '/login.html';
    } else {
      alert(response.error || 'Registration failed.');
      setButtonLoading(registerBtn, false);
    }
  } catch (err) {
    console.error('Registration error:', err);
    alert(err.message || 'Server error. Try again later.');
    setButtonLoading(registerBtn, false);
  }
}

function setButtonLoading(button, loading) {
  button.disabled = loading;
  button.style.opacity = loading ? '0.7' : '1';
  button.innerText = loading ? 'Creating account...' : 'Register';
}