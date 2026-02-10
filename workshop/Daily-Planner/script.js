let tasks = [];
let currentFilter = 'all';
let editingTaskId = null;

function init() {
    loadTasks();
    displayCurrentDate();
    renderTasks();
    updateStats();
}

function displayCurrentDate() {
    const today = new Date();
    document.getElementById('currentDate').textContent =
        today.toDateString();
}

function loadTasks() {
    const saved = localStorage.getItem('dailyPlannerTasks');
    if (saved) tasks = JSON.parse(saved);
}

function saveTasks() {
    localStorage.setItem('dailyPlannerTasks', JSON.stringify(tasks));
}

function addTask() {
    const title = taskTitle.value.trim();
    if (!title) return alert('Enter task title');

    const task = {
        id: editingTaskId ?? Date.now(),
        title,
        description: taskDescription.value,
        time: taskTime.value,
        priority: taskPriority.value,
        completed: false
    };

    if (editingTaskId) {
        tasks = tasks.map(t => t.id === editingTaskId ? task : t);
        editingTaskId = null;
        addTaskBtn.textContent = 'Add Task';
    } else {
        tasks.push(task);
    }

    saveTasks();
    clearForm();
    renderTasks();
    updateStats();
}

function renderTasks() {
    let list = tasks;

    if (currentFilter === 'completed')
        list = tasks.filter(t => t.completed);
    if (currentFilter === 'pending')
        list = tasks.filter(t => !t.completed);
    if (currentFilter === 'high')
        list = tasks.filter(t => t.priority === 'high');

    tasksList.innerHTML = list.length
        ? list.map(t => `
            <div class="task-card ${t.completed ? 'completed' : ''}">
                <strong>${t.title}</strong>
                <div>
                    <button onclick="toggleComplete(${t.id})">✓</button>
                    <button onclick="editTask(${t.id})">✎</button>
                    <button onclick="deleteTask(${t.id})">🗑</button>
                </div>
            </div>
        `).join('')
        : `<p>No tasks found</p>`;
}

function toggleComplete(id) {
    tasks = tasks.map(t =>
        t.id === id ? {...t, completed: !t.completed} : t
    );
    saveTasks();
    renderTasks();
    updateStats();
}

function editTask(id) {
    const t = tasks.find(t => t.id === id);
    taskTitle.value = t.title;
    taskDescription.value = t.description;
    taskTime.value = t.time;
    taskPriority.value = t.priority;
    editingTaskId = id;
    addTaskBtn.textContent = 'Update Task';
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
    updateStats();
}

function filterTasks(type, e) {
    currentFilter = type;
    document.querySelectorAll('.filter-btn')
        .forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    renderTasks();
}

function updateStats() {
    totalTasks.textContent = tasks.length;
    completedTasks.textContent = tasks.filter(t => t.completed).length;
    pendingTasks.textContent = tasks.filter(t => !t.completed).length;
}

function clearForm() {
    taskTitle.value = '';
    taskDescription.value = '';
    taskTime.value = '';
    taskPriority.value = 'medium';
}

init();
