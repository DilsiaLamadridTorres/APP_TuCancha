/* ============================================================
   TUCANCHA
   REGISTRO DE COMPLEJO DEPORTIVO
   ============================================================ */


/* ============================================================
   1. CONFIGURACIÓN DE LOCAL STORAGE
   ============================================================ */

/*
    Guarda el borrador mientras el propietario
    está llenando el formulario.
*/
const STORAGE_KEY = "tucancha_registro_complejo";


/*
    Guarda las solicitudes que ya fueron enviadas
    y que posteriormente verá el administrador.
*/
const SOLICITUDES_KEY = "tucancha_solicitudes_complejos";


const HORARIO_PREDETERMINADO = "Lunes a domingo, 8:00 AM - 10:00 PM";
const API_URL = "http://localhost:8080/api";

// IDs reales creados por el backend
let titularComplejoId = null;
let complejoId = null;

/* ============================================================
   2. CREAR ESTADO INICIAL
   ============================================================ */

function crearEstadoInicial() {

    return {

        organizacion: {

            nombreTitular: "",
            cedulaTitular:"",
            telefonoTitular: "",
            correoTitular: ""

        },

        complejo: {

            nombre: "",
            provincia: "",
            ciudad: "",
            direccion: "",
            telefono: "",
            provinciaNombre: "",
            ciudadNombre: "",
            prestaciones: []

        },

        canchas: [],

        comoNosConociste: "",

        pasoActual: 1,

        pasoMaximo: 1

    };

}


/* ============================================================
   3. ESTADO PRINCIPAL
   ============================================================ */

let registroComplejo = crearEstadoInicial();


/*
    Guarda temporalmente el ID de la cancha
    que se está editando.
*/
let canchaEditandoId = null;


/*
    Guarda las fotos seleccionadas mientras
    estamos creando/editando una cancha.
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
   5. ALERTAS PERSONALIZADAS
   ============================================================ */

function mostrarAlerta(
    mensaje,
    tipo = "info",
    titulo = ""
) {

    let container =
        obtenerElemento("formAlertContainer");


    if (!container) {

        container =
            document.createElement(
                "div"
            );


        container.id =
            "formAlertContainer";


        container.className =
            "form-alert-container";


        container.setAttribute(
            "aria-live",
            "polite"
        );


        container.setAttribute(
            "aria-atomic",
            "true"
        );


        document.body.appendChild(
            container
        );

    }


    /*
        Evitamos que se acumulen demasiadas alertas.
    */
    const alertasActuales =
        container.querySelectorAll(".form-alert");


    if (alertasActuales.length >= 4) {

        alertasActuales[0].remove();

    }


    const tiposPermitidos = [
        "success",
        "error",
        "warning",
        "info"
    ];


    if (!tiposPermitidos.includes(tipo)) {

        tipo = "info";

    }


    const iconos = {

        success: "bi-check-lg",

        error: "bi-x-lg",

        warning: "bi-exclamation-lg",

        info: "bi-info-lg"

    };


    const titulos = {

        success: "¡Listo!",

        error: "Revisa la información",

        warning: "Atención",

        info: "Información"

    };


    const alerta =
        document.createElement("div");


    alerta.className =
        `form-alert ${tipo}`;


    alerta.innerHTML = `

        <div class="form-alert-icon">

            <i class="bi ${iconos[tipo]}"></i>

        </div>


        <div class="form-alert-content">

            <h4 class="form-alert-title">
                ${titulo || titulos[tipo]}
            </h4>

            <p class="form-alert-message">
                ${mensaje}
            </p>

        </div>


        <button
            type="button"
            class="form-alert-close"
            aria-label="Cerrar alerta"
        >
            ×
        </button>

    `;


    container.appendChild(alerta);


    const btnCerrar =
        alerta.querySelector(
            ".form-alert-close"
        );


    btnCerrar.addEventListener(
        "click",
        () => {

            cerrarAlerta(alerta);

        }
    );


    /*
        La alerta desaparece automáticamente.
    */
    setTimeout(
        () => {

            cerrarAlerta(alerta);

        },
        4000
    );

}


/* ============================================================
   6. CERRAR ALERTA
   ============================================================ */

function cerrarAlerta(alerta) {

    if (
        !alerta ||
        !alerta.isConnected
    ) {

        return;

    }


    alerta.classList.add("hide");


    setTimeout(
        () => {

            if (alerta.isConnected) {

                alerta.remove();

            }

        },
        250
    );

}


/* ============================================================
   7. GUARDAR BORRADOR EN LOCAL STORAGE
   ============================================================ */

function guardarLocalStorage() {

    try {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(registroComplejo)
        );

        return true;

    } catch (error) {

        console.error(
            "Error guardando el formulario:",
            error
        );

        return false;

    }

}


/* ============================================================
   8. RECUPERAR BORRADOR
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


        const estadoInicial =
            crearEstadoInicial();


        registroComplejo = {

            ...estadoInicial,

            ...datos,

            organizacion: {

                ...estadoInicial.organizacion,

                ...(datos.organizacion || {})

            },

            complejo: {

                ...estadoInicial.complejo,

                ...(datos.complejo || {})

            },

            canchas:
                Array.isArray(datos.canchas)
                    ? datos.canchas
                    : []

        };


        /*
            Evitamos pasos inválidos.
        */

        registroComplejo.pasoActual =
            Math.min(
                Math.max(
                    Number(registroComplejo.pasoActual) || 1,
                    1
                ),
                4
            );


        registroComplejo.pasoMaximo =
            Math.min(
                Math.max(
                    Number(registroComplejo.pasoMaximo) || 1,
                    registroComplejo.pasoActual
                ),
                4
            );


    } catch (error) {

        console.error(
            "Error recuperando el formulario:",
            error
        );


        registroComplejo =
            crearEstadoInicial();

    }

}


/* ============================================================
   9. MOSTRAR PASO
   ============================================================ */

function mostrarPaso(numeroPaso) {

    const pasos =
        document.querySelectorAll(
            ".form-step-content"
        );

    pasos.forEach(
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
        La pantalla de revision se alimenta exclusivamente
        del estado almacenado en memoria. No vuelve a leer
        inputs que ya fueron limpiados.
    */
    if (numeroPaso === 4) {
        actualizarRevision();
    }

    /*
        Al cambiar de paso se limpian los controles visuales.
        Esto NO borra los registros de Supabase ni el estado
        interno necesario para la revision.
    */
    limpiarCamposVisuales();

    guardarLocalStorage();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* ============================================================
   9.5 LIMPIAR CAMPOS VISUALES
   ============================================================ */

function limpiarCamposVisuales() {

    document
        .querySelectorAll("input, select, textarea")
        .forEach(elemento => {

            if (elemento.type === "checkbox" || elemento.type === "radio") {

                elemento.checked = false;

            } else if (elemento.type === "file") {

                elemento.value = "";

            } else {

                elemento.value = "";

            }
        });

    document
        .querySelectorAll(".prestation.active, .duration-option.active")
        .forEach(elemento => {

            elemento.classList.remove("active");

        });

    const preview = obtenerElemento("photoPreview");

    if (preview) {
        preview.innerHTML = "";
    }

    const errores = document.querySelectorAll(
        ".field-error, #photosError, #durationError"
    );

    errores.forEach(error => error.remove());

    document
        .querySelectorAll(".input-error")
        .forEach(elemento => {
            elemento.classList.remove("input-error");
        });
}


/* ============================================================
   10. ACTUALIZAR SIDEBAR
   ============================================================ */

function actualizarSidebar() {

    const botones =
        document.querySelectorAll(
            ".form-steps .step"
        );


    botones.forEach(
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
                Pasos anteriores completados.
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
   11. ACTUALIZAR PROGRESO
   ============================================================ */

function actualizarProgreso() {

    const porcentaje =
        registroComplejo.pasoActual * 25;


    const barra =
        obtenerElemento("progressBar");


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
   12. MOSTRAR ERROR DE CAMPO
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
        document.createElement("small");


    error.className =
        "field-error";


    error.id =
        `error-${elemento.id}`;


    error.textContent =
        mensaje;


    /*
        Buscamos dónde colocar el error.
    */

    const formFloating =
        elemento.closest(".form-floating");


    const phoneField =
        elemento.closest(".phone-field");


    const reviewSelect =
        elemento.closest(".review-select");


    const contenedor =
        formFloating ||
        phoneField ||
        reviewSelect;


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
   13. LIMPIAR ERROR DE CAMPO
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
   14. VALIDAR CAMPO OBLIGATORIO
   ============================================================ */

function validarRequerido(
    id,
    mensaje
) {

    const elemento =
        obtenerElemento(id);


    if (!elemento) {

        console.warn(
            `No existe #${id}`
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
   15. VALIDAR TELÉFONO
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


    /*
        Dejamos únicamente números.
    */

    const telefono =
        input.value.replace(
            /\D/g,
            ""
        );


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
   16. VALIDAR CORREO
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
   17. CAPTURAR ORGANIZACIÓN
   ============================================================ */

function capturarOrganizacion() {

    registroComplejo.organizacion = {

        nombreTitular:
            obtenerValor(
                "nombreTitular"
            ),
        cedulaTitular:
            obtenerValor(
                "cedulaTitular"
            ),

        telefonoTitular:
            obtenerValor(
                "telefonoTitular"
            ),

        correoTitular:
            obtenerValor(
                "correoTitular"
            )

    };


    guardarLocalStorage();

}


/* ============================================================
   18. VALIDAR ORGANIZACIÓN
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

    if(
        !validarRequerido(
            "cedulaTitular",
            "Cédula es obligatoria"
        )
    ){
        valido=false;
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
            "Ingresa un número de teléfono válido."
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


    if (!valido) {

        mostrarAlerta(
            "Completa correctamente los datos del titular antes de continuar.",
            "error"
        );

        return false;

    }


    capturarOrganizacion();

    return true;

}
async function guardarTitularEnBackend() {

    const datosTitular = {
        nombreTitular: obtenerValor("nombreTitular"),
        cedulaTitular: obtenerValor("cedulaTitular"),
        correoTitular: obtenerValor("correoTitular"),
        telefonoTitular: obtenerValor("telefonoTitular")
    };

    console.log(
        "Enviando titular al backend:",
        datosTitular
    );

    const response = await fetch(
        `${API_URL}/titulares`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(datosTitular)
        }
    );

    if (!response.ok) {

        let mensaje =
            "No fue posible registrar el titular.";

        try {

            const errorBackend =
                await response.json();

            mensaje =
                errorBackend.message ||
                errorBackend.error ||
                mensaje;

        } catch (error) {

            console.error(
                "No se pudo leer el error del backend:",
                error
            );
        }

        throw new Error(mensaje);
    }

    const titularCreado =
        await response.json();

    console.log(
        "Titular creado:",
        titularCreado
    );

    /*
     * IMPORTANTE:
     * Guardamos el ID generado por PostgreSQL/Supabase.
     */
    titularComplejoId =
        titularCreado.id;

    if (!titularComplejoId) {

        throw new Error(
            "El backend creó el titular pero no devolvió su ID."
        );
    }

    console.log(
        "ID titular:",
        titularComplejoId
    );

    return titularCreado;
}


/* ============================================================
   19. CAPTURAR COMPLEJO
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

        provinciaNombre:
            obtenerTextoSelect(
                "provincia"
            ),

        ciudadNombre:
            obtenerTextoSelect(
                "ciudad"
            ),

        prestaciones:
            prestaciones

    };


    guardarLocalStorage();

}


/* ============================================================
   20. VALIDAR COMPLEJO
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
            "Ingresa un número de teléfono válido."
        )
    ) {

        valido = false;

    }


    if (!valido) {

        mostrarAlerta(
            "Completa correctamente los datos del complejo antes de continuar.",
            "error"
        );

        return false;

    }


    capturarComplejo();

    return true;

}


/* ============================================================
   20.1 GUARDAR COMPLEJO EN BACKEND
   ============================================================ */

async function guardarComplejoEnBackend() {

    if (!titularComplejoId) {
        throw new Error(
            "No existe un titular registrado para asociar el complejo."
        );
    }

    const token =
        sessionStorage.getItem("access_token");

    if (!token) {
        throw new Error(
            "No hay una sesión activa. Inicia sesión nuevamente."
        );
    }

    const prestacionesSeleccionadas =
        Array.from(
            document.querySelectorAll(".prestation.active")
        ).map(
            boton => boton.dataset.value
        );

    const datosComplejo = {
        nombreComplejo: obtenerValor("nombreComplejo"),
        provincia: obtenerValor("provincia"),
        ciudad: obtenerValor("ciudad"),
        direccion: obtenerValor("direccion"),
        telefonoComplejo: obtenerValor("telefonoComplejo"),
        titularComplejoId: titularComplejoId,
        estacionamiento: prestacionesSeleccionadas.includes("Estacionamiento"),
        vestuario: prestacionesSeleccionadas.includes("Vestuario"),
        asador: prestacionesSeleccionadas.includes("Asador"),
        bar: prestacionesSeleccionadas.includes("Bar"),
        duchas: prestacionesSeleccionadas.includes("Duchas"),
        tv: prestacionesSeleccionadas.includes("TV"),
        bufet: prestacionesSeleccionadas.includes("Bufet")
    };

    console.log(
        "Enviando complejo:",
        datosComplejo
    );

    const response =
        await fetch(
            `${API_URL}/complejos`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(datosComplejo)
            }
        );

    if (!response.ok) {
        let mensaje =
            "No fue posible registrar el complejo.";

        try {
            const errorBackend =
                await response.json();

            mensaje =
                errorBackend.message ||
                errorBackend.error ||
                mensaje;
        } catch (error) {
            console.error(error);
        }

        throw new Error(mensaje);
    }

    const complejoCreado =
        await response.json();

    console.log(
        "Complejo creado:",
        complejoCreado
    );

    complejoId =
        complejoCreado.id;

    if (!complejoId) {
        throw new Error(
            "El backend creó el complejo pero no devolvió su ID."
        );
    }

    console.log(
        "ID complejo:",
        complejoId
    );

    return complejoCreado;
}

/* ============================================================
   21. RESTAURAR DATOS GUARDADOS
   ============================================================ */

function restaurarFormulario() {

    /* ========================================================
       ORGANIZACIÓN
       ======================================================== */

    const camposOrganizacion = {

        nombreTitular:
            registroComplejo
                .organizacion
                .nombreTitular,
        
        cedulaTitular:
            registroComplejo
                .organizacion
                .cedulaTitular,

        telefonoTitular:
            registroComplejo
                .organizacion
                .telefonoTitular,

        correoTitular:
            registroComplejo
                .organizacion
                .correoTitular

    };


    Object.entries(
        camposOrganizacion
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


    /* ========================================================
       COMPLEJO
       ======================================================== */

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


    /* ========================================================
       PRESTACIONES
       ======================================================== */

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


    /* ========================================================
       CÓMO NOS CONOCISTE
       ======================================================== */

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
   22. ABRIR FORMULARIO DE CANCHA
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
        Limpiamos los campos antes de abrir.
    */

    limpiarFormularioCancha();


    /* ========================================================
       EDITAR CANCHA
       ======================================================== */

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


        const nombre =
            obtenerElemento(
                "courtName"
            );


        const sport =
            obtenerElemento(
                "courtSport"
            );


        const floor =
            obtenerElemento(
                "courtFloor"
            );


        const largo =
            obtenerElemento(
                "courtLength"
            );


        const ancho =
            obtenerElemento(
                "courtWidth"
            );


        const precio =
            obtenerElemento(
                "courtPrice"
            );


        if (nombre) {

            nombre.value =
                cancha.nombre || "";

        }


        if (sport) {

            sport.value =
                cancha.deporte;

        }


        if (floor) {

            floor.value =
                cancha.tipoPiso;

        }


        if (largo) {

            largo.value =
                cancha.largo;

        }


        if (ancho) {

            ancho.value =
                cancha.ancho;

        }


        if (precio) {

            precio.value =
                cancha.precioPorHora
                || cancha.precio
                || "";

        }


        const cubierta =
            obtenerElemento(
                "courtCovered"
            );


        if (cubierta) {

            cubierta.checked =
                cancha.techada;

        }


        const otros =
            obtenerElemento(
                "otherSports"
            );


        if (otros) {

            otros.checked =
                cancha.permiteOtrosDeportes;

        }


        /*
            Restauramos duraciones.
        */

        document
            .querySelectorAll(
                ".duration-option"
            )
            .forEach(
                boton => {

                    boton.classList.toggle(

                        "active",

                        cancha.duraciones
                            ?.includes(
                                boton.dataset.duration
                            )

                    );

                }
            );


        /*
            Restauramos fotografías.
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

        /* ====================================================
           NUEVA CANCHA
           ==================================================== */

        const titulo =
            obtenerElemento(
                "courtFormTitle"
            );


        if (titulo) {

            titulo.textContent =
                "Nueva cancha";

        }

    }


    /*
        Ocultamos elementos innecesarios.
    */

    vacio
        ?.classList
        .add("d-none");


    agregarOtra
        ?.classList
        .add("d-none");


    /*
        Mostramos formulario.
    */

    formulario
        .classList
        .remove("d-none");


    /*
        Mientras estamos agregando/editando,
        bloqueamos Continuar.
    */

    if (continuar) {

        continuar.disabled = true;

    }

}


/* ============================================================
   23. CERRAR FORMULARIO DE CANCHA
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
   24. LIMPIAR FORMULARIO DE CANCHA
   ============================================================ */

function limpiarFormularioCancha() {

    const campos = [

        "courtName",
        "courtSport",
        "courtFloor",
        "courtLength",
        "courtWidth",
        "courtPrice"

    ];


    campos.forEach(
        id => {

            const campo =
                obtenerElemento(id);


            if (campo) {

                campo.value = "";

                limpiarError(campo);

            }

        }
    );


    const cubierta =
        obtenerElemento(
            "courtCovered"
        );


    if (cubierta) {

        cubierta.checked = false;

    }


    const otros =
        obtenerElemento(
            "otherSports"
        );


    if (otros) {

        otros.checked = false;

    }


    /*
        Limpiar duraciones.
    */

    document
        .querySelectorAll(
            ".duration-option"
        )
        .forEach(
            boton => {

                boton.classList.remove(
                    "active"
                );

            }
        );


    /*
        Limpiar input de fotos.
    */

    const inputFotos =
        obtenerElemento(
            "courtPhotos"
        );


    if (inputFotos) {

        inputFotos.value = "";

    }


    fotosTemporales = [];

    canchaEditandoId = null;


    /*
        Ocultamos botón eliminar.
    */

    obtenerElemento(
        "btnDeleteCourt"
    )
        ?.classList
        .add(
            "d-none"
        );


    /*
        Limpiar preview.
    */

    const preview =
        obtenerElemento(
            "photoPreview"
        );


    if (preview) {

        preview.innerHTML = "";

    }


    /*
        Limpiar error de duración.
    */

    const errorDuracion =
        obtenerElemento(
            "durationError"
        );


    if (errorDuracion) {

        errorDuracion.remove();

    }


    const errorFotos =
        obtenerElemento(
            "photosError"
        );


    if (errorFotos) {

        errorFotos.remove();

    }


    document
        .querySelector(
            ".photo-upload"
        )
        ?.classList
        .remove(
            "input-error"
        );

}


/* ============================================================
   25. CONVERTIR FOTO A BASE64
   ============================================================ */

function convertirFotoBase64(file) {

    return new Promise(
        (resolve, reject) => {

            const reader =
                new FileReader();


            reader.onload =
                () => {

                    const dataUrlOriginal =
                        reader.result;


                    const imagen =
                        new Image();


                    imagen.onload =
                        () => {

                            const MAX_DIMENSION =
                                720;


                            const escala =
                                Math.min(
                                    1,
                                    MAX_DIMENSION /
                                    Math.max(
                                        imagen.width,
                                        imagen.height
                                    )
                                );


                            const canvas =
                                document.createElement(
                                    "canvas"
                                );


                            canvas.width =
                                Math.max(
                                    1,
                                    Math.round(
                                        imagen.width * escala
                                    )
                                );


                            canvas.height =
                                Math.max(
                                    1,
                                    Math.round(
                                        imagen.height * escala
                                    )
                                );


                            const contexto =
                                canvas.getContext(
                                    "2d"
                                );


                            if (!contexto) {

                                resolve(
                                    dataUrlOriginal
                                );

                                return;

                            }


                            contexto.fillStyle =
                                "#FFFFFF";


                            contexto.fillRect(
                                0,
                                0,
                                canvas.width,
                                canvas.height
                            );


                            contexto.drawImage(
                                imagen,
                                0,
                                0,
                                canvas.width,
                                canvas.height
                            );


                            const dataUrlOptimizada =
                                canvas.toDataURL(
                                    "image/jpeg",
                                    0.62
                                );


                            resolve(
                                dataUrlOptimizada.length <
                                dataUrlOriginal.length
                                    ? dataUrlOptimizada
                                    : dataUrlOriginal
                            );

                        };


                    imagen.onerror =
                        () => {

                            resolve(
                                dataUrlOriginal
                            );

                        };


                    imagen.src =
                        dataUrlOriginal;

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
   26. PROCESAR FOTOS
   ============================================================ */

async function procesarFotos(archivos) {

    const MAX_FOTOS = 4;

    const MAX_SIZE =
        8 * 1024 * 1024;

    for (const archivo of archivos) {

        if (
            fotosTemporales.length >=
            MAX_FOTOS
        ) {

            mostrarAlerta(
                "Puedes agregar máximo 4 fotos por cancha.",
                "warning"
            );

            break;
        }

        const formatosPermitidos = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (
            !formatosPermitidos.includes(
                archivo.type
            )
        ) {

            mostrarAlerta(
                `${archivo.name} no tiene un formato permitido.`,
                "error"
            );

            continue;
        }

        if (
            archivo.size >
            MAX_SIZE
        ) {

            mostrarAlerta(
                `${archivo.name} pesa más de 8 MB. Usa una imagen más liviana.`,
                "warning"
            );

            continue;
        }

        try {

            const base64 =
                await convertirFotoBase64(
                    archivo
                );

            fotosTemporales.push({
                nombre:
                    archivo.name,

                tipo:
                    base64.startsWith(
                        "data:image/jpeg"
                    )
                        ? "image/jpeg"
                        : archivo.type,

                archivo:
                    archivo,

                dataUrl:
                    base64
            });

            validarFotosCancha();

        } catch (error) {

            console.error(
                "Error procesando foto:",
                error
            );

            mostrarAlerta(
                `No se pudo cargar ${archivo.name}.`,
                "error"
            );
        }
    }

    renderizarPreviewFotos();
}


/* ============================================================
   27. MOSTRAR PREVIEW DE FOTOS
   ============================================================ */

function renderizarPreviewFotos() {

    const preview =
        obtenerElemento(
            "photoPreview"
        );


    if (!preview) {

        return;

    }


    preview.innerHTML = "";


    fotosTemporales.forEach(
        (foto, index) => {

            const dataUrl =
                obtenerDataUrlFoto(
                    foto
                );


            if (!dataUrl) {

                return;

            }


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "photo-preview-item";


            item.innerHTML = `

                <img
                    src="${dataUrl}"
                    alt="Foto de la cancha"
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
   28. ELIMINAR FOTO DEL PREVIEW
   ============================================================ */

function eliminarFotoPreview(index) {

    fotosTemporales.splice(
        index,
        1
    );


    renderizarPreviewFotos();


    validarFotosCancha();

}


/* ============================================================
   VALIDAR FOTOS DE LA CANCHA
   ============================================================ */

function obtenerDataUrlFoto(foto) {

    if (typeof foto === "string") {
        return foto.trim();
    }

    if (
        typeof foto?.dataUrl === "string" &&
        foto.dataUrl.trim()
    ) {
        return foto.dataUrl.trim();
    }

    if (
        typeof foto?.url === "string" &&
        foto.url.trim()
    ) {

        const url = foto.url.trim();

        if (
            url.startsWith("http://") ||
            url.startsWith("https://")
        ) {
            return url;
        }

        return `${API_URL.replace("/api", "")}${url}`;
    }

    return "";
}

function canchaTieneFotos(cancha) {

    return (
        Array.isArray(cancha?.fotos) &&
        cancha.fotos.length > 0
    );
}

function validarCanchasGuardadasConFotos() {

    const canchaSinFotos =
        registroComplejo
            .canchas
            .find(
                cancha =>
                    !canchaTieneFotos(cancha)
            );

    if (!canchaSinFotos) {

        return true;
    }

    mostrarAlerta(
        `${canchaSinFotos.nombre || "Una cancha"} debe tener al menos una foto antes de continuar.`,
        "warning",
        "Foto pendiente"
    );

    return false;
}


/* ============================================================
   29. VALIDAR CANCHA
   ============================================================ */
/* ============================================================
   VALIDAR FOTOS DE LA CANCHA
   ============================================================ */

function validarFotosCancha() {

    const errorAnterior =
        obtenerElemento("photosError");

    if (errorAnterior) {
        errorAnterior.remove();
    }

    const upload =
        document.querySelector(".photo-upload");

    upload?.classList.remove("input-error");

    /*
     * Mientras estamos creando/editando una cancha,
     * validamos las fotos seleccionadas temporalmente.
     */
    if (
        Array.isArray(fotosTemporales) &&
        fotosTemporales.length > 0
    ) {
        return true;
    }

    const contenedor =
        document.querySelector(".court-photos");

    if (contenedor) {

        const error =
            document.createElement("small");

        error.id = "photosError";
        error.className = "field-error";
        error.textContent =
            "Agrega al menos una foto de la cancha.";

        contenedor.insertAdjacentElement(
            "afterend",
            error
        );
    }

    upload?.classList.add("input-error");

    return false;
}
/* ============================================================
   VALIDAR PRECIO DE LAS CANCHAS GUARDADAS
   ============================================================ */

function canchaTienePrecio(cancha) {

    const valor =
        cancha?.precioPorHora ??
        cancha?.precio;

    const precio =
        Number(valor);

    return (
        Number.isFinite(precio) &&
        precio > 0
    );
}


function validarCanchasGuardadasConPrecio() {

    const canchaSinPrecio =
        registroComplejo
            .canchas
            .find(
                cancha =>
                    !canchaTienePrecio(cancha)
            );

    /*
     * Todas las canchas tienen precio.
     */
    if (!canchaSinPrecio) {

        return true;
    }

    /*
     * Encontramos una cancha sin precio.
     */
    mostrarAlerta(
        `${canchaSinPrecio.nombre || "Una cancha"} debe tener precio por hora antes de continuar.`,
        "warning",
        "Precio pendiente"
    );

    return false;
}
function validarCancha() {

    let valido = true;


    if (
        !validarRequerido(
            "courtName",
            "Ingresa el nombre de la cancha."
        )
    ) {

        valido = false;

    }


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
            "Selecciona un tipo de piso."
        )
    ) {

        valido = false;

    }


    /* ========================================================
       LARGO
       ======================================================== */

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


        if (
            !Number.isFinite(largo) ||
            largo <= 0
        ) {

            mostrarError(
                obtenerElemento(
                    "courtLength"
                ),
                "El largo debe ser mayor que 0."
            );

            valido = false;

        }

    }


    /* ========================================================
       ANCHO
       ======================================================== */

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


        if (
            !Number.isFinite(ancho) ||
            ancho <= 0
        ) {

            mostrarError(
                obtenerElemento(
                    "courtWidth"
                ),
                "El ancho debe ser mayor que 0."
            );

            valido = false;

        }

    }


    /* ========================================================
       PRECIO
       ======================================================== */

    if (
        !validarRequerido(
            "courtPrice",
            "Ingresa el precio por hora de la cancha."
        )
    ) {

        valido = false;

    } else {

        const precio =
            Number(
                obtenerValor(
                    "courtPrice"
                )
            );


        if (
            !Number.isFinite(precio) ||
            precio <= 0
        ) {

            mostrarError(
                obtenerElemento(
                    "courtPrice"
                ),
                "El precio debe ser mayor que 0."
            );

            valido = false;

        }

    }


    /* ========================================================
       DURACIÓN
       ======================================================== */

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


            contenedor.insertAdjacentElement(
                "afterend",
                error
            );

        }


        valido = false;

    }


    /* ========================================================
       FOTOS
       ======================================================== */

    if (
        !validarFotosCancha()
    ) {

        valido = false;

    }


    if (!valido) {

        mostrarAlerta(
            "Completa los datos obligatorios de la cancha.",
            "error"
        );

    }


    return valido;

}


/* ============================================================
   30. GUARDAR CANCHA
   ============================================================ */

function guardarCancha() {

    if (!validarCancha()) {
        return;
    }

    const duracionSeleccionada =
        document.querySelector(
            ".duration-option.active"
        );

    const duracionMinutos =
        duracionSeleccionada
            ? Number(
                duracionSeleccionada.dataset.duration
            )
            : null;

    const precioPorHora =
        Number(
            obtenerValor("courtPrice")
        );

    const datosCancha = {
        nombre: obtenerValor("courtName"),
        deporte: obtenerValor("courtSport"),
        tipoPiso: obtenerValor("courtFloor"),
        largo: Number(obtenerValor("courtLength")),
        ancho: Number(obtenerValor("courtWidth")),
        precioPorHora: precioPorHora,
        duracionMinutos: duracionMinutos,
        techada: obtenerElemento("courtCovered")?.checked || false,
        permiteOtrosDeportes: obtenerElemento("otherSports")?.checked || false,
        fotos: [...fotosTemporales]
    };

    const token = sessionStorage.getItem("access_token");

    if (!token) {
        mostrarAlerta("No hay una sesión activa.", "error", "Sesión requerida");
        return;
    }

    if (!complejoId) {
        mostrarAlerta("No encontramos el complejo registrado.", "error", "Complejo no encontrado");
        return;
    }

    const boton = obtenerElemento("btnSaveCourt");

    guardarCanchaEnBackend(datosCancha, token, boton)
        .catch(error => {
            console.error("Error registrando cancha:", error);
            mostrarAlerta(
                error.message || "No fue posible registrar la cancha.",
                "error",
                "Error"
            );
        });
}


/* ============================================================
   30.1 GUARDAR CANCHA EN BACKEND Y SUS FOTOS
   ============================================================ */

async function guardarCanchaEnBackend(datosCancha, token, boton) {

    try {

        if (boton) {
            boton.disabled = true;
            boton.textContent = "Guardando...";
        }

        const requestCancha = {
            idComplejo: complejoId,
            nombre: datosCancha.nombre,
            deporte: datosCancha.deporte,
            tipoPiso: datosCancha.tipoPiso,
            largo: datosCancha.largo,
            ancho: datosCancha.ancho,
            precioHora: datosCancha.precioPorHora,
            duracionMinutos: datosCancha.duracionMinutos,
            techada: datosCancha.techada,
            otrosDeportes: datosCancha.permiteOtrosDeportes
        };

        console.log("Enviando cancha:", requestCancha);

        const response = await fetch(
            `${API_URL}/canchas`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(requestCancha)
            }
        );

        if (!response.ok) {
            let mensaje = "No fue posible registrar la cancha.";

            try {
                const errorBackend = await response.json();
                mensaje = errorBackend.message || errorBackend.error || mensaje;
            } catch (error) {
                console.error(error);
            }

            throw new Error(mensaje);
        }

        const canchaCreada = await response.json();

        console.log("Cancha creada:", canchaCreada);

        const idCancha = canchaCreada.idCancha;

        if (!idCancha) {
            throw new Error(
                "El backend creó la cancha pero no devolvió idCancha."
            );
        }

        console.log("ID cancha:", idCancha);

        let fotosGuardadas = [];

        if (Array.isArray(fotosTemporales) && fotosTemporales.length > 0) {
            fotosGuardadas = await guardarFotosEnBackend(
                fotosTemporales,
                token
            );
        }

        const canchaLocal = {
            id: idCancha,
            idCancha: idCancha,
            idComplejo: complejoId,
            nombre: canchaCreada.nombre,
            deporte: canchaCreada.deporte,
            tipoPiso: canchaCreada.tipoPiso,
            largo: canchaCreada.largo,
            ancho: canchaCreada.ancho,
            precioPorHora: canchaCreada.precioHora,
            precio: canchaCreada.precioHora,
            duracionMinutos: canchaCreada.duracionMinutos,
            duraciones: canchaCreada.duracionMinutos
                ? [String(canchaCreada.duracionMinutos)]
                : [],
            techada: canchaCreada.techada,
            permiteOtrosDeportes: canchaCreada.otrosDeportes,
            estado: canchaCreada.estado,
            fotos: fotosGuardadas.map(foto => ({
                idFoto: foto.idFoto,
                nombre: foto.nombreArchivo,
                tipo: foto.tipoContenido,
                url: foto.url
                    ? `${API_URL.replace("/api", "")}${foto.url}`
                    : `${API_URL}/fotos/${foto.idFoto}`
            }))
        };

        if (canchaEditandoId !== null) {
            const indice = registroComplejo.canchas.findIndex(
                cancha => cancha.id === canchaEditandoId
            );

            if (indice >= 0) {
                registroComplejo.canchas[indice] = canchaLocal;
            }
        } else {
            registroComplejo.canchas.push(canchaLocal);
        }

        guardarLocalStorage();

        mostrarAlerta(
            fotosGuardadas.length > 0
                ? "La cancha y sus fotos fueron guardadas correctamente."
                : "La cancha fue registrada correctamente.",
            "success",
            "Cancha guardada"
        );

        cerrarFormularioCancha();
        renderizarCanchas();

    } finally {

        if (boton) {
            boton.disabled = false;
            boton.textContent = "Guardar cancha";
        }
    }
}


/* ============================================================
   30.2 GUARDAR FOTOS
   ============================================================ */

async function guardarFotosEnBackend(fotos, token) {

    if (!complejoId) {
        throw new Error(
            "No existe un complejo registrado para asociar las fotos."
        );
    }

    if (!Array.isArray(fotos) || fotos.length === 0) {
        return [];
    }

    const fotosGuardadas = [];

    for (const foto of fotos) {

        let archivo = foto?.archivo;

        /*
            Las fotos nuevas conservan el File original.
            Solo usamos dataUrl como compatibilidad con datos antiguos.
        */
        if (!(archivo instanceof File)) {

            if (!foto?.dataUrl) {
                throw new Error(
                    `No existe el archivo de la foto ${foto?.nombre || "seleccionada"}.`
                );
            }

            const respuestaBlob =
                await fetch(foto.dataUrl);

            const blob =
                await respuestaBlob.blob();

            archivo =
                new File(
                    [blob],
                    foto.nombre || "foto.jpg",
                    {
                        type:
                            foto.tipo ||
                            blob.type ||
                            "image/jpeg"
                    }
                );
        }

        const formData =
            new FormData();

        formData.append(
            "foto",
            archivo,
            archivo.name || foto.nombre || "foto.jpg"
        );

        console.log(
            "Subiendo foto:",
            archivo.name || foto.nombre
        );

        const response =
            await fetch(
                `${API_URL}/complejos/${complejoId}/fotos`,
                {
                    method: "POST",
                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    },
                    body: formData
                }
            );

        if (!response.ok) {

            let mensaje =
                `No se pudo guardar la foto: ${archivo.name || foto.nombre}`;

            try {
                const errorBackend =
                    await response.json();

                mensaje =
                    errorBackend.message ||
                    errorBackend.error ||
                    mensaje;

            } catch (error) {
                console.error(
                    "No se pudo leer el error de la foto:",
                    error
                );
            }

            throw new Error(mensaje);
        }

        const fotoGuardada =
            await response.json();

        console.log(
            "Foto guardada:",
            fotoGuardada
        );

        fotosGuardadas.push(
            fotoGuardada
        );
    }

    return fotosGuardadas;
}


/* ============================================================
   31. ELIMINAR CANCHA
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


    guardarLocalStorage();


    obtenerElemento(
        "courtFormCard"
    )
        ?.classList
        .add(
            "d-none"
        );


    limpiarFormularioCancha();

    renderizarCanchas();


    mostrarAlerta(
        "La cancha fue eliminada.",
        "info"
    );

}


/* ============================================================
   32. OBTENER NOMBRE DEL DEPORTE
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


    return deportes[valor] || valor;

}


/* ============================================================
   33. OBTENER NOMBRE DEL PISO
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


    return pisos[valor] || valor;

}


/* ============================================================
   34. OBTENER NOMBRE DE DURACIÓN
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


    return duraciones[valor] || valor;

}


/* ============================================================
   35. FORMATEAR PRECIO DE CANCHA
   ============================================================ */

function formatearPrecioCancha(valor) {

    const precio =
        Number(valor);


    if (
        !valor ||
        Number.isNaN(precio)
    ) {

        return "Precio pendiente";

    }


    return `$${precio.toLocaleString("es-CO")} COP / hora`;

}


/* ============================================================
   36. RENDERIZAR CANCHAS GUARDADAS
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


    lista.innerHTML = "";


    const formularioVisible =
        formulario &&
        !formulario
            .classList
            .contains(
                "d-none"
            );


    /* ========================================================
       SIN CANCHAS
       ======================================================== */

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

            continuar.disabled = true;

        }


        return;

    }


    /* ========================================================
       CON CANCHAS
       ======================================================== */

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


                /* =================================================
                   TAGS
                   ================================================= */

                const tags = [];


                if (cancha.techada) {

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


                if (
                    Array.isArray(
                        cancha.duraciones
                    )
                ) {

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

                }


                /* =================================================
                   FOTOS
                   ================================================= */

                const fotosCancha =
                    Array.isArray(
                        cancha.fotos
                    )
                        ? cancha.fotos
                            .map(
                                obtenerDataUrlFoto
                            )
                            .filter(Boolean)
                        : [];


                let fotosHTML = "";


                if (
                    fotosCancha.length > 0
                ) {

                    fotosHTML = `

                        <div class="saved-court-photos">

                            ${
                                fotosCancha
                                    .map(
                                        (dataUrl, index) => `

                                            <div class="saved-court-photo">

                                                <img
                                                    src="${dataUrl}"
                                                    alt="Foto ${index + 1} de ${cancha.nombre}"
                                                >

                                            </div>

                                        `
                                    )
                                    .join("")
                            }

                        </div>

                    `;

                }


                /* =================================================
                   TARJETA
                   ================================================= */

                tarjeta.innerHTML = `

                    <div class="saved-court-info">


                        <div class="saved-court-title">

                            <h3>
                                ${cancha.nombre}
                            </h3>


                            <span class="sport-badge">

                                ${obtenerNombreDeporte(
                                    cancha.deporte
                                )}

                            </span>

                        </div>


                        <p>

                            ${obtenerNombrePiso(
                                cancha.tipoPiso
                            )}

                            ·

                            ${cancha.largo}m x
                            ${cancha.ancho}m

                            &middot;

                            ${formatearPrecioCancha(
                                cancha.precioPorHora
                                || cancha.precio
                            )}

                        </p>


                        <div class="saved-court-tags">

                            ${
                                tags
                                    .map(
                                        tag =>
                                            `<span>${tag}</span>`
                                    )
                                    .join("")
                            }

                        </div>


                        ${fotosHTML}


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


    /*
        Mostrar botón agregar otra.
    */

    if (!formularioVisible) {

        agregarOtra
            ?.classList
            .remove(
                "d-none"
            );

    }


    /*
        Habilitar continuar cuando
        exista al menos una cancha.
    */

    if (continuar) {

        continuar.disabled =
            formularioVisible;

    }

}


/* ============================================================
   36. OBTENER TEXTO DEL SELECT
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
   37. ACTUALIZAR REVISIÓN
   ============================================================ */

function actualizarRevision() {

    const datosTitular = {
        reviewOwnerName:
            registroComplejo.organizacion.nombreTitular,

        reviewOwnerCedula:
            registroComplejo.organizacion.cedulaTitular,

        reviewOwnerPhone:
            registroComplejo.organizacion.telefonoTitular
                ? `+57 ${registroComplejo.organizacion.telefonoTitular}`
                : "—",

        reviewOwnerEmail:
            registroComplejo.organizacion.correoTitular
    };

    Object.entries(datosTitular).forEach(
        ([id, valor]) => {
            const elemento =
                obtenerElemento(id);

            if (elemento) {
                elemento.textContent =
                    valor || "—";
            }
        }
    );

    const datosComplejo = {
        reviewComplexName:
            registroComplejo.complejo.nombre,

        reviewProvince:
            registroComplejo.complejo.provinciaNombre ||
            registroComplejo.complejo.provincia ||
            "—",

        reviewCity:
            registroComplejo.complejo.ciudadNombre ||
            registroComplejo.complejo.ciudad ||
            "—",

        reviewAddress:
            registroComplejo.complejo.direccion,

        reviewComplexPhone:
            registroComplejo.complejo.telefono
                ? `+57 ${registroComplejo.complejo.telefono}`
                : "—",

        reviewAmenities:
            Array.isArray(
                registroComplejo.complejo.prestaciones
            ) &&
            registroComplejo.complejo.prestaciones.length > 0
                ? registroComplejo.complejo.prestaciones.join(", ")
                : "Sin prestaciones cargadas"
    };

    Object.entries(datosComplejo).forEach(
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
   38. RENDERIZAR CANCHAS EN REVISIÓN
   ============================================================ */

function renderizarCanchasRevision() {

    const contenedor =
        obtenerElemento(
            "reviewCourts"
        );


    if (!contenedor) {

        return;

    }


    contenedor.innerHTML = "";


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

                        ${obtenerNombreDeporte(
                            cancha.deporte
                        )}

                        ·

                        ${obtenerNombrePiso(
                            cancha.tipoPiso
                        )}

                        &middot;

                        ${formatearPrecioCancha(
                            cancha.precioPorHora
                            || cancha.precio
                        )}

                    </strong>

                `;


                contenedor.appendChild(
                    fila
                );

            }
        );

}


/* ============================================================
   39. CREAR SOLICITUDES PARA ADMIN
   ============================================================ */

function clonarCanchaParaSolicitud(cancha) {

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


function crearSolicitudesPorCancha() {

    const idGrupoSolicitud =
        `SOL-${Date.now()}`;


    const fechaSolicitud =
        new Date()
            .toISOString();


    return registroComplejo
        .canchas
        .map(
            (cancha, index) => {

                const canchaSolicitud =
                    clonarCanchaParaSolicitud(
                        cancha
                    );


                return {

                    id:
                        `${idGrupoSolicitud}-CANCHA-${index + 1}`,

                    grupoSolicitudId:
                        idGrupoSolicitud,

                    canchaId:
                        canchaSolicitud.id,

                    numeroCancha:
                        index + 1,

                    precio:
                        canchaSolicitud.precio,

                    precioPorHora:
                        canchaSolicitud.precioPorHora,

                    horario:
                        canchaSolicitud.horario
                        || HORARIO_PREDETERMINADO,

                    horarioAtencion:
                        canchaSolicitud.horarioAtencion
                        || HORARIO_PREDETERMINADO,

                    organizacion: {
                        ...registroComplejo.organizacion
                    },

                    complejo: {

                        ...registroComplejo.complejo,

                        prestaciones: [
                            ...registroComplejo
                                .complejo
                                .prestaciones
                        ]

                    },

                    canchas: [
                        canchaSolicitud
                    ],

                    comoNosConociste:
                        registroComplejo
                            .comoNosConociste,

                    estado:
                        "pendiente",

                    fechaSolicitud:
                        fechaSolicitud

                };

            }
        );

}


/* ============================================================
   40. GUARDAR SOLICITUDES PARA ADMIN
   ============================================================ */

function guardarSolicitudFinal(
    solicitudesNuevas
) {

    let solicitudes = [];


    try {

        solicitudes =
            JSON.parse(
                localStorage.getItem(
                    SOLICITUDES_KEY
                )
            ) || [];

    } catch (error) {

        console.error(error);

        solicitudes = [];

    }


    const nuevasSolicitudes =
        Array.isArray(
            solicitudesNuevas
        )
            ? solicitudesNuevas
            : [
                solicitudesNuevas
            ];


    solicitudes.push(
        ...nuevasSolicitudes
    );


    const borradorActual =
        localStorage.getItem(
            STORAGE_KEY
        );


    localStorage.removeItem(
        STORAGE_KEY
    );


    try {

        localStorage.setItem(
            SOLICITUDES_KEY,
            JSON.stringify(
                solicitudes
            )
        );

        return true;

    } catch (error) {

        if (
            borradorActual !== null
        ) {

            try {

                localStorage.setItem(
                    STORAGE_KEY,
                    borradorActual
                );

            } catch (errorRestaurando) {

                console.error(
                    "Error restaurando borrador:",
                    errorRestaurando
                );

            }

        }


        console.error(
            "Error guardando solicitud:",
            error
        );


        mostrarAlerta(
            "No fue posible guardar la solicitud. Puede que las imágenes ocupen demasiado espacio.",
            "error"
        );


        return false;

    }

}


/* ============================================================
   41. ENVIAR SOLICITUD
   ============================================================ */

function enviarSolicitud() {

    const titularCompleto =
        Boolean(
            registroComplejo.organizacion.nombreTitular &&
            registroComplejo.organizacion.cedulaTitular &&
            registroComplejo.organizacion.telefonoTitular &&
            registroComplejo.organizacion.correoTitular &&
            titularComplejoId
        );

    if (!titularCompleto) {

        mostrarAlerta(
            "No se encontró un titular registrado correctamente.",
            "error",
            "Titular no encontrado"
        );

        return;
    }

    const complejoCompleto =
        Boolean(
            registroComplejo.complejo.nombre &&
            registroComplejo.complejo.provincia &&
            registroComplejo.complejo.ciudad &&
            registroComplejo.complejo.direccion &&
            registroComplejo.complejo.telefono &&
            Array.isArray(registroComplejo.complejo.prestaciones) &&
            registroComplejo.complejo.prestaciones.length > 0 &&
            complejoId
        );

    if (!complejoCompleto) {

        mostrarAlerta(
            "No se encontró el complejo registrado correctamente.",
            "error",
            "Complejo no encontrado"
        );

        return;
    }

    if (
        !Array.isArray(registroComplejo.canchas) ||
        registroComplejo.canchas.length === 0
    ) {

        mostrarAlerta(
            "Debes agregar al menos una cancha antes de enviar la solicitud.",
            "warning"
        );

        mostrarPaso(3);
        renderizarCanchas();
        return;
    }

    if (!validarCanchasGuardadasConFotos()) {
        mostrarPaso(3);
        renderizarCanchas();
        return;
    }

    if (!validarCanchasGuardadasConPrecio()) {
        mostrarPaso(3);
        renderizarCanchas();
        return;
    }

    const howFoundUs =
        obtenerElemento("howFoundUs");

    if (!howFoundUs || !howFoundUs.value) {

        mostrarError(
            howFoundUs,
            "Selecciona una opción."
        );

        mostrarAlerta(
            "Selecciona cómo conociste TuCancha.",
            "warning"
        );

        return;
    }

    limpiarError(howFoundUs);

    registroComplejo.comoNosConociste =
        howFoundUs.value;

    guardarLocalStorage();

    const solicitudesCancha =
        crearSolicitudesPorCancha();

    const guardado =
        guardarSolicitudFinal(
            solicitudesCancha
        );

    if (!guardado) {
        return;
    }

    const solicitudesConsola =
        JSON.parse(
            JSON.stringify(solicitudesCancha)
        );

    solicitudesConsola.forEach(
        solicitud => {
            solicitud.canchas.forEach(
                cancha => {
                    cancha.fotos =
                        (cancha.fotos || []).map(
                            foto => ({
                                idFoto:
                                    foto.idFoto,
                                nombre:
                                    foto.nombre || foto.nombreArchivo,
                                tipo:
                                    foto.tipo || foto.tipoContenido,
                                url:
                                    foto.url
                            })
                        );
                }
            );
        }
    );

    console.log(
        "=========================================="
    );
    console.log(
        "TUCANCHA - NUEVA SOLICITUD"
    );
    console.log(
        "=========================================="
    );
    console.log(
        JSON.stringify(
            solicitudesConsola,
            null,
            4
        )
    );
    console.log(
        "Solicitudes completas:",
        solicitudesCancha
    );

    mostrarAlerta(
        "La solicitud fue enviada correctamente.",
        "success",
        "Solicitud enviada"
    );

    reiniciarFormulario(false);
}


/* ============================================================
   41. REINICIAR FORMULARIO
   ============================================================ */

function reiniciarFormulario(
    preguntar = true
) {

    if (preguntar) {

        const confirmar =
            confirm(
                "¿Seguro que deseas empezar de nuevo? Se eliminará el borrador actual."
            );


        if (!confirmar) {

            return;

        }

    }


    /* ========================================================
       BORRAR BORRADOR
       ======================================================== */

    localStorage.removeItem(
        STORAGE_KEY
    );


    /* ========================================================
       REINICIAR ESTADO
       ======================================================== */

    registroComplejo =
        crearEstadoInicial();


    canchaEditandoId =
        null;


    fotosTemporales =
        [];


    /* ========================================================
       RESET FORMS
       ======================================================== */

    obtenerElemento(
        "organizationForm"
    )?.reset();


    obtenerElemento(
        "complexForm"
    )?.reset();


    const howFoundUs =
        obtenerElemento(
            "howFoundUs"
        );


    if (howFoundUs) {

        howFoundUs.value = "";

    }


    /* ========================================================
       PRESTACIONES
       ======================================================== */

    document
        .querySelectorAll(
            ".prestation.active"
        )
        .forEach(
            boton => {

                boton.classList.remove(
                    "active"
                );

            }
        );


    /* ========================================================
       LIMPIAR CANCHA
       ======================================================== */

    limpiarFormularioCancha();


    obtenerElemento(
        "courtFormCard"
    )
        ?.classList
        .add(
            "d-none"
        );


    /* ========================================================
       LIMPIAR CANCHAS
       ======================================================== */

    const lista =
        obtenerElemento(
            "savedCourtsList"
        );


    if (lista) {

        lista.innerHTML = "";

    }


    /* ========================================================
       LIMPIAR ERRORES
       ======================================================== */

    document
        .querySelectorAll(
            ".field-error"
        )
        .forEach(
            error => {

                error.remove();

            }
        );


    document
        .querySelectorAll(
            ".input-error"
        )
        .forEach(
            campo => {

                campo.classList.remove(
                    "input-error"
                );

            }
        );


    /* ========================================================
       VOLVER AL PASO 1
       ======================================================== */

    mostrarPaso(1);

    renderizarCanchas();


    if (preguntar) {

        mostrarAlerta(
            "El formulario fue reiniciado correctamente.",
            "info"
        );

    }

}


/* ============================================================
   42. AUTOGUARDADO
   ============================================================ */

function configurarAutoguardado() {

    /* ========================================================
       ORGANIZACIÓN
       ======================================================== */

    const camposOrganizacion = [

        "nombreTitular",
        "cedulaTitular",
        "telefonoTitular",
        "correoTitular"

    ];


    camposOrganizacion.forEach(
        id => {

            const elemento =
                obtenerElemento(id);


            elemento
                ?.addEventListener(
                    "input",
                    () => {

                        capturarOrganizacion();

                        limpiarError(elemento);

                    }
                );

        }
    );


    /* ========================================================
       COMPLEJO
       ======================================================== */

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
                    () => {

                        capturarComplejo();

                        limpiarError(elemento);

                    }
                );


            elemento
                ?.addEventListener(
                    "change",
                    () => {

                        capturarComplejo();

                        limpiarError(elemento);

                    }
                );

        }
    );


    /* ========================================================
       CÓMO NOS CONOCISTE
       ======================================================== */

    obtenerElemento(
        "howFoundUs"
    )
        ?.addEventListener(
            "change",
            event => {

                registroComplejo
                    .comoNosConociste =
                    event.target.value;


                limpiarError(
                    event.target
                );


                guardarLocalStorage();

            }
        );

}


/* ============================================================
   43. CONFIGURAR EVENTOS
   ============================================================ */

function configurarEventos() {

    /* ========================================================
       PASO 1 → PASO 2
       ======================================================== */

    obtenerElemento(
    "btnContinueOrganization"
)
    ?.addEventListener(
        "click",
        async () => {

            // ===============================
            // VALIDAR FORMULARIO
            // ===============================

            if (!validarOrganizacion()) {
                return;
            }

            const boton =
                obtenerElemento(
                    "btnContinueOrganization"
                );

            try {

                // ===============================
                // BLOQUEAR BOTÓN
                // ===============================

                if (boton) {

                    boton.disabled = true;

                    boton.innerHTML =
                        `Guardando... <span>→</span>`;
                }

                // ===============================
                // GUARDAR EN SUPABASE
                // A TRAVÉS DEL BACKEND
                // ===============================

                const titular =
                    await guardarTitularEnBackend();

                console.log(
                    "Titular registrado correctamente:",
                    titular
                );

                mostrarAlerta(
                    "Los datos del titular fueron guardados correctamente.",
                    "success",
                    "Titular registrado"
                );

                // ===============================
                // PASAR AL COMPLEJO
                // ===============================

                mostrarPaso(2);

            } catch (error) {

                console.error(
                    "Error registrando titular:",
                    error
                );

                mostrarAlerta(
                    error.message ||
                    "No fue posible registrar el titular.",
                    "error",
                    "Error al registrar"
                );

            } finally {

                if (boton) {

                    boton.disabled = false;

                    boton.innerHTML =
                        `Continuar <span>→</span>`;
                }
            }
        }
    );


    /* ========================================================
       PASO 2 → PASO 1
       ======================================================== */

    obtenerElemento(
        "btnBackComplex"
    )
        ?.addEventListener(
            "click",
            () => {

                mostrarPaso(1);

            }
        );


    /* ========================================================
       PASO 2 → PASO 3
       ======================================================== */

    obtenerElemento(
        "btnContinueComplex"
    )
        ?.addEventListener(
            "click",
            async () => {

                if (!validarComplejo()) {
                    return;
                }

                if (!titularComplejoId) {
                    mostrarAlerta(
                        "No encontramos el titular registrado.",
                        "error",
                        "Titular no encontrado"
                    );
                    mostrarPaso(1);
                    return;
                }

                const boton = obtenerElemento(
                    "btnContinueComplex"
                );

                try {

                    if (boton) {
                        boton.disabled = true;
                        boton.innerHTML =
                            `Guardando... <span>→</span>`;
                    }

                    const complejo =
                        await guardarComplejoEnBackend();

                    console.log(
                        "Complejo registrado correctamente:",
                        complejo
                    );

                    mostrarAlerta(
                        "El complejo fue registrado correctamente.",
                        "success",
                        "Complejo registrado"
                    );

                    mostrarPaso(3);
                    renderizarCanchas();

                } catch (error) {

                    console.error(
                        "Error registrando complejo:",
                        error
                    );

                    mostrarAlerta(
                        error.message ||
                        "No fue posible registrar el complejo.",
                        "error",
                        "Error"
                    );

                } finally {

                    if (boton) {
                        boton.disabled = false;
                        boton.innerHTML =
                            `Continuar <span>→</span>`;
                    }
                }
            }
        );


    /* ========================================================
       PASO 3 → PASO 2
       ======================================================== */

    obtenerElemento(
        "btnBackCourt"
    )
        ?.addEventListener(
            "click",
            () => {

                mostrarPaso(2);

            }
        );


    /* ========================================================
       PASO 3 → PASO 4
       ======================================================== */

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

                mostrarAlerta(
                    "Debes agregar al menos una cancha para continuar.",
                    "warning"
                );

                return;
            }

            if (
                !validarCanchasGuardadasConFotos()
            ) {

                return;
            }

            if (
                !validarCanchasGuardadasConPrecio()
            ) {

                return;
            }

            mostrarPaso(4);

        }
    );


    /* ========================================================
       PASO 4 → PASO 3
       ======================================================== */

    obtenerElemento(
        "btnBackReview"
    )
        ?.addEventListener(
            "click",
            () => {

                mostrarPaso(3);

                renderizarCanchas();

            }
        );


    /* ========================================================
       EMPEZAR DE NUEVO
       ======================================================== */

    obtenerElemento(
        "btnRestartRegistration"
    )
        ?.addEventListener(
            "click",
            () => {

                reiniciarFormulario(true);

            }
        );


    /* ========================================================
       PRESTACIONES
       ======================================================== */

    document
        .querySelectorAll(
            ".prestation"
        )
        .forEach(
            boton => {

                boton.addEventListener(
                    "click",
                    () => {

                        boton.classList.toggle(
                            "active"
                        );

                    }
                );
            }
        );


    /* ========================================================
       DURACIONES
       ======================================================== */

    document
        .querySelectorAll(
            ".duration-option"
        )
        .forEach(
            boton => {

                boton.addEventListener(
                    "click",
                    () => {

                        document
                            .querySelectorAll(
                                ".duration-option"
                            )
                            .forEach(
                                opcion =>
                                    opcion.classList.remove(
                                        "active"
                                    )
                            );

                        boton.classList.add(
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


    /* ========================================================
       AGREGAR PRIMERA CANCHA
       ======================================================== */

    obtenerElemento(
        "btnAddCourt"
    )
        ?.addEventListener(
            "click",
            () => {

                abrirFormularioCancha();

            }
        );


    /* ========================================================
       AGREGAR OTRA CANCHA
       ======================================================== */

    obtenerElemento(
        "btnAddAnotherCourt"
    )
        ?.addEventListener(
            "click",
            () => {

                abrirFormularioCancha();

            }
        );


    /* ========================================================
       CANCELAR CANCHA
       ======================================================== */

    obtenerElemento(
        "btnCancelCourt"
    )
        ?.addEventListener(
            "click",
            () => {

                cerrarFormularioCancha();

            }
        );


    /* ========================================================
       GUARDAR CANCHA
       ======================================================== */

    obtenerElemento(
        "btnSaveCourt"
    )
        ?.addEventListener(
            "click",
            () => {

                guardarCancha();

            }
        );


    /* ========================================================
       ELIMINAR DESDE FORMULARIO
       ======================================================== */

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


    /* ========================================================
       CARGAR FOTOS
       ======================================================== */

    document
        .querySelector(
            ".photo-upload"
        )
        ?.addEventListener(
            "click",
            event => {

                const inputFotos =
                    obtenerElemento(
                        "courtPhotos"
                    );


                if (!inputFotos) {

                    return;

                }


                event.preventDefault();


                inputFotos.click();

            }
        );


    obtenerElemento(
        "courtPhotos"
    )
        ?.addEventListener(
            "change",
            async event => {

                const archivos =
                    Array.from(
                        event.target.files
                    );


                await procesarFotos(
                    archivos
                );


                /*
                    Permitimos volver a seleccionar
                    la misma imagen posteriormente.
                */

                event.target.value = "";

            }
        );


    /* ========================================================
       ELIMINAR FOTO DEL PREVIEW
       ======================================================== */

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


    /* ========================================================
       EDITAR / ELIMINAR CANCHA GUARDADA
       ======================================================== */

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


    /* ========================================================
       ENVIAR SOLICITUD
       ======================================================== */

    obtenerElemento(
        "btnSubmitRequest"
    )
        ?.addEventListener(
            "click",
            () => {

                enviarSolicitud();
                window.location.href = "../index.html";
            }
        );


    /* ========================================================
       SIDEBAR
       ======================================================== */

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


                        /*
                            Solo puede regresar o visitar
                            pasos que ya alcanzó.
                        */

                        if (
                            paso <=
                            registroComplejo
                                .pasoMaximo
                        ) {

                            mostrarPaso(paso);


                            if (paso === 3) {

                                renderizarCanchas();

                            }

                        }

                    }
                );

            }
        );


    /* ========================================================
       AUTOGUARDADO
       ======================================================== */

    configurarAutoguardado();

}


/* ============================================================
   44. INICIAR APLICACIÓN
   ============================================================ */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /* ====================================================
           RECUPERAR BORRADOR
           ==================================================== */

        recuperarLocalStorage();


        /* ====================================================
           CAMPOS VISUALES LIMPIOS
           ==================================================== */

        limpiarCamposVisuales();


        /* ====================================================
           CONFIGURAR EVENTOS
           ==================================================== */

        configurarEventos();


        /* ====================================================
           RENDERIZAR CANCHAS
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
            "TuCancha: registro de complejo iniciado correctamente."
        );

    }
);
