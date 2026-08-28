// 1. Importación del array exportado desde lista-canchas.js
import { canchas } from '../admin/lista-canchas.js';

// ============================================================
// CANCHAS PUBLICADAS DESDE EL DASHBOARD ADMINISTRATIVO
// ============================================================

const CANCHAS_PUBLICADAS_KEY = "tucancha_canchas_publicadas";
let canchasPublicadas = [];

try {
    const datosPublicados = localStorage.getItem(CANCHAS_PUBLICADAS_KEY);

    if (datosPublicados) {
        const publicaciones = JSON.parse(datosPublicados);

        if (Array.isArray(publicaciones)) {
            canchasPublicadas = publicaciones
                .filter(cancha => cancha.publicada === true)
                .map(cancha => ({
                    id: cancha.id,
                    nombre: cancha.nombre,
                    empresa: cancha.complejo?.nombre || "Complejo deportivo",
                    ubicacion: `${cancha.complejo?.ciudad || ""}${
                        cancha.complejo?.provincia
                            ? ", " + cancha.complejo.provincia
                            : ""
                    }`,
                    calificacion: "Nueva",
                    precio: cancha.precioPorHora || null,
                    imagen: cancha.fotos?.[0] || "../img/foto.canchas.jpg",
                    publicada: true,
                    solicitudId: cancha.solicitudId
                }));
        }
    }
} catch (error) {
    console.error("Error leyendo canchas publicadas:", error);
}

// 2. Unimos las canchas publicadas en LocalStorage al array importado
canchas.push(...canchasPublicadas);

// 3. Selección de elementos del DOM
const listaCanchas = document.getElementById("lista-canchas");
const cantidadCanchas = document.querySelector(".canchas-list__header h2 span");
const resultados = document.querySelector(".canchas-list__header p");

if (resultados) resultados.textContent = `${canchas.length} resultados encontrados`;
if (cantidadCanchas) cantidadCanchas.textContent = canchas.length;

// 4. Ciclo para renderizar la lista completa de canchas
for (let i = 0; i < canchas.length; i++) {
    const card = document.createElement("article");
    card.classList.add("cancha-card");

    const imagen = document.createElement("img");
    imagen.src = canchas[i].imagen;
    imagen.alt = canchas[i].nombre;
    card.appendChild(imagen);

    const contenido = document.createElement("div");
    contenido.classList.add("cancha-card__body");

    const nombre = document.createElement("h3");
    nombre.classList.add("cancha-card__title");
    nombre.textContent = canchas[i].nombre;
    contenido.appendChild(nombre);

    const empresa = document.createElement("p");
    empresa.classList.add("cancha-card__company");
    empresa.textContent = canchas[i].empresa;
    contenido.appendChild(empresa);

    const ubicacion = document.createElement("p");
    ubicacion.classList.add("cancha-card__location");

    const iconoUbicacion = document.createElement("i");
    iconoUbicacion.classList.add("bi", "bi-geo-alt-fill");
    ubicacion.appendChild(iconoUbicacion);
    ubicacion.append(" " + canchas[i].ubicacion);
    contenido.appendChild(ubicacion);

    const calificacion = document.createElement("span");
    calificacion.classList.add("cancha-card__rating");

    const estrella = document.createElement("span");
    estrella.textContent = "⭐️";
    calificacion.appendChild(estrella);

    const numeroCalificacion = document.createElement("span");
    numeroCalificacion.textContent = canchas[i].calificacion;
    calificacion.appendChild(numeroCalificacion);
    contenido.appendChild(calificacion);

    const precio = document.createElement("p");
    precio.classList.add("cancha-card__price");

    if (typeof canchas[i].precio === "number") {
        precio.textContent = `$${canchas[i].precio.toLocaleString("es-CO")} / hora`;
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
        localStorage.setItem("cancha_seleccionada", JSON.stringify(canchas[i]));
        window.location.href = "../html/reservas-cancha.html";
    });

    contenido.appendChild(botonReservar);
    card.appendChild(contenido);

    if (listaCanchas) listaCanchas.appendChild(card);
}