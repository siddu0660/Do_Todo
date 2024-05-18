    const taskInput = document.getElementById('task-input');
    const descriptionInput = document.getElementById('description-input');
    const dateInput = document.getElementById('date-task');
    const addTaskBtn = document.getElementById('add-task');
    const searchInput = document.getElementById('search-input');
    const taskList = document.getElementById('task-list');
    const totalTasksElement = document.getElementById('total-tasks');
    const completedTasksElement = document.getElementById('completed-tasks');
    const pendingTasksElement = document.getElementById('pending-tasks');
    
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    function updateAnalytics() 
    {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.completed).length;
        const pendingTasks = totalTasks - completedTasks;
        
        totalTasksElement.textContent = `Total Tasks: ${totalTasks}`;
        completedTasksElement.textContent = `Completed Tasks: ${completedTasks}`;
        pendingTasksElement.textContent = `Pending Tasks: ${pendingTasks}`;
    }
    
    function process(filteredTasks = tasks) 
    {
        filteredTasks.sort((a, b) => a.date - b.date);
        
        taskList.innerHTML = '';
    
        filteredTasks.forEach((task, index) => 
        {
            const li = document.createElement('li');
    
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.completed;
            checkbox.classList.add('task-checkbox');
            checkbox.addEventListener('change', () => 
            {
                tasks[index].completed = checkbox.checked;
                saveTasksToLocalStorage();
                updateAnalytics();
            });
    
            const taskInfoDiv = document.createElement('div');
            taskInfoDiv.classList.add('task-info');
    
            const taskTitleSpan = document.createElement('span');
            taskTitleSpan.classList.add('task-text');
            taskTitleSpan.textContent = task.title;
    
            const taskDescriptionP = document.createElement('p');
            taskDescriptionP.classList.add('task-description');
            taskDescriptionP.textContent = task.description;
    
            const taskDeadlineSpan = document.createElement('span');
            taskDeadlineSpan.classList.add('task-deadline');
            const taskDate = new Date(task.date);
            const formattedDate = `${taskDate.toLocaleDateString()} ${taskDate.toLocaleTimeString()}`;
            taskDeadlineSpan.innerHTML = `<span class="date-circle">${taskDate.getDate()}</span>`;
            
            const taskActionsDiv = document.createElement('div');
            taskActionsDiv.classList.add('task-actions');
    
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.addEventListener('click', () => editTask(index));
    
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => deleteTask(index));
    
            taskInfoDiv.appendChild(checkbox);
            taskInfoDiv.appendChild(taskTitleSpan);
            taskInfoDiv.appendChild(document.createElement('br')); // Line break for spacing
            taskInfoDiv.appendChild(taskDescriptionP);
    
            taskActionsDiv.appendChild(editButton);
            taskActionsDiv.appendChild(deleteButton);
            taskActionsDiv.appendChild(taskDeadlineSpan);
    
            li.appendChild(taskInfoDiv);
            li.appendChild(taskActionsDiv);
    
            taskList.appendChild(li);
        });
    
        updateAnalytics();
    }
    
    
    addTaskBtn.addEventListener('click', () => 
    {
        const taskTitle = taskInput.value.trim();
        const taskDescription = descriptionInput.value.trim();
        const taskDate = dateInput.value ? new Date(dateInput.value).getTime() : new Date().getTime();
        if (taskTitle) 
        {
            tasks.push({ title: taskTitle, description: taskDescription, completed: false, date: taskDate });
            taskInput.value = '';
            descriptionInput.value = '';
            saveTasksToLocalStorage();
            process();
            updateAnalytics();
        }
    });
    
    function editTask(index) 
    {
        const newTitle = prompt('Enter the new task title', tasks[index].title);
        const newDescription = prompt('Enter the new task description', tasks[index].description);
        const newDateTime = prompt('Enter the new task date and time (YYYY-MM-DD HH:MM)', new Date(tasks[index].date).toISOString().slice(0, -8));
        const newCompleted = confirm(`Mark as completed? (Current state: ${tasks[index].completed})`);
        if (newTitle !== null && newDescription !== null && newDateTime !== null) 
        {
            tasks[index].title = newTitle.trim();
            tasks[index].description = newDescription.trim();
            tasks[index].completed = newCompleted;
            tasks[index].date = new Date(newDateTime).getTime();
            saveTasksToLocalStorage();
            process();
            updateAnalytics();
        }
    }
    
    function deleteTask(index) 
    {
        tasks.splice(index, 1);
        saveTasksToLocalStorage();
        process();
        updateAnalytics();
    }
    
    searchInput.addEventListener('input', () => 
    {
        const searchTerm = searchInput.value.trim().toLowerCase();
        const filteredTasks = tasks.filter(task => task.title.toLowerCase().includes(searchTerm));
        process(filteredTasks);
        updateAnalytics(); 
    });
    
    function saveTasksToLocalStorage() 
    {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    function generateCalendar(month, year) 
    {
        const calendarDiv = document.getElementById("calendar");
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        const today = new Date().getDate();
        
        let table = "<table><tr><th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th></tr><tr>";
        for (let i = 0; i < firstDay; i++) 
        {
            table += "<td></td>";
        }
        
        let date = 1;
        for (let i = firstDay; date <= daysInMonth; i++) 
        {
            if (date === today && month === new Date().getMonth() && year === new Date().getFullYear()) 
            {
            table += "<td class='today'>" + date + "</td>";
            } 
            else 
            {
            table += "<td>" + date + "</td>";
            }
        
            if (i % 7 === 6) 
            {
            table += "</tr><tr>";
            }
        
            date++;
        }
        const lastDay = new Date(year, month, daysInMonth).getDay();
        for (let i = lastDay; i < 6; i++) 
        {
            table += "<td></td>";
        }
        table += "</tr></table>";
        calendarDiv.innerHTML = table;
    }
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    generateCalendar(currentMonth, currentYear);
    
    process();
    updateAnalytics();