const registroForm = document.querySelector("#registro-form");
const registroStatus = document.querySelector("#registro-status");
const registroSubmit = document.querySelector("#registro-submit");
const connectionStatus = document.querySelector("#connection-status");
const contrasena = document.getElementById("contrasena");
const confirmarContrasenaInput = document.getElementById("confirmarContrasena");
const mostrarContrasena = document.getElementById("mostrar-contrasena");
const mostrarConfirmarContrasena = document.getElementById("mostrar-confirmar-contrasena");

if (!window.authService) {
    showStatus("El servicio de autenticación no está disponible.", "error");
} else if (connectionStatus) {
    window.authService.checkConnection()
        .then((connection) => {
            connectionStatus.textContent = connection.message;
        })
        .catch(() => {
            connectionStatus.textContent = "Modo demostración activo.";
        });
}

if (mostrarContrasena && contrasena) {
    mostrarContrasena.addEventListener("click", () => {
        const mostrar = contrasena.type === "password";
        contrasena.type = mostrar ? "text" : "password";
        mostrarContrasena.classList.toggle("bi-eye", !mostrar);
        mostrarContrasena.classList.toggle("bi-eye-slash", mostrar);
    });
}

if (mostrarConfirmarContrasena && confirmarContrasenaInput) {
    mostrarConfirmarContrasena.addEventListener("click", () => {
        const mostrar = confirmarContrasenaInput.type === "password";
        confirmarContrasenaInput.type = mostrar ? "text" : "password";
        mostrarConfirmarContrasena.classList.toggle("bi-eye", !mostrar);
        mostrarConfirmarContrasena.classList.toggle("bi-eye-slash", mostrar);
    });
}

const rules = {
    nombreCompleto: (value) => value.trim().length >= 3 ? "" : "Escribe tu nombre completo (mínimo 3 caracteres).",
    correo: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "" : "Ingresa un correo electrónico válido.",
    telefono: (value) => /^[0-9+()\s-]{7,20}$/.test(value) ? "" : "Ingresa un teléfono válido.",
    contrasena: (value) => /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(value) ? "" : "Usa mínimo 8 caracteres, con una letra y un número.",
    confirmarContrasena: (value, form) => value === form.contrasena.value ? "" : "Las contraseñas no coinciden.",
    terminos: (value) => value ? "" : "Debes aceptar los términos para crear tu cuenta."
};

function setFieldError(field, message) {
    const feedback = document.querySelector(`#${field.name}-error`);
    const hasError = Boolean(message);

    field.classList.toggle("is-invalid", hasError);
    field.setAttribute("aria-invalid", hasError);

    if (feedback) {
        feedback.textContent = message || "";
        // Muestra/oculta el mensaje de error forzando 'd-block' (solución para campos envueltos en div)
        feedback.classList.toggle("d-block", hasError);
    }

    return !hasError;
}

function validateField(field) {
    const rule = rules[field.name];
    if (!rule) return true; // Si no hay regla asociada, lo considera válido

    const value = field.type === "checkbox" ? field.checked : field.value;
    const errorMessage = rule(value, registroForm);

    return setFieldError(field, errorMessage);
}

function showStatus(message, type) {
    if (registroStatus) {
        registroStatus.textContent = "";
        registroStatus.className = "auth-status auth-status--hidden";
    }

    if (!message || !window.showToast) return;

    const toastType = type === "success" ? "success" : type === "error" ? "error" : "warning";
    window.showToast(message, toastType);
}

Object.keys(rules).forEach((name) => {
    const field = registroForm.elements[name];
    if (!field) return;
    field.addEventListener(field.type === "checkbox" ? "change" : "blur", () => validateField(field));
});

registroForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    let formularioValido = true;

    Object.keys(rules).forEach((name) => {
        const field = registroForm.elements[name];

        if (field && !validateField(field)) {
            formularioValido = false;
        }
    });

    if (!formularioValido) {
        showStatus("Revisa los campos del formulario.", "error");
        return;
    }

    registroSubmit.disabled = true;
    registroSubmit.innerHTML =
        '<span class="spinner-border spinner-border-sm" aria-hidden="true"></span> Creando cuenta…';

    showStatus("", "hidden");

    const datos = {
        nombreCompleto: registroForm.elements.nombreCompleto.value.trim(),
        correo: registroForm.elements.correo.value.trim(),
        telefono: registroForm.elements.telefono.value.trim(),
        contrasena: registroForm.elements.contrasena.value
    };

    try {
        await window.authService.register(datos);

        showStatus("¡Cuenta creada correctamente!", "success");

        registroForm.reset();

    } catch (error) {
        console.error(error);
        showStatus(error.message, "error");

    } finally {
        registroSubmit.disabled = false;
        registroSubmit.innerHTML = "Crear cuenta";
    }
});