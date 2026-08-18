const loginForm = document.querySelector("#login-form");

if (loginForm) {
    const loginStatus = document.querySelector("#login-status");
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const correo = loginForm.correo.value.trim();
        const contrasena = loginForm.contrasena.value;
        if (!correo || !contrasena) {
            loginStatus.textContent = "Ingresa tu correo y contraseña.";
            loginStatus.className = "auth-status auth-status--error";
            return;
        }
        try {
            await window.authService.login({ correo, contrasena });
            loginStatus.textContent = "Inicio de sesión exitoso.";
            loginStatus.className = "auth-status auth-status--success";
        } catch (error) {
            loginStatus.textContent = error.message || "No fue posible iniciar sesión.";
            loginStatus.className = "auth-status auth-status--error";
        }
    });
}
