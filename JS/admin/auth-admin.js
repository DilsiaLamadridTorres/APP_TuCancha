(function () {
    const LOGIN_URL = "../login.html";

    function obtenerUsuarioActual() {
        try {
            return JSON.parse(
                sessionStorage.getItem("usuario") || "null"
            );
        } catch (error) {
            console.error(
                "Error leyendo usuario admin:",
                error
            );

            sessionStorage.removeItem("usuario");

            return null;
        }
    }

    const usuario = obtenerUsuarioActual();

    if (!usuario || usuario.rol !== "admin") {
        window.location.replace(LOGIN_URL);
    }
})();
