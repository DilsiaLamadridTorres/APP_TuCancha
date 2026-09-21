import { backendApi } from "../services/backend-api.js";

document.addEventListener("DOMContentLoaded", () => {
    const reservaGuardada = localStorage.getItem("reserva_seleccionada");

    if (!reservaGuardada) {
<<<<<<< HEAD
        mostrarModal({
            titulo: "Sin reserva activa",
            mensaje: "No hay ninguna reserva en proceso. Regresa a la selección de canchas.",
            icono: "ℹ️",
            botones: [{
                texto: "Volver",
                clase: "modal-boton-principal",
                accion: () => window.location.href = "canchas.html"
            }]
        });
=======
        showToast("No hay ninguna reserva en proceso.", "warning");
        window.location.href = "../index.html";
>>>>>>> 58f61cd81eb2d571429defeb0c3fefae0e253156
        return;
    }

    let reserva;

    try {
        reserva = JSON.parse(reservaGuardada);
    } catch (error) {
        localStorage.removeItem("reserva_seleccionada");
        showToast("La reserva guardada no es válida.", "error");
        window.location.href = "canchas.html";
        return;
    }

    // 2. Inyectar dinámicamente los datos en los elementos HTML con [data-field]
    Object.keys(reserva).forEach(key => {
        const elementos = document.querySelectorAll(`[data-field="${key}"]`);
        elementos.forEach(elemento => {
            if (key === "imagen") {
                elemento.src = reserva[key];
            } else if (key === "precio") {
                elemento.textContent = `$${Number(reserva[key]).toLocaleString()}`;
            } else {
                elemento.textContent = reserva[key];
            }
        });
    });

    const radiosPago = document.querySelectorAll('input[name="metodoPago"]');
    const seccionTarjeta = document.getElementById("seccion-datos-tarjeta");
    const pagoStatus = document.getElementById("pago-status");
    const formPago = document.getElementById("pago-form");

    if (!formPago) {
        return;
    }

    radiosPago.forEach(radio => {
        radio.addEventListener("change", (e) => {
            if (e.target.value === "tarjeta") {
                seccionTarjeta.classList.remove("d-none");
            } else {
                seccionTarjeta.classList.add("d-none");
                // Limpiamos los campos si cambia de opinión a Nequi o Daviplata
                document.getElementById("numero-tarjeta").value = "";
                document.getElementById("vencimiento").value = "";
                document.getElementById("cvv").value = "";
                document.getElementById("nombre-titular").value = "";
                if (pagoStatus) pagoStatus.textContent = "";
            }
        });
    });

    // 4. Funcionalidad del botón Eliminar / Cancelar Reserva (Devuelve a canchas.html)
    const btnCancelar = document.getElementById("btn-cancelar-reserva");
    if (btnCancelar) {
        btnCancelar.addEventListener("click", async () => {
            const confirmar = await window.showConfirm("¿Estás seguro de que deseas cancelar esta reserva?");

            if (!confirmar) {
                return;
            }

            localStorage.removeItem("reserva_seleccionada");
            showToast("Reserva cancelada.", "success");
            window.location.href = "canchas.html";
        });
    }

    formPago.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Validar método de pago seleccionado
        const metodoSeleccionado = document.querySelector('input[name="metodoPago"]:checked');
        if (!metodoSeleccionado) {
            mostrarAviso("Por favor selecciona un método de pago.", "danger");
            return;
        }

        // Si es tarjeta, validar campos obligatorios
        if (metodoSeleccionado.value === "tarjeta") {
            const numTarjeta = document.getElementById("numero-tarjeta").value.trim();
            const vencimiento = document.getElementById("vencimiento").value.trim();
            const cvv = document.getElementById("cvv").value.trim();
            const titular = document.getElementById("nombre-titular").value.trim();

            if (!numTarjeta || !vencimiento || !cvv || !titular) {
                mostrarAviso("Por favor completa todos los datos de la tarjeta.", "danger");
                return;
            }
        }

        let usuario;

        try {
            usuario = JSON.parse(sessionStorage.getItem("usuario"));
        } catch (error) {
            mostrarAviso("No fue posible identificar tu sesión.", "danger");
            return;
        }

        if (!usuario?.idBackend || !Number.isInteger(Number(reserva.horarioId)) || Number(reserva.horarioId) <= 0) {
            mostrarAviso(
                "No fue posible identificar el usuario o el horario válido de la reserva. Revisa la disponibilidad del servidor.",
                "danger"
            );
            return;
        }

        // Deshabilitar botón temporalmente mientras se confirma con el backend.
        const btnConfirmar = document.getElementById("btn-confirmar-pago");
        btnConfirmar.disabled = true;
        btnConfirmar.innerHTML = `<i class="bi bi-check-circle-fill me-2"></i> Reservado`;

        mostrarAviso("Procesando pago y asegurando tu cancha...", "warning");

        try {
            const respuestaReserva = await backendApi.crearReserva(usuario.idBackend, reserva.horarioId);

            await new Promise(resolve => setTimeout(resolve, 1500));

            reserva.metodoPago = metodoSeleccionado.value;
            reserva.estado = "Confirmada";
            reserva.fechaPago = new Date().toLocaleString("es-CO");
<<<<<<< HEAD
            reserva.idReserva = respuestaReserva?.id || respuestaReserva?.idReserva || `RES-${Date.now()}`;

            const misReservasGuardadas = JSON.parse(localStorage.getItem("mis_reservas") || "[]");
            const yaExiste = misReservasGuardadas.some(item => String(item.idReserva || item.id) === String(reserva.idReserva));
            if (!yaExiste) {
                misReservasGuardadas.push(reserva);
                localStorage.setItem("mis_reservas", JSON.stringify(misReservasGuardadas));
            }

=======
            reserva.idReserva = `RES-${Date.now()}`;

            let misReservas = JSON.parse(localStorage.getItem("mis_reservas")) || [];
            misReservas.push(reserva);
            localStorage.setItem("mis_reservas", JSON.stringify(misReservas));

            // Limpiar la reserva temporal en proceso
>>>>>>> 58f61cd81eb2d571429defeb0c3fefae0e253156
            localStorage.removeItem("reserva_seleccionada");

            window.location.href = "reservas-cliente.html";
        } catch (error) {
            console.error("No fue posible crear la reserva:", error);
            mostrarAviso(
                error.message || "No fue posible crear la reserva. Inténtalo de nuevo.",
                "danger"
            );
            btnConfirmar.disabled = false;
            btnConfirmar.innerHTML = "Confirmar y pagar";
        }
    });

    // Función auxiliar para pintar avisos dinámicos bonitos en pantalla
    function mostrarAviso(mensaje, tipo) {
        if (!pagoStatus) return;
        pagoStatus.className = `alert alert-${tipo} mt-3 text-center fw-bold shadow-sm`;
        pagoStatus.textContent = mensaje;
    }
});
