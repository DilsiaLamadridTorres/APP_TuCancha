const canchaGuardada = localStorage.getItem("cancha_seleccionada");

if (canchaGuardada) {
    const cancha = JSON.parse(canchaGuardada);
    const elementosDinamicos = document.querySelectorAll("[data-field]");
    
    elementosDinamicos.forEach(elemento => {
        const campo = elemento.getAttribute("data-field");
        
        if (!(campo in cancha)) return;

        if (elemento.tagName === "IMG") {
            elemento.src = cancha[campo];
            if (cancha.nombre) {
                elemento.alt = `Imagen de ${cancha.nombre}`;
            }
        } else if (campo === "precio") {
            const precioNumerico = Number(cancha[campo]);
            elemento.textContent = `$ ${precioNumerico.toLocaleString("es-CO")}`;
        } else {
            elemento.textContent = cancha[campo];
        }
    });
} else {
    console.warn("No se encontró ninguna cancha seleccionada en LocalStorage.");
}

const btnCancelar = document.getElementById("btn-cancelar-reserva");

if (btnCancelar) {
    btnCancelar.addEventListener("click", () => {
        if (confirm("¿Estás seguro de que deseas cancelar y eliminar esta reserva?")) {
            // 1. Borra la cancha del almacenamiento
            localStorage.removeItem("cancha_seleccionada");
            
            alert("La reserva ha sido eliminada.");
            
            // 2. Redirige a la página del catálogo de canchas
            // Reemplaza "canchas.html" por la ruta real de tu vista de canchas
            window.location.href = "canchas.html"; 
        }
    });
}