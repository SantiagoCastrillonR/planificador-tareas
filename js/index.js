const taskManager = new TaskManager();
console.log(taskManager.tasks);

const formulario = document.querySelector('#formulario-tareas');

function validFormFieldInput(data) {
    const { nombre, descripcion, fecha, estado } = data;

    if (nombre.trim() === '' || descripcion.trim() === '' || fecha === '' || estado === '') {
        return false; 
    }
    return true; 
}

formulario.addEventListener('submit', function(evento) {
    // Prevenir que la página se recargue
    evento.preventDefault();

    const nombre = document.querySelector('#nombreTarea').value;
    const descripcion = document.querySelector('#descripcionTarea').value;
    const fecha = document.querySelector('#fechaTarea').value;
    const estado = document.querySelector('#estadoTarea').value;

    console.log("name: " + nombre);
    console.log("description: " + descripcion);
    console.log("date: " + fecha);
    console.log("status: " + estado);

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
        Swal.fire({
            icon: 'success',
            title: '¡Tarea válida!',
            text: 'La tarea ha sido validada correctamente.',
            confirmButtonColor: '#198754',
            timer: 2000,
            showConfirmButton: false
        });
        
        formulario.reset();
    }
});


const botonesToggle = document.querySelectorAll('.btn-toggle');

botonesToggle.forEach(boton => {
    boton.addEventListener('click', function() {
        const tarjeta = this.closest('.card');
        const badge = tarjeta.querySelector('.badge');
        
        tarjeta.classList.toggle('border-success');
        tarjeta.classList.toggle('border-secondary-subtle');
        tarjeta.classList.toggle('bg-success-subtle');
        
        if(tarjeta.classList.contains('border-success')) {
            this.textContent = "Desmarcar";
            this.classList.replace('btn-outline-success', 'btn-secondary');
            
            badge.textContent = "Completado";
            badge.className = "badge bg-success";
        } else {
            this.textContent = "Marcar";
            this.classList.replace('btn-secondary', 'btn-outline-success');
            
            badge.textContent = "Pendiente";
            badge.className = "badge bg-warning text-dark";
        }
    });
});