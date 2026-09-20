const registroForm = document.querySelector("#registro-form");
const registroStatus = document.querySelector("#registro-status");
const registroSubmit = document.querySelector("#registro-submit");
const contrasena = document.getElementById("contrasena");
const mostrarContrasena = document.getElementById("mostrar-contrasena");
const confirmaContrasena = document.getElementById("confirmarContrasena");
const mostrarConfirmarContrasena = document.getElementById("mostrar-confirmar-contrasena");


mostrarContrasena.addEventListener("click", () => {
contrasena.type = contrasena.type === "password" ? "text" : "password";  
mostrarContrasena.classList.toggle("bi-eye");
mostrarContrasena.classList.toggle("bi-eye-slash");

});

mostrarConfirmarContrasena.addEventListener("click", () => {
mostrarConfirmarContrasena.type = mostrarConfirmarContrasena.type === "password" ? "text" : "password";  
mostrarConfirmarContrasena.classList.toggle("bi-eye");
mostrarConfirmarContrasena.classList.toggle("bi-eye-slash");

});



const rules = {
    nombreCompleto: (value) => value.trim().length >= 3 ? "" : "Escribe tu nombre completo (mínimo 3 caracteres).",
    correo: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "" : "Ingresa un correo electrónico válido.",
    telefono: (value) => !value || /^[0-9+()\s-]{7,20}$/.test(value) ? "" : "Ingresa un teléfono válido.",
    contrasena: (value) => /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(value) ? "" : "Usa mínimo 8 caracteres, con una letra y un número.",
    confirmarContrasena: (value, form) => value === form.contrasena.value ? "" : "Las contraseñas no coinciden.",
    terminos: (value) => value ? "" : "Debes aceptar los términos para crear tu cuenta."
};

function setFieldError(field, message) {
    const feedback = document.querySelector(`#${field.name}-error`);
    field.classList.toggle("is-invalid", Boolean(message));
    field.setAttribute("aria-invalid", Boolean(message));
    if (feedback) feedback.textContent = message;
    return !message;
}

function validateField(field) {
    const value = field.type === "checkbox" ? field.checked : field.value;
    return setFieldError(field, rules[field.name](value, registroForm));
}

function showStatus(message, type) {
    registroStatus.textContent = message;
    registroStatus.className = `auth-status auth-status--${type}`;
}

Object.keys(rules).forEach((name) => {
    const field = registroForm.elements[name];
    field.addEventListener(field.type === "checkbox" ? "change" : "blur", () => validateField(field));
});

registroForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const valid = Object.keys(rules).every((name) => validateField(registroForm.elements[name]));
    if (!valid) {
        showStatus("Revisa los campos marcados antes de continuar.", "error");
        return;
    }

    registroSubmit.disabled = true;
    registroSubmit.innerHTML = '<span class="spinner-border spinner-border-sm" aria-hidden="true"></span> Creando cuenta…';
    showStatus("", "hidden");

    try {
        const result = await window.authService.register({
            nombreCompleto: registroForm.nombreCompleto.value.trim(),
            correo: registroForm.correo.value.trim(),
            telefono: registroForm.telefono.value.trim(),
            contrasena: registroForm.contrasena.value
        });
        registroForm.reset();
        const message = result.needsEmailConfirmation
            ? "Cuenta creada. Revisa tu correo para confirmar la cuenta antes de iniciar sesión."
            : result.mode === "demo"
                ? "Cuenta creada en modo demostración. Configura Supabase para guardar usuarios reales."
                : "Cuenta creada correctamente. Ya puedes iniciar sesión.";
        showStatus(message, "success");
    } catch (error) {
        showStatus(error.message || "No fue posible crear la cuenta. Inténtalo de nuevo.", "error");
    } finally {
        registroSubmit.disabled = false;
        registroSubmit.textContent = "Crear cuenta";
    }

    window.location.href="canchas.html";
});

window.authService.checkConnection().then((result) => {
    const indicator = document.querySelector("#connection-status");
    indicator.textContent = result.message;
    indicator.className = `connection-status connection-status--${result.mode}`;
    setTimeout(()=>{
        indicator.style.display="none";
    },3000)
}).catch((error) => {
    const indicator = document.querySelector("#connection-status");
    indicator.textContent = error.message;
    indicator.className = "connection-status connection-status--error";
});
