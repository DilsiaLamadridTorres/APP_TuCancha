import { backendApi } from "../services/backend-api.js";

const ADMIN_USERS = [
    {
        correo: "admin@tucancha.com",
        contrasena: "admin2026*",
        nombre: "Administrador"
    }
];

function normalizarCorreo(correo) {
    return correo.trim().toLowerCase();
}

function obtenerAdminHardcodeado(correo) {
    return ADMIN_USERS.find(
        (admin) =>
            admin.correo === normalizarCorreo(correo)
    );
}

function obtenerRolUsuario(correo) {
    return obtenerAdminHardcodeado(correo)
        ? "admin"
        : "usuario";
}

function obtenerRutaPorRol(rol) {
    return rol === "admin"
        ? "admin/inicio-admin.html"
        : "canchas.html";
}

async function obtenerUsuarioBackend(correo) {
    const usuarios = await backendApi.obtenerUsuarios();

    if (!Array.isArray(usuarios)) {
        throw new Error("El backend devolvió una lista de usuarios inválida.");
    }

    const usuario = usuarios.find(item =>
        normalizarCorreo(item.correo || "") === normalizarCorreo(correo)
    );

    if (!usuario || !Number.isInteger(Number(usuario.id)) || Number(usuario.id) <= 0) {
        throw new Error(
            "Tu cuenta no está registrada en el sistema de reservas. " +
            "Debe existir en Supabase y en el backend con el mismo correo."
        );
    }

    return usuario;
}

const loginForm = document.querySelector("#login-form");
const btnVerContrasena = document.getElementById("btn-ver-contrasena");
const iconoContrasena = document.getElementById("icono-contrasena");

if (btnVerContrasena && iconoContrasena) {
    btnVerContrasena.addEventListener("click", () => {
        const inputContrasena = document.getElementById("contrasena");
        if (!inputContrasena) return;

        const mostrar = inputContrasena.type === "password";
        inputContrasena.type = mostrar ? "text" : "password";
        iconoContrasena.classList.toggle("bi-eye", !mostrar);
        iconoContrasena.classList.toggle("bi-eye-slash", mostrar);
    });
}

if (loginForm) {

    const loginStatus =
        document.querySelector("#login-status");

    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const correo =
            loginForm.correo.value.trim();

        const contrasena =
            loginForm.contrasena.value;


        /* =========================================
           VALIDACIÓN
           ========================================= */

        if (!correo || !contrasena) {

            loginStatus.textContent =
                "Ingresa tu correo y contraseña.";

            loginStatus.className =
                "auth-status auth-status--error";

            return;
        }


        /* =========================================
           INICIAR SESIÓN
           ========================================= */

        try {

            loginStatus.textContent =
                "Iniciando sesión...";

            loginStatus.className =
                "auth-status";

            const adminHardcodeado =
                obtenerAdminHardcodeado(correo);

            if (adminHardcodeado) {

                if (
                    contrasena !==
                    adminHardcodeado.contrasena
                ) {

                    throw new Error(
                        "Correo o contrasena incorrectos."
                    );
                }

                const usuario = {

                    nombre:
                        adminHardcodeado.nombre,

                    correo:
                        adminHardcodeado.correo,

                    rol:
                        "admin"
                };

                sessionStorage.setItem(
                    "usuario",
                    JSON.stringify(usuario)
                );

                sessionStorage.removeItem(
                    "access_token"
                );

                loginStatus.textContent =
                    "Inicio de sesión exitoso.";

                loginStatus.className =
                    "auth-status auth-status--success";

                setTimeout(() => {

                    window.location.href =
                        obtenerRutaPorRol(
                            usuario.rol
                        );

                }, 500);

                return;
            }


            const result =
                await window.authService.login({
                    correo,
                    contrasena
                });


            console.log(
                "Login exitoso:",
                result
            );


            /* =====================================
               OBTENER DATOS DEL USUARIO
               ===================================== */

            const correoUsuario = result.user?.email || correo;
            const usuario = {
                nombre:
                    result.user?.user_metadata
                        ?.nombre_completo || correoUsuario,
                correo: correoUsuario,
                rol: obtenerRolUsuario(correoUsuario)
            };

            try {
                const usuarioBackend = await obtenerUsuarioBackend(correoUsuario);

                usuario.idBackend = Number(usuarioBackend.id);
            } catch (error) {
                sessionStorage.removeItem("usuario");
                sessionStorage.removeItem("access_token");

                console.error("No fue posible identificar el usuario en el backend:", error);
                loginStatus.textContent = error.message;
                loginStatus.className = "auth-status auth-status--error";
                return;
            }


            /* =====================================
               GUARDAR USUARIO
               ===================================== */

            sessionStorage.setItem(
                "usuario",
                JSON.stringify(usuario)
            );


            /* =====================================
               GUARDAR TOKEN DE SUPABASE
               ===================================== */

            if (result.access_token) {

                sessionStorage.setItem(
                    "access_token",
                    result.access_token
                );
            }


            /* =====================================
               MENSAJE DE ÉXITO
               ===================================== */

            loginStatus.textContent =
                "Inicio de sesión exitoso.";

            loginStatus.className =
                "auth-status auth-status--success";


            /* =====================================
               REDIRECCIÓN
               ===================================== */

            setTimeout(() => {

                window.location.href =
                    obtenerRutaPorRol(
                        usuario.rol
                    );

            }, 500);


        } catch (error) {

            console.error(
                "Error al iniciar sesión:",
                error
            );

            loginStatus.textContent =
                error.message ||
                "No fue posible iniciar sesión.";

            loginStatus.className =
                "auth-status auth-status--error";
        }

    });
}
