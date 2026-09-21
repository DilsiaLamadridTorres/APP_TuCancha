document.addEventListener("DOMContentLoaded", () => {
<<<<<<< HEAD
  let reservaSeleccionada = null;
=======
>>>>>>> 58f61cd81eb2d571429defeb0c3fefae0e253156
  const contenedorProximas = document.getElementById("contenedor-proximas");
  const contenedorAnteriores = document.getElementById("contenedor-anteriores");
  const panelDetalle = document.getElementById("panel-detalle");
  const btnCerrarDetalle = document.querySelector(".btn-cerrar");
  const btnModificar = document.querySelector(".btn-modificar");
  const btnCancelar = document.getElementById("btn-cancelar-reserva");
<<<<<<< HEAD
  const btnModificar = document.querySelector(".btn-modificar");
  const menuModificar = document.getElementById("menu-modificar");
  const btnCambiarHorario = document.getElementById("btn-cambiar-horario");
  const btnCambiarDia = document.getElementById("btn-cambiar-dia");

  // 1. Cargar el usuario logueado actual desde sessionStorage (o localStorage como respaldo)
  const usuarioLogueadoStr =
    sessionStorage.getItem("usuario") ||
    localStorage.getItem("usuario_logueado") ||
    localStorage.getItem("usuario");

=======
  const filtros = document.querySelectorAll(".btn-filtro");
  const selectOrden = document.getElementById("select-orden");

  let reservaSeleccionada = null;
  let filtroActual = "todas";
  let ordenActual = "proximas";

  const usuarioLogueadoStr = sessionStorage.getItem("usuario") || localStorage.getItem("usuario_logueado") || localStorage.getItem("usuario");
>>>>>>> 58f61cd81eb2d571429defeb0c3fefae0e253156
  const usuarioActual = usuarioLogueadoStr ? JSON.parse(usuarioLogueadoStr) : null;
  const nombreUsuarioReal = usuarioActual?.nombre || usuarioActual?.correo || "Cliente";

  function obtenerReservas() {
    const reservasGuardadas = localStorage.getItem("mis_reservas");
    let reservas = [];

    try {
      reservas = reservasGuardadas ? JSON.parse(reservasGuardadas) : [];
    } catch (error) {
      localStorage.removeItem("mis_reservas");
      reservas = [];
    }

    if (!Array.isArray(reservas)) {
      reservas = [];
    }

    return reservas.map((reserva, index) => ({
      ...reserva,
      idReserva: reserva.idReserva || `RES-LEGACY-${index + 1}`,
      estado: String(reserva.estado || "Confirmada").trim(),
      fecha: reserva.fecha || "",
      hora: reserva.hora || reserva.horario || "",
      nombre: reserva.nombre || "Cancha deportiva"
    }));
  }

<<<<<<< HEAD
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
=======
  function escaparHtml(valor) {
    return String(valor ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function obtenerCategoria(reserva) {
    const estado = String(reserva.estado || "Confirmada").trim().toLowerCase();
    const fechaTexto = reserva.fecha || "";
    const fechaObj = fechaTexto ? new Date(`${fechaTexto}T00:00:00`) : null;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (estado === "cancelada") return "canceladas";
    if (estado === "completada" || estado === "completadas") return "completadas";
    if (fechaObj && fechaObj < hoy) return "completadas";
    return "proximas";
  }

  let misReservas = obtenerReservas().map((reserva) => ({
    ...reserva,
    _categoria: obtenerCategoria(reserva)
  }));

  function actualizarContadores() {
    const proximas = misReservas.filter((reserva) => reserva._categoria === "proximas").length;
    const completadas = misReservas.filter((reserva) => reserva._categoria === "completadas").length;
    const canceladas = misReservas.filter((reserva) => reserva._categoria === "canceladas").length;

    const labels = Array.from(document.querySelectorAll(".btn-filtro span"));
    if (labels[0]) labels[0].textContent = misReservas.length;
    if (labels[1]) labels[1].textContent = proximas;
    if (labels[2]) labels[2].textContent = completadas;
    if (labels[3]) labels[3].textContent = canceladas;
  }

  function renderTarjeta(reserva, index) {
    const estado = (reserva.estado || "Confirmada").toString();
    const badgeColor = estado.toLowerCase() === "cancelada"
      ? "#dc3545"
      : estado.toLowerCase() === "completada" || estado.toLowerCase() === "completadas"
        ? "#0d6efd"
        : "#107c41";
>>>>>>> 58f61cd81eb2d571429defeb0c3fefae0e253156

    return `
      <div class="tarjeta-reserva" data-estado="${escaparHtml(estado)}" style="background: #181c24; border: 1px solid #2a2f3a; border-radius: 8px; padding: 15px; margin-bottom: 15px; display: flex; align-items: center; justify-content: space-between; gap: 15px;">
        <img src="${escaparHtml(reserva.imagen || "")}" alt="${escaparHtml(reserva.nombre || "Cancha")}" style="width: 100px; height: 70px; object-fit: cover; border-radius: 6px;">
        <div style="flex: 1; min-width: 0;">
          <div style="display: flex; justify-content: space-between; align-items: center; gap: 10px; margin-bottom: 6px;">
            <h3 style="margin: 0; color: #fff; font-size: 1.1rem;">${escaparHtml(reserva.nombre || "Cancha Deportiva")}</h3>
            <span style="background: ${badgeColor}; color: white; font-size: 0.72rem; border-radius: 999px; padding: 4px 8px; font-weight: 700;">${escaparHtml(estado)}</span>
          </div>
          <p style="margin: 0; color: #aaa; font-size: 0.85rem;">Ubicación: ${escaparHtml(reserva.ubicacion || "Ubicación no especificada")}</p>
          <small style="color: #d8dfe7; font-weight: bold;">Fecha: ${escaparHtml(reserva.fecha || "")} - Hora: ${escaparHtml(reserva.hora || reserva.horario || "")} (${escaparHtml(reserva.duracion || "")})</small>
        </div>
        <button class="btn-ver-reserva" data-index="${index}" style="background: #2a2f3a; color: #fff; border: 1px solid #444; padding: 8px 14px; border-radius: 6px; cursor: pointer; font-weight: bold;">
          Ver reserva
        </button>
      </div>
    `;
  }

  function renderLista() {
    const ordenado = [...misReservas].sort((a, b) => {
      const fechaA = a.fecha ? new Date(`${a.fecha}T00:00:00`).getTime() : Number.MAX_SAFE_INTEGER;
      const fechaB = b.fecha ? new Date(`${b.fecha}T00:00:00`).getTime() : Number.MAX_SAFE_INTEGER;
      return ordenActual === "antiguas" ? fechaA - fechaB : fechaB - fechaA;
    });

    const filtradas = filtroActual === "todas"
      ? ordenado
      : ordenado.filter((reserva) => reserva._categoria === filtroActual);

    const proximas = filtradas.filter((reserva) => reserva._categoria === "proximas");
    const completadas = filtradas.filter((reserva) => reserva._categoria === "completadas");
    const canceladas = filtradas.filter((reserva) => reserva._categoria === "canceladas");

    if (contenedorProximas) {
      contenedorProximas.innerHTML = "";
      const items = filtroActual === "canceladas" ? canceladas : proximas;

      if (items.length === 0) {
        contenedorProximas.innerHTML = `
          <div style="padding: 20px; text-align: center; color: #aaa; background: #181c24; border-radius: 8px;">
            <p>No hay reservas en esta sección.</p>
          </div>
        `;
      } else {
        items.forEach((reserva, index) => {
          const reservaIndex = misReservas.findIndex((r) => r.idReserva === reserva.idReserva);
          contenedorProximas.innerHTML += renderTarjeta(reserva, reservaIndex >= 0 ? reservaIndex : index);
        });
      }
    }

    if (contenedorAnteriores) {
      contenedorAnteriores.innerHTML = "";
      const items = filtroActual === "todas"
        ? [...completadas, ...canceladas]
        : filtroActual === "completadas"
          ? completadas
          : filtroActual === "canceladas"
            ? canceladas
            : [];

      if (items.length === 0) {
        contenedorAnteriores.innerHTML = `
          <div style="padding: 20px; text-align: center; color: #aaa; background: #181c24; border-radius: 8px;">
            <p>No hay reservas anteriores para mostrar.</p>
          </div>
        `;
      } else {
        items.forEach((reserva, index) => {
          const reservaIndex = misReservas.findIndex((r) => r.idReserva === reserva.idReserva);
          contenedorAnteriores.innerHTML += renderTarjeta(reserva, reservaIndex >= 0 ? reservaIndex : index);
        });
      }
    }

    const btnVer = document.querySelectorAll(".btn-ver-reserva");
    btnVer.forEach((boton) => {
      boton.addEventListener("click", (event) => {
        const index = Number(event.currentTarget.getAttribute("data-index"));
        const reserva = misReservas[index];
        if (!reserva) return;
        mostrarDetalleReserva(reserva);
      });
    });
  }

<<<<<<< HEAD
  // 5. Mapear datos específicos de una reserva al panel lateral
  function mostrarDetalleReserva(reserva) {
    if (!panelDetalle) return;

    reservaSeleccionada = reserva;
=======
  function mostrarDetalleReserva(reserva) {
    if (!panelDetalle || !reserva) return;
>>>>>>> 58f61cd81eb2d571429defeb0c3fefae0e253156

    reservaSeleccionada = reserva;
    const reservaCancelada = String(reserva.estado || "").trim().toLowerCase() === "cancelada";
    if (btnCancelar) {
      btnCancelar.disabled = reservaCancelada;
      btnCancelar.textContent = reservaCancelada ? "Reserva cancelada" : "Cancelar reserva";
      btnCancelar.setAttribute("aria-disabled", String(reservaCancelada));
    }
    const elementosDinamicos = panelDetalle.querySelectorAll("[data-field]");

    elementosDinamicos.forEach((elemento) => {
      const campo = elemento.getAttribute("data-field");
      let valor = reserva[campo];
<<<<<<< HEAD
      
=======

>>>>>>> 58f61cd81eb2d571429defeb0c3fefae0e253156
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

<<<<<<< HEAD
  // 6. Asignar eventos a los botones "Ver reserva"
  const botonesVer = document.querySelectorAll(".btn-ver-reserva");
  botonesVer.forEach((boton) => {
    boton.addEventListener("click", (e) => {
      const index = e.currentTarget.getAttribute("data-index");
      mostrarDetalleReserva(misReservas[index]);
=======
  function aplicarFiltro(nuevoFiltro) {
    filtroActual = nuevoFiltro;
    filtros.forEach((boton) => {
      const esActivo = boton.dataset.filter === nuevoFiltro;
      boton.classList.toggle("active", esActivo);
    });
    renderLista();
  }

  function actualizarReservas() {
    localStorage.setItem("mis_reservas", JSON.stringify(misReservas.map(({ _categoria, ...reserva }) => reserva)));
    actualizarContadores();
    renderLista();
  }

  filtros.forEach((boton) => {
    boton.addEventListener("click", () => {
      const nombre = boton.textContent.trim().toLowerCase();
      if (nombre.includes("todas")) {
        aplicarFiltro("todas");
      } else if (nombre.includes("próximas") || nombre.includes("proximas")) {
        aplicarFiltro("proximas");
      } else if (nombre.includes("completadas")) {
        aplicarFiltro("completadas");
      } else if (nombre.includes("canceladas")) {
        aplicarFiltro("canceladas");
      }
>>>>>>> 58f61cd81eb2d571429defeb0c3fefae0e253156
    });
  });

  if (selectOrden) {
    selectOrden.addEventListener("change", (event) => {
      ordenActual = event.target.value;
      renderLista();
    });
  }

  if (btnCerrarDetalle) {
    btnCerrarDetalle.addEventListener("click", () => {
      panelDetalle.style.display = "none";
    });
  }

<<<<<<< HEAD
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
=======
  if (btnModificar) {
    btnModificar.addEventListener("click", () => {
      if (!reservaSeleccionada) return;

      const estado = String(reservaSeleccionada.estado || "").toLowerCase();
      if (estado === "cancelada" || estado === "completada" || estado === "completadas") {
        showToast("Solo puedes modificar una reserva activa o próxima.", "warning");
        return;
      }

      const reservaParaEditar = {
        ...reservaSeleccionada,
        hora: reservaSeleccionada.hora || reservaSeleccionada.horario || "",
        horario: reservaSeleccionada.hora || reservaSeleccionada.horario || ""
      };

      localStorage.setItem("reserva_modificar", JSON.stringify(reservaParaEditar));
      localStorage.setItem("cancha_seleccionada", JSON.stringify({
        id: reservaParaEditar.canchaId || reservaParaEditar.id || reservaParaEditar.idCancha,
        nombre: reservaParaEditar.nombre,
        ubicacion: reservaParaEditar.ubicacion,
        imagen: reservaParaEditar.imagen,
        precio: reservaParaEditar.precio,
        descripcion: reservaParaEditar.descripcion || ""
      }));

      showToast("Preparando la reserva para editarla.", "info");

      setTimeout(() => {
        window.location.href = "reservas-cancha.html";
      }, 500);
    });
  }

  if (btnCancelar) {
    btnCancelar.addEventListener("click", async () => {
      if (!reservaSeleccionada) return;

      if (String(reservaSeleccionada.estado || "").trim().toLowerCase() === "cancelada") {
        showToast("Esta reserva ya está cancelada.", "info");
        return;
      }

      const confirmar = await window.showConfirm(
        "¿Seguro que deseas cancelar esta reserva? El horario quedará disponible."
      );

      if (!confirmar) return;

      misReservas = misReservas.map((reserva) => {
        if (reserva.idReserva === reservaSeleccionada.idReserva) {
          return { ...reserva, estado: "Cancelada", _categoria: "canceladas" };
        }

        return reserva;
      });

      actualizarReservas();
      showToast("Reserva cancelada correctamente.", "success");
      panelDetalle.style.display = "none";
      reservaSeleccionada = null;
    });
  }

  filtros.forEach((boton) => {
    const texto = boton.textContent.trim().toLowerCase();
    if (texto.includes("todas")) boton.dataset.filter = "todas";
    if (texto.includes("próximas") || texto.includes("proximas")) boton.dataset.filter = "proximas";
    if (texto.includes("completadas")) boton.dataset.filter = "completadas";
    if (texto.includes("canceladas")) boton.dataset.filter = "canceladas";
  });

  actualizarContadores();
  aplicarFiltro("todas");

  if (misReservas.length > 0) {
    mostrarDetalleReserva(misReservas[0]);
  }
});
>>>>>>> 58f61cd81eb2d571429defeb0c3fefae0e253156
