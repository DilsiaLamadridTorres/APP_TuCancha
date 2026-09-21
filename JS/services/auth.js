const token = sessionStorage.getItem("access_token");

if (!token) {
    sessionStorage.setItem(
        "pagina_anterior",
        window.location.pathname
    );

    window.location.href = "login.html";
}