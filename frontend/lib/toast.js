const showToast = (message, type = 'info', duration = 4000) => {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;

    const icon = type === 'success' ? '✓' :
                 type === 'error'   ? '✕' :
                 type === 'warning' ? '⚠' : 'ℹ';

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <span class="toast-message">${message}</span>
        <button class="toast-close">×</button>
    `;

    toast.querySelector('.toast-close').addEventListener('click', () => toast.remove());
    toast.addEventListener('click', () => toast.remove());

    toastContainer.appendChild(toast);
    
    // Trigger animation by adding show class
    setTimeout(() => toast.classList.add('show'), 10);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentElement) toast.remove();
        }, 300);
    }, duration);
};

const showError = (error) => {
    const message = error?.message || error?.error || error || 'An error occurred';
    showToast(message, 'error');
};

const showSuccess = (message) => showToast(message, 'success');
const showInfo    = (message) => showToast(message, 'info');
const showWarning = (message) => showToast(message, 'warning');

export { showToast, showError, showSuccess, showInfo, showWarning };