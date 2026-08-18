// const canchas es la variable
// [] este es un Array, el array se llama canchas y dentro del array hay un objeto {}
let canchas = [{
    id: 1, // id es el nombre de la propiedad / 1 es el valor de la propiedad 
    nombre: "Cancha el Golazo",
    empresa: "Complejo deportivo el mono",
    ubicacion: "Medellin calle siempre viva",
    calificacion: 4.8,
    precio: 80000,
    imagen: "https://equiver.com.co/images/campos-futbol-microfutbol-grama-sintetica/campos-futbol-microfutbol-grama-sintetica-2.jpg"

},
{
    id: 2,
    nombre: "Cancha los amigos",
    empresa: "Complejo el pelón",
    ubicacion: "Bogotá",
    calificacion: 4.6,
    precio: 75000,
    imagen: "https://images.unsplash.com/photo-1543351611-58f69d7c1781?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
},
{
    id: 3,
    nombre: "Juega en pila",
    empresa: "Deportivos S.A",
    ubicacion: "Pereira",
    calificacion: 4.5,
    precio: 60000,
    imagen: "https://images.unsplash.com/photo-1487466365202-1afdb86c764e?q=80&w=1473&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
},
{
    id: 4,
    nombre: "Cancha de arriba",
    empresa: "Pateando y jugando",
    ubicacion: "Barranquilla",
    calificacion: 4.9,
    precio: 79000,
    imagen: "https://images.unsplash.com/photo-1607414721186-5309963d7b52?q=80&w=736&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
},
{
    id: 5,
    nombre: "Juega más",
    empresa: "Rueda la pelota",
    ubicacion: "Medellin",
    calificacion: 3.8,
    precio: 75000,
    imagen: "https://images.unsplash.com/photo-1676746424139-77f8bd8922a8?q=80&w=736&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
},
{
    id: 6,
    nombre: "Cancha la verde",
    empresa: "Imports SAS",
    ubicacion: "Medellin calle siempre viva",
    calificacion: 4.8,
    precio: 80000,
    imagen: "https://plus.unsplash.com/premium_photo-1663948061665-34c2b6d42381?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
},
{
    id: 7,
    nombre: "Cancha los Millo",
    empresa: "Asociacion deportiva",
    ubicacion: "San Antonio de Pereira",
    calificacion: 5,
    precio: 85000,
    imagen: "https://images.unsplash.com/photo-1602432141202-e8b683524997?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
},
{
    id: 8,
    nombre: "Cancha la amarilla",
    empresa: "Guayos",
    ubicacion: "Guarne",
    calificacion: 4.7,
    precio: 82000,
    imagen: "https://images.unsplash.com/photo-1546717003-caee5f93a9db?q=80&w=1078&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
},
{
    id: 9,
    nombre: "Fiebre amarilla",
    empresa: "Verde SAS",
    ubicacion: "Vereda carmín",
    calificacion: 4.8,
    precio: 80000,
    imagen: "https://images.unsplash.com/photo-1632684363781-c82fe0e357c8?q=80&w=718&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
},
{
    id: 10,
    nombre: "La sonadora",
    empresa: "Verde SAS",
    ubicacion: "Medellin, Castilla",
    calificacion: 4.3,
    precio: 80000,
    imagen: "https://images.unsplash.com/photo-1510526292299-20af3f62d453?q=80&w=1128&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
}
]

// ============================================================
// CANCHAS PUBLICADAS DESDE EL DASHBOARD ADMINISTRATIVO
// ============================================================

const CANCHAS_PUBLICADAS_KEY =
    "tucancha_canchas_publicadas";

let canchasPublicadas = [];

try {

    const datosPublicados =
        localStorage.getItem(
            CANCHAS_PUBLICADAS_KEY
        );

    if (datosPublicados) {

        const publicaciones =
            JSON.parse(
                datosPublicados
            );

        if (Array.isArray(publicaciones)) {

            canchasPublicadas =
                publicaciones
                    .filter(
                        cancha =>
                            cancha.publicada === true
                    )
                    .map(
                        cancha => ({

                            id:
                                cancha.id,

                            nombre:
                                cancha.nombre,

                            empresa:
                                cancha.complejo?.nombre
                                || "Complejo deportivo",

                            ubicacion:
                                `${cancha.complejo?.ciudad || ""}${
                                    cancha.complejo?.provincia
                                        ? ", " + cancha.complejo.provincia
                                        : ""
                                }`,

                            calificacion:
                                "Nueva",

                            precio:
                                cancha.precioPorHora
                                || null,

                            imagen:
                                cancha.fotos?.[0]
                                || "https://via.placeholder.com/400x250?text=TuCancha",

                            publicada:
                                true,

                            solicitudId:
                                cancha.solicitudId

                        })
                    );

        }

    }

} catch (error) {

    console.error(
        "Error leyendo canchas publicadas:",
        error
    );

}


// Agregamos las canchas publicadas
// a las canchas que ya existían.
canchas.push(
    ...canchasPublicadas
);


// traer lista-canchas del HTML y lo guarda en la variable listaCanchas
const listaCanchas = document.getElementById("lista-canchas");
const cantidadCanchas = document.querySelector(".canchas-list__header h2 span");
const resultados = document.querySelector(".canchas-list__header p");
resultados.textContent = `${canchas.length} resultados encontrados`;
cantidadCanchas.textContent = canchas.length;



// El for recorre el array canchas utilizando i como contador. Empieza en 0 porque los arrays empiezan en la posición 0, continúa mientras i sea menor que la cantidad de elementos del array y después de cada vuelta incrementa i en 1.
for (let i = 0; i < canchas.length; i++) {
    // canchas[i] obtiene la cancha que se está recorriendo en ese momento, y el for hace que esto se repita hasta recorrer e imprimir las 10 canchas.
    console.log(canchas[i]);
    console.log(canchas[i].nombre);
    console.log(canchas[i].empresa);
    console.log(canchas[i].ubicacion);
    console.log(canchas[i].calificacion);
    console.log(canchas[i].precio);
    console.log(canchas[i].imagen);

    /// Esta línea crea un elemento <article> en HTML y lo guarda en la variable card.
    // Está dentro del for para crear una card nueva en cada vuelta.
    const card = document.createElement("article");
    // A la card que acabamos de crear le agregamos la clase CSS "cancha-card".
    card.classList.add("cancha-card");
    const imagen = document.createElement("img");
    imagen.src = canchas[i].imagen;
    imagen.alt = canchas[i].nombre;
    // Agrega una imagen dentro de card, es una clase hijo.
    card.appendChild(imagen);

    // Se crea un <div> para guardar la información de la cancha
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

precio.classList.add(
    "cancha-card__price"
);

if (
    typeof canchas[i].precio === "number"
) {

    precio.textContent =
        `$${canchas[i].precio.toLocaleString("es-CO")} / hora`;

} else {

    precio.textContent =
        "Precio no especificado";

}

contenido.appendChild(
    precio
);

    card.appendChild(contenido);

const botonReservar = document.createElement("button");
botonReservar.textContent = "Reservar";
botonReservar.classList.add("cancha-card__button");
contenido.appendChild(botonReservar);

    listaCanchas.appendChild(card);

}




