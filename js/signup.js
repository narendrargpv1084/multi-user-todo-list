// js/signup.js

function signup() {
    const username = document.getElementById('signup-username').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;

    if (!username || !password || !confirmPassword) {
        showMessage('Please fill all fields!');
        return;
    }

    if (password !== confirmPassword) {
        showMessage('Passwords do not match!');
        return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];

    const userExists = users.some(user => user.username === username);
    if (userExists) {
        showMessage('Username already exists!');
        return;
    }

    users.push({ username, password });
    localStorage.setItem('users', JSON.stringify(users));

    showMessage('Signup successful! Redirecting to login...', false);
    setTimeout(() => window.location.href = 'login.html', 1500);
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
