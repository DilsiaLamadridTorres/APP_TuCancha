document.addEventListener("DOMContentLoaded", () => {
  const contenedorProximas = document.getElementById("contenedor-proximas");
  const panelDetalle = document.getElementById("panel-detalle");
  const btnCerrarDetalle = document.querySelector(".btn-cerrar");

  // 1. Cargar el usuario logueado actual desde sessionStorage (o localStorage como respaldo)
  const usuarioLogueadoStr = sessionStorage.getItem("usuario") || localStorage.getItem("usuario_logueado") || localStorage.getItem("usuario");
  const usuarioActual = usuarioLogueadoStr ? JSON.parse(usuarioLogueadoStr) : null;
  
  // Extraer el nombre real del usuario (compatible con Supabase o estructura personalizada)
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

  // 4. Pintar todas las tarjetas dinámicamente en la izquierda
  if (contenedorProximas) {
    contenedorProximas.innerHTML = ""; // Limpiar contenedor
    
    misReservas.forEach((reserva, index) => {
      const tarjetaHTML = `
        <div class="tarjeta-reserva" style="background: #181c24; border: 1px solid #2a2f3a; border-radius: 8px; padding: 15px; margin-bottom: 15px; display: flex; align-items: center; justify-content: space-between; gap: 15px;">
          <img src="${reserva.imagen || ''}" alt="${reserva.nombre || 'Cancha'}" style="width: 100px; height: 70px; object-fit: cover; border-radius: 6px;">
          
          <div style="flex: 1;">
            <h3 style="margin: 0 0 5px 0; color: #fff; font-size: 1.1rem;">${reserva.nombre || 'Cancha Deportiva'}</h3>
            <p style="margin: 0; color: #aaa; font-size: 0.85rem;">📍 ${reserva.ubicacion || 'Ubicación no especificada'}</p>
            <small style="color: #107c41; font-weight: bold;">📅 ${reserva.fecha || ''} - ⏰ ${reserva.hora || ''} (${reserva.duracion || ''})</small>
          </div>

          <button class="btn-ver-reserva" data-index="${index}" style="background: #2a2f3a; color: #fff; border: 1px solid #444; padding: 8px 14px; border-radius: 6px; cursor: pointer; font-weight: bold;">
            Ver reserva
          </button>
        </div>
      `;
      contenedorProximas.innerHTML += tarjetaHTML;
    });
  }

  // 5. Función para mapear los datos específicos de una reserva y del usuario al panel lateral
  // 5. Función para mapear los datos específicos de una reserva al panel lateral
  function mostrarDetalleReserva(reserva) {
    if (!panelDetalle) return;

    const elementosDinamicos = panelDetalle.querySelectorAll("[data-field]");

    elementosDinamicos.forEach((elemento) => {
      const campo = elemento.getAttribute("data-field");

      let valor = reserva[campo];
      
      // Mapear campos especiales y asegurar nombres alternativos
      if (campo === "usuario" || campo === "cliente" || campo === "nombreUsuario") {
        valor = reserva.cliente || nombreUsuarioReal;
      } else if (campo === "id") {
        valor = reserva.idReserva || reserva.id;
      } else if (campo === "hora" || campo === "horario") {
        // Busca en cualquiera de las propiedades donde pueda venir la hora de la cancha
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

  // 6. Asignar eventos a cada botón "Ver reserva" generado
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

  // Abrir por defecto el panel lateral con la información de la primera reserva de la lista
  if (misReservas.length > 0) {
    mostrarDetalleReserva(misReservas[0]);
  }
});