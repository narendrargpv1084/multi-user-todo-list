// js/app.js

let currentUser = localStorage.getItem('currentUser');

const loginLink = document.getElementById('login-link');
const signupLink = document.getElementById('signup-link');
const logoutLink = document.getElementById('logout-link');

if (currentUser) {
    loginLink.style.display = 'none';
    signupLink.style.display = 'none';
    logoutLink.style.display = 'inline';
    renderTasks();
} else {
    renderTasks();
}

function renderTasks() {
    const tbody = document.querySelector('#todo-table tbody');
    tbody.innerHTML = '';

    if (!currentUser) return;

    const tasks = JSON.parse(localStorage.getItem(`tasks_${currentUser}`)) || [];

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
}

function addTask() {
    if (!currentUser) {
        showMessage('Please Login/SignUp first!');
        return;
    }

    const input = document.getElementById('new-task-input');
    const taskText = input.value.trim();

    if (taskText !== '') {
        const tasks = JSON.parse(localStorage.getItem(`tasks_${currentUser}`)) || [];
        tasks.push({ text: taskText, status: 'Pending' });
        localStorage.setItem(`tasks_${currentUser}`, JSON.stringify(tasks));
        input.value = '';
        renderTasks();
        showMessage('Task added successfully!', false);
    } else {
        showMessage('Please enter a task!');
    }
}

function updateStatus(index) {
    const tasks = JSON.parse(localStorage.getItem(`tasks_${currentUser}`)) || [];
    tasks[index].status = tasks[index].status === 'Pending' ? 'Completed' : 'Pending';
    localStorage.setItem(`tasks_${currentUser}`, JSON.stringify(tasks));
    renderTasks();
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

    const tasks = JSON.parse(localStorage.getItem(`tasks_${currentUser}`)) || [];
    tasks[index].text = newText;
    localStorage.setItem(`tasks_${currentUser}`, JSON.stringify(tasks));

    renderTasks();
    showMessage('Task updated successfully!', false);
}

function removeTask(index) {
    const tasks = JSON.parse(localStorage.getItem(`tasks_${currentUser}`)) || [];
    tasks.splice(index, 1);
    localStorage.setItem(`tasks_${currentUser}`, JSON.stringify(tasks));
    renderTasks();
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
