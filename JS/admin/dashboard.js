document.addEventListener("DOMContentLoaded", () => {

    /* ============================================================
       CONFIGURACIÓN
       ============================================================ */

    const SOLICITUDES_KEY = "tucancha_solicitudes_complejos";
    const CANCHAS_PUBLICADAS_KEY = "tucancha_canchas_publicadas";


    /* ============================================================
       REFERENCIAS AL DOM
       ============================================================ */

    const panelDetalle =
        document.getElementById("panel-detalle");

    const cuerpoTabla =
        document.getElementById("cuerpo-tabla-solicitudes");

    const botonCerrarDetalle =
        document.getElementById("boton-cerrar-detalle");

    const botonMarcarRevision =
        document.getElementById("boton-marcar-revision");

    const botonAprobarPublicar =
        document.getElementById("boton-aprobar-publicar");

    const botonRechazar =
        document.getElementById("boton-rechazar");


    /* ============================================================
       ESTADO DE LA APLICACIÓN
       ============================================================ */

    let solicitudes = [];

    let idSolicitudSeleccionada = null;

    let filtroActual = "pendiente";


    /* ============================================================
       LEER SOLICITUDES DESDE LOCAL STORAGE
       ============================================================ */

    function cargarSolicitudes() {

        try {

            const datos =
                localStorage.getItem(
                    SOLICITUDES_KEY
                );


            if (!datos) {

                solicitudes = [];

                return;

            }


            const solicitudesParseadas =
                JSON.parse(datos);


            solicitudes =
                Array.isArray(solicitudesParseadas)
                    ? solicitudesParseadas
                    : [];


        } catch (error) {

            console.error(
                "Error leyendo las solicitudes:",
                error
            );

            solicitudes = [];

        }

    }


    /* ============================================================
       GUARDAR SOLICITUDES
       ============================================================ */

    function guardarSolicitudes() {

        try {

            localStorage.setItem(
                SOLICITUDES_KEY,
                JSON.stringify(solicitudes)
            );

            return true;

        } catch (error) {

            console.error(
                "Error guardando solicitudes:",
                error
            );

            return false;

        }

    }


    /* ============================================================
       FORMATEAR FECHA
       ============================================================ */

    function formatearFecha(
        fecha
    ) {

        if (!fecha) {

            return "Sin fecha";

        }


        const fechaObjeto =
            new Date(fecha);


        if (
            Number.isNaN(
                fechaObjeto.getTime()
            )
        ) {

            return "Sin fecha";

        }


        return fechaObjeto.toLocaleString(
            "es-CO",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    }


    /* ============================================================
       TEXTO DEL ESTADO
       ============================================================ */

    function obtenerTextoEstado(
        estado
    ) {

        const estados = {

            pendiente: "Pendiente",

            en_revision: "En revisión",

            aprobada: "Aprobada",

            publicada: "Publicada",

            rechazada: "Rechazada"

        };


        return estados[estado]
            || "Pendiente";

    }


    /* ============================================================
       CLASE DEL ESTADO
       ============================================================ */

    function obtenerClaseEstado(
        estado
    ) {

        return estado
            .replace(
                "_",
                "-"
            );

    }


    /* ============================================================
       OBTENER TODAS LAS CANCHAS DE UNA SOLICITUD
       ============================================================ */

    function obtenerCanchasSolicitud(
        solicitud
    ) {

        if (
            !solicitud ||
            !Array.isArray(
                solicitud.canchas
            )
        ) {

            return [];

        }


        return solicitud.canchas;

    }


    /* ============================================================
       NOMBRE DEL COMPLEJO
       ============================================================ */

    function obtenerNombreComplejo(
        solicitud
    ) {

        return (
            solicitud?.complejo?.nombre
            || "Complejo sin nombre"
        );

    }


    /* ============================================================
       PROPIETARIO
       ============================================================ */

    function obtenerPropietario(
        solicitud
    ) {

        return (
            solicitud?.organizacion?.nombreTitular
            || "Sin propietario"
        );

    }


    /* ============================================================
       CIUDAD
       ============================================================ */

    function obtenerCiudad(
        solicitud
    ) {

        const ciudad =
            solicitud?.complejo?.ciudad
            || "";

        const provincia =
            solicitud?.complejo?.provincia
            || "";


        if (
            ciudad &&
            provincia
        ) {

            return `${ciudad}<br>${provincia}`;

        }


        return ciudad
            || provincia
            || "Sin ubicación";

    }


    /* ============================================================
       OBTENER PRIMERA FOTO
       ============================================================ */

    function obtenerPrimeraFoto(
        solicitud
    ) {

        const canchas =
            obtenerCanchasSolicitud(
                solicitud
            );


        for (
            const cancha of canchas
        ) {

            if (
                Array.isArray(
                    cancha.fotos
                ) &&
                cancha.fotos.length > 0
            ) {

                const foto =
                    cancha.fotos[0];


                if (
                    typeof foto === "string"
                ) {

                    return foto;

                }


                if (
                    foto?.dataUrl
                ) {

                    return foto.dataUrl;

                }

            }

        }


        return "https://via.placeholder.com/60x40?text=Cancha";

    }


    /* ============================================================
       OBTENER DEPORTE
       ============================================================ */

    function obtenerDeporte(
        solicitud
    ) {

        const canchas =
            obtenerCanchasSolicitud(
                solicitud
            );


        if (
            canchas.length === 0
        ) {

            return "Sin canchas";

        }


        const deportes =
            canchas
                .map(
                    cancha =>
                        cancha.deporte
                )
                .filter(Boolean);


        if (
            deportes.length === 0
        ) {

            return "Sin deporte";

        }


        return deportes
            .map(
                deporte =>
                    formatearDeporte(
                        deporte
                    )
            )
            .join(", ");

    }


    /* ============================================================
       FORMATEAR DEPORTE
       ============================================================ */

    function formatearDeporte(
        deporte
    ) {

        const deportes = {

            "futbol-5": "Fútbol 5",

            "futbol-8": "Fútbol 8",

            "futbol-11": "Fútbol 11"

        };


        return deportes[deporte]
            || deporte;

    }


    /* ============================================================
       RENDERIZAR TABLA
       ============================================================ */

    function renderizarTabla() {

        cuerpoTabla.innerHTML = "";


        const solicitudesFiltradas =
            obtenerSolicitudesFiltradas();


        if (
            solicitudesFiltradas.length === 0
        ) {

            const fila =
                document.createElement("tr");


            fila.innerHTML = `
                <td colspan="6"
                    style="text-align:center; padding:40px;">
                    No hay solicitudes
                    para este estado.
                </td>
            `;


            cuerpoTabla.appendChild(
                fila
            );


            actualizarPaginacion(
                0
            );

            return;

        }


        solicitudesFiltradas
            .forEach(
                solicitud => {

                    const fila =
                        crearFilaSolicitud(
                            solicitud
                        );


                    cuerpoTabla.appendChild(
                        fila
                    );

                }
            );


        actualizarPaginacion(
            solicitudesFiltradas.length
        );

    }


    /* ============================================================
       CREAR FILA
       ============================================================ */

    function crearFilaSolicitud(
        solicitud
    ) {

        const fila =
            document.createElement("tr");


        fila.className =
            "fila-solicitud";


        fila.dataset.id =
            solicitud.id;


        if (
            solicitud.id ===
            idSolicitudSeleccionada
        ) {

            fila.classList.add(
                "activa"
            );

        }


        const estado =
            solicitud.estado
            || "pendiente";


        const nombreComplejo =
            obtenerNombreComplejo(
                solicitud
            );


        const propietario =
            obtenerPropietario(
                solicitud
            );


        const ciudad =
            obtenerCiudad(
                solicitud
            );


        const deporte =
            obtenerDeporte(
                solicitud
            );


        const fecha =
            formatearFecha(
                solicitud.fechaSolicitud
            );


        const imagen =
            obtenerPrimeraFoto(
                solicitud
            );


        fila.innerHTML = `

            <td class="columna-cancha">

                <img
                    src="${imagen}"
                    alt="${nombreComplejo}"
                    class="miniatura-cancha"
                >

                <div class="info-cancha">

                    <h3>
                        ${nombreComplejo}
                    </h3>

                    <p>
                        ${deporte}
                    </p>

                </div>

            </td>


            <td class="columna-propietario">

                ${propietario}

                <br>

                ${
                    solicitud
                        ?.organizacion
                        ?.telefono
                    || "Sin teléfono"
                }

            </td>


            <td class="columna-ciudad">

                ${ciudad}

            </td>


            <td class="columna-fecha">

                ${fecha}

            </td>


            <td class="columna-estado">

                <span
                    class="etiqueta-estado ${obtenerClaseEstado(
                        estado
                    )}"
                >
                    ${obtenerTextoEstado(
                        estado
                    )}
                </span>

            </td>


            <td class="columna-acciones">

                <button
                    class="boton-ver"
                    type="button"
                >
                    Ver solicitud
                    <span class="flecha">
                        &gt;
                    </span>
                </button>

            </td>

        `;


        return fila;

    }


    /* ============================================================
       OBTENER SOLICITUDES SEGÚN FILTRO
       ============================================================ */

    function obtenerSolicitudesFiltradas() {

        if (
            filtroActual === "todas"
        ) {

            return [...solicitudes];

        }


        return solicitudes.filter(
            solicitud =>
                (
                    solicitud.estado
                    || "pendiente"
                ) === filtroActual
        );

    }


    /* ============================================================
       CONTADORES
       ============================================================ */

    function actualizarContadores() {

        const conteos = {

            pendiente: 0,

            en_revision: 0,

            aprobada: 0,

            rechazada: 0,

            publicada: 0

        };


        solicitudes.forEach(
            solicitud => {

                const estado =
                    solicitud.estado
                    || "pendiente";


                if (
                    conteos[estado]
                    !== undefined
                ) {

                    conteos[estado]++;

                }

            }
        );


        const botones =
            document.querySelectorAll(
                ".boton-filtro"
            );


        botones.forEach(
            boton => {

                const estado =
                    boton.dataset.estado;


                const contador =
                    boton.querySelector(
                        ".contador"
                    );


                if (!contador) {

                    return;

                }


                if (
                    estado === "todas"
                ) {

                    contador.textContent =
                        solicitudes.length;

                    return;

                }


                if (
                    estado === "aprobada"
                ) {

                    contador.textContent =
                        conteos.aprobada
                        +
                        conteos.publicada;

                    return;

                }


                contador.textContent =
                    conteos[estado]
                    || 0;

            }
        );

    }


    /* ============================================================
       FILTROS
       ============================================================ */

    function configurarFiltros() {

        const botones =
            document.querySelectorAll(
                ".boton-filtro"
            );


        botones.forEach(
            boton => {

                boton.addEventListener(
                    "click",
                    () => {

                        botones.forEach(
                            otro =>
                                otro.classList.remove(
                                    "activo"
                                )
                        );


                        boton.classList.add(
                            "activo"
                        );


                        filtroActual =
                            boton.dataset.estado;


                        renderizarTabla();

                    }
                );

            }
        );

    }


    /* ============================================================
       MOSTRAR DETALLE
       ============================================================ */

    function mostrarDetalles(
        idSolicitud
    ) {

        const solicitud =
            solicitudes.find(
                item =>
                    item.id ===
                    idSolicitud
            );


        if (!solicitud) {

            console.error(
                "Solicitud no encontrada:",
                idSolicitud
            );

            return;

        }


        idSolicitudSeleccionada =
            idSolicitud;


        const complejo =
            solicitud.complejo
            || {};

        const organizacion =
            solicitud.organizacion
            || {};


        const canchas =
            obtenerCanchasSolicitud(
                solicitud
            );


        /* ========================================================
           INFORMACIÓN PRINCIPAL
           ======================================================== */

        const imagenPrincipal =
            document.getElementById(
                "imagen-detalle-principal"
            );


        if (imagenPrincipal) {

            imagenPrincipal.src =
                obtenerPrimeraFoto(
                    solicitud
                );

        }


        asignarTexto(
            "fecha-envio-detalle",
            formatearFecha(
                solicitud.fechaSolicitud
            )
        );


        asignarTexto(
            "nombre-cancha-detalle",
            obtenerNombreComplejo(
                solicitud
            )
        );


        asignarTexto(
            "tipo-cancha-detalle",
            obtenerDeporte(
                solicitud
            )
        );


        asignarTexto(
            "nombre-propietario-detalle",
            organizacion.nombreTitular
            || "Sin propietario"
        );


        asignarTexto(
            "telefono-propietario-detalle",
            organizacion.telefono
            || "Sin teléfono"
        );


        asignarTexto(
            "ciudad-detalle",
            `${complejo.ciudad || ""}${
                complejo.provincia
                    ? ", " + complejo.provincia
                    : ""
            }`
        );


        asignarTexto(
            "direccion-detalle",
            complejo.direccion
            || "Sin dirección"
        );


        asignarTexto(
            "precio-detalle",
            obtenerPrecio(
                solicitud
            )
        );


        asignarTexto(
            "horario-detalle",
            obtenerHorario(
                solicitud
            )
        );


        asignarTexto(
            "descripcion-detalle",
            obtenerDescripcion(
                solicitud
            )
        );


        /* ========================================================
           SERVICIOS
           ======================================================== */

        renderizarServicios(
            complejo.prestaciones
        );


        /* ========================================================
           FOTOS
           ======================================================== */

        renderizarFotos(
            canchas
        );


        /* ========================================================
           ESTADO
           ======================================================== */

        actualizarInterfazEstadoPanel(
            solicitud.estado
            || "pendiente"
        );


        actualizarBotonesAccion(
            solicitud.estado
            || "pendiente"
        );


        resaltarFilaSeleccionadaEnTabla(
            idSolicitud
        );


        panelDetalle.classList.add(
            "abierto"
        );

    }


    /* ============================================================
       ASIGNAR TEXTO
       ============================================================ */

    function asignarTexto(
        id,
        texto
    ) {

        const elemento =
            document.getElementById(
                id
            );


        if (elemento) {

            elemento.textContent =
                texto;

        }

    }


    /* ============================================================
       PRECIO
       ============================================================ */

    function obtenerPrecio(
        solicitud
    ) {

        return (
            solicitud.precioPorHora
            || solicitud.complejo?.precioPorHora
            || "No especificado"
        );

    }


    /* ============================================================
       HORARIO
       ============================================================ */

    function obtenerHorario(
        solicitud
    ) {

        return (
            solicitud.horarioAtencion
            || solicitud.complejo?.horarioAtencion
            || "No especificado"
        );

    }


    /* ============================================================
       DESCRIPCIÓN
       ============================================================ */

    function obtenerDescripcion(
        solicitud
    ) {

        return (
            solicitud.descripcion
            || solicitud.complejo?.descripcion
            || "Sin descripción registrada."
        );

    }


    /* ============================================================
       SERVICIOS
       ============================================================ */

    function renderizarServicios(
        prestaciones
    ) {

        const contenedor =
            document.getElementById(
                "servicios-detalle"
            );


        if (!contenedor) {

            return;

        }


        contenedor.innerHTML = "";


        if (
            !Array.isArray(
                prestaciones
            ) ||
            prestaciones.length === 0
        ) {

            contenedor.innerHTML =
                "<span>Sin prestaciones registradas.</span>";

            return;

        }


        prestaciones.forEach(
            prestacion => {

                const etiqueta =
                    document.createElement(
                        "span"
                    );


                etiqueta.className =
                    "etiqueta-servicio";


                etiqueta.textContent =
                    prestacion;


                contenedor.appendChild(
                    etiqueta
                );

            }
        );

    }


    /* ============================================================
       FOTOS
       ============================================================ */

    function renderizarFotos(
        canchas
    ) {

        const contenedor =
            document.querySelector(
                ".fotos-adicionales"
            );


        if (!contenedor) {

            return;

        }


        contenedor.innerHTML = "";


        const fotos = [];


        canchas.forEach(
            cancha => {

                if (
                    Array.isArray(
                        cancha.fotos
                    )
                ) {

                    cancha.fotos.forEach(
                        foto => {

                            if (
                                typeof foto === "string"
                            ) {

                                fotos.push(
                                    foto
                                );

                            } else if (
                                foto?.dataUrl
                            ) {

                                fotos.push(
                                    foto.dataUrl
                                );

                            }

                        }
                    );

                }

            }
        );


        fotos
            .slice(0, 5)
            .forEach(
                (foto, index) => {

                    const imagen =
                        document.createElement(
                            "img"
                        );


                    imagen.src =
                        foto;

                    imagen.alt =
                        `Foto ${index + 1}`;

                    contenedor.appendChild(
                        imagen
                    );

                }
            );


        if (
            fotos.length === 0
        ) {

            contenedor.innerHTML =
                "<span>Sin fotos adicionales.</span>";

        }

    }


    /* ============================================================
       ACTUALIZAR ESTADO VISUAL
       ============================================================ */

    function actualizarInterfazEstadoPanel(
        estado
    ) {

        const etiquetaEstado =
            document.getElementById(
                "etiqueta-estado-detalle"
            );


        if (!etiquetaEstado) {

            return;

        }


        etiquetaEstado.className =
            `etiqueta-estado ${obtenerClaseEstado(
                estado
            )}`;


        etiquetaEstado.textContent =
            obtenerTextoEstado(
                estado
            );


        const contenedorPasos =
            document.querySelector(
                ".linea-tiempo-estado .pasos-estado"
            );


        if (!contenedorPasos) {

            return;

        }


        const pasos =
            contenedorPasos.querySelectorAll(
                ".paso-estado"
            );


        const mapaEstados = {

            pendiente: 0,

            en_revision: 1,

            aprobada: 2,

            publicada: 3,

            rechazada: -1

        };


        const indiceActual =
            mapaEstados[estado] ?? -1;


        pasos.forEach(
            (paso, indice) => {

                if (
                    indice <=
                    indiceActual
                ) {

                    paso.classList.add(
                        "activo"
                    );

                } else {

                    paso.classList.remove(
                        "activo"
                    );

                }

            }
        );

    }


    /* ============================================================
       BOTONES SEGÚN ESTADO
       ============================================================ */

    function actualizarBotonesAccion(
        estado
    ) {

        if (!botonMarcarRevision) {

            return;

        }


        switch (estado) {

            case "pendiente":

                botonMarcarRevision.disabled =
                    false;

                botonAprobarPublicar.disabled =
                    false;

                botonRechazar.disabled =
                    false;

                botonMarcarRevision.textContent =
                    "Marcar en revisión";

                botonAprobarPublicar.textContent =
                    "Aprobar y publicar";

                break;


            case "en_revision":

                botonMarcarRevision.disabled =
                    true;

                botonAprobarPublicar.disabled =
                    false;

                botonRechazar.disabled =
                    false;

                break;


            case "aprobada":

                botonMarcarRevision.disabled =
                    true;

                botonAprobarPublicar.disabled =
                    false;

                botonRechazar.disabled =
                    false;

                break;


            case "publicada":

                botonMarcarRevision.disabled =
                    true;

                botonAprobarPublicar.disabled =
                    true;

                botonRechazar.disabled =
                    true;

                break;


            case "rechazada":

                botonMarcarRevision.disabled =
                    false;

                botonAprobarPublicar.disabled =
                    false;

                botonRechazar.disabled =
                    true;

                break;


            default:

                botonMarcarRevision.disabled =
                    false;

                botonAprobarPublicar.disabled =
                    false;

                botonRechazar.disabled =
                    false;

        }

    }


    /* ============================================================
       RESALTAR FILA
       ============================================================ */

    function resaltarFilaSeleccionadaEnTabla(
        idSolicitud
    ) {

        const filas =
            cuerpoTabla.querySelectorAll(
                ".fila-solicitud"
            );


        filas.forEach(
            fila => {

                if (
                    fila.dataset.id ===
                    String(idSolicitud)
                ) {

                    fila.classList.add(
                        "activa"
                    );

                } else {

                    fila.classList.remove(
                        "activa"
                    );

                }

            }
        );

    }


    /* ============================================================
       CAMBIAR ESTADO
       ============================================================ */

    function cambiarEstadoSolicitud(
        idSolicitud,
        nuevoEstado
    ) {

        const indice =
            solicitudes.findIndex(
                solicitud =>
                    solicitud.id ===
                    idSolicitud
            );


        if (
            indice === -1
        ) {

            return;

        }


        const solicitud =
            solicitudes[indice];


        solicitud.estado =
            nuevoEstado;


        if (
            nuevoEstado ===
            "aprobada"
        ) {

            publicarCanchas(
                solicitud
            );

        }


        if (
            nuevoEstado ===
            "publicada"
        ) {

            publicarCanchas(
                solicitud
            );

        }


        const guardado =
            guardarSolicitudes();


        if (!guardado) {

            return;

        }


        actualizarInterfazEstadoPanel(
            nuevoEstado
        );


        actualizarBotonesAccion(
            nuevoEstado
        );


        actualizarContadores();


        renderizarTabla();


        console.log(
            `TuCancha: solicitud ${idSolicitud} → ${nuevoEstado}`
        );

    }


    /* ============================================================
       PUBLICAR CANCHAS
       ============================================================ */

    function publicarCanchas(
        solicitud
    ) {

        let canchasPublicadas = [];


        try {

            const datos =
                localStorage.getItem(
                    CANCHAS_PUBLICADAS_KEY
                );


            canchasPublicadas =
                datos
                    ? JSON.parse(datos)
                    : [];


            if (
                !Array.isArray(
                    canchasPublicadas
                )
            ) {

                canchasPublicadas = [];

            }

        } catch (error) {

            console.error(
                "Error leyendo canchas publicadas:",
                error
            );

            canchasPublicadas = [];

        }


        const canchas =
            obtenerCanchasSolicitud(
                solicitud
            );


        canchas.forEach(
            cancha => {

                const canchaPublicada = {

                    id:
                        cancha.id,

                    solicitudId:
                        solicitud.id,

                    nombre:
                        cancha.nombre,

                    deporte:
                        cancha.deporte,

                    tipoPiso:
                        cancha.tipoPiso,

                    largo:
                        cancha.largo,

                    ancho:
                        cancha.ancho,

                    duraciones:
                        cancha.duraciones || [],

                    techada:
                        cancha.techada || false,

                    permiteOtrosDeportes:
                        cancha.permiteOtrosDeportes
                        || false,

                    fotos:
                        cancha.fotos || [],

                    complejo:
                        {
                            ...solicitud.complejo
                        },

                    organizacion:
                        {
                            ...solicitud.organizacion
                        },

                    publicada:
                        true,

                    fechaPublicacion:
                        new Date()
                            .toISOString()

                };


                const existe =
                    canchasPublicadas.some(
                        publicada =>
                            publicada.id ===
                            cancha.id
                    );


                if (!existe) {

                    canchasPublicadas.push(
                        canchaPublicada
                    );

                }

            }
        );


        try {

            localStorage.setItem(
                CANCHAS_PUBLICADAS_KEY,
                JSON.stringify(
                    canchasPublicadas
                )
            );


            console.log(
                "TuCancha: canchas publicadas correctamente.",
                canchasPublicadas
            );


        } catch (error) {

            console.error(
                "Error guardando canchas publicadas:",
                error
            );

        }

    }


    /* ============================================================
       PAGINACIÓN
       ============================================================ */

    function actualizarPaginacion(
        cantidad
    ) {

        const inicio =
            document.getElementById(
                "rango-inicio"
            );

        const fin =
            document.getElementById(
                "rango-fin"
            );

        const total =
            document.getElementById(
                "total-solicitudes"
            );


        if (cantidad === 0) {

            if (inicio) {
                inicio.textContent = "0";
            }

            if (fin) {
                fin.textContent = "0";
            }

        } else {

            if (inicio) {
                inicio.textContent = "1";
            }

            if (fin) {
                fin.textContent =
                    cantidad;
            }

        }


        if (total) {

            total.textContent =
                cantidad;

        }

    }


    /* ============================================================
       EVENTOS DE LA TABLA
       ============================================================ */

    cuerpoTabla.addEventListener(
        "click",
        event => {

            const boton =
                event.target.closest(
                    ".boton-ver"
                );


            if (!boton) {

                return;

            }


            const fila =
                boton.closest(
                    ".fila-solicitud"
                );


            if (!fila) {

                return;

            }


            mostrarDetalles(
                fila.dataset.id
            );

        }
    );


    /* ============================================================
       CERRAR DETALLE
       ============================================================ */

    botonCerrarDetalle?.addEventListener(
        "click",
        () => {

            panelDetalle.classList.remove(
                "abierto"
            );


            idSolicitudSeleccionada =
                null;


            resaltarFilaSeleccionadaEnTabla(
                null
            );

        }
    );


    /* ============================================================
       MARCAR EN REVISIÓN
       ============================================================ */

    botonMarcarRevision?.addEventListener(
        "click",
        () => {

            if (
                !idSolicitudSeleccionada
            ) {

                return;

            }


            cambiarEstadoSolicitud(
                idSolicitudSeleccionada,
                "en_revision"
            );

        }
    );


    /* ============================================================
       APROBAR Y PUBLICAR
       ============================================================ */

    botonAprobarPublicar?.addEventListener(
        "click",
        () => {

            if (
                !idSolicitudSeleccionada
            ) {

                return;

            }


            cambiarEstadoSolicitud(
                idSolicitudSeleccionada,
                "aprobada"
            );


            /*
                La solicitud queda aprobada
                y las canchas se publican.
            */

            cambiarEstadoSolicitud(
                idSolicitudSeleccionada,
                "publicada"
            );

        }
    );


    /* ============================================================
       RECHAZAR
       ============================================================ */

    botonRechazar?.addEventListener(
        "click",
        () => {

            if (
                !idSolicitudSeleccionada
            ) {

                return;

            }


            const confirmar =
                confirm(
                    "¿Estás seguro de que deseas rechazar esta solicitud?"
                );


            if (!confirmar) {

                return;

            }


            cambiarEstadoSolicitud(
                idSolicitudSeleccionada,
                "rechazada"
            );

        }
    );


    /* ============================================================
       INICIALIZAR
       ============================================================ */

    cargarSolicitudes();

    configurarFiltros();

    actualizarContadores();

    renderizarTabla();


    console.log(
        "TuCancha Admin: dashboard conectado a localStorage."
    );

    console.log(
        "Solicitudes cargadas:",
        solicitudes
    );

});