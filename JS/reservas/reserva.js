import { backendApi } from "../services/backend-api.js";

document.addEventListener("DOMContentLoaded", () => {
    const canchaGuardada = localStorage.getItem("cancha_seleccionada");
    const reservaModificar = (() => {
        try {
            const item = localStorage.getItem("reserva_modificar");
            return item ? JSON.parse(item) : null;
        } catch (error) {
            localStorage.removeItem("reserva_modificar");
            return null;
        }
    })();
    let canchaSeleccionada = null;

    if (canchaGuardada) {
        try {
            canchaSeleccionada = JSON.parse(canchaGuardada);
        } catch (error) {
            console.error("No fue posible leer la cancha seleccionada:", error);
        }
    }

    if (canchaSeleccionada) {
        const elementosDinamicos = document.querySelectorAll("[data-field]");

        elementosDinamicos.forEach(elemento => {
            const campo = elemento.getAttribute("data-field");

            if (elemento.tagName === "IMG") {
                elemento.src = canchaSeleccionada[campo] || "../img/foto.canchas.jpg";

                if (canchaSeleccionada.nombre) {
                    elemento.alt = `Imagen de ${canchaSeleccionada.nombre}`;
                }

                return;
            }

            if (campo === "precio") {
                const precioNumerico = Number(canchaSeleccionada[campo]);

                elemento.textContent = !canchaSeleccionada[campo] || Number.isNaN(precioNumerico)
                    ? "Precio no especificado"
                    : `$ ${precioNumerico.toLocaleString("es-CO")}`;

                return;
            }

            elemento.textContent = canchaSeleccionada[campo] || "No especificado";
        });
    } else if (reservaModificar) {
        canchaSeleccionada = {
            id: reservaModificar.canchaId || reservaModificar.idCancha || reservaModificar.id,
            nombre: reservaModificar.nombre,
            ubicacion: reservaModificar.ubicacion,
            imagen: reservaModificar.imagen,
            precio: reservaModificar.precio,
            descripcion: reservaModificar.descripcion || ""
        };
        localStorage.setItem("cancha_seleccionada", JSON.stringify(canchaSeleccionada));

        const elementosDinamicos = document.querySelectorAll("[data-field]");
        elementosDinamicos.forEach(elemento => {
            const campo = elemento.getAttribute("data-field");
            if (elemento.tagName === "IMG") {
                elemento.src = canchaSeleccionada[campo] || "../img/foto.canchas.jpg";
                if (canchaSeleccionada.nombre) {
                    elemento.alt = `Imagen de ${canchaSeleccionada.nombre}`;
                }
            }
            if (campo === "precio") {
                const precioNumerico = Number(canchaSeleccionada[campo]);
                elemento.textContent = !canchaSeleccionada[campo] || Number.isNaN(precioNumerico)
                    ? "Precio no especificado"
                    : `$ ${precioNumerico.toLocaleString("es-CO")}`;
            } else if (campo && canchaSeleccionada[campo] !== undefined && canchaSeleccionada[campo] !== null) {
                elemento.textContent = canchaSeleccionada[campo];
            }
        });
    } else {
        console.warn("No se encontró ninguna cancha seleccionada en LocalStorage.");
    }

    const parametros = new URLSearchParams(window.location.search);
    const idCancha = canchaSeleccionada?.idCancha || canchaSeleccionada?.id || parametros.get("id");
    const fechas = document.getElementById("fechas");
    const turnos = document.getElementById("turnos");
    const cantidadTurnos = document.getElementById("cantidad-turnos");
    const fechaReserva = document.getElementById("fecha-reserva");
    const horarioReserva = document.getElementById("horario-reserva");
    const detalleCancha = document.getElementById("detalle-cancha");
    const botonReservar = document.querySelector(".reservar");
    const fechaInicio = document.getElementById("fecha-inicio");
    const fechaFin = document.getElementById("fecha-fin");
    const botonAnterior = document.querySelector(".anterior");
    const botonSiguiente = document.querySelector(".siguiente");

    let fechaSeleccionada = null;
    let horarioSeleccionado = null;
    let botonFechaSeleccionado = null;
    let botonHorarioSeleccionado = null;
    let semanaActual = new Date();
    let solicitudHorariosActual = 0;

    const horariosRespaldo = [
        "08:00", "10:00", "11:00", "12:00", "14:00",
        "15:00", "16:00", "18:00", "19:00", "20:00"
    ];
    const horariosOcupadosRespaldo = [];

    function formatearPrecioReserva(valor) {
        const precio = Number(valor);

        if (!valor || Number.isNaN(precio)) {
            return "Precio no especificado";
        }

<<<<<<< HEAD
        return `$ ${precio.toLocaleString("es-CO")}`;
    }

    function renderizarDetalleReserva(cancha) {
        if (!detalleCancha) {
            return;
        }

        detalleCancha.innerHTML = "";

        const nombre = document.createElement("strong");
        nombre.textContent = cancha.nombre || "Cancha seleccionada";

        const ubicacion = document.createElement("p");
        ubicacion.textContent = cancha.ubicacion || "Ubicación no especificada";

        const precio = document.createElement("p");
        precio.textContent = formatearPrecioReserva(cancha.precio);

        detalleCancha.append(nombre, ubicacion, precio);
    }

    function obtenerLunes(fecha) {
        const lunes = new Date(fecha);
        const diaSemana = lunes.getDay();
        const diferencia = diaSemana === 0 ? 6 : diaSemana - 1;

        lunes.setDate(lunes.getDate() - diferencia);
        lunes.setHours(0, 0, 0, 0);

        return lunes;
    }

    function actualizarTextoSemana(lunes) {
        const domingo = new Date(lunes);
        domingo.setDate(lunes.getDate() + 6);

        if (fechaInicio) {
            fechaInicio.textContent = lunes.toLocaleDateString("es-CO", {
                day: "numeric",
                month: "long"
            });
        }

        if (fechaFin) {
            fechaFin.textContent = domingo.toLocaleDateString("es-CO", {
                day: "numeric",
                month: "long"
            });
        }
    }

    function formatearFechaApi(fecha) {
        const mes = String(fecha.getMonth() + 1).padStart(2, "0");
        const dia = String(fecha.getDate()).padStart(2, "0");

        return `${fecha.getFullYear()}-${mes}-${dia}`;
    }

    function formatearHora(hora) {
        return typeof hora === "string" ? hora.slice(0, 5) : "";
    }

    function limpiarSeleccionHorario() {
        horarioSeleccionado = null;
        botonHorarioSeleccionado = null;

        if (horarioReserva) {
            horarioReserva.textContent = "";
        }
    }

    function seleccionarHorario(horario, botonHorario) {
        if (botonHorarioSeleccionado) {
            botonHorarioSeleccionado.classList.remove("seleccionado");
        }

        if (!horario || !horario.idHorario || !Number.isInteger(Number(horario.idHorario))) {
            mostrarModal({
                titulo: "Horario no disponible",
                mensaje: "No se pudo obtener un horario válido del servidor para confirmar la reserva.",
                icono: "⚠️",
                botones: [{
                    texto: "Entendido",
                    clase: "modal-boton-principal",
                    cerrar: true
                }]
            });
            return;
        }

        horarioSeleccionado = horario;
        botonHorarioSeleccionado = botonHorario;
        botonHorario.classList.add("seleccionado");

        if (horarioReserva) {
            horarioReserva.textContent = horario.etiqueta;
        }
    }

    function renderizarHorarios(horarios) {
        if (!turnos) {
            return;
        }

        turnos.innerHTML = "";

        horarios.forEach(horario => {
            const botonHorario = document.createElement("button");
            botonHorario.textContent = horario.etiqueta;

            if (horario.ocupado) {
                botonHorario.classList.add("ocupado");
            } else {
                botonHorario.addEventListener("click", () => {
                    seleccionarHorario(horario, botonHorario);
                });
            }

            turnos.appendChild(botonHorario);
        });

        if (cantidadTurnos) {
            cantidadTurnos.textContent = horarios.filter(horario => !horario.ocupado).length;
        }
    }

    function obtenerHorariosRespaldo() {
        return horariosRespaldo.map(hora => ({
            etiqueta: hora,
            ocupado: horariosOcupadosRespaldo.includes(hora)
        }));
    }

    async function mostrarHorarios() {
        const solicitudActual = ++solicitudHorariosActual;

        limpiarSeleccionHorario();
=======
    // DILSIA AGENDA DESDE ACA
    const parametros = new URLSearchParams(window.location.search);

    const idCancha = parametros.get("id");


    const fechas = document.getElementById("fechas");
    const turnos = document.getElementById("turnos");
    const cantidadTurnos = document.getElementById("cantidad-turnos");
    const fechaReserva = document.getElementById("fecha-reserva");
    const horarioReserva = document.getElementById("horario-reserva");
    const detalleCancha = document.getElementById("detalle-cancha");
    const botonReservar = document.querySelector(".reservar");
    const fechaInicio = document.getElementById("fecha-inicio");
    const fechaFin = document.getElementById("fecha-fin");
    const botonAnterior = document.querySelector(".anterior");
    const botonSiguiente = document.querySelector(".siguiente");

    function formatearPrecioReserva(valor) {
        const precio = Number(valor);

        if (
            !valor ||
            Number.isNaN(precio)
        ) {
            return "Precio no especificado";
        }

        return `$ ${precio.toLocaleString("es-CO")}`;
    }

    function renderizarDetalleReserva(cancha) {
        if (!detalleCancha) {
            return;
        }

        detalleCancha.innerHTML = "";

        const nombre = document.createElement("strong");
        nombre.textContent = cancha.nombre || "Cancha seleccionada";

        const ubicacion = document.createElement("p");
        ubicacion.textContent = cancha.ubicacion || "Ubicacion no especificada";

        const precio = document.createElement("p");
        precio.textContent = formatearPrecioReserva(cancha.precio);

        detalleCancha.appendChild(nombre);
        detalleCancha.appendChild(ubicacion);
        detalleCancha.appendChild(precio);
    }

    if (canchaSeleccionada) {
        renderizarDetalleReserva(canchaSeleccionada);
    }


    let fechaSeleccionada = null;
    let horarioSeleccionado = null;
    let botonFechaSeleccionado = null;
    let botonHorarioSeleccionado = null;

    let semanaActual = new Date();

    //  HORARIOS TEMPORALES


    const horarios = [
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00",
        "20:00"
    ];


    //  HORARIOS OCUPADOS TEMPORALES


    const horariosOcupados = [
        "09:00",
        "13:00",
        "17:00"
    ];

    cantidadTurnos.textContent = horarios.length - horariosOcupados.length;

    function obtenerLunes(fecha) {
        const lunes = new Date(fecha);
        const diaSemana = lunes.getDay();
        let diferencia;
        if (diaSemana === 0) {
            diferencia = 6;
        } else {
            diferencia = diaSemana - 1;
        }
        lunes.setDate(
            lunes.getDate() - diferencia
        );
        lunes.setHours(0, 0, 0, 0);
        return lunes;
    }

    function esFechaPasada(fecha) {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const fechaComparar = new Date(fecha);
        fechaComparar.setHours(0, 0, 0, 0);
        return fechaComparar < hoy;
    }

    function convertirFechaIso(fechaTexto) {
        if (!fechaTexto) return "";

        if (/^\d{4}-\d{2}-\d{2}$/.test(fechaTexto)) {
            return fechaTexto;
        }

        const partes = fechaTexto.split(/[/-]/);
        if (partes.length !== 3) return "";

        const [dia, mes, anio] = partes.map((parte) => Number(parte));
        if (!dia || !mes || !anio) return "";

        const fecha = new Date(anio, mes - 1, dia);
        if (Number.isNaN(fecha.getTime())) return "";

        return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}-${String(fecha.getDate()).padStart(2, "0")}`;
    }

    function preseleccionarReservaModificar() {
        if (!reservaModificar) return;

        const fechaIso = convertirFechaIso(reservaModificar.fecha);
        if (!fechaIso) return;

        const botonFecha = Array.from(document.querySelectorAll("#fechas button")).find((boton) => boton.dataset.fecha === fechaIso);
        if (botonFecha && !botonFecha.disabled) {
            botonFecha.click();

            setTimeout(() => {
                const horario = reservaModificar.hora || reservaModificar.horario;
                const botonHorario = Array.from(document.querySelectorAll("#turnos button")).find((boton) => boton.textContent.trim() === horario);
                if (botonHorario && !botonHorario.classList.contains("ocupado")) {
                    botonHorario.click();
                }
            }, 0);
        }
    }

    function mostrarSemana() {
        const lunes = obtenerLunes(semanaActual);
        fechas.innerHTML = "";
        for (let i = 0; i < 7; i++) {
            const fecha = new Date(lunes);
            fecha.setDate(
                lunes.getDate() + i
            );

            const botonFecha = document.createElement("button");
            const fechaIso = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}-${String(fecha.getDate()).padStart(2, "0")}`;
            botonFecha.dataset.fecha = fechaIso;
            const dia = document.createElement("span");
            dia.textContent =
                fecha.toLocaleDateString("es-CO", {
                    weekday: "short"
                });

            const numero = document.createElement("strong");

            numero.textContent =
                fecha.getDate();

            const mes = document.createElement("small");
            mes.textContent =
                fecha.toLocaleDateString("es-CO", {
                    month: "short"
                });

            botonFecha.appendChild(dia);
            botonFecha.appendChild(numero);
            botonFecha.appendChild(mes);

            const fechaPasada = esFechaPasada(fecha);

            if (fechaPasada) {
                botonFecha.disabled = true;
                botonFecha.classList.add("ocupado");
                botonFecha.setAttribute("aria-disabled", "true");
            } else {
                botonFecha.addEventListener("click", () => {
                    if (botonFechaSeleccionado !== null) {
                        botonFechaSeleccionado.classList.remove(
                            "seleccionada"
                        );
                    }

                    fechaSeleccionada = fecha;
                    if (fechaReserva) {
                        fechaReserva.textContent =
                            fechaSeleccionada.toLocaleDateString(
                                "es-CO"
                            );
                    }

                    botonFecha.classList.add(
                        "seleccionada"
                    );

                    botonFechaSeleccionado =
                        botonFecha;

                    mostrarHorarios();

                    console.log(
                        "Fecha seleccionada:",
                        fechaSeleccionada
                    );

                });
            }

            fechas.appendChild(
                botonFecha
            );

        }

        actualizarTextoSemana(lunes);
        preseleccionarReservaModificar();
    }

    function actualizarTextoSemana(lunes) {
        const domingo = new Date(lunes);
        domingo.setDate(
            lunes.getDate() + 6
        );

        fechaInicio.textContent =
            lunes.toLocaleDateString(
                "es-CO",
                {
                    day: "numeric",
                    month: "long"
                }
            );


        fechaFin.textContent =
            domingo.toLocaleDateString(
                "es-CO",
                {
                    day: "numeric",
                    month: "long"
                }
            );
    }


    function mostrarHorarios() {

        turnos.innerHTML = "";

        horarioSeleccionado = null;

        botonHorarioSeleccionado = null;

        if (horarioReserva) {
            horarioReserva.textContent = "";
>>>>>>> 58f61cd81eb2d571429defeb0c3fefae0e253156

        if (turnos) {
            turnos.innerHTML = "";
        }

<<<<<<< HEAD
        if (idCancha && fechaSeleccionada) {
            try {
                const horariosBackend = await backendApi.obtenerHorariosDisponibles(
                    idCancha,
                    formatearFechaApi(fechaSeleccionada)
                );

                if (solicitudActual !== solicitudHorariosActual) {
                    return;
                }

                if (!Array.isArray(horariosBackend)) {
                    throw new Error("El backend devolvió una respuesta inválida.");
                }

                renderizarHorarios(horariosBackend.map(horario => ({
                    idHorario: horario.idHorario,
                    etiqueta: `${formatearHora(horario.horaInicio)} - ${formatearHora(horario.horaFin)}`,
                    ocupado: horario.estado !== "DISPONIBLE"
                })));

                return;
            } catch (error) {
                if (solicitudActual !== solicitudHorariosActual) {
                    return;
                }
=======
        for (let i = 0; i < horarios.length; i++) {
            const botonHorario =
                document.createElement("button");
            botonHorario.textContent =
                horarios[i];

            if (
                horariosOcupados.includes(
                    horarios[i]
                )
            ) {

                botonHorario.classList.add(
                    "ocupado"
                );

            }

            else {
                botonHorario.addEventListener(
                    "click",
                    () => {
                        if (
                            botonHorarioSeleccionado !== null
                        ) {
                            botonHorarioSeleccionado.classList.remove(
                                "seleccionado"
                            );

                        }

                        horarioSeleccionado =
                            horarios[i];
                        if (horarioReserva) {
                            horarioReserva.textContent =
                                horarioSeleccionado;
                        }

                        botonHorario.classList.add(
                            "seleccionado"
                        );


                        botonHorarioSeleccionado =
                            botonHorario;

                        console.log(
                            "Horario seleccionado:",
                            horarioSeleccionado
                        );

                    }
                );

            }

            turnos.appendChild(
                botonHorario
            );
>>>>>>> 58f61cd81eb2d571429defeb0c3fefae0e253156

                console.warn(
                    "No fue posible cargar la disponibilidad del backend. Se conserva el respaldo local.",
                    error
                );
            }
        }

<<<<<<< HEAD
        renderizarHorarios(obtenerHorariosRespaldo());
    }

    function limpiarSeleccionFechaYHorario() {
        fechaSeleccionada = null;
        botonFechaSeleccionado = null;
        solicitudHorariosActual += 1;
        limpiarSeleccionHorario();
=======
    }

    botonAnterior.addEventListener(
        "click",
        () => {
            semanaActual.setDate(
                semanaActual.getDate() - 7
            );

            fechaSeleccionada = null;
            horarioSeleccionado = null;
            botonFechaSeleccionado = null;
            botonHorarioSeleccionado = null;


            if (fechaReserva) {
                fechaReserva.textContent = "";
            }
>>>>>>> 58f61cd81eb2d571429defeb0c3fefae0e253156

            if (horarioReserva) {
                horarioReserva.textContent = "";
            }

<<<<<<< HEAD
        if (turnos) {
            turnos.innerHTML = "";
        }
    }

    function mostrarSemana() {
        if (!fechas) {
            return;
        }

        const lunes = obtenerLunes(semanaActual);
        fechas.innerHTML = "";

        for (let indice = 0; indice < 7; indice += 1) {
            const fecha = new Date(lunes);
            fecha.setDate(lunes.getDate() + indice);

            const botonFecha = document.createElement("button");
            const dia = document.createElement("span");
            const numero = document.createElement("strong");
            const mes = document.createElement("small");

            dia.textContent = fecha.toLocaleDateString("es-CO", { weekday: "short" });
            numero.textContent = fecha.getDate();
            mes.textContent = fecha.toLocaleDateString("es-CO", { month: "short" });
            botonFecha.append(dia, numero, mes);

            botonFecha.addEventListener("click", () => {
                if (botonFechaSeleccionado) {
                    botonFechaSeleccionado.classList.remove("seleccionada");
                }

                fechaSeleccionada = fecha;
                botonFechaSeleccionado = botonFecha;
                botonFecha.classList.add("seleccionada");

                if (fechaReserva) {
                    fechaReserva.textContent = fechaSeleccionada.toLocaleDateString("es-CO");
                }

                mostrarHorarios();
            });

            fechas.appendChild(botonFecha);
        }

        actualizarTextoSemana(lunes);
    }

    if (canchaSeleccionada) {
        renderizarDetalleReserva(canchaSeleccionada);
    }

    if (cantidadTurnos) {
        cantidadTurnos.textContent = horariosRespaldo.length - horariosOcupadosRespaldo.length;
    }

    botonAnterior?.addEventListener("click", () => {
        semanaActual.setDate(semanaActual.getDate() - 7);
        limpiarSeleccionFechaYHorario();
        mostrarSemana();
    });

    botonSiguiente?.addEventListener("click", () => {
        semanaActual.setDate(semanaActual.getDate() + 7);
        limpiarSeleccionFechaYHorario();
        mostrarSemana();
    });

    botonReservar?.addEventListener("click", () => {
        const usuarioGuardado = sessionStorage.getItem("usuario");

        if (!usuarioGuardado) {
            mostrarModal({
                titulo: "Inicia sesión para reservar",
                mensaje: "Para reservar una cancha necesitas iniciar sesión o registrarte.",
                icono: "🔐",
                botones: [
                    {
                        texto: "Iniciar sesión",
                        clase: "modal-boton-principal",
                        accion: () => {
                            window.location.href = "login.html";
                        }
                    },
                    {
                        texto: "Registrarme",
                        clase: "modal-boton-secundario",
                        accion: () => {
                            window.location.href = "registro.html";
                        }
                    },
                    {
                        texto: "Cerrar",
                        clase: "modal-boton-secundario"
                    }
                ]
            });

            return;
        }

        if (!canchaSeleccionada) {
            mostrarModal({
                titulo: "Selecciona una cancha",
                mensaje: "Debes elegir una cancha antes de continuar con la reserva.",
                icono: "📍",
                botones: [{
                    texto: "Ver canchas",
                    clase: "modal-boton-principal",
                    accion: () => window.location.href = "canchas.html"
                }]
            });
            return;
        }

        if (!fechaSeleccionada) {
            mostrarModal({
                titulo: "Selecciona una fecha",
                mensaje: "Elige la fecha de tu reserva antes de continuar.",
                icono: "📅",
                botones: [{
                    texto: "Entendido",
                    clase: "modal-boton-principal"
                }]
            });
            return;
        }

        if (!horarioSeleccionado || !Number.isInteger(Number(horarioSeleccionado.idHorario))) {
            mostrarModal({
                titulo: "Horario no disponible",
                mensaje: "No se pudo confirmar la reserva porque no se obtuvo un horario válido del servidor. Intenta seleccionar otra fecha o vuelve a cargar la disponibilidad.",
                icono: "⚠️",
                botones: [{
                    texto: "Entendido",
                    clase: "modal-boton-principal"
                }]
            });
            return;
        }

        const reserva = {
            canchaId: canchaSeleccionada.idCancha || canchaSeleccionada.id,
            precio: canchaSeleccionada.precio,
            nombre: canchaSeleccionada.nombre,
            ubicacion: canchaSeleccionada.ubicacion,
            imagen: canchaSeleccionada.imagen,
            fecha: fechaSeleccionada.toLocaleDateString("es-CO"),
            fechaIso: formatearFechaApi(fechaSeleccionada),
            horarioId: Number(horarioSeleccionado.idHorario),
            horario: horarioSeleccionado.etiqueta,
            duracion: "1 hora",
            jugadores: "10 jugadores"
        };

        localStorage.setItem("reserva_seleccionada", JSON.stringify(reserva));
        window.location.href = "pagar-reserva.html";
    });

=======
            turnos.innerHTML = "";

            mostrarSemana();
        }
    );

    botonSiguiente.addEventListener(
        "click",
        () => {
            semanaActual.setDate(
                semanaActual.getDate() + 7
            );

            fechaSeleccionada = null;
            horarioSeleccionado = null;
            botonFechaSeleccionado = null;
            botonHorarioSeleccionado = null;

            if (fechaReserva) {
                fechaReserva.textContent = "";
            }

            if (horarioReserva) {
                horarioReserva.textContent = "";
            }
            turnos.innerHTML = "";
            mostrarSemana();
        }
    );

    botonReservar.addEventListener("click", () => {

        const usuario = sessionStorage.getItem("usuario");

        if (!usuario) {
            showToast(
                "Para reservar una cancha necesitas iniciar sesión o registrarte.",
                "warning"
            );

            sessionStorage.setItem(
                "pagina_anterior",
                window.location.pathname
            );

            setTimeout(() => {
                window.location.href = "login.html";
            }, 1200);

            return;
        }

        if (!canchaSeleccionada) {
            showToast("Selecciona una cancha antes de reservar", "warning");
            window.location.href = "canchas.html";
            return;
        }

        if (fechaSeleccionada === null) {
            showToast("Selecciona una fecha", "warning");
            return;
        }

        if (horarioSeleccionado === null) {
            showToast("Selecciona un horario", "warning");
            return;
        }

        const reserva = {
            canchaId: canchaSeleccionada.id,
            precio: canchaSeleccionada.precio,
            nombre: canchaSeleccionada.nombre,
            ubicacion: canchaSeleccionada.ubicacion,
            imagen: canchaSeleccionada.imagen,
            fecha: fechaSeleccionada.toLocaleDateString("es-CO"),
            horario: horarioSeleccionado,
            duracion: "1 hora",
            jugadores: "10 jugadores"
        };

        if (reservaModificar) {
            const reservas = JSON.parse(localStorage.getItem("mis_reservas") || "[]");
            const index = reservas.findIndex((item) => item.idReserva === reservaModificar.idReserva);

            if (index >= 0) {
                reservas[index] = {
                    ...reservas[index],
                    ...reserva,
                    idReserva: reservaModificar.idReserva,
                    estado: "Confirmada",
                    metodoPago: reservas[index].metodoPago || "Efectivo",
                    fechaPago: new Date().toLocaleString("es-CO")
                };
                localStorage.setItem("mis_reservas", JSON.stringify(reservas));
                localStorage.removeItem("reserva_modificar");
                localStorage.removeItem("cancha_seleccionada");
                showToast("Reserva modificada correctamente.", "success");
                setTimeout(() => {
                    window.location.href = "reservas-cliente.html";
                }, 1000);
                return;
            }
        }

        localStorage.setItem("reserva_seleccionada", JSON.stringify(reserva));

        console.log("Reserva guardada:", reserva);

        window.location.href = "pagar-reserva.html";
    });

>>>>>>> 58f61cd81eb2d571429defeb0c3fefae0e253156
    mostrarSemana();
});
