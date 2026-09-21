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

            // =========================================
            // GUARDAR INFORMACIÓN DEL USUARIO
            // =========================================

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

            // =========================================
            // MENSAJE DE ÉXITO
            // =========================================

            if (window.showToast) {
                window.showToast("Inicio de sesión exitoso.", "success");
            } else {
                loginStatus.textContent = "Inicio de sesión exitoso.";
                loginStatus.className = "auth-status auth-status--success";
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