class MiNavbar extends HTMLElement {

    connectedCallback() {

        /* =====================================================
           OBTENER PÁGINA ACTUAL
           ===================================================== */

        const rutaActual =
            (
                window.location.pathname
                    .split("/")
                    .pop() || "index.html"
            ).toLowerCase();


        /* =====================================================
           SABER SI ESTAMOS DENTRO DE /html
           ===================================================== */

        const estaEnHtml =
            window.location.pathname
                .toLowerCase()
                .includes("/html/");


        /* =====================================================
           RUTAS
           ===================================================== */

        const rutaInicio =
            estaEnHtml
                ? "../index.html"
                : "index.html";


        const rutaPaginas =
            estaEnHtml
                ? ""
                : "html/";


        const rutaLogo =
            estaEnHtml
                ? "../img/logo/Logo.png"
                : "img/logo/Logo.png";


        /* =====================================================
           OBTENER USUARIO LOGUEADO
           ===================================================== */

        let usuario = null;

        try {

            usuario = JSON.parse(
                sessionStorage.getItem("usuario")
            );

        } catch (error) {

            usuario = null;

        }


        /* =====================================================
           VERIFICAR SI ES JUGADOR
           ===================================================== */

        const esJugador =
            usuario &&
            usuario.rol === "JUGADOR";
        const esAdmin =
            usuario &&
            usuario.rol === "ADMIN";    


        /* =====================================================
           CONSTRUIR BOTÓN DEL USUARIO
           ===================================================== */

        let botonUsuario = "";


        if (!usuario) {

            botonUsuario = `
                <a
                    href="${rutaPaginas}registro.html"
                    class="btn btn-primary"
                    id="btn-unete"
                >
                    Únete
                </a>
            `;

        } else {

            botonUsuario = `
                <div class="dropdown">

                    <button
                        class="btn btn-primary dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        ${usuario.nombre}
                    </button>

                    <ul class="dropdown-menu dropdown-menu-end">

                        ${
                            esJugador
                                ? `
                                    <li>
                                        <a
                                            class="dropdown-item"
                                            href="${rutaPaginas}reservas-cliente.html"
                                        >
                                            <i class="bi bi-calendar-check me-2"></i>
                                            Mis reservas
                                        </a>
                                    </li>

                                    <li>
                                        <hr class="dropdown-divider">
                                    </li>
                                `
                                : ""
                        }
                        ${
                        esAdmin
                            ? `
                                <li>
                                    <a
                                        class="dropdown-item"
                                        href="${rutaPaginas}registro-complejo.html"
                                    >
                                        <i class="bi bi-building-add me-2"></i>
                                        Registro complejo
                                    </a>
                                </li>
                            `
                            : ""
                    }

                    ${
                        esJugador || esAdmin
                            ? `
                                <li>
                                    <hr class="dropdown-divider">
                                </li>
                            `
                            : ""
                    }

                        <li>
                            <button
                                class="dropdown-item"
                                type="button"
                                id="btn-cerrar-sesion"
                            >
                                <i class="bi bi-box-arrow-right me-2"></i>
                                Cerrar sesión
                            </button>
                        </li>

                    </ul>

                </div>
            `;
        }


        /* =====================================================
           NAVBAR
           ===================================================== */

        this.innerHTML = `

            <nav class="navbar navbar-expand-lg bg-dark shadow-sm">

                <div class="container-fluid">

                    <!-- LOGO -->

                    <a
                        href="${rutaInicio}"
                        class="d-flex align-items-center text-decoration-none"
                    >

                        <img
                            src="${rutaLogo}"
                            alt="Logo TuCancha"
                            width="100"
                            height="100"
                            class="me-2 rounded-circle object-fit-cover"
                        >

                    </a>


                    <!-- NOMBRE -->

                    <div class="d-flex flex-column">

                        <a
                            href="${rutaInicio}"
                            class="text-decoration-none d-flex flex-column"
                        >

                            <span
                                class="fw-bold text-white lh-1 fs-2"
                            >
                                TuCancha
                            </span>

                            <small class="fst-italic fs-6">
                                ¡Arma tu parche y juégatela!
                            </small>

                        </a>

                    </div>


                    <!-- BOTÓN RESPONSIVE -->

                    <button
                        class="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Abrir navegación"
                    >

                        <span class="navbar-toggler-icon"></span>

                    </button>


                    <!-- LINKS -->

                    <div
                        class="collapse navbar-collapse text-center"
                        id="navbarNav"
                    >

                        <ul
                            class="navbar-nav mx-auto text-center my-auto"
                        >

                            <!-- INICIO -->

                            <li class="nav-item">

                                <a
                                    class="nav-link ${
                                        rutaActual === "index.html"
                                            ? "active"
                                            : ""
                                    }"
                                    href="${rutaInicio}"
                                >
                                    Inicio
                                </a>

                            </li>


                            <!-- CANCHAS -->

                            <li class="nav-item">

                                <a
                                    class="nav-link ${
                                        rutaActual === "canchas.html"
                                            ? "active"
                                            : ""
                                    }"
                                    href="${rutaPaginas}canchas.html"
                                >
                                    Canchas
                                </a>

                            </li>


                            <!-- NOSOTROS -->

                            <li class="nav-item">

                                <a
                                    class="nav-link ${
                                        rutaActual === "nosotros.html"
                                            ? "active"
                                            : ""
                                    }"
                                    href="${rutaPaginas}nosotros.html"
                                >
                                    Nosotros
                                </a>

                            </li>


                            <!-- CONTACTO -->

                            <li class="nav-item">

                                <a
                                    class="nav-link ${
                                        rutaActual === "contacto.html"
                                            ? "active"
                                            : ""
                                    }"
                                    href="${rutaPaginas}contacto.html"
                                >
                                    Contacto
                                </a>

                            </li>

                        </ul>                      

                        ${
                        esAdmin
                        ? `
                        <li class="nav-item">
                        <a
                            class="nav-link ${
                            rutaActual === "registro-complejo.html"
                            ? "active"
                            : ""
                            }"
                            href="${rutaPaginas}registro-complejo.html"
                            >
                            Registrar Complejo
                        </a>
                        </li>`: ""}

                        ${
                        esJugador
                        ? `
                        <li class="nav-item">
                        <a
                            class="nav-link ${
                            rutaActual === "reservas-cliente.html"
                            ? "active"
                            : ""
                            }"
                            href="${rutaPaginas}reservas-cliente.html"
                            >
                            Mis reservas
                        </a>
                        </li>`: ""}

                        <!-- USUARIO -->

                        <div class="d-flex align-items-center mx-5">

                            ${botonUsuario}

                        </div>

                    </div>

                </div>

            </nav>
        `;


        /* =====================================================
           GUARDAR PÁGINA ANTERIOR AL PULSAR "ÚNETE"
           ===================================================== */

        const botonUnete =
            this.querySelector("#btn-unete");


        if (botonUnete) {

            botonUnete.addEventListener(
                "click",
                () => {

                    sessionStorage.setItem(
                        "pagina_anterior",
                        window.location.pathname
                    );

                }
            );

        }


        /* =====================================================
           CERRAR SESIÓN
           ===================================================== */

        const botonCerrarSesion =
            this.querySelector("#btn-cerrar-sesion");


        if (botonCerrarSesion) {

            botonCerrarSesion.addEventListener(
                "click",
                () => {

                    sessionStorage.removeItem(
                        "usuario"
                    );

                    sessionStorage.removeItem(
                        "access_token"
                    );

                    sessionStorage.removeItem(
                        "pagina_anterior"
                    );

                    window.location.href =
                        rutaInicio;

                }
            );

        }

    }

}


customElements.define(
    "mi-navbar",
    MiNavbar
);