                    //CONTROLADOR DE RESERVAS//

document.addEventListener('DOMContentLoaded', () => {
  const bookingForm = document.getElementById('booking-form');
  const formMessage = document.getElementById('form-message');
  const fechaInput = document.getElementById('fecha');

  if (!bookingForm) return;

  // 1. Restringir fechas pasadas en el selector de fecha
  const hoy = new Date().toISOString().split('T')[0];
  fechaInput.setAttribute('min', hoy);

  // 2. Manejo del evento de envío (Submit)
  bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Captura de valores
    const cancha = document.getElementById('cancha-select').value;
    const fecha = fechaInput.value;
    const hora = document.getElementById('hora').value;
    const nombre = document.getElementById('nombre').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const email = document.getElementById('email').value.trim();

    // Validación básica de campos
    if (!cancha || !fecha || !hora || !nombre || !telefono || !email) {
      mostrarMensaje('Por favor, completa todos los campos requeridos.', 'danger');
      return;
    }

    // Estructura del objeto Reserva
    const reservaData = {
      cancha,
      fecha,
      hora,
      cliente: {
        nombre,
        telefono,
        email
      },
      createdAt: new Date().toISOString()
    };

    console.log('Datos de la reserva listos:', reservaData);

    // Feedback al usuario mientras se procesa
    mostrarMensaje('Procesando tu reserva...', 'info');

    try {
      // OK,AQUÍ IRÁ LA INTEGRACIÓN CON LA API / BASE DE DATOS
      // Ejemplo simulado:
      await new Promise((resolve) => setTimeout(resolve, 1000));

      mostrarMensaje('¡Reserva confirmada con éxito! Nos vemos en la cancha.', 'success');
      bookingForm.reset();
    } catch (error) {
      console.error('Error al guardar reserva:', error);
      mostrarMensaje('Ocurrió un error al procesar la reserva. Intenta de nuevo.', 'danger');
    }
  });

  // Función auxiliar para mostrar alertas de Bootstrap
  function mostrarMensaje(mensaje, tipo) {
    formMessage.innerHTML = `
      <div class="alert alert-${tipo} alert-dismissible fade show text-center" role="alert">
        ${mensaje}
      </div>
    `;
  }
});