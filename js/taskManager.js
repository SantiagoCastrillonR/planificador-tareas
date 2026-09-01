class TaskManager {
    constructor(currentId = 0) {
        this.tasks = [];
        this.currentId = currentId;
    }

    addTask(name, description, dueDate, status) {
        this.currentId++;
        
        this.tasks.push({
            id: this.currentId,
            name: name,
            description: description,
            dueDate: dueDate,
            status: 'PORHACER' 
        });

        this.save();
    }

    deleteTask(taskId) {
        const newTasks = [];
        for (let task of this.tasks) {
            if (task.id !== taskId) {
                newTasks.push(task);
            }
        }
        this.tasks = newTasks;
    }

    save() {
        const tasksJson = JSON.stringify(this.tasks);
        localStorage.setItem('tasks', tasksJson);
        
        const currentIdJson = String(this.currentId);
        localStorage.setItem('currentId', currentIdJson);
    }

    load() {
        if (localStorage.getItem('tasks')) {
            const tasksJson = localStorage.getItem('tasks');
            this.tasks = JSON.parse(tasksJson);
        }

        if (localStorage.getItem('currentId')) {
            const currentIdJson = localStorage.getItem('currentId');
            this.currentId = Number(currentIdJson);
        }
    }

    render() {
        let tareasHtml = '';

        this.tasks.forEach(tarea => {
            tareasHtml += `
                <div class="col-12 col-lg-6" data-task-id="${tarea.id}">
                    <div class="card h-100 shadow-sm border-secondary-subtle">
                        <div class="card-body d-flex flex-column">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <h3 class="h6 card-title fw-bold mb-0">${tarea.name}</h3>
                                <span class="badge bg-warning text-dark">${tarea.status}</span>
                            </div>
                            <p class="card-text text-secondary small mb-3">${tarea.description}</p>
                            <div class="d-flex justify-content-between align-items-center mt-auto">
                                <small class="text-muted fw-semibold">📅 ${tarea.dueDate}</small>
                                <div>
                                    <button class="btn btn-sm btn-outline-success btn-toggle">Marcar</button>
                                    <button class="btn btn-sm btn-outline-danger delete-button">Eliminar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        document.querySelector('#lista-tareas').innerHTML = tareasHtml;
    }
}