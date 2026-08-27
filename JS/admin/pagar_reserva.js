document.addEventListener("DOMContentLoaded", () => {
    // 1. LEER RESERVA ACTUAL DESDE LOCALSTORAGE
    const canchaGuardada = localStorage.getItem("cancha_seleccionada");
    let cancha = null;

    if (canchaGuardada) {
        cancha = JSON.parse(canchaGuardada);
        const elementosDinamicos = document.querySelectorAll("[data-field]");

        elementosDinamicos.forEach(elemento => {
            const campo = elemento.getAttribute("data-field");

            if (elemento.tagName === "IMG") {
                elemento.src = cancha[campo] || "../img/fotocancha.png";
                if (cancha.nombre) {
                    elemento.alt = `Imagen de ${cancha.nombre}`;
                }
            } else if (campo === "precio") {
                const precioNumerico = Number(cancha[campo] || 0);
                elemento.textContent = `$ ${precioNumerico.toLocaleString("es-CO")}`;
            } else {
                elemento.textContent = cancha[campo] || "";
            }
        });
    } else {
        console.warn("No se encontró ninguna cancha seleccionada en LocalStorage.");
    }

    // 2. PROCESAR PAGO
    const formPago = document.getElementById("pago-form");
    const pagoStatus = document.getElementById("pago-status");

    if (formPago) {
        formPago.addEventListener("submit", (e) => {
            e.preventDefault();

            if (!cancha) {
                pagoStatus.textContent = "Error: No hay reserva activa para procesar.";
                pagoStatus.className = "payment-status text-danger";
                return;
            }

            // Cambia el estado a pagado
            cancha.estado = "Pagada";
            localStorage.setItem("cancha_seleccionada", JSON.stringify(cancha));

            pagoStatus.textContent = "¡Pago realizado con éxito! Reserva confirmada.";
            pagoStatus.className = "payment-status text-success";
        });
    }

    // 3. ELIMINAR RESERVA
    const btnCancelar = document.getElementById("btn-cancelar-reserva");

    if (btnCancelar) {
        btnCancelar.addEventListener("click", () => {
            if (confirm("¿Estás seguro de que deseas cancelar y eliminar esta reserva?")) {
                localStorage.removeItem("cancha_seleccionada");
                alert("La reserva ha sido eliminada.");
                window.location.reload();
            }
        });
    }
});