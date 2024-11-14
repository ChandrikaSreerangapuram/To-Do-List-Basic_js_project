document.addEventListener("DOMContentLoaded", () => {
    const taskList = document.getElementById("taskList");
    const newTaskInput = document.getElementById("newTaskInput");
    const addTaskBtn = document.getElementById("addTaskBtn");
    const searchBar = document.getElementById("searchBar");
    const emptyMessage = document.getElementById("emptyMessage");

    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function renderTasks(filter = "all", search = "") {
        taskList.innerHTML = "";
        const filteredTasks = tasks
            .filter(task => (filter === "completed" ? task.completed : filter === "pending" ? !task.completed : true))
            .filter(task => task.name.toLowerCase().includes(search.toLowerCase()));
        emptyMessage.style.display = filteredTasks.length ? "none" : "block";

        filteredTasks.forEach(task => {
            const taskItem = document.createElement("li");
            taskItem.className = `task-item ${task.completed ? "completed" : ""}`;
            taskItem.draggable = true;
            taskItem.dataset.id = task.id;

            const taskText = document.createElement("span");
            taskText.textContent = task.name;
            taskText.contentEditable = task.isEditing ? "true" : "false";

            const toggleBtn = document.createElement("button");
            toggleBtn.textContent = task.completed ? "Undo" : "Complete";
            toggleBtn.addEventListener("click", () => toggleTaskCompletion(task.id));

            const editBtn = document.createElement("button");
            editBtn.textContent = task.isEditing ? "Save" : "Edit";
            editBtn.addEventListener("click", () => toggleEditTask(task.id));

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.addEventListener("click", () => deleteTask(task.id));

            taskItem.appendChild(taskText);
            taskItem.appendChild(toggleBtn);
            taskItem.appendChild(editBtn);
            taskItem.appendChild(deleteBtn);

            taskList.appendChild(taskItem);
        });
    }

    function addTask() {
        const taskName = newTaskInput.value.trim();
        if (taskName) {
            tasks.push({
                id: Date.now(),
                name: taskName,
                completed: false,
                isEditing: false,
            });
            saveTasks();
            renderTasks();
            newTaskInput.value = "";
        }
    }

    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    }

    function toggleTaskCompletion(id) {
        const task = tasks.find(task => task.id === id);
        if (task) task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }

    function toggleEditTask(id) {
        tasks = tasks.map(task => ({
            ...task,
            isEditing: task.id === id ? !task.isEditing : task.isEditing,
        }));
        saveTasks();
        renderTasks();
    }

    function handleSearch() {
        renderTasks(document.querySelector(".filter-buttons .active")?.id || "all", searchBar.value);
    }

    searchBar.addEventListener("input", handleSearch);
    addTaskBtn.addEventListener("click", addTask);
    document.getElementById("showAll").addEventListener("click", () => renderTasks("all"));
    document.getElementById("showCompleted").addEventListener("click", () => renderTasks("completed"));
    document.getElementById("showPending").addEventListener("click", () => renderTasks("pending"));
    
    // Initialize task list
    renderTasks();
});
