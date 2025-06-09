// app.js with Firebase Realtime Database

// Get currentUser from LocalStorage (Login flow stays same)
let currentUser = localStorage.getItem('currentUser');

const loginLink = document.getElementById('login-link');
const signupLink = document.getElementById('signup-link');
const logoutLink = document.getElementById('logout-link');

// Firebase DB reference
const db = firebase.database();

if (currentUser) {
    loginLink.style.display = 'none';
    signupLink.style.display = 'none';
    logoutLink.style.display = 'inline';
    loadTasksFromFirebase();
} else {
    renderTasks([]);
}

function loadTasksFromFirebase() {
    db.ref('tasks/' + currentUser).once('value', (snapshot) => {
        const tasks = snapshot.val() || [];
        renderTasks(tasks);
    });
}

function saveTasksToFirebase(tasks) {
    db.ref('tasks/' + currentUser).set(tasks);
}

function renderTasks(tasksFromDb = []) {
    const tbody = document.querySelector('#todo-table tbody');
    tbody.innerHTML = '';

    const tasks = tasksFromDb;

    tasks.forEach((task, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td id="task-text-${index}">${task.text}</td>
            <td>${task.status}</td>
            <td><button onclick="updateStatus(${index})">Update</button></td>
            <td id="edit-cell-${index}">
                <button onclick="startEdit(${index})">Edit</button>
            </td>
            <td><button onclick="removeTask(${index})">Remove</button></td>
        `;
        tbody.appendChild(tr);
    });

    // Store in JS for editing
    window.currentTasks = tasks;
}

function addTask() {
    if (!currentUser) {
        showMessage('Please Login/SignUp first!');
        return;
    }

    const input = document.getElementById('new-task-input');
    const taskText = input.value.trim();

    if (taskText !== '') {
        const tasks = window.currentTasks || [];
        tasks.push({ text: taskText, status: 'Pending' });
        saveTasksToFirebase(tasks);
        input.value = '';
        renderTasks(tasks);
        showMessage('Task added successfully!', false);
    } else {
        showMessage('Please enter a task!');
    }
}

function updateStatus(index) {
    const tasks = window.currentTasks || [];
    tasks[index].status = tasks[index].status === 'Pending' ? 'Completed' : 'Pending';
    saveTasksToFirebase(tasks);
    renderTasks(tasks);
    showMessage('Task status updated!', false);
}

function startEdit(index) {
    const taskTextTd = document.getElementById(`task-text-${index}`);
    const editCell = document.getElementById(`edit-cell-${index}`);

    const currentText = taskTextTd.textContent;
    taskTextTd.innerHTML = `<input type="text" id="edit-input-${index}" value="${currentText}" style="width: 80%;">`;
    editCell.innerHTML = `<button onclick="saveEdit(${index})">Save</button>`;
}

function saveEdit(index) {
    const editInput = document.getElementById(`edit-input-${index}`);
    const newText = editInput.value.trim();

    const tasks = window.currentTasks || [];
    tasks[index].text = newText;
    saveTasksToFirebase(tasks);
    renderTasks(tasks);
    showMessage('Task updated successfully!', false);
}

function removeTask(index) {
    const tasks = window.currentTasks || [];
    tasks.splice(index, 1);
    saveTasksToFirebase(tasks);
    renderTasks(tasks);
    showMessage('Task removed successfully!', false);
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

function showMessage(text, isError = true) {
    const msgDiv = document.getElementById('message');
    msgDiv.style.display = 'block';
    msgDiv.textContent = text;
    msgDiv.style.backgroundColor = isError ? '#f8d7da' : '#d4edda';
    msgDiv.style.color = isError ? '#721c24' : '#155724';
    msgDiv.style.border = isError ? '1px solid #f5c6cb' : '1px solid #c3e6cb';
}
