const canchaGuardada = localStorage.getItem("cancha_seleccionada");
    //console.log("Hola");

    if (canchaGuardada) {
        // CONVERTIMOS EN JSON EL localStorage
        const cancha = JSON.parse(canchaGuardada);
        const elementosDinamicos = document.querySelectorAll("[data-field]");
        elementosDinamicos.forEach(elemento => {
            const campo = elemento.getAttribute("data-field");
            if (elemento.tagName === "IMG") {
                elemento.src = cancha[campo]; // Inyecta la URL de la imagen

                if (cancha.nombre) {
                    elemento.alt = `Imagen de ${cancha.nombre}`; // Alt dinámico opcional
                }
            }
            if (campo === "precio") {
                const precioNumerico = Number(cancha[campo]);
                elemento.textContent = `$ ${precioNumerico.toLocaleString("es-CO")}`;
            } else {
                elemento.textContent = cancha[campo];
            }
        });
    } else {
        console.warn("No se encontró ninguna cancha seleccionada en LocalStorage.");
    }

