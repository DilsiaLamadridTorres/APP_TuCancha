
document.addEventListener("DOMContentLoaded", () => {
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


let fechaSeleccionada = null;
let horarioSeleccionado = null;
let botonFechaSeleccionado = null;
let botonHorarioSeleccionado = null;

let semanaActual = new Date();

// ========================================
// HORARIOS TEMPORALES
// ========================================

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


// ========================================
// HORARIOS OCUPADOS TEMPORALES
// ========================================

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

function mostrarSemana() {
    const lunes = obtenerLunes(semanaActual);
    fechas.innerHTML = "";
    for (let i = 0; i < 7; i++) {
        const fecha = new Date(lunes);
        fecha.setDate(
            lunes.getDate() + i
        );

        const botonFecha = document.createElement("button");
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

        fechas.appendChild(
            botonFecha
        );

    }

    actualizarTextoSemana(lunes);
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

    }

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

    }

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

        if (horarioReserva) {
            horarioReserva.textContent = "";
        }

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
    if (fechaSeleccionada === null) {
        alert("Selecciona una fecha");
        return;
    }

    if (horarioSeleccionado === null) {
        alert("Selecciona un horario");
        return;
    }
    const cancha = JSON.parse(canchaGuardada);
    const reserva = {
        canchaId: cancha.id,
        precio:cancha.precio,
        nombre:cancha.nombre,
        ubicacion:cancha.ubicacion,
        imagen:cancha.imagen,
        fecha: fechaSeleccionada.toLocaleDateString("es-CO"),
        horario: horarioSeleccionado,
        duracion: "1 hora",          
        jugadores: "10 jugadores"
    };

    localStorage.setItem("reserva_seleccionada", JSON.stringify(reserva));

    console.log("Reserva guardada:", reserva);

    window.location.href = "pagar-reserva.html";
});

mostrarSemana();
})