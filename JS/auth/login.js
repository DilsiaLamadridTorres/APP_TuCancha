<<<<<<< HEAD
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

=======
>>>>>>> 58f61cd81eb2d571429defeb0c3fefae0e253156
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

    const loginStatus = document.querySelector("#login-status");

    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const correo = loginForm.correo.value.trim();
        const contrasena = loginForm.contrasena.value;

        // =========================================
        // VALIDACIÓN
        // =========================================

        if (!correo || !contrasena) {

            if (window.showToast) {
                window.showToast("Ingresa tu correo y contraseña.", "error");
            } else {
                loginStatus.textContent = "Ingresa tu correo y contraseña.";
                loginStatus.className = "auth-status auth-status--error";
            }

            return;
        }

        // =========================================
        // INICIAR SESIÓN
        // =========================================

        try {

            loginStatus.textContent =
                "Iniciando sesión...";

            loginStatus.className =
                "auth-status";

            const resultado = await window.authService.login({
                correo,
                contrasena
            });

            const rol = resultado.rol || "JUGADOR";
            const nombre = resultado.nombre || resultado.nombreCompleto || correo;

<<<<<<< HEAD
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
=======
            // =========================================
            // GUARDAR INFORMACIÓN DEL USUARIO
            // =========================================
>>>>>>> 58f61cd81eb2d571429defeb0c3fefae0e253156

            sessionStorage.setItem(
                "access_token",
                resultado.access_token || resultado.token || resultado.id
            );

            sessionStorage.setItem(
                "usuario",
                JSON.stringify({
                    id: resultado.id,
                    nombre,
                    correo,
                    rol
                })
            );

            console.log("Login exitoso:", resultado);

<<<<<<< HEAD
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
=======
            // =========================================
            // MENSAJE DE ÉXITO
            // =========================================

            if (window.showToast) {
                window.showToast("Inicio de sesión exitoso.", "success");
            } else {
                loginStatus.textContent = "Inicio de sesión exitoso.";
                loginStatus.className = "auth-status auth-status--success";
>>>>>>> 58f61cd81eb2d571429defeb0c3fefae0e253156
            }

            if (loginStatus) {
                loginStatus.textContent = "";
                loginStatus.className = "auth-status auth-status--hidden";
            }

            // =========================================
            // REDIRECCIÓN
            // =========================================

            setTimeout(() => {

                const paginaAnterior =
                    sessionStorage.getItem("pagina_anterior");

                const paginaAnteriorValida =
                    paginaAnterior &&
                    paginaAnterior !== "/html/login.html" &&
                    paginaAnterior !== "login.html" &&
                    !paginaAnterior.includes("login.html") &&
                    paginaAnterior !== window.location.pathname;

                if (paginaAnteriorValida) {

                    sessionStorage.removeItem(
                        "pagina_anterior"
                    );

                    window.location.href =
                        paginaAnterior;

                    return;
                }

                sessionStorage.removeItem("pagina_anterior");

                const rutaHome =
                    window.location.pathname.includes("/html/")
                        ? "../index.html"
                        : "index.html";

                if (rol === "ADMIN") {

                    window.location.href =
                        "admin/inicio-admin.html";

                } else {

                    window.location.href =
                        rutaHome;
                }

            }, 500);

        } catch (error) {

            console.error(
                "Error al iniciar sesión:",
                error
            );

            if (window.showToast) {
                window.showToast(error.message || "No fue posible iniciar sesión.", "error");
            } else {
                loginStatus.textContent = error.message || "No fue posible iniciar sesión.";
                loginStatus.className = "auth-status auth-status--error";
            }

            if (loginStatus) {
                loginStatus.textContent = "";
                loginStatus.className = "auth-status auth-status--hidden";
            }
        }
    });
}
<<<<<<< HEAD
=======


// ============================================================
// MOSTRAR / OCULTAR CONTRASEÑA
// ============================================================

const inputContrasena =
    document.getElementById("contrasena");

const botonVerContrasena =
    document.getElementById("btn-ver-contrasena");

const iconoContrasena =
    document.getElementById("icono-contrasena");


if (botonVerContrasena) {

    botonVerContrasena.addEventListener(
        "click",
        () => {

            const estaOculta =
                inputContrasena.type === "password";

            inputContrasena.type =
                estaOculta ? "text" : "password";

            iconoContrasena.classList.toggle(
                "bi-eye",
                !estaOculta
            );

            iconoContrasena.classList.toggle(
                "bi-eye-slash",
                estaOculta
            );

            botonVerContrasena.setAttribute(
                "aria-label",
                estaOculta
                    ? "Ocultar contraseña"
                    : "Mostrar contraseña"
            );
        }
    );
}
>>>>>>> 58f61cd81eb2d571429defeb0c3fefae0e253156
