const taskManager = new TaskManager();
taskManager.load();

if (taskManager.tasks.length === 0) {
    taskManager.addTask(
        'Terminar Sprint 1', 
        'Diseñar la Tarjeta de Tarea y la Lista de Tareas usando clases de Bootstrap.', 
        '2026-09-10', 
        '2026-09-15', 
        'completado',
        'Estudio'
    );
    
    taskManager.addTask(
        'Revisar Repositorio', 
        'Verificar que todos los commits de la semana estén integrados en la rama principal.', 
        '2026-09-15', 
        'Sin fecha límite', 
        'en_progreso',
        'Trabajo'
    );
}

taskManager.render();

// NUEVO: Control para mostrar/ocultar input cuando seleccionan "Otro" en categoría (Formulario principal)
const selectCategoria = document.querySelector('#categoriaTarea');
const contenedorOtra = document.querySelector('#contenedorOtraCategoria');
const inputOtra = document.querySelector('#otraCategoria');

selectCategoria.addEventListener('change', function() {
    if (this.value === 'Otro') {
        contenedorOtra.classList.remove('d-none');
        inputOtra.required = true;
    } else {
        contenedorOtra.classList.add('d-none');
        inputOtra.required = false;
        inputOtra.value = '';
    }
});

// NUEVO: Control para checkbox "Sin fecha límite" (Formulario principal)
const checkSinFecha = document.querySelector('#sinFechaLimite');
const inputFechaLimite = document.querySelector('#fechaLimiteTarea');

checkSinFecha.addEventListener('change', function() {
    if (this.checked) {
        inputFechaLimite.value = '';
        inputFechaLimite.disabled = true;
        inputFechaLimite.required = false;
    } else {
        inputFechaLimite.disabled = false;
    }
});

// NUEVO: Control para mostrar/ocultar input "Otro" en el Modal de Edición
const editSelectCategoria = document.querySelector('#editCategoriaTarea');
const editContenedorOtra = document.querySelector('#editContenedorOtraCategoria');
const editInputOtra = document.querySelector('#editOtraCategoria');

editSelectCategoria.addEventListener('change', function() {
    if (this.value === 'Otro') {
        editContenedorOtra.classList.remove('d-none');
        editInputOtra.required = true;
    } else {
        editContenedorOtra.classList.add('d-none');
        editInputOtra.required = false;
        editInputOtra.value = '';
    }
});

// NUEVO: Control para checkbox "Sin fecha límite" en el Modal de Edición
const editCheckSinFecha = document.querySelector('#editSinFechaLimite');
const editInputFechaLimite = document.querySelector('#editFechaLimiteTarea');

editCheckSinFecha.addEventListener('change', function() {
    if (this.checked) {
        editInputFechaLimite.value = '';
        editInputFechaLimite.disabled = true;
        editInputFechaLimite.required = false;
    } else {
        editInputFechaLimite.disabled = false;
    }
});

const formulario = document.querySelector('#formulario-tareas');

function validFormFieldInput(data) {
    const { nombre, descripcion, estado } = data;
    if (nombre.trim() === '' || descripcion.trim() === '' || estado === '') {
        return false; 
    }
    return true; 
}

formulario.addEventListener('submit', function(evento) {
    evento.preventDefault();

    const nombre = document.querySelector('#nombreTarea').value;
    const descripcion = document.querySelector('#descripcionTarea').value;
    const fechaInicio = document.querySelector('#fechaInicioTarea').value;
    
    // Validar si marcó "Sin fecha límite"
    const sinFecha = checkSinFecha.checked;
    const fechaLimite = sinFecha ? 'Sin fecha límite' : inputFechaLimite.value;

    const estado = document.querySelector('#estadoTarea').value;
    
    // Obtener categoría (si es "Otro", tomar el valor del input libre)
    let categoria = selectCategoria.value;
    if (categoria === 'Otro') {
        categoria = inputOtra.value.trim();
    }

    const datosTarea = { nombre, descripcion, estado };
    const esValido = validFormFieldInput(datosTarea);

    if (!esValido || (!sinFecha && !fechaLimite)) {
        Swal.fire({
            icon: 'error',
            title: 'Formulario incompleto',
            text: 'Por favor, completa todos los campos requeridos (incluyendo fechas).',
            confirmButtonColor: '#dc3545'
        });
    } else {
        taskManager.addTask(nombre, descripcion, fechaInicio, fechaLimite, estado, categoria);
        
        const filtroActivo = document.querySelector('.filter-btn.active')?.dataset.filter || 'todas';
        taskManager.render(filtroActivo);

        Swal.fire({
            icon: 'success',
            title: '¡Tarea válida!',
            text: 'La tarea ha sido registrada correctamente.',
            confirmButtonColor: '#198754',
            timer: 2000,
            showConfirmButton: false
        });
        
        formulario.reset();
        contenedorOtra.classList.add('d-none');
        inputFechaLimite.disabled = false;
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
        
        const filtroActivo = document.querySelector('.filter-btn.active').dataset.filter;
        taskManager.render(filtroActivo);
    }

    if (evento.target.classList.contains('edit-button')) {
        const parentTask = evento.target.closest('[data-task-id]');
        const taskId = Number(parentTask.dataset.taskId);
        const task = taskManager.tasks.find(t => t.id === taskId);

        document.querySelector('#editTaskId').value = task.id;
        document.querySelector('#editNombreTarea').value = task.name;
        document.querySelector('#editDescripcionTarea').value = task.description;
        document.querySelector('#editFechaInicioTarea').value = task.startDate !== 'No definida' ? task.startDate : '';
        
        // Manejar fecha límite o sin fecha en modal
        if (task.dueDate === 'Sin fecha límite') {
            editCheckSinFecha.checked = true;
            editInputFechaLimite.value = '';
            editInputFechaLimite.disabled = true;
        } else {
            editCheckSinFecha.checked = false;
            editInputFechaLimite.value = task.dueDate;
            editInputFechaLimite.disabled = false;
        }

        document.querySelector('#editEstadoTarea').value = task.status;

        // Manejar categoría estándar u "Otro" en modal
        const categoriasComunes = ['Trabajo', 'Estudio', 'Personal', 'Hogar'];
        if (categoriasComunes.includes(task.category)) {
            editSelectCategoria.value = task.category;
            editContenedorOtra.classList.add('d-none');
            editInputOtra.value = '';
        } else {
            editSelectCategoria.value = 'Otro';
            editContenedorOtra.classList.remove('d-none');
            editInputOtra.value = task.category;
        }

        const modal = new bootstrap.Modal(document.getElementById('modalEditar'));
        modal.show();
    }

    if (evento.target.classList.contains('delete-button')) {
        const parentTask = evento.target.closest('[data-task-id]');
        const taskId = Number(parentTask.dataset.taskId);
        
        taskManager.deleteTask(taskId);
        const filtroActivo = document.querySelector('.filter-btn.active').dataset.filter;
        taskManager.render(filtroActivo);
    }
});

document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        
        const filtro = e.target.dataset.filter;
        taskManager.render(filtro);
    });
});

document.querySelector('#form-editar-tarea').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const id = Number(document.querySelector('#editTaskId').value);
    const name = document.querySelector('#editNombreTarea').value;
    const description = document.querySelector('#editDescripcionTarea').value;
    const startDate = document.querySelector('#editFechaInicioTarea').value;
    
    const sinFecha = editCheckSinFecha.checked;
    const dueDate = sinFecha ? 'Sin fecha límite' : editInputFechaLimite.value;
    const status = document.querySelector('#editEstadoTarea').value;
    
    let category = editSelectCategoria.value;
    if (category === 'Otro') {
        category = editInputOtra.value.trim();
    }

    taskManager.updateTaskFull(id, { name, description, startDate, dueDate, status, category });
    
    const filtroActivo = document.querySelector('.filter-btn.active').dataset.filter;
    taskManager.render(filtroActivo);

    const modalElement = document.getElementById('modalEditar');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance.hide();

    Swal.fire({
        icon: 'success',
        title: '¡Actualizada!',
        text: 'La tarea se modificó correctamente.',
        timer: 1500,
        showConfirmButton: false
    });
});