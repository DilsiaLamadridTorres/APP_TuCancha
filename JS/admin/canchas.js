const API_URL = "https://tucanchabackend-production-e5df.up.railway.app/api";

const IMAGEN_DEFAULT = "../img/foto.canchas.jpg";

let canchas = [];

let cantidadMostrada = 10;


/* ============================================================
   INICIO
   ============================================================ */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        await cargarCanchasActivas();

        configurarBusqueda();

        configurarFiltros();

        configurarVerMas();

    }
);


/* ============================================================
   CARGAR CANCHAS ACTIVAS
   ============================================================ */

async function cargarCanchasActivas() {

    const contenedor =
        document.getElementById("lista-canchas");

    if (!contenedor) {
        return;
    }

    try {

        const token =
            sessionStorage.getItem("access_token");

        if (!token) {

            mostrarMensaje(
                "No existe una sesión activa."
            );

            return;
        }

        /*
         * Obtener solamente canchas activas
         */
        const response =
            await fetch(
                `${API_URL}/canchas/activas`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );

        if (!response.ok) {

            throw new Error(
                `Error ${response.status} al obtener las canchas.`
            );
        }

        const canchasBackend =
            await response.json();

        console.log(
            "Canchas activas:",
            canchasBackend
        );

        /*
         * Para cada cancha obtenemos
         * el complejo y sus fotos.
         */
        canchas =
            await Promise.all(
                canchasBackend.map(
                    async cancha => {

                        const complejo =
                            await obtenerComplejo(
                                cancha.idComplejo,
                                token
                            );

                        const fotos =
                            await obtenerFotosComplejo(
                                cancha.idComplejo,
                                token
                            );

                        return {

                            ...cancha,

                            complejo:
                                complejo,

                            fotos:
                                fotos,

                            empresa:
                                complejo?.nombreComplejo
                                ||
                                "Complejo deportivo",

                            ubicacion:
                                obtenerUbicacion(
                                    complejo
                                ),

                            /*
                             * Normalizamos precio
                             */
                            precio:
                                Number(
                                    cancha.precioHora
                                )

                        };

                    }
                )
            );

        console.log(
            "Canchas completas:",
            canchas
        );

        cantidadMostrada = 10;

        mostrarCanchas(
            canchas
        );

    } catch (error) {

        console.error(
            "Error cargando canchas:",
            error
        );

        mostrarMensaje(
            error.message ||
            "No fue posible cargar las canchas."
        );
    }
}


/* ============================================================
   OBTENER COMPLEJO
   ============================================================ */

async function obtenerComplejo(
    idComplejo,
    token
) {

    const response =
        await fetch(
            `${API_URL}/complejos/${idComplejo}`,
            {
                method: "GET",

                headers: {
                    "Authorization":
                        `Bearer ${token}`
                }
            }
        );

    if (!response.ok) {

        throw new Error(
            `No se pudo obtener el complejo ${idComplejo}.`
        );
    }

    return await response.json();
}


/* ============================================================
   OBTENER FOTOS DEL COMPLEJO
   ============================================================ */

async function obtenerFotosComplejo(
    idComplejo,
    token
) {

    const response =
        await fetch(
            `${API_URL}/complejos/${idComplejo}/fotos`,
            {
                method: "GET",

                headers: {
                    "Authorization":
                        `Bearer ${token}`
                }
            }
        );

    if (!response.ok) {

        /*
         * No tener fotos no debe impedir
         * mostrar la cancha.
         */
        console.warn(
            `No se pudieron obtener las fotos del complejo ${idComplejo}.`
        );

        return [];
    }

    const datos =
        await response.json();

    /*
     * El endpoint podría devolver:
     *
     * un objeto
     * o
     * un arreglo
     *
     * Normalizamos ambos casos.
     */

    if (Array.isArray(datos)) {

        return datos;
    }

    if (datos) {

        return [datos];
    }

    return [];
}


/* ============================================================
   OBTENER UBICACIÓN
   ============================================================ */

function obtenerUbicacion(
    complejo
) {

    if (!complejo) {

        return "Ubicación no especificada";
    }

    const ciudad =
        complejo.ciudad || "";

    const provincia =
        complejo.provincia || "";

    if (
        ciudad &&
        provincia
    ) {

        return `${ciudad}, ${provincia}`;
    }

    return (
        ciudad ||
        provincia ||
        complejo.direccion ||
        "Ubicación no especificada"
    );
}


/* ============================================================
   OBTENER URL DE FOTO
   ============================================================ */

function obtenerUrlFoto(
    foto
) {

    if (!foto) {

        return "";
    }

    /*
     * Si ya es una URL
     */
    if (
        typeof foto === "string"
    ) {

        return foto;
    }

    /*
     * URL devuelta por backend
     */
    if (
        foto.url
    ) {

        if (
            foto.url.startsWith(
                "http://"
            ) ||
            foto.url.startsWith(
                "https://"
            )
        ) {

            return foto.url;
        }

        return (
            API_URL.replace(
                "/api",
                ""
            )
            +
            foto.url
        );
    }

    /*
     * Compatibilidad con imágenes
     * antiguas del frontend
     */
    if (
        foto.dataUrl
    ) {

        return foto.dataUrl;
    }

    return "";
}


/* ============================================================
   IMAGEN PRINCIPAL DEL COMPLEJO
   ============================================================ */

function obtenerImagenCancha(
    cancha
) {

    if (
        Array.isArray(
            cancha.fotos
        ) &&
        cancha.fotos.length > 0
    ) {

        const url =
            obtenerUrlFoto(
                cancha.fotos[0]
            );

        if (url) {

            return url;
        }
    }

    return IMAGEN_DEFAULT;
}


/* ============================================================
   RENDERIZAR CANCHAS
   ============================================================ */

function mostrarCanchas(
    lista
) {

    const listaCanchas =
        document.getElementById(
            "lista-canchas"
        );

    if (!listaCanchas) {

        return;
    }

    listaCanchas.innerHTML = "";

    if (
        !Array.isArray(lista) ||
        lista.length === 0
    ) {

        mostrarMensaje(
            "No hay canchas disponibles."
        );

        return;
    }

    const limite =
        Math.min(
            cantidadMostrada,
            lista.length
        );

    for (
        let i = 0;
        i < limite;
        i++
    ) {

        const card =
            crearCardCancha(
                lista[i]
            );

        listaCanchas.appendChild(
            card
        );
    }

    actualizarContador(
        lista.length
    );
}


/* ============================================================
   CREAR CARD
   ============================================================ */

function crearCardCancha(
    cancha
) {

    const card =
        document.createElement(
            "article"
        );

    card.classList.add(
        "cancha-card"
    );


    /* ========================================================
       IMAGEN
       ======================================================== */

    const imagen =
        document.createElement(
            "img"
        );

    imagen.src =
        obtenerImagenCancha(
            cancha
        );

    imagen.alt =
        cancha.nombre ||
        "Cancha";

    /*
     * Si la imagen falla,
     * mostramos la predeterminada.
     */
    imagen.addEventListener(
        "error",
        () => {

            if (
                imagen.src.indexOf(
                    IMAGEN_DEFAULT
                ) === -1
            ) {

                imagen.src =
                    IMAGEN_DEFAULT;
            }

        }
    );

    card.appendChild(
        imagen
    );


    /* ========================================================
       CONTENIDO
       ======================================================== */

    const contenido =
        document.createElement(
            "div"
        );

    contenido.classList.add(
        "cancha-card__body"
    );


    /* ========================================================
       NOMBRE CANCHA
       ======================================================== */

    const nombre =
        document.createElement(
            "h3"
        );

    nombre.classList.add(
        "cancha-card__title"
    );

    nombre.textContent =
        cancha.nombre ||
        "Cancha";

    contenido.appendChild(
        nombre
    );


    /* ========================================================
       NOMBRE COMPLEJO
       ======================================================== */

    const empresa =
        document.createElement(
            "p"
        );

    empresa.classList.add(
        "cancha-card__company"
    );

    empresa.textContent =
        cancha.complejo
            ?.nombreComplejo
        ||
        cancha.empresa
        ||
        "Complejo deportivo";

    contenido.appendChild(
        empresa
    );


    /* ========================================================
       UBICACIÓN
       ======================================================== */

    const ubicacion =
        document.createElement(
            "p"
        );

    ubicacion.classList.add(
        "cancha-card__location"
    );

    const iconoUbicacion =
        document.createElement(
            "i"
        );

    iconoUbicacion.classList.add(
        "bi",
        "bi-geo-alt-fill"
    );

    ubicacion.appendChild(
        iconoUbicacion
    );

    ubicacion.append(
        ` ${cancha.ubicacion}`
    );

    contenido.appendChild(
        ubicacion
    );


    /* ========================================================
       CALIFICACIÓN
       ======================================================== */

    const calificacion =
        document.createElement(
            "span"
        );

    calificacion.classList.add(
        "cancha-card__rating"
    );

    calificacion.textContent =
        "⭐ Nueva";

    contenido.appendChild(
        calificacion
    );


    /* ========================================================
       PRECIO
       ======================================================== */

    const precio =
        document.createElement(
            "p"
        );

    precio.classList.add(
        "cancha-card__price"
    );

    const precioNumerico =
        Number(
            cancha.precioHora
        );

    if (
        Number.isFinite(
            precioNumerico
        )
    ) {

        precio.textContent =
            `$${precioNumerico.toLocaleString(
                "es-CO"
            )} / hora`;

    } else {

        precio.textContent =
            "Precio no especificado";
    }

    contenido.appendChild(
        precio
    );


    /* ========================================================
       BOTÓN RESERVAR
       ======================================================== */

    const botonReservar =
        document.createElement(
            "button"
        );

    botonReservar.type =
        "button";

    botonReservar.textContent =
        "Reservar";

    botonReservar.classList.add(
        "cancha-card__button"
    );

    botonReservar.addEventListener(
        "click",
        () => {

            /*
             * Guardamos temporalmente
             * la cancha seleccionada
             * para reservas.
             */
            localStorage.setItem(
                "cancha_seleccionada",
                JSON.stringify(
                    cancha
                )
            );

            window.location.href =
                "../html/reservas-cancha.html";
        }
    );

    contenido.appendChild(
        botonReservar
    );


    card.appendChild(
        contenido
    );

    return card;
}


/* ============================================================
   CONTADOR
   ============================================================ */

function actualizarContador(
    cantidad
) {

    const cantidadCanchas =
        document.querySelector(
            ".canchas-list__header h2 span"
        );

    const resultados =
        document.querySelector(
            ".canchas-list__header p"
        );

    if (cantidadCanchas) {

        cantidadCanchas.textContent =
            cantidad;
    }

    if (resultados) {

        resultados.textContent =
            `${cantidad} resultados encontrados`;
    }
}


/* ============================================================
   BÚSQUEDA
   ============================================================ */

function configurarBusqueda() {

    const formulario =
        document.querySelector(
            ".canchas-search"
        );

    const input =
        document.getElementById(
            "buscar-cancha"
        );

    if (
        !formulario ||
        !input
    ) {

        return;
    }

    formulario.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            const texto =
                input.value
                    .toLowerCase()
                    .trim();

            const resultado =
                canchas.filter(
                    cancha => {

                        const nombre =
                            String(
                                cancha.nombre ||
                                ""
                            ).toLowerCase();

                        const ubicacion =
                            String(
                                cancha.ubicacion ||
                                ""
                            ).toLowerCase();

                        const complejo =
                            String(
                                cancha.empresa ||
                                ""
                            ).toLowerCase();

                        return (
                            nombre.includes(
                                texto
                            )
                            ||
                            ubicacion.includes(
                                texto
                            )
                            ||
                            complejo.includes(
                                texto
                            )
                        );
                    }
                );

            cantidadMostrada =
                10;

            mostrarCanchas(
                resultado
            );
        }
    );
}


/* ============================================================
   FILTROS
   ============================================================ */

function configurarFiltros() {

    const botones =
        document.querySelectorAll(
            ".canchas-filter"
        );

    if (
        botones.length < 3
    ) {

        return;
    }

    /*
     * UBICACIÓN
     */
    botones[0].addEventListener(
        "click",
        () => {

            const ubicaciones =
                [
                    ...new Set(
                        canchas.map(
                            cancha =>
                                cancha.ubicacion
                        )
                    )
                ];

            mostrarMenuFiltro(
                botones[0],
                "menu-ubicaciones",
                ubicaciones
            );
        }
    );


    /*
     * PRECIO
     */
    botones[1].addEventListener(
        "click",
        () => {

            mostrarMenuPrecio(
                botones[1]
            );
        }
    );


    /*
     * DISPONIBILIDAD
     */
    botones[2].addEventListener(
        "click",
        () => {

            const resultado =
                canchas.filter(
                    cancha =>
                        String(
                            cancha.estado
                        ).toUpperCase()
                        ===
                        "ACTIVA"
                );

            cantidadMostrada =
                10;

            mostrarCanchas(
                resultado
            );
        }
    );
}


/* ============================================================
   MENÚ UBICACIÓN
   ============================================================ */

function mostrarMenuFiltro(
    boton,
    clase,
    opciones
) {

    const existente =
        document.querySelector(
            `.${clase}`
        );

    if (existente) {

        existente.remove();

        return;
    }

    const menu =
        document.createElement(
            "div"
        );

    menu.classList.add(
        clase
    );

    opciones.forEach(
        opcionTexto => {

            const opcion =
                document.createElement(
                    "button"
                );

            opcion.type =
                "button";

            opcion.textContent =
                opcionTexto;

            opcion.addEventListener(
                "click",
                () => {

                    const resultado =
                        canchas.filter(
                            cancha =>
                                cancha.ubicacion ===
                                opcionTexto
                        );

                    cantidadMostrada =
                        10;

                    mostrarCanchas(
                        resultado
                    );

                    menu.remove();
                }
            );

            menu.appendChild(
                opcion
            );
        }
    );

    boton.parentElement.appendChild(
        menu
    );
}


/* ============================================================
   MENÚ PRECIO
   ============================================================ */

function mostrarMenuPrecio(
    boton
) {

    const existente =
        document.querySelector(
            ".menu-precios"
        );

    if (existente) {

        existente.remove();

        return;
    }

    const menu =
        document.createElement(
            "div"
        );

    menu.classList.add(
        "menu-precios"
    );

    const opciones = [
        "Menos de $50.000",
        "$50.000 - $80.000",
        "Más de $80.000"
    ];

    opciones.forEach(
        texto => {

            const opcion =
                document.createElement(
                    "button"
                );

            opcion.type =
                "button";

            opcion.textContent =
                texto;

            opcion.addEventListener(
                "click",
                () => {

                    let resultado =
                        [];

                    if (
                        texto ===
                        "Menos de $50.000"
                    ) {

                        resultado =
                            canchas.filter(
                                cancha =>
                                    Number(
                                        cancha.precioHora
                                    )
                                    < 50000
                            );
                    }

                    else if (
                        texto ===
                        "$50.000 - $80.000"
                    ) {

                        resultado =
                            canchas.filter(
                                cancha => {

                                    const precio =
                                        Number(
                                            cancha.precioHora
                                        );

                                    return (
                                        precio >= 50000 &&
                                        precio <= 80000
                                    );
                                }
                            );
                    }

                    else if (
                        texto ===
                        "Más de $80.000"
                    ) {

                        resultado =
                            canchas.filter(
                                cancha =>
                                    Number(
                                        cancha.precioHora
                                    )
                                    > 80000
                            );
                    }

                    cantidadMostrada =
                        10;

                    mostrarCanchas(
                        resultado
                    );

                    menu.remove();
                }
            );

            menu.appendChild(
                opcion
            );
        }
    );

    boton.parentElement.appendChild(
        menu
    );
}


/* ============================================================
   VER MÁS
   ============================================================ */

function configurarVerMas() {

    const boton =
        document.querySelector(
            ".btn-ver-mas"
        );

    if (!boton) {

        return;
    }

    boton.addEventListener(
        "click",
        () => {

            cantidadMostrada += 10;

            mostrarCanchas(
                canchas
            );
        }
    );
}


/* ============================================================
   MENSAJE
   ============================================================ */

function mostrarMensaje(
    mensaje
) {

    const contenedor =
        document.getElementById(
            "lista-canchas"
        );

    if (!contenedor) {

        return;
    }

    contenedor.innerHTML = `

        <div class="canchas-empty-message">

            <i class="bi bi-info-circle"></i>

            <p>
                ${mensaje}
            </p>

        </div>

    `;
}