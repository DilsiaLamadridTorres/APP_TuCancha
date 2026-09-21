const loginForm = document.querySelector("#login-form");

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

            loginStatus.textContent =
                "Ingresa tu correo y contraseña.";

            loginStatus.className =
                "auth-status auth-status--error";

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

            const respuesta = await fetch(
                "https://tucanchabackend-production.up.railway.app/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        correo: correo,
                        password: contrasena
                    })
                }
            );

            const resultado = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(
                    resultado.message ||
                    resultado.error ||
                    "Correo o contraseña incorrectos."
                );
            }

            // =========================================
            // GUARDAR INFORMACIÓN DEL USUARIO
            // =========================================

            sessionStorage.setItem(
                "access_token",
                resultado.token
            );

            sessionStorage.setItem(
                "usuario",
                JSON.stringify({
                    nombre: resultado.nombre,
                    rol: resultado.rol
                })
            );

            console.log("Login exitoso:", resultado);

            // =========================================
            // MENSAJE DE ÉXITO
            // =========================================

            loginStatus.textContent =
                "Inicio de sesión exitoso.";

            loginStatus.className =
                "auth-status auth-status--success";

            // =========================================
            // REDIRECCIÓN
            // =========================================

            setTimeout(() => {

                const paginaAnterior =
                    sessionStorage.getItem("pagina_anterior");

                if (paginaAnterior) {

                    sessionStorage.removeItem(
                        "pagina_anterior"
                    );

                    window.location.href =
                        paginaAnterior;

                    return;
                }

                // Si no existe página anterior,
                // usamos una ruta por defecto.

                if (resultado.rol === "ADMIN") {

                    window.location.href =
                        "admin/inicio-admin.html";

                } else {

                    window.location.href =
                        "reservas-cliente.html";
                }

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