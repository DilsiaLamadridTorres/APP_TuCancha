document.addEventListener('DOMContentLoaded', () => {
    // Datos simulados de solicitudes
    const solicitudesRegistradas = {
        '1': {
            id: '1',
            nombreCancha: 'Arena Gol 7',
            tipoDeporte: 'Fútbol 7',
            nombrePropietario: 'Carlos Pérez',
            telefono: '+57 301 234 5678',
            ciudad: 'Medellín, Antioquia',
            direccion: 'Calle 45 # 78 - 123',
            precioPorHora: '$60.000 COP',
            horarioAtencion: 'Lunes a Domingo: 6:00 AM - 11:00 PM',
            fechaEnvio: '24 May 2024, 10:30 AM',
            estadoSolicitud: 'pendiente',
            descripcion: 'Cancha sintética profesional con medidas reglamentarias, iluminación LED y ambiente seguro para tu partido.',
            imagenPrincipal: 'https://via.placeholder.com/400x250?text=Arena+Gol+7'
        },
        '2': {
            id: '2',
            nombreCancha: 'La 80 Cancha',
            tipoDeporte: 'Fútbol 8',
            nombrePropietario: 'María López',
            telefono: '+57 301 456 7890',
            ciudad: 'Cali, Valle del Cauca',
            direccion: 'Carrera 80 # 10 - 20',
            precioPorHora: '$75.000 COP',
            horarioAtencion: 'Martes a Domingo: 8:00 AM - 10:00 PM',
            fechaEnvio: '23 May 2024, 09:20 AM',
            estadoSolicitud: 'en_revision',
            descripcion: 'Excelente cancha de grama artificial cerca a la avenida principal. Incluye camerinos nuevos.',
            imagenPrincipal: 'https://via.placeholder.com/400x250?text=La+80+Cancha'
        }
    };

    // Referencias a la vista HTML
    const panelDetalle = document.getElementById('panel-detalle');
    const cuerpoTabla = document.getElementById('cuerpo-tabla-solicitudes');
    const botonCerrarDetalle = document.getElementById('boton-cerrar-detalle');
    
    // Botones de acción del panel
    const botonMarcarRevision = document.getElementById('boton-marcar-revision');
    const botonAprobarPublicar = document.getElementById('boton-aprobar-publicar');
    const botonRechazar = document.getElementById('boton-rechazar');

    // Estado seleccionado actualmente
    let idSolicitudSeleccionada = null;

    // Función para mostrar los detalles de la solicitud seleccionada
    function mostrarDetalles(idSolicitud) {
        const datos = solicitudesRegistradas[idSolicitud];
        if (!datos) return;

        idSolicitudSeleccionada = idSolicitud;

        // Asignar los valores a los elementos HTML del detalle
        document.getElementById('imagen-detalle-principal').src = datos.imagenPrincipal;
        document.getElementById('fecha-envio-detalle').textContent = datos.fechaEnvio;
        document.getElementById('nombre-cancha-detalle').textContent = datos.nombreCancha;
        document.getElementById('tipo-cancha-detalle').textContent = datos.tipoDeporte;
        document.getElementById('nombre-propietario-detalle').textContent = datos.nombrePropietario;
        document.getElementById('telefono-propietario-detalle').textContent = datos.telefono;
        document.getElementById('ciudad-detalle').textContent = datos.ciudad;
        document.getElementById('direccion-detalle').textContent = datos.direccion;
        document.getElementById('precio-detalle').textContent = datos.precioPorHora;
        document.getElementById('horario-detalle').textContent = datos.horarioAtencion;
        document.getElementById('descripcion-detalle').textContent = datos.descripcion;

        // Actualizar estados visuales
        actualizarInterfazEstadoPanel(datos.estadoSolicitud);
        resaltarFilaSeleccionadaEnTabla(idSolicitud);

        // Desplegar el panel
        panelDetalle.classList.add('abierto');
    }

    // Actualiza la línea de tiempo y la etiqueta de estado dentro del panel derecho
    function actualizarInterfazEstadoPanel(estado) {
        const etiquetaEstado = document.getElementById('etiqueta-estado-detalle');
        etiquetaEstado.className = 'etiqueta-estado ' + estado.replace('_', '-');
        
        const textoEstado = estado.charAt(0).toUpperCase() + estado.slice(1).replace('_', ' ');
        etiquetaEstado.textContent = textoEstado;

        // Actualización de la línea de tiempo
        const contenedorPasos = document.querySelector('.linea-tiempo-estado .pasos-estado');
        const pasosLíneaTiempo = contenedorPasos.querySelectorAll('.paso-estado');
        
        const mapaEstados = {
            'pendiente': 0, 
            'en_revision': 1, 
            'aprobada': 2, 
            'publicada': 3
        };

        const indiceActual = mapaEstados[estado] !== undefined ? mapaEstados[estado] : -1;

        pasosLíneaTiempo.forEach((paso, indice) => {
            if (indice <= indiceActual) {
                paso.classList.add('activo');
            } else {
                paso.classList.remove('activo');
            }
        });
    }

    // Marca visualmente cuál fila de la tabla está seleccionada
    function resaltarFilaSeleccionadaEnTabla(idSolicitud) {
        const filas = cuerpoTabla.querySelectorAll('.fila-solicitud');
        filas.forEach(fila => {
            if (fila.dataset.id === idSolicitud) {
                fila.classList.add('activa');
            } else {
                fila.classList.remove('activa');
            }
        });
    }

    // Modifica el estado de una solicitud y refresca la vista
    function cambiarEstadoSolicitud(idSolicitud, nuevoEstado) {
        const datos = solicitudesRegistradas[idSolicitud];
        if (!datos) return;

        datos.estadoSolicitud = nuevoEstado;

        // Si es la solicitud activa, actualizar el panel
        if (idSolicitudSeleccionada === idSolicitud) {
            actualizarInterfazEstadoPanel(nuevoEstado);
        }

        // Actualizar el estado correspondiente en la fila de la tabla
        const fila = cuerpoTabla.querySelector(`.fila-solicitud[data-id="${idSolicitud}"]`);
        if (fila) {
            const etiquetaEstadoTabla = fila.querySelector('.columna-estado .etiqueta-estado');
            etiquetaEstadoTabla.className = 'etiqueta-estado ' + nuevoEstado.replace('_', '-');
            
            const textoEstado = nuevoEstado.charAt(0).toUpperCase() + nuevoEstado.slice(1).replace('_', ' ');
            etiquetaEstadoTabla.textContent = textoEstado;
        }
    }

    // Eventos de interacción

    // Detectar clic en el botón "Ver solicitud"
    cuerpoTabla.addEventListener('click', (evento) => {
        const botonVer = evento.target.closest('.boton-ver');
        if (botonVer) {
            const filaPadre = botonVer.closest('.fila-solicitud');
            mostrarDetalles(filaPadre.dataset.id);
        }
    });

    // Cerrar panel de detalle
    botonCerrarDetalle.addEventListener('click', () => {
        panelDetalle.classList.remove('abierto');
        idSolicitudSeleccionada = null;
        resaltarFilaSeleccionadaEnTabla(null);
    });

    // Botones de acción del panel
    botonMarcarRevision.addEventListener('click', () => {
        if (idSolicitudSeleccionada) {
            cambiarEstadoSolicitud(idSolicitudSeleccionada, 'en_revision');
        }
    });

    botonAprobarPublicar.addEventListener('click', () => {
        if (idSolicitudSeleccionada) {
            cambiarEstadoSolicitud(idSolicitudSeleccionada, 'aprobada');
            // Simular publicación automática tras aprobación
            setTimeout(() => {
                cambiarEstadoSolicitud(idSolicitudSeleccionada, 'publicada');
            }, 1200);
        }
    });

    botonRechazar.addEventListener('click', () => {
        if (idSolicitudSeleccionada && confirm('¿Estás seguro de que deseas rechazar esta solicitud?')) {
            cambiarEstadoSolicitud(idSolicitudSeleccionada, 'rechazada');
        }
    });
});