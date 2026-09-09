const taskManager = new TaskManager();
taskManager.load();

// Tareas de ejemplo predeterminadas al iniciar por primera vez si no hay nada guardado
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

// MODO OSCURO 

const darkModeToggle = document.querySelector('#darkModeToggle');
const bodyElement = document.body;

const savedDarkMode = localStorage.getItem('darkMode');
if (savedDarkMode === 'enabled') {
    bodyElement.classList.add('dark-mode');
    darkModeToggle.textContent = '●'; 
} else {
    darkModeToggle.textContent = '○'; 
}

darkModeToggle.addEventListener('click', function() {
    bodyElement.classList.toggle('dark-mode');
    
    if (bodyElement.classList.contains('dark-mode')) {
        localStorage.setItem('darkMode', 'enabled');
        darkModeToggle.textContent = '●';
    } else {
        localStorage.setItem('darkMode', 'disabled');
        darkModeToggle.textContent = '○';
    }
});

// Función para actualizar contadores
function actualizarContadores() {
    const total = taskManager.tasks.length;
    const pendientes = taskManager.tasks.filter(t => t.status === 'pendiente').length;
    const enProgreso = taskManager.tasks.filter(t => t.status === 'en_progreso').length;
    const completadas = taskManager.tasks.filter(t => t.status === 'completado').length;

    document.querySelector('#count-todas').textContent = total;
    document.querySelector('#count-pendiente').textContent = pendientes;
    document.querySelector('#count-en_progreso').textContent = enProgreso;
    document.querySelector('#count-completado').textContent = completadas;
}

taskManager.render();
actualizarContadores();

// Formulario colapsable (se despliega al enfocar el nombre)
const inputNombre = document.querySelector('#nombreTarea');
const seccionColapsable = document.querySelector('#seccion-colapsable');
let collapseInstance = new bootstrap.Collapse(seccionColapsable, { toggle: false });

inputNombre.addEventListener('focus', function() {
    collapseInstance.show();
});

// Selector de categorías personalizadas 
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

// Checkbox para manejar la opción de "Sin fecha límite"
const checkSinFecha = document.querySelector('#sinFechaLimite');
const inputFechaLimite = document.querySelector('#fechaLimiteTarea');

checkSinFecha.addEventListener('change', function() {
    if (this.checked) {
        inputFechaLimite.value = '';
        inputFechaLimite.disabled = true;
    } else {
        inputFechaLimite.disabled = false;
    }
});


// MINI CALENDARIO 

let fechaActualCalendario = new Date();
let fechaSeleccionadaStr = null;

function renderMiniCalendario() {
    const grid = document.querySelector('#miniCalendarioGrid');
    const labelMesAnio = document.querySelector('#mesAnioLabel');
    grid.innerHTML = '';

    const anio = fechaActualCalendario.getFullYear();
    const mes = fechaActualCalendario.getMonth();

    const nombresMeses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    labelMesAnio.textContent = `${nombresMeses[mes]} ${anio}`;

    const diasSemana = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];
    diasSemana.forEach(d => {
        const headerDiv = document.createElement('div');
        headerDiv.className = 'calendar-day-header';
        headerDiv.textContent = d;
        grid.appendChild(headerDiv);
    });

    const primerDiaMes = new Date(anio, mes, 1);
    let diaSemanaInicio = primerDiaMes.getDay() - 1;
    if (diaSemanaInicio === -1) diaSemanaInicio = 6;

    const ultimoDiaMes = new Date(anio, mes + 1, 0).getDate();

    for (let i = 0; i < diaSemanaInicio; i++) {
        const emptyDiv = document.createElement('div');
        grid.appendChild(emptyDiv);
    }

    for (let dia = 1; dia <= ultimoDiaMes; dia++) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day';
        dayDiv.textContent = dia;

        const mesStr = String(mes + 1).padStart(2, '0');
        const diaStr = String(dia).padStart(2, '0');
        const fechaStr = `${anio}-${mesStr}-${diaStr}`;

        dayDiv.dataset.date = fechaStr;

        // Verifica si el día tiene tareas asignadas 
        const tieneTareas = taskManager.tasks.some(t => t.dueDate === fechaStr || t.startDate === fechaStr);
        if (tieneTareas) {
            dayDiv.classList.add('has-task');
        }

        if (fechaSeleccionadaStr === fechaStr) {
            dayDiv.classList.add('selected');
        }

        dayDiv.addEventListener('click', function() {
            document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
            this.classList.add('selected');
            fechaSeleccionadaStr = this.dataset.date;
            mostrarTareasDelDia(fechaSeleccionadaStr);
        });

        grid.appendChild(dayDiv);
    }
}

function mostrarTareasDelDia(fechaStr) {
    const contenedorTareasDelDia = document.querySelector('#tareas-del-dia');
    const tituloDia = document.querySelector('#tituloDiaSeleccionado');
    tituloDia.textContent = `Tareas del ${fechaStr}:`;

    const tareasDelDia = taskManager.tasks.filter(t => t.dueDate === fechaStr || t.startDate === fechaStr);

    if (tareasDelDia.length === 0) {
        contenedorTareasDelDia.innerHTML = `<p class="small text-muted text-center fst-italic mb-0">No hay tareas programadas.</p>`;
        return;
    }

    let htmlDia = '<ul class="list-group list-group-flush small bg-transparent">';
    tareasDelDia.forEach(t => {
        htmlDia += `
            <li class="list-group-item px-0 d-flex justify-content-between align-items-center bg-transparent text-inherit">
                <div>
                    <span class="fw-bold">${t.name}</span><br>
                    <span class="text-muted" style="font-size: 0.75rem;">Estado: ${t.status}</span>
                </div>
                <span class="badge bg-success-subtle text-success border border-success-subtle">${t.category}</span>
            </li>
        `;
    });
    htmlDia += '</ul>';
    contenedorTareasDelDia.innerHTML = htmlDia;
}

document.querySelector('#mesAnterior').addEventListener('click', function() {
    fechaActualCalendario.setMonth(fechaActualCalendario.getMonth() - 1);
    renderMiniCalendario();
});

document.querySelector('#mesSiguiente').addEventListener('click', function() {
    fechaActualCalendario.setMonth(fechaActualCalendario.getMonth() + 1);
    renderMiniCalendario();
});

renderMiniCalendario();

// Controles para edición ("Otro" y "Sin fecha límite")
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

const editCheckSinFecha = document.querySelector('#editSinFechaLimite');
const editInputFechaLimite = document.querySelector('#editFechaLimiteTarea');

editCheckSinFecha.addEventListener('change', function() {
    if (this.checked) {
        editInputFechaLimite.value = '';
        editInputFechaLimite.disabled = true;
    } else {
        editInputFechaLimite.disabled = false;
    }
});

// Envío del formulario principal para crear tareas
const formulario = document.querySelector('#formulario-tareas');

formulario.addEventListener('submit', function(evento) {
    evento.preventDefault();

    const nombre = inputNombre.value;
    const descripcion = document.querySelector('#descripcionTarea').value;
    const fechaInicio = document.querySelector('#fechaInicioTarea').value;
    const sinFecha = checkSinFecha.checked;
    const fechaLimite = sinFecha ? 'Sin fecha límite' : inputFechaLimite.value;
    const estado = document.querySelector('#estadoTarea').value;
    
    let categoria = selectCategoria.value;
    if (categoria === 'Otro') {
        categoria = inputOtra.value.trim();
    }

    if (nombre.trim() === '' || estado === '') {
        Swal.fire({
            icon: 'error',
            title: 'Formulario incompleto',
            text: 'Por favor, llena al menos el nombre y el estado de la tarea.',
            confirmButtonColor: '#dc3545'
        });
    } else {
        taskManager.addTask(nombre, descripcion, fechaInicio, fechaLimite, estado, categoria);
        
        const filtroActivo = document.querySelector('.task-tab-btn.active')?.dataset.filter || 'todas';
        taskManager.render(filtroActivo);
        actualizarContadores();
        renderMiniCalendario();

        Swal.fire({
            icon: 'success',
            title: '¡Registrada!',
            text: 'La tarea ha sido guardada exitosamente.',
            confirmButtonColor: '#3a8b50',
            timer: 1500,
            showConfirmButton: false
        });
        
        formulario.reset();
        collapseInstance.hide();
        contenedorOtra.classList.add('d-none');
        inputFechaLimite.disabled = false;
    }
});

// Eventos de la lista general (Completar, En Progreso, Editar, Eliminar con SweetAlert2)
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
        
        const filtroActivo = document.querySelector('.task-tab-btn.active').dataset.filter;
        taskManager.render(filtroActivo);
        actualizarContadores();
        renderMiniCalendario();
    }

    if (evento.target.classList.contains('btn-progress')) {
        const parentTask = evento.target.closest('[data-task-id]');
        const taskId = Number(parentTask.dataset.taskId);
        
        taskManager.updateTaskStatus(taskId, 'en_progreso');
        
        const filtroActivo = document.querySelector('.task-tab-btn.active').dataset.filter;
        taskManager.render(filtroActivo);
        actualizarContadores();
        renderMiniCalendario();
    }

    if (evento.target.classList.contains('edit-button')) {
        const parentTask = evento.target.closest('[data-task-id]');
        const taskId = Number(parentTask.dataset.taskId);
        const task = taskManager.tasks.find(t => t.id === taskId);

        document.querySelector('#editTaskId').value = task.id;
        document.querySelector('#editNombreTarea').value = task.name;
        document.querySelector('#editDescripcionTarea').value = task.description;
        document.querySelector('#editFechaInicioTarea').value = task.startDate !== 'No definida' ? task.startDate : '';
        
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
        
        // Alerta de confirmación profesional con SweetAlert2 para eliminar tareas
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará la tarea permanentemente.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3a8b50',
            cancelButtonColor: '#d9534f',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                taskManager.deleteTask(taskId);
                const filtroActivo = document.querySelector('.task-tab-btn.active').dataset.filter;
                taskManager.render(filtroActivo);
                actualizarContadores();
                renderMiniCalendario();

                Swal.fire({
                    icon: 'success',
                    title: '¡Eliminada!',
                    text: 'La tarea ha sido borrada.',
                    timer: 1200,
                    showConfirmButton: false
                });
            }
        });
    }
});

// Manejo de eventos para las pestañas de filtro superiores
document.querySelectorAll('.task-tab-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const targetBtn = e.currentTarget;

        document.querySelectorAll('.task-tab-btn').forEach(b => b.classList.remove('active'));
        targetBtn.classList.add('active');
        
        const filtro = targetBtn.dataset.filter;
        taskManager.render(filtro);
    });
});

// Envío del formulario del modal de edición
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
    
    const filtroActivo = document.querySelector('.task-tab-btn.active').dataset.filter;
    taskManager.render(filtroActivo);
    actualizarContadores();
    renderMiniCalendario();

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