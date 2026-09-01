document.addEventListener("DOMContentLoaded", () => {
  const panelDetalle = document.getElementById("panel-detalle");
  const btnCerrar = panelDetalle ? panelDetalle.querySelector(".btn-cerrar") : null;
  const contenedorProximas = document.getElementById("contenedor-proximas");

  // Ocultar el panel lateral por defecto
  if (panelDetalle) {
    panelDetalle.style.display = "none";
  }

  // -----------------------------------------------------------
  // 1. Obtener y actualizar datos del USUARIO LOGUEADO
  // -----------------------------------------------------------
  const usuarioGuardado = 
    sessionStorage.getItem("usuario_logueado") || 
    localStorage.getItem("usuario_logueado") || 
    localStorage.getItem("usuario");

  let usuarioActual = { nombre: "Usuario" };

  if (usuarioGuardado) {
    try {
      usuarioActual = JSON.parse(usuarioGuardado);
    } catch (e) {
      // Por si el storage solo guardó un string plano con el nombre
      usuarioActual = { nombre: usuarioGuardado };
    }
  }

  // Nombre completo o primer nombre
  const nombreMostrar = usuarioActual.nombre 
    ? `${usuarioActual.nombre} ${usuarioActual.apellido || ''}`.trim() 
    : "Usuario";

  // Actualizar el saludo en la Navbar si existe la etiqueta
  const elementoSaludo = document.querySelector(".user-info span:last-child") || document.querySelector(".user-name");
  if (elementoSaludo) {
    elementoSaludo.textContent = `Hola, ${usuarioActual.nombre || 'Usuario'}`;
  }

  // -----------------------------------------------------------
  // 2. Obtener la reserva guardada desde localStorage
  // -----------------------------------------------------------
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

  const reserva = JSON.parse(reservaGuardada);

  // -----------------------------------------------------------
  // 3. Renderizar únicamente la tarjeta de la reserva
  // -----------------------------------------------------------
  if (contenedorProximas) {
    contenedorProximas.innerHTML = "";

    const nombreCancha = reserva.nombre || reserva.nombreCancha || "Cancha Reservada";
    const ubicacion = reserva.ubicacion || reserva.ciudad || "Ubicación no disponible";
    const fecha = reserva.fecha || reserva.fechaReserva || "Fecha pendiente";
    const hora = reserva.hora || reserva.horaReserva || "";
    const imagen = reserva.imagen || reserva.img || reserva.foto || "https://equiver.com.co/images/campos-futbol-microfutbol-grama-sintetica/campos-futbol-microfutbol-grama-sintetica-2.jpg";

    const tarjeta = document.createElement("div");
    tarjeta.className = "tarjeta-reserva";

    tarjeta.innerHTML = `
      <div style="display: flex; gap: 15px; align-items: center;">
        <img src="${imagen}" alt="${nombreCancha}" style="width: 80px; height: 60px; object-fit: cover; border-radius: 6px;">
        <div>
          <h3 style="margin: 0 0 5px 0; color: var(--color-blanco-secundario);">${nombreCancha}</h3>
          <p style="margin: 0; color: var(--text-muted); font-size: 0.85rem;">📍 ${ubicacion} | 📅 ${fecha} ${hora ? '(' + hora + ')' : ''}</p>
        </div>
      </div>
      <button class="btn-ver-reserva">Ver reserva</button>
    `;

    tarjeta.querySelector(".btn-ver-reserva").addEventListener("click", () => {
      mostrarDetalleReserva(reserva);
    });

    contenedorProximas.appendChild(tarjeta);
  }

  // -----------------------------------------------------------
  // 4. Mostrar panel derecho con datos de reserva y del usuario
  // -----------------------------------------------------------
  function mostrarDetalleReserva(datos) {
    if (!panelDetalle) return;

    const elementos = panelDetalle.querySelectorAll("[data-field]");

    elementos.forEach((el) => {
      const campo = el.getAttribute("data-field");
      
      let valor = datos[campo];

      // Caso especial: Campo "usuario" o "Reserva para"
      if (campo === "usuario") {
        valor = nombreMostrar;
      }

      // Mapeo de respaldos para campos de reserva
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

  // 5. Cerrar panel con la 'X'
  if (btnCerrar) {
    btnCerrar.addEventListener("click", () => {
      panelDetalle.style.display = "none";
    });
  }
});