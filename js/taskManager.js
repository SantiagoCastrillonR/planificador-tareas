/*   - Guardarlas en memoria
 *   - Agregar, editar, eliminar y cambiar su estado
 *   - Guardarlas y cargarlas desde localStorage 
 *   - renderizar las tarjetas de tareas en el HTML
 */
class TaskManager {

    constructor(currentId = 0) {
        this.tasks = [];          // Aquí se guardan todas las tareas 
        this.currentId = currentId; // Contador para generar IDs únicos
    }

    // CREAR TAREA

    addTask(name, description, startDate, dueDate, status, category) {
        this.currentId++; // Cada tarea nueva tiene un ID diferente y único

        this.tasks.push({
            id: this.currentId,
            name: name,
            description: description || 'Sin descripción',
            startDate: startDate || 'No definida',
            dueDate: dueDate || 'Sin fecha límite',
            status: status,
            category: category || 'General'
        });

        this.save();
    }

    // ELIMINAR TAREA

    deleteTask(taskId) {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        this.save();
    }

    // CAMBIAR SOLO EL ESTADO DE UNA TAREA

    updateTaskStatus(taskId, newStatus) {
        const taskIndex = this.tasks.findIndex(task => task.id === taskId);

        if (taskIndex !== -1) { // -1 significa que no se encontró la tarea
            this.tasks[taskIndex].status = newStatus;
            this.save();
        }
    }

    // EDITAR DATOS DE UNA TAREA 
  
    updateTaskFull(id, updatedData) {
        const index = this.tasks.findIndex(task => task.id === id);

        if (index !== -1) {
            this.tasks[index] = { ...this.tasks[index], ...updatedData };
            this.save();
        }
    }

    // GUARDAR EN localStorage 
    save() {
        const tasksJson = JSON.stringify(this.tasks);
        localStorage.setItem('tasks', tasksJson);

        const currentIdJson = String(this.currentId);
        localStorage.setItem('currentId', currentIdJson);
    }


    // CARGAR DESDE localStorage

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

    // RENDERIZAR LAS TARJETAS DE TAREAS EN PANTALLA

    render(filter = 'todas') {
        let tareasHtml = '';

        // 1) Decidir qué mostrar según el filtro 
        let tareasARenderizar = this.tasks;
        if (filter !== 'todas') {
            tareasARenderizar = this.tasks.filter(tarea => tarea.status === filter);
        }

        tareasARenderizar.forEach(tarea => {
            const isCompleted = tarea.status === 'completado';
            const isInProgress = tarea.status === 'en_progreso';

            // Estilos visuales según estado tarea
            const badgeClass = isCompleted ? 'bg-success' : (isInProgress ? 'bg-info text-dark' : 'bg-warning text-dark');
            const badgeText = isCompleted ? 'COMPLETADO' : (isInProgress ? 'EN PROGRESO' : 'PENDIENTE');
            const borderClass = isCompleted ? 'border-success bg-success-subtle' : 'border-secondary-subtle';

            const btnToggleClass = isCompleted ? 'btn-secondary' : 'btn-outline-success';
            const btnToggleText = isCompleted ? 'Desmarcar' : 'Completar';

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

                            <div class="mb-3 small text-muted">
                                <div> ● <strong>Inicio:</strong> ${tarea.startDate}</div>
                                <div> ● <strong>Límite:</strong> ${tarea.dueDate}</div>
                            </div>

                            <!-- Botones de acción de cada tarjeta.
                                 Los "clicks" de estos botones se escuchan
                                 en index.js (delegación de eventos). -->
                            <div class="d-flex justify-content-center align-items-center mt-auto">
                                <div class="btn-group gap-1 flex-wrap justify-content-center">
                                    <button class="btn btn-sm btn-toggle ${btnToggleClass}">${btnToggleText}</button>
                                    <button class="btn btn-sm btn-progress">Progreso</button>
                                    <button class="btn btn-sm edit-button">Editar</button>
                                    <button class="btn btn-sm delete-button">Borrar</button>
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