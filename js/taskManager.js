class TaskManager {
    constructor(currentId = 0) {
        this.tasks = [];
        this.currentId = currentId;
    }

    // NUEVO: Recibe startDate y dueDate (o "Sin fecha límite")
    addTask(name, description, startDate, dueDate, status, category) {
        this.currentId++;
        
        this.tasks.push({
            id: this.currentId,
            name: name,
            description: description,
            startDate: startDate || 'No definida',
            dueDate: dueDate || 'Sin fecha límite',
            status: status,
            category: category || 'General'
        });

        this.save();
    }

    deleteTask(taskId) {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        this.save();
    }

    updateTaskStatus(taskId, newStatus) {
        const taskIndex = this.tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            this.tasks[taskIndex].status = newStatus;
            this.save();
        }
    }

    updateTaskFull(id, updatedData) {
        const index = this.tasks.findIndex(task => task.id === id);
        if (index !== -1) {
            this.tasks[index] = { ...this.tasks[index], ...updatedData };
            this.save();
        }
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

    render(filter = 'todas') {
        let tareasHtml = '';

        let tareasARenderizar = this.tasks;
        if (filter !== 'todas') {
            tareasARenderizar = this.tasks.filter(tarea => tarea.status === filter);
        }

        tareasARenderizar.forEach(tarea => {
            const isCompleted = tarea.status === 'completado';
            
            const badgeClass = isCompleted ? 'bg-success' : (tarea.status === 'en_progreso' ? 'bg-info text-dark' : 'bg-warning text-dark');
            const badgeText = isCompleted ? 'COMPLETADO' : (tarea.status === 'en_progreso' ? 'EN PROGRESO' : 'PENDIENTE');
            const borderClass = isCompleted ? 'border-success bg-success-subtle' : 'border-secondary-subtle';
            const btnToggleClass = isCompleted ? 'btn-secondary' : 'btn-outline-success';
            const btnToggleText = isCompleted ? 'Desmarcar' : 'Marcar';

            tareasHtml += `
                <div class="col-12 col-lg-6" data-task-id="${tarea.id}">
                    <div class="card h-100 shadow-sm ${borderClass}">
                        <div class="card-body d-flex flex-column">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <div>
                                    <span class="badge bg-light text-success border border-success-subtle mb-1">${tarea.category}</span>
                                    <h3 class="h6 card-title fw-bold mb-0">${tarea.name}</h3>
                                </div>
                                <span class="badge ${badgeClass}">${badgeText}</span>
                            </div>
                            <p class="card-text text-secondary small mb-3">${tarea.description}</p>
                            
                            <!-- NUEVO: Mostrar tanto fecha de inicio como límite en la tarjeta -->
                            <div class="mb-3 small text-muted">
                                <div>🚀 <strong>Inicio:</strong> ${tarea.startDate}</div>
                                <div>🏁 <strong>Límite:</strong> ${tarea.dueDate}</div>
                            </div>

                            <div class="d-flex justify-content-end align-items-center mt-auto">
                                <div class="btn-group">
                                    <button class="btn btn-sm ${btnToggleClass} btn-toggle">${btnToggleText}</button>
                                    <button class="btn btn-sm btn-outline-primary edit-button">Editar</button>
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