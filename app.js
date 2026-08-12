
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