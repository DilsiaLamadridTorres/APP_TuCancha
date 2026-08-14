/* ============================================================
   TUCANCHA
   REGISTRO DE COMPLEJO DEPORTIVO
   ============================================================ */


/* ============================================================
   1. CONFIGURACIÓN
   ============================================================ */

const STORAGE_KEY = "tucancha_registro_complejo";

const SOLICITUDES_KEY = "tucancha_solicitudes_complejos";


/* ============================================================
   2. CREAR ESTADO INICIAL
   ============================================================ */

function crearEstadoInicial() {

    return {

        organizacion: {
            nombreTitular: "",
            telefono: "",
            correo: ""
        },

        complejo: {
            nombre: "",
            provincia: "",
            ciudad: "",
            direccion: "",
            telefono: "",
            prestaciones: []
        },

        canchas: [],

        comoNosConociste: "",

        pasoActual: 1,

        pasoMaximo: 1
    };

}


/* ============================================================
   3. ESTADO DEL FORMULARIO
   ============================================================ */

let registroComplejo = crearEstadoInicial();

let canchaEditandoId = null;

/*
    Aquí guardaremos temporalmente las fotos
    de la cancha que estamos creando/editando.
*/
let fotosTemporales = [];


/* ============================================================
   4. FUNCIONES AUXILIARES
   ============================================================ */

function obtenerElemento(id) {

    return document.getElementById(id);

}


function obtenerValor(id) {

    const elemento = obtenerElemento(id);

    if (!elemento) {
        return "";
    }

    return elemento.value.trim();

}


/* ============================================================
   5. LOCAL STORAGE
   ============================================================ */

function guardarLocalStorage() {

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(registroComplejo)
        );

    } catch (error) {

        console.error(
            "No se pudo guardar el formulario en localStorage:",
            error
        );

    }

}


/* ============================================================
   6. RECUPERAR LOCAL STORAGE
   ============================================================ */

function recuperarLocalStorage() {

    const datosGuardados =
        localStorage.getItem(STORAGE_KEY);


    if (!datosGuardados) {

        registroComplejo =
            crearEstadoInicial();

        return;

    }


    try {

        const datos =
            JSON.parse(datosGuardados);


        registroComplejo = {

            ...crearEstadoInicial(),

            ...datos,

            organizacion: {
                ...crearEstadoInicial().organizacion,
                ...(datos.organizacion || {})
            },

            complejo: {
                ...crearEstadoInicial().complejo,
                ...(datos.complejo || {})
            },

            canchas: Array.isArray(datos.canchas)
                ? datos.canchas
                : []

        };


    } catch (error) {

        console.error(
            "No se pudo recuperar el formulario:",
            error
        );


        registroComplejo =
            crearEstadoInicial();

    }

}


/* ============================================================
   7. MOSTRAR PASO
   ============================================================ */

function mostrarPaso(numeroPaso) {

    const pasosContenido =
        document.querySelectorAll(
            ".form-step-content"
        );


    pasosContenido.forEach(
        (paso, index) => {

            paso.classList.toggle(
                "active",
                index + 1 === numeroPaso
            );

        }
    );


    registroComplejo.pasoActual =
        numeroPaso;


    if (
        numeroPaso >
        registroComplejo.pasoMaximo
    ) {

        registroComplejo.pasoMaximo =
            numeroPaso;

    }


    actualizarSidebar();

    actualizarProgreso();


    /*
        Si llegamos a revisión,
        cargamos la información.
    */

    if (numeroPaso === 4) {

        actualizarRevision();

    }


    guardarLocalStorage();

}


/* ============================================================
   8. ACTUALIZAR SIDEBAR
   ============================================================ */

function actualizarSidebar() {

    const pasosSidebar =
        document.querySelectorAll(
            ".form-steps .step"
        );


    pasosSidebar.forEach(
        boton => {

            const numero =
                Number(
                    boton.dataset.step
                );


            boton.classList.remove(
                "active",
                "completed"
            );


            /*
                Paso actual.
            */

            if (
                numero ===
                registroComplejo.pasoActual
            ) {

                boton.classList.add(
                    "active"
                );

            }


            /*
                Paso completado.
            */

            if (
                numero <
                registroComplejo.pasoActual
            ) {

                boton.classList.add(
                    "completed"
                );

            }

        }
    );

}


/* ============================================================
   9. ACTUALIZAR PROGRESO
   ============================================================ */

function actualizarProgreso() {

    const porcentaje =
        registroComplejo.pasoActual * 25;


    const barra =
        obtenerElemento(
            "progressBar"
        );


    const texto =
        obtenerElemento(
            "progressPercentage"
        );


    if (barra) {

        barra.style.width =
            `${porcentaje}%`;

    }


    if (texto) {

        texto.textContent =
            `${porcentaje}%`;

    }

}


/* ============================================================
   10. ERRORES DE VALIDACIÓN
   ============================================================ */

function mostrarError(
    elemento,
    mensaje
) {

    if (!elemento) {
        return;
    }


    limpiarError(elemento);


    elemento.classList.add(
        "input-error"
    );


    const error =
        document.createElement(
            "small"
        );


    error.className =
        "field-error";


    error.id =
        `error-${elemento.id}`;


    error.textContent =
        mensaje;


    const contenedor =
        elemento.closest(
            ".form-floating"
        )
        ||
        elemento.closest(
            ".phone-field"
        )
        ||
        elemento.closest(
            ".review-select"
        );


    if (contenedor) {

        contenedor.insertAdjacentElement(
            "afterend",
            error
        );

    } else {

        elemento.insertAdjacentElement(
            "afterend",
            error
        );

    }

}


/* ============================================================
   11. LIMPIAR ERROR
   ============================================================ */

function limpiarError(elemento) {

    if (!elemento) {
        return;
    }


    elemento.classList.remove(
        "input-error"
    );


    const error =
        obtenerElemento(
            `error-${elemento.id}`
        );


    if (error) {

        error.remove();

    }

}


/* ============================================================
   12. VALIDAR CAMPO REQUERIDO
   ============================================================ */

function validarRequerido(
    id,
    mensaje
) {

    const elemento =
        obtenerElemento(id);


    if (!elemento) {

        console.warn(
            `No existe el elemento #${id}`
        );

        return false;

    }


    if (!elemento.value.trim()) {

        mostrarError(
            elemento,
            mensaje
        );

        return false;

    }


    limpiarError(elemento);

    return true;

}


/* ============================================================
   13. VALIDAR TELÉFONO
   ============================================================ */

function validarTelefono(
    id,
    mensaje
) {

    const input =
        obtenerElemento(id);


    if (!input) {
        return false;
    }


    const telefono =
        input.value.replace(
            /\D/g,
            ""
        );


    /*
        Permitimos de 7 a 10 números.
    */

    if (
        telefono.length < 7 ||
        telefono.length > 10
    ) {

        mostrarError(
            input,
            mensaje
        );

        return false;

    }


    limpiarError(input);

    return true;

}


/* ============================================================
   14. VALIDAR CORREO
   ============================================================ */

function validarCorreo() {

    const input =
        obtenerElemento(
            "correoTitular"
        );


    if (!input) {
        return false;
    }


    const correo =
        input.value.trim();


    const expresion =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!expresion.test(correo)) {

        mostrarError(
            input,
            "Ingresa un correo electrónico válido."
        );

        return false;

    }


    limpiarError(input);

    return true;

}


/* ============================================================
   15. CAPTURAR ORGANIZACIÓN
   ============================================================ */

function capturarOrganizacion() {

    registroComplejo.organizacion = {

        nombreTitular:
            obtenerValor(
                "nombreTitular"
            ),

        telefono:
            obtenerValor(
                "telefonoTitular"
            ),

        correo:
            obtenerValor(
                "correoTitular"
            )

    };


    guardarLocalStorage();

}


/* ============================================================
   16. VALIDAR ORGANIZACIÓN
   ============================================================ */

function validarOrganizacion() {

    let valido = true;


    if (
        !validarRequerido(
            "nombreTitular",
            "El nombre del titular es obligatorio."
        )
    ) {

        valido = false;

    }


    if (
        !validarRequerido(
            "telefonoTitular",
            "El teléfono es obligatorio."
        )
    ) {

        valido = false;

    } else if (
        !validarTelefono(
            "telefonoTitular",
            "Ingresa un teléfono válido."
        )
    ) {

        valido = false;

    }


    if (
        !validarRequerido(
            "correoTitular",
            "El correo electrónico es obligatorio."
        )
    ) {

        valido = false;

    } else if (
        !validarCorreo()
    ) {

        valido = false;

    }


    if (valido) {

        capturarOrganizacion();

    }


    return valido;

}


/* ============================================================
   17. CAPTURAR COMPLEJO
   ============================================================ */

function capturarComplejo() {

    const prestaciones =

        Array.from(

            document.querySelectorAll(
                ".prestation.active"
            )

        ).map(

            boton =>
                boton.dataset.value

        );


    registroComplejo.complejo = {

        nombre:
            obtenerValor(
                "nombreComplejo"
            ),

        provincia:
            obtenerValor(
                "provincia"
            ),

        ciudad:
            obtenerValor(
                "ciudad"
            ),

        direccion:
            obtenerValor(
                "direccion"
            ),

        telefono:
            obtenerValor(
                "telefonoComplejo"
            ),

        prestaciones:
            prestaciones

    };


    guardarLocalStorage();

}


/* ============================================================
   18. VALIDAR COMPLEJO
   ============================================================ */

function validarComplejo() {

    let valido = true;


    if (
        !validarRequerido(
            "nombreComplejo",
            "El nombre del complejo es obligatorio."
        )
    ) {

        valido = false;

    }


    if (
        !validarRequerido(
            "provincia",
            "Selecciona una provincia."
        )
    ) {

        valido = false;

    }


    if (
        !validarRequerido(
            "ciudad",
            "Selecciona una ciudad."
        )
    ) {

        valido = false;

    }


    if (
        !validarRequerido(
            "direccion",
            "La dirección es obligatoria."
        )
    ) {

        valido = false;

    }


    if (
        !validarRequerido(
            "telefonoComplejo",
            "El teléfono del complejo es obligatorio."
        )
    ) {

        valido = false;

    } else if (
        !validarTelefono(
            "telefonoComplejo",
            "Ingresa un teléfono válido."
        )
    ) {

        valido = false;

    }


    if (valido) {

        capturarComplejo();

    }


    return valido;

}


/* ============================================================
   19. RESTAURAR CAMPOS GUARDADOS
   ============================================================ */

function restaurarFormulario() {

    /* ------------------------------
       ORGANIZACIÓN
       ------------------------------ */

    const nombreTitular =
        obtenerElemento(
            "nombreTitular"
        );

    const telefonoTitular =
        obtenerElemento(
            "telefonoTitular"
        );

    const correoTitular =
        obtenerElemento(
            "correoTitular"
        );


    if (nombreTitular) {

        nombreTitular.value =
            registroComplejo
                .organizacion
                .nombreTitular;

    }


    if (telefonoTitular) {

        telefonoTitular.value =
            registroComplejo
                .organizacion
                .telefono;

    }


    if (correoTitular) {

        correoTitular.value =
            registroComplejo
                .organizacion
                .correo;

    }


    /* ------------------------------
       COMPLEJO
       ------------------------------ */

    const camposComplejo = {

        nombreComplejo:
            registroComplejo
                .complejo
                .nombre,

        provincia:
            registroComplejo
                .complejo
                .provincia,

        ciudad:
            registroComplejo
                .complejo
                .ciudad,

        direccion:
            registroComplejo
                .complejo
                .direccion,

        telefonoComplejo:
            registroComplejo
                .complejo
                .telefono

    };


    Object.entries(
        camposComplejo
    ).forEach(

        ([id, valor]) => {

            const elemento =
                obtenerElemento(id);


            if (elemento) {

                elemento.value =
                    valor || "";

            }

        }

    );


    /* ------------------------------
       PRESTACIONES
       ------------------------------ */

    document
        .querySelectorAll(
            ".prestation"
        )
        .forEach(

            boton => {

                boton.classList.toggle(

                    "active",

                    registroComplejo
                        .complejo
                        .prestaciones
                        .includes(
                            boton.dataset.value
                        )

                );

            }

        );


    /* ------------------------------
       CÓMO NOS CONOCISTE
       ------------------------------ */

    const howFoundUs =
        obtenerElemento(
            "howFoundUs"
        );


    if (howFoundUs) {

        howFoundUs.value =
            registroComplejo
                .comoNosConociste || "";

    }

}


/* ============================================================
   20. ABRIR FORMULARIO DE CANCHA
   ============================================================ */

function abrirFormularioCancha(
    idCancha = null
) {

    const formulario =
        obtenerElemento(
            "courtFormCard"
        );


    const vacio =
        obtenerElemento(
            "emptyCourts"
        );


    const agregarOtra =
        obtenerElemento(
            "btnAddAnotherCourt"
        );


    const continuar =
        obtenerElemento(
            "btnContinueCourt"
        );


    if (!formulario) {

        console.error(
            "No existe #courtFormCard"
        );

        return;

    }


    /*
        Limpiamos primero.
    */

    limpiarFormularioCancha();


    /*
        Estamos editando.
    */

    if (idCancha !== null) {

        const cancha =
            registroComplejo
                .canchas
                .find(
                    item =>
                        item.id === idCancha
                );


        if (!cancha) {
            return;
        }


        canchaEditandoId =
            idCancha;


        const titulo =
            obtenerElemento(
                "courtFormTitle"
            );


        if (titulo) {

            titulo.textContent =
                cancha.nombre;

        }


        obtenerElemento(
            "courtSport"
        ).value =
            cancha.deporte;


        obtenerElemento(
            "courtFloor"
        ).value =
            cancha.tipoPiso;


        obtenerElemento(
            "courtLength"
        ).value =
            cancha.largo;


        obtenerElemento(
            "courtWidth"
        ).value =
            cancha.ancho;


        obtenerElemento(
            "courtCovered"
        ).checked =
            cancha.techada;


        obtenerElemento(
            "otherSports"
        ).checked =
            cancha.permiteOtrosDeportes;


        /*
            Duraciones.
        */

        document
            .querySelectorAll(
                ".duration-option"
            )
            .forEach(

                boton => {

                    boton.classList.toggle(

                        "active",

                        cancha.duraciones.includes(
                            boton.dataset.duration
                        )

                    );

                }

            );


        /*
            Fotos existentes.
        */

        fotosTemporales =
            Array.isArray(
                cancha.fotos
            )
                ? [...cancha.fotos]
                : [];


        renderizarPreviewFotos();


        /*
            Mostrar botón eliminar.
        */

        obtenerElemento(
            "btnDeleteCourt"
        )
            ?.classList
            .remove(
                "d-none"
            );

    } else {

        const titulo =
            obtenerElemento(
                "courtFormTitle"
            );


        if (titulo) {

            titulo.textContent =
                `Cancha ${
                    registroComplejo
                        .canchas
                        .length + 1
                }`;

        }

    }


    vacio
        ?.classList
        .add(
            "d-none"
        );


    agregarOtra
        ?.classList
        .add(
            "d-none"
        );


    formulario
        .classList
        .remove(
            "d-none"
        );


    /*
        Mientras está editando/agregando,
        no permitimos continuar.
    */

    if (continuar) {

        continuar.disabled =
            true;

    }

}


/* ============================================================
   21. CERRAR FORMULARIO DE CANCHA
   ============================================================ */

function cerrarFormularioCancha() {

    const formulario =
        obtenerElemento(
            "courtFormCard"
        );


    formulario
        ?.classList
        .add(
            "d-none"
        );


    limpiarFormularioCancha();

    renderizarCanchas();

}


/* ============================================================
   22. LIMPIAR FORMULARIO DE CANCHA
   ============================================================ */

function limpiarFormularioCancha() {

    const sport =
        obtenerElemento(
            "courtSport"
        );

    const floor =
        obtenerElemento(
            "courtFloor"
        );

    const length =
        obtenerElemento(
            "courtLength"
        );

    const width =
        obtenerElemento(
            "courtWidth"
        );


    if (sport) {
        sport.value = "";
    }

    if (floor) {
        floor.value = "";
    }

    if (length) {
        length.value = "";
    }

    if (width) {
        width.value = "";
    }


    const covered =
        obtenerElemento(
            "courtCovered"
        );

    const otherSports =
        obtenerElemento(
            "otherSports"
        );


    if (covered) {

        covered.checked =
            false;

    }


    if (otherSports) {

        otherSports.checked =
            false;

    }


    document
        .querySelectorAll(
            ".duration-option"
        )
        .forEach(

            boton =>
                boton.classList.remove(
                    "active"
                )

        );


    const inputFotos =
        obtenerElemento(
            "courtPhotos"
        );


    if (inputFotos) {

        inputFotos.value =
            "";

    }


    fotosTemporales =
        [];


    canchaEditandoId =
        null;


    obtenerElemento(
        "btnDeleteCourt"
    )
        ?.classList
        .add(
            "d-none"
        );


    const preview =
        obtenerElemento(
            "photoPreview"
        );


    if (preview) {

        preview.innerHTML =
            "";

    }


    /*
        Limpiar errores.
    */

    [
        sport,
        floor,
        length,
        width
    ].forEach(

        elemento => {

            if (elemento) {

                limpiarError(
                    elemento
                );

            }

        }

    );


    const errorDuracion =
        obtenerElemento(
            "durationError"
        );


    if (errorDuracion) {

        errorDuracion.remove();

    }

}


/* ============================================================
   23. CONVERTIR FOTO A BASE64
   ============================================================ */

function convertirFotoBase64(file) {

    return new Promise(
        (resolve, reject) => {

            const reader =
                new FileReader();


            reader.onload =
                () => {

                    resolve(
                        reader.result
                    );

                };


            reader.onerror =
                () => {

                    reject(
                        new Error(
                            "No se pudo leer la imagen."
                        )
                    );

                };


            reader.readAsDataURL(
                file
            );

        }
    );

}


/* ============================================================
   24. CAPTURAR FOTOS
   ============================================================ */

async function procesarFotos(
    archivos
) {

    const MAX_FOTOS = 4;

    const MAX_SIZE =
        700 * 1024;


    for (
        const archivo
        of archivos
    ) {

        /*
            Máximo cuatro fotos.
        */

        if (
            fotosTemporales.length >=
            MAX_FOTOS
        ) {

            alert(
                "Puedes agregar máximo 4 fotos por cancha."
            );

            break;

        }


        /*
            Validar tipo.
        */

        if (
            !archivo.type.startsWith(
                "image/"
            )
        ) {

            alert(
                `${archivo.name} no es una imagen válida.`
            );

            continue;

        }


        /*
            Evitamos llenar localStorage
            con imágenes demasiado grandes.
        */

        if (
            archivo.size >
            MAX_SIZE
        ) {

            alert(
                `${archivo.name} pesa demasiado. El máximo temporal es 700 KB.`
            );

            continue;

        }


        const base64 =
            await convertirFotoBase64(
                archivo
            );


        fotosTemporales.push({

            nombre:
                archivo.name,

            tipo:
                archivo.type,

            dataUrl:
                base64

        });

    }


    renderizarPreviewFotos();

}


/* ============================================================
   25. RENDERIZAR PREVIEW DE FOTOS
   ============================================================ */

function renderizarPreviewFotos() {

    const preview =
        obtenerElemento(
            "photoPreview"
        );


    if (!preview) {
        return;
    }


    preview.innerHTML =
        "";


    fotosTemporales.forEach(
        (foto, index) => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "photo-preview-item";


            item.innerHTML = `

                <img
                    src="${foto.dataUrl}"
                    alt="Foto de cancha"
                >

                <button
                    type="button"
                    class="photo-preview-remove"
                    data-index="${index}"
                    title="Eliminar foto"
                >
                    ×
                </button>

            `;


            preview.appendChild(
                item
            );

        }
    );

}


/* ============================================================
   26. ELIMINAR FOTO DEL PREVIEW
   ============================================================ */

function eliminarFotoPreview(index) {

    fotosTemporales.splice(
        index,
        1
    );


    renderizarPreviewFotos();

}


/* ============================================================
   27. VALIDAR CANCHA
   ============================================================ */

function validarCancha() {

    let valido =
        true;


    if (
        !validarRequerido(
            "courtSport",
            "Selecciona un deporte."
        )
    ) {

        valido = false;

    }


    if (
        !validarRequerido(
            "courtFloor",
            "Selecciona el tipo de piso."
        )
    ) {

        valido = false;

    }


    if (
        !validarRequerido(
            "courtLength",
            "Ingresa el largo de la cancha."
        )
    ) {

        valido = false;

    } else {

        const largo =
            Number(
                obtenerValor(
                    "courtLength"
                )
            );


        if (largo <= 0) {

            mostrarError(
                obtenerElemento(
                    "courtLength"
                ),
                "El largo debe ser mayor que 0."
            );

            valido =
                false;

        }

    }


    if (
        !validarRequerido(
            "courtWidth",
            "Ingresa el ancho de la cancha."
        )
    ) {

        valido = false;

    } else {

        const ancho =
            Number(
                obtenerValor(
                    "courtWidth"
                )
            );


        if (ancho <= 0) {

            mostrarError(
                obtenerElemento(
                    "courtWidth"
                ),
                "El ancho debe ser mayor que 0."
            );

            valido =
                false;

        }

    }


    /* ------------------------------
       VALIDAR DURACIÓN
       ------------------------------ */

    const duraciones =
        document.querySelectorAll(
            ".duration-option.active"
        );


    const errorAnterior =
        obtenerElemento(
            "durationError"
        );


    if (errorAnterior) {

        errorAnterior.remove();

    }


    if (
        duraciones.length === 0
    ) {

        const contenedor =
            document.querySelector(
                ".duration-options"
            );


        if (contenedor) {

            const error =
                document.createElement(
                    "small"
                );


            error.id =
                "durationError";


            error.className =
                "field-error";


            error.textContent =
                "Selecciona al menos una duración.";


            contenedor
                .insertAdjacentElement(
                    "afterend",
                    error
                );

        }


        valido =
            false;

    }


    return valido;

}


/* ============================================================
   28. GUARDAR CANCHA
   ============================================================ */

function guardarCancha() {

    if (
        !validarCancha()
    ) {

        return;

    }


    const duraciones =

        Array.from(

            document.querySelectorAll(
                ".duration-option.active"
            )

        ).map(

            boton =>
                boton.dataset.duration

        );


    const datosCancha = {

        deporte:
            obtenerValor(
                "courtSport"
            ),

        tipoPiso:
            obtenerValor(
                "courtFloor"
            ),

        largo:
            Number(
                obtenerValor(
                    "courtLength"
                )
            ),

        ancho:
            Number(
                obtenerValor(
                    "courtWidth"
                )
            ),

        duraciones:
            duraciones,

        techada:
            obtenerElemento(
                "courtCovered"
            )?.checked || false,

        permiteOtrosDeportes:
            obtenerElemento(
                "otherSports"
            )?.checked || false,

        fotos:
            [...fotosTemporales]

    };


    /* ====================================================
       EDITAR CANCHA
       ==================================================== */

    if (
        canchaEditandoId !== null
    ) {

        const indice =
            registroComplejo
                .canchas
                .findIndex(

                    cancha =>
                        cancha.id ===
                        canchaEditandoId

                );


        if (indice !== -1) {

            registroComplejo
                .canchas[indice] = {

                    ...registroComplejo
                        .canchas[indice],

                    ...datosCancha

                };

        }

    } else {

        /* =================================================
           CREAR NUEVA CANCHA
           ================================================= */

        registroComplejo
            .canchas
            .push({

                id:
                    Date.now(),

                nombre:
                    `Cancha ${
                        registroComplejo
                            .canchas
                            .length + 1
                    }`,

                ...datosCancha

            });

    }


    guardarLocalStorage();

    cerrarFormularioCancha();

}


/* ============================================================
   29. ELIMINAR CANCHA
   ============================================================ */

function eliminarCancha(id) {

    const confirmar =
        confirm(
            "¿Seguro que deseas eliminar esta cancha?"
        );


    if (!confirmar) {
        return;
    }


    registroComplejo.canchas =

        registroComplejo
            .canchas
            .filter(

                cancha =>
                    cancha.id !== id

            );


    /*
        Renumeramos las canchas.
    */

    registroComplejo
        .canchas
        .forEach(
            (cancha, index) => {

                cancha.nombre =
                    `Cancha ${index + 1}`;

            }
        );


    guardarLocalStorage();

    cerrarFormularioCancha();

    renderizarCanchas();

}


/* ============================================================
   30. TEXTO DEL DEPORTE
   ============================================================ */

function obtenerNombreDeporte(valor) {

    const deportes = {

        "futbol-5":
            "Fútbol 5",

        "futbol-8":
            "Fútbol 8",

        "futbol-11":
            "Fútbol 11"

    };


    return deportes[valor]
        || valor;

}


/* ============================================================
   31. TEXTO DEL PISO
   ============================================================ */

function obtenerNombrePiso(valor) {

    const pisos = {

        sintetico:
            "Sintético",

        cemento:
            "Cemento",

        natural:
            "Natural"

    };


    return pisos[valor]
        || valor;

}


/* ============================================================
   32. TEXTO DURACIÓN
   ============================================================ */

function obtenerNombreDuracion(valor) {

    const duraciones = {

        "60":
            "1 hora",

        "90":
            "1 hora y 30 min",

        "120":
            "2 horas"

    };


    return duraciones[valor]
        || valor;

}


/* ============================================================
   33. RENDERIZAR CANCHAS
   ============================================================ */

function renderizarCanchas() {

    const lista =
        obtenerElemento(
            "savedCourtsList"
        );


    const vacio =
        obtenerElemento(
            "emptyCourts"
        );


    const agregarOtra =
        obtenerElemento(
            "btnAddAnotherCourt"
        );


    const continuar =
        obtenerElemento(
            "btnContinueCourt"
        );


    const formulario =
        obtenerElemento(
            "courtFormCard"
        );


    if (!lista) {
        return;
    }


    lista.innerHTML =
        "";


    const formularioVisible =
        formulario &&
        !formulario
            .classList
            .contains(
                "d-none"
            );


    /* ====================================================
       SIN CANCHAS
       ==================================================== */

    if (
        registroComplejo
            .canchas
            .length === 0
    ) {

        if (!formularioVisible) {

            vacio
                ?.classList
                .remove(
                    "d-none"
                );

        }


        agregarOtra
            ?.classList
            .add(
                "d-none"
            );


        if (continuar) {

            continuar.disabled =
                true;

        }


        return;

    }


    /* ====================================================
       CON CANCHAS
       ==================================================== */

    vacio
        ?.classList
        .add(
            "d-none"
        );


    registroComplejo
        .canchas
        .forEach(
            cancha => {

                const tarjeta =
                    document.createElement(
                        "div"
                    );


                tarjeta.className =
                    "saved-court-card";


                const tags = [];


                if (
                    cancha.techada
                ) {

                    tags.push(
                        "Techada"
                    );

                }


                if (
                    cancha.permiteOtrosDeportes
                ) {

                    tags.push(
                        "Permite otros deportes"
                    );

                }


                cancha.duraciones
                    .forEach(
                        duracion => {

                            tags.push(
                                obtenerNombreDuracion(
                                    duracion
                                )
                            );

                        }
                    );


                if (
                    cancha.fotos.length > 0
                ) {

                    tags.push(
                        `${cancha.fotos.length} foto(s)`
                    );

                }


                tarjeta.innerHTML = `

                    <div class="saved-court-info">

                        <div class="saved-court-title">

                            <h3>
                                ${cancha.nombre}
                            </h3>

                            <span class="sport-badge">
                                ${obtenerNombreDeporte(cancha.deporte)}
                            </span>

                        </div>


                        <p>
                            ${obtenerNombrePiso(cancha.tipoPiso)}
                            ·
                            ${cancha.largo}m x ${cancha.ancho}m
                        </p>


                        <div class="saved-court-tags">

                            ${
                                tags.map(
                                    tag =>
                                        `<span>${tag}</span>`
                                ).join("")
                            }

                        </div>

                    </div>


                    <div class="saved-court-actions">

                        <button
                            type="button"
                            class="btn-edit-court"
                            data-id="${cancha.id}"
                            title="Editar cancha"
                        >
                            <i class="bi bi-pencil"></i>
                        </button>


                        <button
                            type="button"
                            class="btn-remove-court"
                            data-id="${cancha.id}"
                            title="Eliminar cancha"
                        >
                            <i class="bi bi-trash"></i>
                        </button>

                    </div>

                `;


                lista.appendChild(
                    tarjeta
                );

            }
        );


    if (!formularioVisible) {

        agregarOtra
            ?.classList
            .remove(
                "d-none"
            );

    }


    if (continuar) {

        continuar.disabled =
            formularioVisible;

    }

}


/* ============================================================
   34. ACTUALIZAR REVISIÓN
   ============================================================ */

function actualizarRevision() {

    capturarOrganizacion();

    capturarComplejo();


    const nombreTitular =
        obtenerElemento(
            "reviewOwnerName"
        );


    const telefonoTitular =
        obtenerElemento(
            "reviewOwnerPhone"
        );


    const correoTitular =
        obtenerElemento(
            "reviewOwnerEmail"
        );


    if (nombreTitular) {

        nombreTitular.textContent =
            registroComplejo
                .organizacion
                .nombreTitular;

    }


    if (telefonoTitular) {

        telefonoTitular.textContent =
            `+57 ${registroComplejo.organizacion.telefono}`;

    }


    if (correoTitular) {

        correoTitular.textContent =
            registroComplejo
                .organizacion
                .correo;

    }


    /* ====================================================
       COMPLEJO
       ==================================================== */

    const datos = {

        reviewComplexName:
            registroComplejo
                .complejo
                .nombre,

        reviewProvince:
            obtenerTextoSelect(
                "provincia"
            ),

        reviewCity:
            obtenerTextoSelect(
                "ciudad"
            ),

        reviewAddress:
            registroComplejo
                .complejo
                .direccion,

        reviewComplexPhone:
            `+57 ${registroComplejo.complejo.telefono}`,

        reviewAmenities:
            registroComplejo
                .complejo
                .prestaciones
                .length

                ? registroComplejo
                    .complejo
                    .prestaciones
                    .join(", ")

                : "Sin prestaciones cargadas"

    };


    Object.entries(
        datos
    ).forEach(

        ([id, valor]) => {

            const elemento =
                obtenerElemento(id);


            if (elemento) {

                elemento.textContent =
                    valor || "—";

            }

        }

    );


    renderizarCanchasRevision();

}


/* ============================================================
   35. OBTENER TEXTO DEL SELECT
   ============================================================ */

function obtenerTextoSelect(id) {

    const select =
        obtenerElemento(id);


    if (
        !select ||
        select.selectedIndex < 0
    ) {

        return "";

    }


    return select.options[
        select.selectedIndex
    ].text;

}


/* ============================================================
   36. RENDERIZAR CANCHAS EN REVISIÓN
   ============================================================ */

function renderizarCanchasRevision() {

    const contenedor =
        obtenerElemento(
            "reviewCourts"
        );


    if (!contenedor) {
        return;
    }


    contenedor.innerHTML =
        "";


    registroComplejo
        .canchas
        .forEach(
            cancha => {

                const fila =
                    document.createElement(
                        "div"
                    );


                fila.className =
                    "review-court-row";


                fila.innerHTML = `

                    <span>
                        ${cancha.nombre}
                    </span>

                    <strong>
                        ${obtenerNombreDeporte(cancha.deporte)}
                        ·
                        ${obtenerNombrePiso(cancha.tipoPiso)}
                    </strong>

                `;


                contenedor.appendChild(
                    fila
                );

            }
        );

}


/* ============================================================
   37. GUARDAR SOLICITUD PARA ADMIN
   ============================================================ */

function guardarSolicitudFinal(
    solicitud
) {

    let solicitudes = [];


    try {

        solicitudes =
            JSON.parse(
                localStorage.getItem(
                    SOLICITUDES_KEY
                )
            ) || [];

    } catch {

        solicitudes =
            [];

    }


    solicitudes.push(
        solicitud
    );


    localStorage.setItem(
        SOLICITUDES_KEY,
        JSON.stringify(
            solicitudes
        )
    );

}


/* ============================================================
   38. ENVIAR SOLICITUD
   ============================================================ */

function enviarSolicitud() {

    if (
        !validarOrganizacion()
    ) {

        mostrarPaso(1);

        return;

    }


    if (
        !validarComplejo()
    ) {

        mostrarPaso(2);

        return;

    }


    if (
        registroComplejo
            .canchas
            .length === 0
    ) {

        alert(
            "Debes agregar al menos una cancha."
        );

        mostrarPaso(3);

        return;

    }


    const howFoundUs =
        obtenerElemento(
            "howFoundUs"
        );


    if (
        !howFoundUs ||
        !howFoundUs.value
    ) {

        mostrarError(
            howFoundUs,
            "Selecciona cómo nos conociste."
        );

        return;

    }


    limpiarError(
        howFoundUs
    );


    registroComplejo
        .comoNosConociste =
        howFoundUs.value;


    /* ====================================================
       CREAR SOLICITUD
       ==================================================== */

    const solicitud = {

        id:
            `SOL-${Date.now()}`,

        organizacion:
            registroComplejo
                .organizacion,

        complejo:
            registroComplejo
                .complejo,

        canchas:
            registroComplejo
                .canchas,

        comoNosConociste:
            registroComplejo
                .comoNosConociste,

        estado:
            "pendiente",

        fechaSolicitud:
            new Date()
                .toISOString()

    };


    /* ====================================================
       GUARDAMOS PARA EL FUTURO PANEL ADMIN
       ==================================================== */

    guardarSolicitudFinal(
        solicitud
    );


    /* ====================================================
       JSON PARA CONSOLA
       ==================================================== */

    const solicitudConsola =
        JSON.parse(
            JSON.stringify(
                solicitud
            )
        );


    /*
        Para no imprimir miles de caracteres Base64,
        reemplazamos solamente el contenido de la imagen
        en la salida de consola.
    */

    solicitudConsola
        .canchas
        .forEach(
            cancha => {

                cancha.fotos =
                    cancha.fotos.map(
                        foto => ({

                            nombre:
                                foto.nombre,

                            tipo:
                                foto.tipo,

                            dataUrl:
                                "[imagen almacenada]"

                        })
                    );

            }
        );


    console.log(
        "======================================="
    );

    console.log(
        "NUEVA SOLICITUD TUCANCHA"
    );

    console.log(
        "======================================="
    );


    console.log(
        JSON.stringify(
            solicitudConsola,
            null,
            4
        )
    );


    console.log(
        "Objeto completo:",
        solicitud
    );


    /*
        Eliminamos borrador.
    */

    localStorage.removeItem(
        STORAGE_KEY
    );


    alert(
        "Solicitud enviada correctamente. Quedará pendiente de revisión."
    );


    reiniciarFormulario(
        false
    );

}


/* ============================================================
   39. REINICIAR FORMULARIO
   ============================================================ */

function reiniciarFormulario(
    preguntar = true
) {

    if (preguntar) {

        const confirmar =
            confirm(
                "¿Seguro que deseas empezar de nuevo? Se eliminarán los datos guardados."
            );


        if (!confirmar) {

            return;

        }

    }


    /* ====================================================
       BORRAR LOCAL STORAGE
       ==================================================== */

    localStorage.removeItem(
        STORAGE_KEY
    );


    /* ====================================================
       RESTAURAR ESTADO
       ==================================================== */

    registroComplejo =
        crearEstadoInicial();


    canchaEditandoId =
        null;


    fotosTemporales =
        [];


    /* ====================================================
       RESETEAR FORMULARIOS
       ==================================================== */

    obtenerElemento(
        "organizationForm"
    )?.reset();


    obtenerElemento(
        "complexForm"
    )?.reset();


    obtenerElemento(
        "howFoundUs"
    ).value =
        "";


    document
        .querySelectorAll(
            ".prestation.active"
        )
        .forEach(
            boton =>
                boton.classList.remove(
                    "active"
                )
        );


    limpiarFormularioCancha();


    /* ====================================================
       LIMPIAR ERRORES
       ==================================================== */

    document
        .querySelectorAll(
            ".field-error"
        )
        .forEach(
            error =>
                error.remove()
        );


    document
        .querySelectorAll(
            ".input-error"
        )
        .forEach(
            campo =>
                campo.classList.remove(
                    "input-error"
                )
        );


    /* ====================================================
       LIMPIAR CANCHAS
       ==================================================== */

    const lista =
        obtenerElemento(
            "savedCourtsList"
        );


    if (lista) {

        lista.innerHTML =
            "";

    }


    obtenerElemento(
        "courtFormCard"
    )
        ?.classList
        .add(
            "d-none"
        );


    mostrarPaso(1);

    renderizarCanchas();

}


/* ============================================================
   40. AUTOGUARDADO
   ============================================================ */

function configurarAutoguardado() {

    const camposOrganizacion = [

        "nombreTitular",
        "telefonoTitular",
        "correoTitular"

    ];


    camposOrganizacion.forEach(
        id => {

            obtenerElemento(id)
                ?.addEventListener(
                    "input",
                    capturarOrganizacion
                );

        }
    );


    const camposComplejo = [

        "nombreComplejo",
        "provincia",
        "ciudad",
        "direccion",
        "telefonoComplejo"

    ];


    camposComplejo.forEach(
        id => {

            const elemento =
                obtenerElemento(id);


            elemento
                ?.addEventListener(
                    "input",
                    capturarComplejo
                );


            elemento
                ?.addEventListener(
                    "change",
                    capturarComplejo
                );

        }
    );


    obtenerElemento(
        "howFoundUs"
    )
        ?.addEventListener(
            "change",
            event => {

                registroComplejo
                    .comoNosConociste =
                    event.target.value;


                guardarLocalStorage();

            }
        );

}


/* ============================================================
   41. CONFIGURAR EVENTOS
   ============================================================ */

function configurarEventos() {

    /* ====================================================
       PASO 1 → PASO 2
       ==================================================== */

    obtenerElemento(
        "btnContinueOrganization"
    )
        ?.addEventListener(
            "click",
            () => {

                if (
                    !validarOrganizacion()
                ) {

                    return;

                }


                mostrarPaso(2);

            }
        );


    /* ====================================================
       VOLVER PASO 2 → PASO 1
       ==================================================== */

    obtenerElemento(
        "btnBackComplex"
    )
        ?.addEventListener(
            "click",
            () => {

                capturarComplejo();

                mostrarPaso(1);

            }
        );


    /* ====================================================
       PASO 2 → PASO 3
       ==================================================== */

    obtenerElemento(
        "btnContinueComplex"
    )
        ?.addEventListener(
            "click",
            () => {

                if (
                    !validarComplejo()
                ) {

                    return;

                }


                mostrarPaso(3);

            }
        );


    /* ====================================================
       VOLVER PASO 3 → PASO 2
       ==================================================== */

    obtenerElemento(
        "btnBackCourt"
    )
        ?.addEventListener(
            "click",
            () => {

                mostrarPaso(2);

            }
        );


    /* ====================================================
       PASO 3 → PASO 4
       ==================================================== */

    obtenerElemento(
        "btnContinueCourt"
    )
        ?.addEventListener(
            "click",
            () => {

                if (
                    registroComplejo
                        .canchas
                        .length === 0
                ) {

                    alert(
                        "Debes agregar al menos una cancha."
                    );

                    return;

                }


                mostrarPaso(4);

            }
        );


    /* ====================================================
       VOLVER PASO 4 → PASO 3
       ==================================================== */

    obtenerElemento(
        "btnBackReview"
    )
        ?.addEventListener(
            "click",
            () => {

                mostrarPaso(3);

            }
        );


    /* ====================================================
       EMPEZAR DE NUEVO
       ==================================================== */

    obtenerElemento(
        "btnRestartRegistration"
    )
        ?.addEventListener(
            "click",
            () => {

                reiniciarFormulario(
                    true
                );

            }
        );


    /* ====================================================
       PRESTACIONES
       ==================================================== */

    document
        .querySelectorAll(
            ".prestation"
        )
        .forEach(
            boton => {

                boton.addEventListener(
                    "click",
                    () => {

                        boton
                            .classList
                            .toggle(
                                "active"
                            );


                        capturarComplejo();

                    }
                );

            }
        );


    /* ====================================================
       DURACIONES
       ==================================================== */

    document
        .querySelectorAll(
            ".duration-option"
        )
        .forEach(
            boton => {

                boton.addEventListener(
                    "click",
                    () => {

                        boton
                            .classList
                            .toggle(
                                "active"
                            );


                        const error =
                            obtenerElemento(
                                "durationError"
                            );


                        if (error) {

                            error.remove();

                        }

                    }
                );

            }
        );


    /* ====================================================
       AGREGAR PRIMERA CANCHA
       ==================================================== */

    obtenerElemento(
        "btnAddCourt"
    )
        ?.addEventListener(
            "click",
            () => {

                abrirFormularioCancha();

            }
        );


    /* ====================================================
       AGREGAR OTRA CANCHA
       ==================================================== */

    obtenerElemento(
        "btnAddAnotherCourt"
    )
        ?.addEventListener(
            "click",
            () => {

                abrirFormularioCancha();

            }
        );


    /* ====================================================
       CANCELAR CANCHA
       ==================================================== */

    obtenerElemento(
        "btnCancelCourt"
    )
        ?.addEventListener(
            "click",
            cerrarFormularioCancha
        );


    /* ====================================================
       GUARDAR CANCHA
       ==================================================== */

    obtenerElemento(
        "btnSaveCourt"
    )
        ?.addEventListener(
            "click",
            guardarCancha
        );


    /* ====================================================
       ELIMINAR CANCHA DESDE FORMULARIO
       ==================================================== */

    obtenerElemento(
        "btnDeleteCourt"
    )
        ?.addEventListener(
            "click",
            () => {

                if (
                    canchaEditandoId === null
                ) {

                    return;

                }


                eliminarCancha(
                    canchaEditandoId
                );

            }
        );


    /* ====================================================
       FOTOS
       ==================================================== */

    obtenerElemento(
        "courtPhotos"
    )
        ?.addEventListener(
            "change",
            async event => {

                await procesarFotos(
                    Array.from(
                        event.target.files
                    )
                );


                event.target.value =
                    "";

            }
        );


    /* ====================================================
       ELIMINAR FOTO DE PREVIEW
       ==================================================== */

    obtenerElemento(
        "photoPreview"
    )
        ?.addEventListener(
            "click",
            event => {

                const boton =
                    event.target.closest(
                        ".photo-preview-remove"
                    );


                if (!boton) {

                    return;

                }


                eliminarFotoPreview(
                    Number(
                        boton.dataset.index
                    )
                );

            }
        );


    /* ====================================================
       EDITAR / ELIMINAR CANCHAS
       Delegación de eventos
       ==================================================== */

    obtenerElemento(
        "savedCourtsList"
    )
        ?.addEventListener(
            "click",
            event => {

                const editar =
                    event.target.closest(
                        ".btn-edit-court"
                    );


                const eliminar =
                    event.target.closest(
                        ".btn-remove-court"
                    );


                if (editar) {

                    abrirFormularioCancha(

                        Number(
                            editar.dataset.id
                        )

                    );

                }


                if (eliminar) {

                    eliminarCancha(

                        Number(
                            eliminar.dataset.id
                        )

                    );

                }

            }
        );


    /* ====================================================
       ENVIAR SOLICITUD
       ==================================================== */

    obtenerElemento(
        "btnSubmitRequest"
    )
        ?.addEventListener(
            "click",
            enviarSolicitud
        );


    /* ====================================================
       NAVEGACIÓN SIDEBAR

       Solo permitimos visitar pasos
       que ya hayan sido alcanzados.
       ==================================================== */

    document
        .querySelectorAll(
            ".form-steps .step"
        )
        .forEach(
            boton => {

                boton.addEventListener(
                    "click",
                    () => {

                        const paso =
                            Number(
                                boton.dataset.step
                            );


                        if (
                            paso <=
                            registroComplejo.pasoMaximo
                        ) {

                            mostrarPaso(
                                paso
                            );

                        }

                    }
                );

            }
        );


    configurarAutoguardado();

}


/* ============================================================
   42. INICIAR APLICACIÓN
   ============================================================ */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /* ====================================================
           RECUPERAR BORRADOR
           ==================================================== */

        recuperarLocalStorage();


        /* ====================================================
           RESTAURAR CAMPOS
           ==================================================== */

        restaurarFormulario();


        /* ====================================================
           CONFIGURAR BOTONES
           ==================================================== */

        configurarEventos();


        /* ====================================================
           MOSTRAR CANCHAS GUARDADAS
           ==================================================== */

        renderizarCanchas();


        /* ====================================================
           RESTAURAR PASO
           ==================================================== */

        mostrarPaso(
            registroComplejo
                .pasoActual || 1
        );


        console.log(
            "Registro de complejo iniciado correctamente."
        );

    }
);