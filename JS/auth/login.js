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
        ? "admin/dashboard_admin.html"
        : "pagar-reserva.html";
}

const loginForm = document.querySelector("#login-form");

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
                    "Inicio de sesiÃ³n exitoso.";

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

            const usuario = {

                nombre:
                    result.user?.user_metadata
                        ?.nombre_completo || correo,

                correo:
                    result.user?.email || correo,

                rol:
                    obtenerRolUsuario(
                        result.user?.email || correo
                    )
            };


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

// ============================================================
// MOSTRAR / OCULTAR CONTRASEÑA
// ============================================================

const inputContrasena = document.getElementById("contrasena");

const botonVERContrasena = document.getElementById("btn-ver-contrasena");

const iconoContrasena = document.getElementById("icono-contrasena");

botonVERContrasena.addEventListener("click", () => {

    // Verificar si actualmente la contrasena esta oculta

    const estaOculta = inputContrasena.type === "password";


    // cambiamos entre password y text
    inputContrasena.type = estaOculta ? "text" : "password";

    // cambiamos el icono

    iconoContrasena.classList.toggle("bi-eye", !estaOculta);


    iconoContrasena.classList.toggle("bi-eye-slash", estaOculta);

    //Cambiar descripcion del boton

    botonVERContrasena.setAttribute("aria-label", estaOculta ? "Ocultar contraseña" : "Mostrar contrOcultar Ocultar contraseña");


});
