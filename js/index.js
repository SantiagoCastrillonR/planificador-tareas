// 1. Inicializar, cargar y renderizar tareas al iniciar la página
const taskManager = new TaskManager();
taskManager.load();
taskManager.render();

const formulario = document.querySelector('#formulario-tareas');

// Función de validación original
function validFormFieldInput(data) {
    const { nombre, descripcion, fecha, estado } = data;
    if (nombre.trim() === '' || descripcion.trim() === '' || fecha === '' || estado === '') {
        return false; 
    }
    return true; 
}

// Evento principal del formulario
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
        // Enviar datos validados a la clase TaskManager
        taskManager.addTask(nombre, descripcion, fecha, estado);
        
        // Actualizar la pantalla con la nueva tarea
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
        const boton = evento.target;
        const tarjeta = boton.closest('.card');
        const badge = tarjeta.querySelector('.badge');
        
        tarjeta.classList.toggle('border-success');
        tarjeta.classList.toggle('border-secondary-subtle');
        tarjeta.classList.toggle('bg-success-subtle');
        
        if (tarjeta.classList.contains('border-success')) {
            boton.textContent = "Desmarcar";
            boton.classList.replace('btn-outline-success', 'btn-secondary');
            badge.textContent = "COMPLETADO";
            badge.className = "badge bg-success";
        } else {
            boton.textContent = "Marcar";
            boton.classList.replace('btn-secondary', 'btn-outline-success');
            badge.textContent = "PENDIENTE";
            badge.className = "badge bg-warning text-dark";
        }
    }
});