// js/login.js

function login() {
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;

    if (!username || !password) {
        showMessage('Please fill all fields!');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];

    const validUser = users.find(user => user.username === username && user.password === password);
    if (validUser) {
        showMessage('Login successful! Redirecting...', false);
        setTimeout(() => {
            localStorage.setItem('currentUser', username);
            window.location.href = 'index.html';
        }, 1500);
    } else {
        showMessage('Invalid username or password!');
    }
}

// Show message on screen
function showMessage(text, isError = true) {
    const msgDiv = document.getElementById('message');
    msgDiv.style.display = 'block';
    msgDiv.textContent = text;
    msgDiv.style.backgroundColor = isError ? '#f8d7da' : '#d4edda';
    msgDiv.style.color = isError ? '#721c24' : '#155724';
    msgDiv.style.border = isError ? '1px solid #f5c6cb' : '1px solid #c3e6cb';
}
