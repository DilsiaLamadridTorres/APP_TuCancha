(function () {
    const LOGIN_URL = "../login.html";

    let usuario = null;

    try {
        usuario = JSON.parse(sessionStorage.getItem("usuario") || "null");
    } catch (error) {
        sessionStorage.removeItem("usuario");
    }

    if (!sessionStorage.getItem("access_token") || usuario?.rol !== "ADMIN") {
        window.location.replace(LOGIN_URL);
    }
})();
