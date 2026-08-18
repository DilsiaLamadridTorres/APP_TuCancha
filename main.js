import { supabase } from './JS/services/config.js';

async function probarConexion() {
  const { data, error } = await supabase.from('usuarios').select('*');
  
  if (error) {
    console.error(' Error conectando a Supabase:', error.message);
  } else {
    console.log(' ¡Conexión a Supabase exitosa! Datos:', data);
  }
}

probarConexion();


// Codigo para la animación de elementos al hacer scroll--- Miguel Pineda


const elementos = document.querySelectorAll(".hidden");

const observer = new IntersectionObserver((entries) => {

    entries.forEach((entry) => {

        if (entry.isIntersecting) {

            entry.target.classList.add("show");
            observer.unobserve(entry.target);

        }

    });

}, {
    threshold: 0.2
});

elementos.forEach((elemento) => {
    observer.observe(elemento);
});