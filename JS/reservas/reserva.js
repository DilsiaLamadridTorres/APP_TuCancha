////////////////////////// CONTROLADOR DE RESERVAS

document.addEventListener('DOMContentLoaded', () => {

  const bookingForm = document.getElementById('booking-form');
  const formMessage = document.getElementById('form-message');
  const fechaInput = document.getElementById('fecha');

  if (!bookingForm || !formMessage || !fechaInput) {
    console.warn('Formulario de reservas no encontrado.');
    return;
  }

  // Restringir fechas pasadas
  const hoy = new Date().toISOString().split('T')[0];
  fechaInput.setAttribute('min', hoy);

  // Manejo del envío
  bookingForm.addEventListener('submit', async (e) => {

    e.preventDefault();

    const cancha = document.getElementById('cancha-select').value;
    const fecha = fechaInput.value;
    const hora = document.getElementById('hora').value;
    const nombre = document.getElementById('nombre').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const email = document.getElementById('email').value.trim();

    // Validación
    if (!cancha || !fecha || !hora || !nombre || !telefono || !email) {
      mostrarMensaje(
        'Por favor, completa todos los campos requeridos.',
        'danger'
      );
      return;
    }

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

    mostrarMensaje(
      'Procesando tu reserva...',
      'info'
    );

    try {

      // Aquí posteriormente irá la API / Supabase
      await new Promise((resolve) => setTimeout(resolve, 1000));

      mostrarMensaje(
        '¡Reserva confirmada con éxito! Nos vemos en la cancha.',
        'success'
      );

      bookingForm.reset();

      // Mantener restricción de fecha después del reset
      fechaInput.setAttribute('min', hoy);

    } catch (error) {

      console.error('Error al guardar reserva:', error);

      mostrarMensaje(
        'Ocurrió un error al procesar la reserva. Intenta de nuevo.',
        'danger'
      );
    }
  });

  function mostrarMensaje(mensaje, tipo) {

    formMessage.innerHTML = `
      <div class="alert alert-${tipo} text-center" role="alert">
        ${mensaje}
      </div>
    `;
  }

});