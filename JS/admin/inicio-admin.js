/* ============================================================
   TUCANCHA
   INICIO PANEL ADMINISTRATIVO
   ============================================================ */


/* ============================================================
   FECHA ACTUAL
   ============================================================ */

const adminCurrentDate =
    document.getElementById(
        "adminCurrentDate"
    );


if (adminCurrentDate) {

    const fechaActual =
        new Date();


    const opcionesFecha = {

        weekday: "long",

        day: "numeric",

        month: "long",

        year: "numeric"

    };


    let fechaFormateada =
        fechaActual.toLocaleDateString(
            "es-CO",
            opcionesFecha
        );


    fechaFormateada =
        fechaFormateada
            .charAt(0)
            .toUpperCase()
        +
        fechaFormateada.slice(1);


    adminCurrentDate.textContent =
        fechaFormateada;

}