document.addEventListener("DOMContentLoaded", () => {
    // 1. Cargar los datos de la reserva guardados previamente en el localStorage
    const reservaGuardada = localStorage.getItem("reserva_seleccionada");
    
    if (!reservaGuardada) {
        alert("No hay ninguna reserva en proceso.");
        window.location.href = "../index.html"; 
        return;
    }

    const reserva = JSON.parse(reservaGuardada);

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

    // 3. Manejar la visualización de los campos de tarjeta según el método de pago seleccionado
    const radiosPago = document.querySelectorAll('input[name="metodoPago"]');
    const seccionTarjeta = document.getElementById("seccion-datos-tarjeta");
    const pagoStatus = document.getElementById("pago-status");

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
        btnCancelar.addEventListener("click", () => {
            if (confirm("¿Estás seguro de que deseas cancelar esta reserva?")) {
                localStorage.removeItem("reserva_seleccionada");
                alert("Reserva cancelada.");
                window.location.href = "canchas.html"; 
            }
        });
    }

    // 5. Funcionalidad del botón Confirmar y Pagar
    const formPago = document.getElementById("pago-form");

    formPago.addEventListener("submit", (e) => {
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

        // Deshabilitar botón temporalmente y cambiar texto a "Reservado"
        const btnConfirmar = document.getElementById("btn-confirmar-pago");
        btnConfirmar.disabled = true;
        btnConfirmar.innerHTML = `<i class="bi bi-check-circle-fill me-2"></i> Reservado`;

        mostrarAviso("Procesando pago y asegurando tu cancha...", "warning");

        setTimeout(() => {
            // Guardar datos definitivos en el arreglo de "mis_reservas"
            reserva.metodoPago = metodoSeleccionado.value;
            reserva.estado = "Confirmada";
            reserva.fechaPago = new Date().toLocaleString("es-CO");

            let misReservas = JSON.parse(localStorage.getItem("mis_reservas")) || [];
            misReservas.push(reserva);
            localStorage.setItem("mis_reservas", JSON.stringify(misReservas));

            // Limpiar la reserva temporal en proceso
            localStorage.removeItem("reserva_seleccionada");

            // Mostrar aviso de éxito definitivo y quedarse en la página
            mostrarAviso("¡Pago exitoso! Cancha reservada correctamente.", "success");

            // Deshabilitar el formulario y el botón de cancelar para congelar la vista
            formPago.querySelectorAll("input, button").forEach(el => el.disabled = true);
            if (btnCancelar) btnCancelar.disabled = true;

        }, 1500);
    });

    // Función auxiliar para pintar avisos dinámicos bonitos en pantalla
    function mostrarAviso(mensaje, tipo) {
        if (!pagoStatus) return;
        pagoStatus.className = `alert alert-${tipo} mt-3 text-center fw-bold shadow-sm`;
        pagoStatus.textContent = mensaje;
    }
});