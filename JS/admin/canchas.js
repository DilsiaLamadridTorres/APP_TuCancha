// 1. Importación del array exportado desde lista-canchas.js
import { canchas } from '../complejos/lista-canchas.js';

// ============================================================
// CANCHAS PUBLICADAS DESDE EL DASHBOARD ADMINISTRATIVO
// ============================================================

const CANCHAS_PUBLICADAS_KEY = "tucancha_canchas_publicadas";
const SOLICITUDES_KEY = "tucancha_solicitudes_complejos";
const IMAGEN_CANCHA_DEFAULT = "../img/foto.canchas.jpg";

function obtenerUrlFoto(foto) {
    if (typeof foto === "string") {
        return foto;
    }

    if (foto?.dataUrl) {
        return foto.dataUrl;
    }

    return "";
}

function obtenerImagenCancha(cancha) {
    if (cancha.imagen) {
        return obtenerUrlFoto(cancha.imagen) || IMAGEN_CANCHA_DEFAULT;
    }

    if (
        Array.isArray(cancha.fotos) &&
        cancha.fotos.length > 0
    ) {
        return obtenerUrlFoto(cancha.fotos[0]) || IMAGEN_CANCHA_DEFAULT;
    }

    return IMAGEN_CANCHA_DEFAULT;
}

function formatearTextoSimple(valor) {
    if (!valor) {
        return "";
    }

    return String(valor)
        .replace(/-/g, " ")
        .replace(/\b\w/g, letra => letra.toUpperCase());
}

function obtenerUbicacionCancha(cancha) {
    if (cancha.ubicacion) {
        return cancha.ubicacion;
    }

    const ciudad = formatearTextoSimple(cancha.complejo?.ciudad);
    const provincia = formatearTextoSimple(cancha.complejo?.provincia);

    if (ciudad && provincia) {
        return `${ciudad}, ${provincia}`;
    }

    return ciudad
        || provincia
        || cancha.complejo?.direccion
        || "UbicaciÃ³n no especificada";
}

function normalizarPrecio(valor) {
    if (
        typeof valor === "number" &&
        !Number.isNaN(valor)
    ) {
        return valor;
    }

    if (
        typeof valor === "string" &&
        valor.trim()
    ) {
        const numero = Number(
            valor.replace(/[^\d]/g, "")
        );

        return Number.isNaN(numero)
            ? null
            : numero;
    }

    return null;
}

function normalizarCanchaPublicada(cancha) {
    const precio = normalizarPrecio(
        cancha.precio || cancha.precioPorHora
    );

    return {
        ...cancha,
        empresa: cancha.empresa || cancha.complejo?.nombre || "Complejo deportivo",
        ubicacion: obtenerUbicacionCancha(cancha),
        calificacion: cancha.calificacion || "Nueva",
        precio: precio,
        precioPorHora: precio,
        imagen: obtenerImagenCancha(cancha),
        descripcion: cancha.descripcion || cancha.complejo?.descripcion || "Cancha publicada por TuCancha.",
        disponible: true,
        publicada: true
    };
}

function canchaEstaPublicada(cancha) {
    const estado = cancha?.estado || "";

    return cancha?.publicada === true ||
        estado === "publicada" ||
        estado === "aprobada";
}

function solicitudEstaAceptada(solicitud) {
    const estado = solicitud?.estado || "";

    return estado === "publicada" ||
        estado === "aprobada";
}

function obtenerCanchasSolicitud(solicitud) {
    if (
        Array.isArray(solicitud?.canchas) &&
        solicitud.canchas.length > 0
    ) {
        return solicitud.canchas;
    }

    if (solicitud?.cancha) {
        return [solicitud.cancha];
    }

    return [];
}

function crearCanchaDesdeSolicitud(solicitud, cancha, index) {
    return {
        ...cancha,
        id: cancha.id || solicitud.canchaId || `${solicitud.id}-cancha-${index + 1}`,
        solicitudId: solicitud.id,
        nombre: cancha.nombre || solicitud.complejo?.nombre || "Cancha publicada",
        empresa: solicitud.complejo?.nombre || cancha.empresa || "Complejo deportivo",
        ubicacion: cancha.ubicacion,
        precio: cancha.precio ||
            cancha.precioPorHora ||
            solicitud.precio ||
            solicitud.precioPorHora ||
            solicitud.complejo?.precio ||
            solicitud.complejo?.precioPorHora,
        descripcion: cancha.descripcion ||
            solicitud.descripcion ||
            solicitud.complejo?.descripcion,
        complejo: {
            ...(solicitud.complejo || {})
        },
        organizacion: {
            ...(solicitud.organizacion || {})
        },
        prestaciones: solicitud.complejo?.prestaciones || [],
        publicada: true,
        estado: "publicada",
        fechaPublicacion: solicitud.fechaPublicacion || solicitud.fechaSolicitud
    };
}

function agregarCanchaPublicada(canchasPublicadas, cancha) {
    const canchaNormalizada = normalizarCanchaPublicada(cancha);

    const existe = canchasPublicadas.some(
        publicada =>
            String(publicada.id) === String(canchaNormalizada.id) &&
            String(publicada.solicitudId) === String(canchaNormalizada.solicitudId)
    );

    if (!existe) {
        canchasPublicadas.push(canchaNormalizada);
    }
}

function obtenerCanchasPublicadas() {
    const canchasPublicadas = [];

try {
    const datosPublicados = localStorage.getItem(CANCHAS_PUBLICADAS_KEY);

    if (datosPublicados) {
        const publicaciones = JSON.parse(datosPublicados);

        if (Array.isArray(publicaciones)) {
            publicaciones
                .filter(canchaEstaPublicada)
                .forEach(cancha =>
                    agregarCanchaPublicada(canchasPublicadas, cancha)
                );
        }
    }
} catch (error) {
    console.error("Error leyendo canchas publicadas:", error);
}

try {
    const datosSolicitudes = localStorage.getItem(SOLICITUDES_KEY);

    if (datosSolicitudes) {
        const solicitudes = JSON.parse(datosSolicitudes);

        if (Array.isArray(solicitudes)) {
            solicitudes
                .filter(solicitudEstaAceptada)
                .forEach(solicitud => {
                    obtenerCanchasSolicitud(solicitud)
                        .forEach((cancha, index) => {
                            agregarCanchaPublicada(
                                canchasPublicadas,
                                crearCanchaDesdeSolicitud(
                                    solicitud,
                                    cancha,
                                    index
                                )
                            );
                        });
                });
        }
    }
} catch (error) {
    console.error("Error leyendo solicitudes aceptadas:", error);
}

    return canchasPublicadas;
}

// 2. Unimos las canchas publicadas en LocalStorage al array importado
const canchasPublicadas = obtenerCanchasPublicadas();
canchas.unshift(...canchasPublicadas);

// 3. Selección de elementos del DOM
const listaCanchas = document.getElementById("lista-canchas");
let cantidadMostrada = 10;
const botonVerMas = document.querySelector(".btn-ver-mas");
const botonesFiltros = document.querySelectorAll(".canchas-filter");

const botonUbicacion = botonesFiltros[0];
const botonPrecio = botonesFiltros[1];
const botonDisponibilidad = botonesFiltros[2];

botonDisponibilidad.addEventListener("click", () => {
    const menuExistente = document.querySelector(".menu-disponibilidad");

    if (menuExistente) {
        menuExistente.remove();
        return;
    }
    const menuDisponibilidad = document.createElement("div");
    menuDisponibilidad.classList.add("menu-disponibilidad");

    botonDisponibilidad.parentElement.appendChild(menuDisponibilidad);

    const opcionDisponible = document.createElement("button");
    opcionDisponible.textContent = "Disponibles";

    opcionDisponible.addEventListener("click", () => {
        const canchasFiltradas = canchas.filter(cancha =>
            cancha.disponible === true
        );

        mostrarCanchas(canchasFiltradas);
    });

    menuDisponibilidad.appendChild(opcionDisponible);

});


botonPrecio.addEventListener("click", () => {
    const menuExistente = document.querySelector(".menu-precios");
    if (menuExistente) {
        menuExistente.remove();
        return;
    }
    const menuPrecios = document.createElement("div");
    menuPrecios.classList.add("menu-precios");

    botonPrecio.parentElement.appendChild(menuPrecios);

    const opcionesPrecio = [
        "Menos de $50.000",
        "$50.000 - $80.000",
        "Más de $80.000"
    ];
    opcionesPrecio.forEach(opcionPrecio => {
        const opcion = document.createElement("button");
        opcion.textContent = opcionPrecio;

        opcion.addEventListener("click", () => {
            const canchasFiltradas = canchas.filter(cancha => {
                if (opcionPrecio === "Menos de $50.000") {
                    return cancha.precio < 50000;
                }
                if (opcionPrecio === "$50.000 - $80.000") {
                    return cancha.precio >= 50000 && cancha.precio <= 80000;
                }
                if (opcionPrecio === "Más de $80.000") {
                    return cancha.precio > 80000;
                }


            });

            mostrarCanchas(canchasFiltradas);

        });

        menuPrecios.appendChild(opcion);
    });

});

botonUbicacion.addEventListener("click", () => {
    const menuExistente = document.querySelector(".menu-ubicaciones");

    if (menuExistente) {
        menuExistente.remove();
        return;
    }
    const ubicaciones = [...new Set(
        canchas.map(cancha => cancha.ubicacion)

    )];

    const menuUbicaciones = document.createElement("div");
    menuUbicaciones.classList.add("menu-ubicaciones");
    botonUbicacion.parentElement.appendChild(menuUbicaciones);
    ubicaciones.forEach(ubicacion => {
        const opcion = document.createElement("button");
        opcion.textContent = ubicacion;

        opcion.addEventListener("click", () => {
            const canchasFiltradas = canchas.filter(cancha =>
                cancha.ubicacion === ubicacion
            );
            mostrarCanchas(canchasFiltradas);
        });

        menuUbicaciones.appendChild(opcion);
    });

});



botonVerMas.addEventListener("click", () => {
    cantidadMostrada = cantidadMostrada + 10;
    mostrarCanchas(canchas);

});

const cantidadCanchas = document.querySelector(".canchas-list__header h2 span");
const resultados = document.querySelector(".canchas-list__header p");
const formularioBusqueda = document.querySelector(".canchas-search");
const inputBusqueda = document.getElementById("buscar-cancha");

formularioBusqueda.addEventListener("submit", (event) => {
    event.preventDefault();
    const textoBuscado = inputBusqueda.value.toLocaleLowerCase().trim();
    const canchasFiltradas = canchas.filter(cancha =>
        cancha.nombre.toLowerCase().includes(textoBuscado) ||
        cancha.ubicacion.toLowerCase().includes(textoBuscado)
    );
    mostrarCanchas(canchasFiltradas);
});



if (resultados) resultados.textContent = `${canchas.length} resultados encontrados`;
if (cantidadCanchas) cantidadCanchas.textContent = canchas.length;

// 4. Ciclo para renderizar la lista completa de canchas
function mostrarCanchas(lista) {
    listaCanchas.innerHTML = "";

    for (let i = 0; i < cantidadMostrada && i < lista.length; i++) {
        const card = document.createElement("article");
        card.classList.add("cancha-card");

        const imagen = document.createElement("img");
        imagen.src = lista[i].imagen;
        imagen.alt = lista[i].nombre;
        card.appendChild(imagen);

        const contenido = document.createElement("div");
        contenido.classList.add("cancha-card__body");

        const nombre = document.createElement("h3");
        nombre.classList.add("cancha-card__title");
        nombre.textContent = lista[i].nombre;
        contenido.appendChild(nombre);

        const empresa = document.createElement("p");
        empresa.classList.add("cancha-card__company");
        empresa.textContent = lista[i].empresa;
        contenido.appendChild(empresa);

        const ubicacion = document.createElement("p");
        ubicacion.classList.add("cancha-card__location");

        const iconoUbicacion = document.createElement("i");
        iconoUbicacion.classList.add("bi", "bi-geo-alt-fill");
        ubicacion.appendChild(iconoUbicacion);
        ubicacion.append(" " + lista[i].ubicacion);
        contenido.appendChild(ubicacion);

        const calificacion = document.createElement("span");
        calificacion.classList.add("cancha-card__rating");

        const estrella = document.createElement("span");
        estrella.textContent = "⭐️";
        calificacion.appendChild(estrella);

        const numeroCalificacion = document.createElement("span");
        numeroCalificacion.textContent = lista[i].calificacion;
        calificacion.appendChild(numeroCalificacion);
        contenido.appendChild(calificacion);

        const precio = document.createElement("p");
        precio.classList.add("cancha-card__price");

        if (typeof lista[i].precio === "number") {
            precio.textContent = `$${lista[i].precio.toLocaleString("es-CO")} / hora`;
        } else {
            precio.textContent = "Precio no especificado";
        }
        contenido.appendChild(precio);

        // ============================================================
        // BOTÓN RESERVAR (Dinámico para todas las canchas)
        // ============================================================
        const botonReservar = document.createElement("button");
        botonReservar.textContent = "Reservar";
        botonReservar.classList.add("cancha-card__button");

        botonReservar.addEventListener("click", () => {
            // Guarda los datos de la cancha elegida y redirige a la vista de reservas
            localStorage.setItem("cancha_seleccionada", JSON.stringify(lista[i]));
            window.location.href = "../html/reservas-cancha.html";
        });

        contenido.appendChild(botonReservar);
        card.appendChild(contenido);

        if (listaCanchas) listaCanchas.appendChild(card);
    }
}
mostrarCanchas(canchas);
