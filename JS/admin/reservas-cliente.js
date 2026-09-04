document.addEventListener("DOMContentLoaded", () => {
  let reservaSeleccionada = null;
  const contenedorProximas = document.getElementById("contenedor-proximas");
  const panelDetalle = document.getElementById("panel-detalle");
  const btnCerrarDetalle = document.querySelector(".btn-cerrar");
  const btnCancelar = document.getElementById("btn-cancelar-reserva");
  const btnModificar = document.querySelector(".btn-modificar");
  const menuModificar = document.getElementById("menu-modificar");
  const btnCambiarHorario = document.getElementById("btn-cambiar-horario");
  const btnCambiarDia = document.getElementById("btn-cambiar-dia");

  // 1. Cargar el usuario logueado actual desde sessionStorage (o localStorage como respaldo)
  const usuarioLogueadoStr =
    sessionStorage.getItem("usuario") ||
    localStorage.getItem("usuario_logueado") ||
    localStorage.getItem("usuario");

  const usuarioActual = usuarioLogueadoStr ? JSON.parse(usuarioLogueadoStr) : null;
  const nombreUsuarioReal = usuarioActual?.nombre || usuarioActual?.correo || "Cliente";

  // 2. Cargar la lista completa de reservas desde LocalStorage ("mis_reservas")
  const reservasGuardadas = localStorage.getItem("mis_reservas");
  const misReservas = reservasGuardadas ? JSON.parse(reservasGuardadas) : [];

  if (misReservas.length === 0) {
    if (contenedorProximas) {
      contenedorProximas.innerHTML = `
        <div style="padding: 20px; text-align: center; color: #aaa; background: #181c24; border-radius: 8px;">
          <p>No tienes reservas activas en este momento.</p>
        </div>
      `;
    }
    if (panelDetalle) panelDetalle.style.display = "none";
    return;
  }

  // 3. Actualizar contadores superiores con el número total de reservas
  const spanTodas = document.querySelector(".btn-filtro.active span");
  const spanProximas = document.querySelectorAll(".btn-filtro span")[1];
  const totalReservasStr = misReservas.length.toString();
  if (spanTodas) spanTodas.textContent = totalReservasStr;
  if (spanProximas) spanProximas.textContent = totalReservasStr;

  // 4. Pintar todas las tarjetas dinámicamente
  if (contenedorProximas) {
    contenedorProximas.innerHTML = "";
    
    misReservas.forEach((reserva, index) => {
      const tarjetaHTML = `
        <div class="tarjeta-reserva" style="background: #181c24; border: 1px solid #2a2f3a; border-radius: 8px; padding: 15px; margin-bottom: 15px; display: flex; align-items: center; justify-content: space-between; gap: 15px;">
          <img src="${reserva.imagen || ''}" alt="${reserva.nombre || 'Cancha'}" style="width: 100px; height: 70px; object-fit: cover; border-radius: 6px;">
          
          <div style="flex: 1;">
            <h3 style="margin: 0 0 5px 0; color: #fff; font-size: 1.1rem;">${reserva.nombre || 'Cancha Deportiva'}</h3>
            <p style="margin: 0; color: #aaa; font-size: 0.85rem;"> ${reserva.ubicacion || 'Ubicación no especificada'}</p>
            <small style="color: #107c41; font-weight: bold;"> ${reserva.fecha || ''} -  ${reserva.hora || ''} (${reserva.duracion || ''})</small>
          </div>

          <button class="btn-ver-reserva" data-index="${index}" style="background: #2a2f3a; color: #fff; border: 1px solid #444; padding: 8px 14px; border-radius: 6px; cursor: pointer; font-weight: bold;">
            Ver reserva
          </button>
        </div>
      `;
      contenedorProximas.innerHTML += tarjetaHTML;
    });
  }

  // 5. Mapear datos específicos de una reserva al panel lateral
  function mostrarDetalleReserva(reserva) {
    if (!panelDetalle) return;

    reservaSeleccionada = reserva;

    const elementosDinamicos = panelDetalle.querySelectorAll("[data-field]");

    elementosDinamicos.forEach((elemento) => {
      const campo = elemento.getAttribute("data-field");
      let valor = reserva[campo];
      
      if (campo === "usuario" || campo === "cliente" || campo === "nombreUsuario") {
        valor = reserva.cliente || nombreUsuarioReal;
      } else if (campo === "id") {
        valor = reserva.idReserva || reserva.id;
      } else if (campo === "hora" || campo === "horario") {
        valor = reserva.hora || reserva.horario || reserva.time;
      }

      if (valor !== undefined && valor !== null) {
        if (elemento.tagName === "IMG") {
          elemento.src = valor;
          elemento.alt = reserva.nombre;
        } else if (campo === "precio") {
          elemento.textContent = `$ ${Number(valor).toLocaleString("es-CO")} COP`;
        } else {
          elemento.textContent = valor;
        }
      }
    });

    panelDetalle.style.display = "block";
  }

  // 6. Asignar eventos a los botones "Ver reserva"
  const botonesVer = document.querySelectorAll(".btn-ver-reserva");
  botonesVer.forEach((boton) => {
    boton.addEventListener("click", (e) => {
      const index = e.currentTarget.getAttribute("data-index");
      mostrarDetalleReserva(misReservas[index]);
    });
  });

  if (btnCerrarDetalle) {
    btnCerrarDetalle.addEventListener("click", () => {
      panelDetalle.style.display = "none";
    });
  }

  // Abrir panel por defecto con la primera reserva
  if (misReservas.length > 0) {
    mostrarDetalleReserva(misReservas[0]);
  }

  // 7. Cancelar reserva usando el modal personalizado
  if (btnCancelar) {
    btnCancelar.addEventListener("click", () => {
      if (!reservaSeleccionada) return;

      mostrarModal({
        titulo: "Cancelar reserva",
        mensaje: "¿Seguro que deseas cancelar esta reserva? El horario quedará disponible inmediatamente.",
        icono: "⚠️",
        botones: [
          {
            texto: "Volver",
            clase: "modal-boton-secundario",
            cerrar: true
          },
          {
            texto: "Sí, cancelar",
            clase: "modal-boton-peligro",
            accion: () => {
              const indiceReserva = misReservas.indexOf(reservaSeleccionada);

              if (indiceReserva === -1) {
                mostrarModal({
                  titulo: "Error",
                  mensaje: "No se pudo encontrar la reserva seleccionada.",
                  icono: "❌",
                  botones: [{ texto: "Entendido", clase: "modal-boton-principal" }]
                });
                return;
              }

              const reservasActualizadas = misReservas.filter((_, index) => index !== indiceReserva);
              localStorage.setItem("mis_reservas", JSON.stringify(reservasActualizadas));

              mostrarModal({
                titulo: "Reserva cancelada",
                mensaje: "Tu reserva ha sido cancelada correctamente.",
                icono: "✅",
                botones: [{
                  texto: "Aceptar",
                  clase: "modal-boton-principal",
                  accion: () => window.location.reload()
                }]
              });
            }
          }
        ]
      });
    });
  }

  // 8. Menú desplegable para modificar
  if (btnModificar) {
    btnModificar.addEventListener("click", () => {
      if (!reservaSeleccionada) {
        mostrarModal({
          titulo: "Atención",
          mensaje: "Primero selecciona una reserva de la lista.",
          icono: "ℹ️",
          botones: [{ texto: "Entendido", clase: "modal-boton-principal" }]
        });
        return;
      }
      menuModificar.classList.toggle("mostrar");
    });
  }

  // 9. Acciones del menú modificar utilizando el modal personalizado
  if (btnCambiarHorario) {
    btnCambiarHorario.addEventListener("click", () => {
      menuModificar.classList.remove("mostrar");
      mostrarModal({
        titulo: "Cambiar horario",
        mensaje: "Esta funcionalidad estará disponible próximamente.",
        icono: "🕐",
        botones: [{ texto: "Entendido", clase: "modal-boton-principal" }]
      });
    });
  }

  if (btnCambiarDia) {
    btnCambiarDia.addEventListener("click", () => {
      menuModificar.classList.remove("mostrar");
      mostrarModal({
        titulo: "Cambiar día",
        mensaje: "Esta funcionalidad estará disponible próximamente.",
        icono: "📅",
        botones: [{ texto: "Entendido", clase: "modal-boton-principal" }]
      });
    });
  }
});