import {canchas} from "../complejos/lista-canchas.js";

const contenedor = document.getElementById("canchas-populares");

// canchas mas populares

const populares = [...canchas].sort((a,b)=>b.calificacion-a.calificacion).slice(0,4);
contenedor.innerHTML = populares.map((cancha) => `
  <div class="col-6 col-lg-3">
    <article class="court-card">
      <img src="${cancha.imagen}" alt="${cancha.nombre}" class="w-100 img-fluid rounded"
     style="height: 220px; object-fit: cover;"">

      <div>
        <span>POPULAR</span>
        <h3 class="fs-5 justify-content-center">${cancha.nombre}</h3>
        <p><i class="bi bi-geo-alt mb-0"></i> ${cancha.ubicacion}</p>
        <p class="fs-5 mb-0">$${cancha.precio.toLocaleString("es-CO")}</p>
        <p class="fs-4 mb-0">⭐️ ${cancha.calificacion}</p>
          <div class="d-flex justify-content-start mt-3">
    <button type="button" class="btn btn-primary w-100 text-white" data-cancha-id="${cancha.id}"">
      Reservar
    </button>
  </div>
      </div>
    </article>
  </div>
`).join("");

document.querySelectorAll("[data-cancha-id]").forEach((boton)=>{
    boton.addEventListener("click",()=>{
        const idCancha=Number(boton.dataset.canchaId);
        const canchaSeleccionada = canchas.find(
      (cancha) => cancha.id === idCancha
    );
     localStorage.setItem(
      "cancha_seleccionada",
      JSON.stringify(canchaSeleccionada)
    );
    window.location.href = "./html/reservas-cancha.html";
    })
})