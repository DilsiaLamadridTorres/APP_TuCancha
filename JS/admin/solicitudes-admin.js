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


            const resultadoNormalizado =
                separarSolicitudesPorCancha(
                    Array.isArray(solicitudesParseadas)
                        ? solicitudesParseadas
                        : []
                );


            solicitudes =
                resultadoNormalizado.solicitudes;


            if (
                resultadoNormalizado.cambio
            ) {

                guardarSolicitudes();

            }


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
            solicitud &&
            Array.isArray(
                solicitud.canchas
            ) &&
            solicitud.canchas.length > 0
        ) {

            return solicitud.canchas;

        }


        if (
            solicitud?.cancha
        ) {

            return [
                solicitud.cancha
            ];

        }


        return [];

    }


    /* ============================================================
       OBTENER CANCHA PRINCIPAL
       ============================================================ */

    function obtenerCanchaPrincipal(
        solicitud
    ) {

        const canchas =
            obtenerCanchasSolicitud(
                solicitud
            );


        return canchas[0] || null;

    }


    /* ============================================================
       SEPARAR SOLICITUDES POR CANCHA
       ============================================================ */

    function clonarCanchaSolicitud(
        cancha
    ) {

        return {

            ...cancha,

            duraciones: [
                ...(cancha.duraciones || [])
            ],

            fotos: [
                ...(cancha.fotos || [])
            ]

        };

    }


    function crearSolicitudParaCancha(
        solicitud,
        cancha,
        index
    ) {

        const canchaSolicitud =
            clonarCanchaSolicitud(
                cancha
            );


        const idGrupo =
            solicitud.grupoSolicitudId
            || solicitud.solicitudGrupoId
            || solicitud.id;


        return {

            ...solicitud,

            id:
                `${idGrupo}-CANCHA-${index + 1}`,

            grupoSolicitudId:
                idGrupo,

            solicitudOriginalId:
                solicitud.id,

            canchaId:
                canchaSolicitud.id,

            numeroCancha:
                index + 1,

            cancha:
                undefined,

            canchas: [
                canchaSolicitud
            ]

        };

    }


    function separarSolicitudesPorCancha(
        listaSolicitudes
    ) {

        let cambio =
            false;


        const solicitudesSeparadas = [];


        listaSolicitudes.forEach(
            solicitud => {

                const canchas =
                    Array.isArray(
                        solicitud?.canchas
                    )
                        ? solicitud.canchas
                        : [];


                if (
                    canchas.length <= 1
                ) {

                    const canchaUnica =
                        canchas[0]
                        || solicitud.cancha;


                    if (
                        canchaUnica &&
                        (
                            solicitud.cancha ||
                            !solicitud.canchaId ||
                            canchas.length === 0
                        )
                    ) {

                        cambio =
                            true;


                        const canchaSolicitud =
                            clonarCanchaSolicitud(
                                canchaUnica
                            );


                        solicitudesSeparadas.push({

                            ...solicitud,

                            cancha:
                                undefined,

                            canchas: [
                                canchaSolicitud
                            ],

                            canchaId:
                                solicitud.canchaId
                                || canchaSolicitud.id

                        });

                        return;

                    }


                    solicitudesSeparadas.push(
                        solicitud
                    );

                    return;

                }


                cambio =
                    true;


                canchas.forEach(
                    (cancha, index) => {

                        solicitudesSeparadas.push(
                            crearSolicitudParaCancha(
                                solicitud,
                                cancha,
                                index
                            )
                        );

                    }
                );

            }
        );


        return {

            solicitudes:
                solicitudesSeparadas,

            cambio:
                cambio

        };

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
       NOMBRE DE LA CANCHA
       ============================================================ */

    function obtenerNombreCancha(
        solicitud
    ) {

        const cancha =
            obtenerCanchaPrincipal(
                solicitud
            );


        return (
            cancha?.nombre
            || obtenerNombreComplejo(
                solicitud
            )
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
       OBTENER URL DE FOTO
       ============================================================ */

    function obtenerUrlFoto(
        foto
    ) {

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


        return "";

    }


    /* ============================================================
       OBTENER FOTO DE UNA CANCHA
       ============================================================ */

    function obtenerFotoCanchaPublicada(
        cancha
    ) {

        if (
            Array.isArray(
                cancha?.fotos
            ) &&
            cancha.fotos.length > 0
        ) {

            const foto =
                obtenerUrlFoto(
                    cancha.fotos[0]
                );


            if (foto) {

                return foto;

            }

        }


        return "../img/foto.canchas.jpg";

    }


    /* ============================================================
       FORMATEAR TEXTO SIMPLE
       ============================================================ */

    function formatearTextoSimple(
        valor
    ) {

        if (!valor) {

            return "";

        }


        return String(valor)
            .replace(/-/g, " ")
            .replace(
                /\b\w/g,
                letra =>
                    letra.toUpperCase()
            );

    }


    /* ============================================================
       UBICACIÃ“N PARA CATÃLOGO
       ============================================================ */

    function obtenerUbicacionPublica(
        complejo = {}
    ) {

        const ciudad =
            formatearTextoSimple(
                complejo.ciudad
            );

        const provincia =
            formatearTextoSimple(
                complejo.provincia
            );


        if (
            ciudad &&
            provincia
        ) {

            return `${ciudad}, ${provincia}`;

        }


        return ciudad
            || provincia
            || complejo.direccion
            || "UbicaciÃ³n no especificada";

    }


    /* ============================================================
       NORMALIZAR PRECIO
       ============================================================ */

    function normalizarPrecio(
        valor
    ) {

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

            const numero =
                Number(
                    valor.replace(/[^\d]/g, "")
                );


            return Number.isNaN(numero)
                ? null
                : numero;

        }


        return null;

    }


    /* ============================================================
       CREAR CANCHA PUBLICADA
       ============================================================ */

    function crearCanchaPublicada(
        solicitud,
        cancha
    ) {

        const precio =
            normalizarPrecio(
                cancha.precio
                || cancha.precioPorHora
                || solicitud.precio
                || solicitud.precioPorHora
                || solicitud.complejo?.precio
                || solicitud.complejo?.precioPorHora
            );


        return {

            id:
                cancha.id,

            solicitudId:
                solicitud.id,

            nombre:
                cancha.nombre
                || obtenerNombreComplejo(
                    solicitud
                ),

            empresa:
                obtenerNombreComplejo(
                    solicitud
                ),

            ubicacion:
                obtenerUbicacionPublica(
                    solicitud.complejo
                ),

            calificacion:
                "Nueva",

            precio:
                precio,

            precioPorHora:
                precio,

            disponible:
                true,

            descripcion:
                obtenerDescripcion(
                    solicitud
                ),

            imagen:
                obtenerFotoCanchaPublicada(
                    cancha
                ),

            deporte:
                cancha.deporte,

            deporteTexto:
                formatearDeporte(
                    cancha.deporte
                ),

            tipoPiso:
                cancha.tipoPiso,

            tipoPisoTexto:
                formatearTextoSimple(
                    cancha.tipoPiso
                ),

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

            prestaciones:
                solicitud.complejo?.prestaciones || [],

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

            estado:
                "publicada",

            fechaPublicacion:
                new Date()
                    .toISOString()

        };

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

        if (!deporte) {

            return "Sin deporte";

        }


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


        const solicitudSeleccionadaVisible =
            solicitudesFiltradas.some(
                solicitud =>
                    String(solicitud.id) ===
                    String(idSolicitudSeleccionada)
            );


        if (!solicitudSeleccionadaVisible) {

            ocultarDetalleSolicitud();

        }


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
            String(solicitud.id) ===
            String(idSolicitudSeleccionada)
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


        const nombreCancha =
            obtenerNombreCancha(
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
                    alt="${nombreCancha}"
                    class="miniatura-cancha"
                >

                <div class="info-cancha">

                    <h3>
                        ${nombreCancha}
                    </h3>

                    <p>
                        ${nombreComplejo} · ${deporte}
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


        if (
            filtroActual === "aprobada"
        ) {

            return solicitudes.filter(
                solicitud =>
                    [
                        "aprobada",
                        "publicada"
                    ].includes(
                        solicitud.estado
                        || "pendiente"
                    )
            );

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
       OCULTAR DETALLE CUANDO NO HAY SELECCIÃ“N
       ============================================================ */

    function ocultarDetalleSolicitud() {

        idSolicitudSeleccionada =
            null;


        if (panelDetalle) {

            panelDetalle.classList.remove(
                "abierto"
            );

            panelDetalle.classList.add(
                "sin-seleccion"
            );

        }


        [
            botonMarcarRevision,
            botonAprobarPublicar,
            botonRechazar
        ].forEach(
            boton => {

                if (boton) {

                    boton.disabled =
                        true;

                }

            }
        );


        resaltarFilaSeleccionadaEnTabla(
            null
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
                    String(item.id) ===
                    String(idSolicitud)
            );


        if (!solicitud) {

            console.error(
                "Solicitud no encontrada:",
                idSolicitud
            );

            ocultarDetalleSolicitud();

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

        const cancha =
            canchas[0]
            || null;


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
            obtenerNombreCancha(
                solicitud
            )
        );


        asignarTexto(
            "tipo-cancha-detalle",
            `${obtenerNombreComplejo(
                solicitud
            )} · ${
                cancha?.deporte
                    ? formatearDeporte(
                        cancha.deporte
                    )
                    : obtenerDeporte(
                        solicitud
                    )
            }`
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


        panelDetalle.classList.remove(
            "sin-seleccion"
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

        const cancha =
            obtenerCanchaPrincipal(
                solicitud
            );


        return (
            solicitud.precioPorHora
            || cancha?.precioPorHora
            || cancha?.precio
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

        const cancha =
            obtenerCanchaPrincipal(
                solicitud
            );


        return (
            solicitud.horarioAtencion
            || cancha?.horarioAtencion
            || cancha?.horario
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

        const cancha =
            obtenerCanchaPrincipal(
                solicitud
            );


        return (
            solicitud.descripcion
            || cancha?.descripcion
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

                const canchaPublicada =
                    crearCanchaPublicada(
                        solicitud,
                        cancha
                    );


                const indicePublicada =
                    canchasPublicadas.findIndex(
                        publicada =>
                            String(publicada.id) ===
                            String(canchaPublicada.id)
                            &&
                            String(publicada.solicitudId) ===
                            String(canchaPublicada.solicitudId)
                    );


                if (
                    indicePublicada === -1
                ) {

                    canchasPublicadas.push(
                        canchaPublicada
                    );

                } else {

                    canchasPublicadas[indicePublicada] = {

                        ...canchasPublicadas[indicePublicada],

                        ...canchaPublicada,

                        fechaPublicacion:
                            canchasPublicadas[indicePublicada]
                                .fechaPublicacion
                            || canchaPublicada.fechaPublicacion

                    };

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

            ocultarDetalleSolicitud();

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
