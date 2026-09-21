const token = sessionStorage.getItem("access_token");

if (!token) {
    const isLoginPage =
        window.location.pathname.endsWith("/login.html") ||
        window.location.pathname.endsWith("login.html");

    if (!isLoginPage) {
        sessionStorage.setItem(
            "pagina_anterior",
            window.location.pathname
        );

        window.location.href = "login.html";
    }
}