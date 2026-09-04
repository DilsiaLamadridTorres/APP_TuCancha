function cerrarModal() {
    const modal = document.getElementById("modal-tu-cancha");
    const modalBotones = document.getElementById("modal-botones");
    
    if (modal) {
        modal.classList.remove("mostrar");
    }
    if (modalBotones) {
        modalBotones.innerHTML = "";
    }
}

function mostrarModal({
    titulo = "",
    mensaje = "",
    icono = "ℹ️",
    botones = []
}) {
    const modal = document.getElementById("modal-tu-cancha");
    const modalCerrar = document.getElementById("modal-cerrar");
    const modalIcono = document.getElementById("modal-icono");
    const modalTitulo = document.getElementById("modal-titulo");
    const modalMensaje = document.getElementById("modal-mensaje");
    const modalBotones = document.getElementById("modal-botones");

    if (!modal) {
        console.warn("No se encontró el contenedor #modal-tu-cancha en el DOM.");
        return;
    }

    if (modalIcono) modalIcono.textContent = icono;
    if (modalTitulo) modalTitulo.textContent = titulo;
    if (modalMensaje) modalMensaje.textContent = mensaje;

    if (modalBotones) {
        modalBotones.innerHTML = "";

        botones.forEach((boton) => {
            const nuevoBoton = document.createElement("button");
            nuevoBoton.type = "button";
            nuevoBoton.textContent = boton.texto;

            nuevoBoton.classList.add(
                "modal-boton",
                boton.clase || "modal-boton-principal"
            );

            nuevoBoton.addEventListener("click", () => {
                if (typeof boton.accion === "function") {
                    boton.accion();
                }

                if (boton.cerrar !== false) {
                    cerrarModal();
                }
            });

            modalBotones.appendChild(nuevoBoton);
        });
    }

    modal.classList.add("mostrar");
}

document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("modal-tu-cancha");
    const modalCerrar = document.getElementById("modal-cerrar");

    if (modalCerrar) {
        modalCerrar.addEventListener("click", cerrarModal);
    }

    if (modal) {
        modal.addEventListener("click", (evento) => {
            if (evento.target === modal) {
                cerrarModal();
            }
        });
    }

    document.addEventListener("keydown", (evento) => {
        if (evento.key === "Escape") {
            cerrarModal();
        }
    });
});

window.mostrarModal = mostrarModal;
window.cerrarModal = cerrarModal;