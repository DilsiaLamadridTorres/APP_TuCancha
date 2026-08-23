class MiNavbar extends HTMLElement {

    connectedCallback() {

        /* =====================================================
           OBTENER PÁGINA ACTUAL
           ===================================================== */

        const rutaActual =
            (window.location.pathname.split('/').pop() || "index.html")
                .toLowerCase();


        /* =====================================================
           SABER SI ESTAMOS DENTRO DE /html
           ===================================================== */

        const estaEnHtml =
            window.location.pathname
                .toLowerCase()
                .includes('/html/');


        /* =====================================================
           RUTAS SEGÚN UBICACIÓN
           ===================================================== */

        /*
            Si estamos dentro de /html:
            Inicio debe subir un nivel.

            html/canchas.html
                    ↓
            ../index.html
        */

        const rutaInicio =
            estaEnHtml
                ? "../index.html"
                : "index.html";


        /*
            Las demás páginas están dentro de /html.

            Desde una página en /html:
            canchas.html

            Desde index.html:
            html/canchas.html
        */

        const rutaPaginas =
            estaEnHtml
                ? ""
                : "html/";


        /*
            Lo mismo ocurre con las imágenes.
        */

        const rutaLogo =
            estaEnHtml
                ? "../img/logo/Logo.png"
                : "img/logo/Logo.png";


        /* =====================================================
           NAVBAR
           ===================================================== */

        this.innerHTML = `

            <nav class="navbar navbar-expand-lg bg-dark shadow-sm">

                <div class="container-fluid">


                    <!-- =========================================
                         LOGO
                         ========================================= -->

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


                    <!-- =========================================
                         NOMBRE
                         ========================================= -->

                    <div class="d-flex flex-column">

                        <a
                            href="${rutaInicio}"
                            class="text-decoration-none d-flex flex-column"
                        >

                            <span class="fw-bold text-white lh-1 fs-2">
                                TuCancha
                            </span>

                            <small class="fst-italic fs-6">
                                ¡Arma tu parche y juégatela!
                            </small>

                        </a>

                    </div>


                    <!-- =========================================
                         BOTÓN RESPONSIVE
                         ========================================= -->

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


                    <!-- =========================================
                         LINKS
                         ========================================= -->

                    <div
                        class="collapse navbar-collapse text-center"
                        id="navbarNav"
                    >

                        <ul class="navbar-nav mx-auto text-center my-auto">


                            <!-- Inicio -->
                            <li class="nav-item">

                                <a
                                    class="nav-link ${rutaActual === "index.html"
                ? "active"
                : ""
            }"
                                    href="${rutaInicio}"
                                >
                                    Inicio
                                </a>

                            </li>


                            <!-- Canchas -->
                            <li class="nav-item">

                                <a
                                    class="nav-link ${rutaActual === "canchas.html"
                ? "active"
                : ""
            }"
                                    href="${rutaPaginas}canchas.html"
                                >
                                    Canchas
                                </a>

                            </li>


                            <!-- Reservas -->
                            <li class="nav-item">

                                <a
                                    class="nav-link ${rutaActual === "reservas.html"
                ? "active"
                : ""
            }"
                                    href="${rutaPaginas}reservas.html"
                                >
                                    Reservas
                                </a>

                            </li>


                            <!-- Precios -->
                            <li class="nav-item">

                                <a
                                    class="nav-link ${rutaActual === "precios.html"
                ? "active"
                : ""
            }"
                                    href="${rutaPaginas}precios.html"
                                >
                                    Precios
                                </a>

                            </li>


                            <!-- Nosotros -->
                            <li class="nav-item">

                                <a
                                    class="nav-link ${rutaActual === "nosotros.html"
                ? "active"
                : ""
            }"
                                    href="${rutaPaginas}nosotros.html"
                                >
                                    Nosotros
                                </a>

                            </li>


                            <!-- Contacto -->
                            <li class="nav-item">

                                <a
                                    class="nav-link ${rutaActual === "contacto.html"
                ? "active"
                : ""
            }"
                                    href="${rutaPaginas}contacto.html"
                                >
                                    Contacto
                                </a>

                            </li>

                        </ul>


                        <!-- =====================================
                             REGISTRO
                             ===================================== -->

                        <a
                            href="${rutaPaginas}registro.html"
                            class="btn btn-primary mx-5"
                        >
                            Únete
                        </a>


                    </div>

                </div>

            </nav>

        `;

    }

}


customElements.define(
    "mi-navbar",
    MiNavbar
);