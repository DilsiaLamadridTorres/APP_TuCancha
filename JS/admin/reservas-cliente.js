document.addEventListener("DOMContentLoaded", () => {
  const panelDetalle = document.getElementById("panel-detalle");
  const btnCerrar = panelDetalle ? panelDetalle.querySelector(".btn-cerrar") : null;
  const contenedorProximas = document.getElementById("contenedor-proximas");

  // Ocultar el panel lateral por defecto
  if (panelDetalle) {
    panelDetalle.style.display = "none";
  }

  // 1. Intentar obtener la reserva recién hecha desde el localStorage
  // Revisa estas claves en el orden en que suelen guardarse al pagar/reservar
  const reservaGuardada = 
    localStorage.getItem("reserva_realizada") || 
    localStorage.getItem("reserva_actual") || 
    localStorage.getItem("cancha_seleccionada");

  if (!reservaGuardada) {
    if (contenedorProximas) {
      contenedorProximas.innerHTML = `<p style="color: var(--text-muted); padding: 10px;">No tienes reservas activas en este momento.</p>`;
    }
    return;
  }

  // Parsear el objeto real de localStorage
  const reserva = JSON.parse(reservaGuardada);

  // 2. Renderizar únicamente la reserva realizada en la sección izquierda
  if (contenedorProximas) {
    contenedorProximas.innerHTML = ""; // Limpia texto por defecto

    const tarjeta = document.createElement("div");
    tarjeta.className = "tarjeta-reserva";

    // Normalización de campos por si variaron en el formulario de pago/reserva
    const nombre = reserva.nombre || reserva.nombreCancha || "Cancha Reservada";
    const ubicacion = reserva.ubicacion || reserva.ciudad || "Ubicación no disponible";
    const fecha = reserva.fecha || reserva.fechaReserva || "Fecha pendiente";
    const hora = reserva.hora || reserva.horaReserva || "";
    const imagen = reserva.imagen || reserva.img || reserva.foto || "https://equiver.com.co/images/campos-futbol-microfutbol-grama-sintetica/campos-futbol-microfutbol-grama-sintetica-2.jpg";

    tarjeta.innerHTML = `
      <div style="display: flex; gap: 15px; align-items: center;">
        <img src="${imagen}" alt="${nombre}" style="width: 80px; height: 60px; object-fit: cover; border-radius: 6px;">
        <div>
          <h3 style="margin: 0 0 5px 0; color: var(--color-blanco-secundario);">${nombre}</h3>
          <p style="margin: 0; color: var(--text-muted); font-size: 0.85rem;">📍 ${ubicacion} | 📅 ${fecha} ${hora ? '(' + hora + ')' : ''}</p>
        </div>
      </div>
      <button class="btn-ver-reserva">Ver reserva</button>
    `;

    // Evento de clic para abrir el panel con la información real
    tarjeta.querySelector(".btn-ver-reserva").addEventListener("click", () => {
      mostrarDetalleReserva(reserva);
    });

    contenedorProximas.appendChild(tarjeta);
  }

  // 3. Función para volcar todos los datos reales en el panel lateral de detalle
  function mostrarDetalleReserva(datos) {
    if (!panelDetalle) return;

    const elementos = panelDetalle.querySelectorAll("[data-field]");

    elementos.forEach((el) => {
      const campo = el.getAttribute("data-field");
      
      // Buscar el valor directamente en el objeto o sus alias comunes
      let valor = datos[campo];
      if (valor === undefined || valor === null) {
        if (campo === "imagen") valor = datos.img || datos.foto;
        if (campo === "nombre") valor = datos.nombreCancha;
        if (campo === "ubicacion") valor = datos.ciudad;
        if (campo === "fecha") valor = datos.fechaReserva;
        if (campo === "hora") valor = datos.horaReserva;
        if (campo === "id") valor = datos.idReserva || datos.numeroReserva || "RES-" + Math.floor(1000 + Math.random() * 9000);
      }

      if (valor !== undefined && valor !== null) {
        if (el.tagName === "IMG") {
          el.src = valor;
          el.alt = datos.nombre || "Imagen de la cancha";
        } else if (campo === "precio") {
          const precioNum = Number(valor);
          el.textContent = isNaN(precioNum)
            ? valor
            : `$ ${precioNum.toLocaleString("es-CO")} COP`;
        } else {
          el.textContent = valor;
        }
      }
    });

    panelDetalle.style.display = "block";
  }

  // 4. Cerrar el panel al pulsar 'X'
  if (btnCerrar) {
    btnCerrar.addEventListener("click", () => {
      panelDetalle.style.display = "none";
    });
  }
});