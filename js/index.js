const taskManager = new TaskManager();
taskManager.load();

// Inyección de tareas de ejemplo si la lista está vacía
if (taskManager.tasks.length === 0) {
    taskManager.addTask(
        'Terminar Sprint 1', 
        'Diseñar la Tarjeta de Tarea y la Lista de Tareas usando clases de Bootstrap.', 
        '2026-09-15', 
        'completado'
    );
    
    taskManager.addTask(
        'Revisar Repositorio', 
        'Verificar que todos los commits de la semana estén integrados en la rama principal.', 
        '2026-09-18', 
        'en_progreso'
    );

    taskManager.addTask(
        'Practicar JavaScript', 
        'Repasar lógica de programación, arreglos y manipulación del DOM.', 
        '2026-09-20', 
        'pendiente'
    );
}

taskManager.render();

const formulario = document.querySelector('#formulario-tareas');

function validFormFieldInput(data) {
    const { nombre, descripcion, fecha, estado } = data;
    if (nombre.trim() === '' || descripcion.trim() === '' || fecha === '' || estado === '') {
        return false; 
    }
    return true; 
}

formulario.addEventListener('submit', function(evento) {
    evento.preventDefault();

    const nombre = document.querySelector('#nombreTarea').value;
    const descripcion = document.querySelector('#descripcionTarea').value;
    const fecha = document.querySelector('#fechaTarea').value;
    const estado = document.querySelector('#estadoTarea').value;

    const datosTarea = { nombre, descripcion, fecha, estado };
    const esValido = validFormFieldInput(datosTarea);

    if (!esValido) {
        Swal.fire({
            icon: 'error',
            title: 'Formulario incompleto',
            text: 'Por favor, completa todos los campos requeridos.',
            confirmButtonColor: '#dc3545'
        });
    } else {
        taskManager.addTask(nombre, descripcion, fecha, estado);
        taskManager.render();

        Swal.fire({
            icon: 'success',
            title: '¡Tarea válida!',
            text: 'La tarea ha sido registrada correctamente.',
            confirmButtonColor: '#198754',
            timer: 2000,
            showConfirmButton: false
        });
        
        formulario.reset();
    }
});

document.querySelector('#lista-tareas').addEventListener('click', function(evento) {
    
    if (evento.target.classList.contains('btn-toggle')) {
        const parentTask = evento.target.closest('[data-task-id]');
        const taskId = Number(parentTask.dataset.taskId);
        
        const currentTask = taskManager.tasks.find(t => t.id === taskId);
        
        if (currentTask.status === 'completado') {
            taskManager.updateTaskStatus(taskId, 'pendiente');
        } else {
            taskManager.updateTaskStatus(taskId, 'completado');
        }
        
        taskManager.render();
    }

    if (evento.target.classList.contains('delete-button')) {
        const parentTask = evento.target.closest('[data-task-id]');
        const taskId = Number(parentTask.dataset.taskId);
        
        taskManager.deleteTask(taskId);
        taskManager.render();
    }
});