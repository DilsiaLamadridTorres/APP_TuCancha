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
           OBTENER USUARIO
           ===================================================== */

        const usuarioGuardado =
            sessionStorage.getItem("usuario");

        let usuario = null;

        if (usuarioGuardado) {

            try {

                usuario =
                    JSON.parse(usuarioGuardado);

            } catch (error) {

                console.error(
                    "Error leyendo usuario:",
                    error
                );

                sessionStorage.removeItem("usuario");
            }
        }


        /* =====================================================
           CONFIGURAR BOTÓN DE USUARIO
           ===================================================== */

        let nombreUsuario = "Únete";

        let rutaUsuario =
            `${rutaPaginas}registro.html`;


        if (usuario) {

            nombreUsuario =
                usuario.nombre || "Usuario";

            rutaUsuario =
                `${rutaPaginas}pagar-reserva.html`;
        }


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

                        <span
                            class="navbar-toggler-icon"
                        ></span>

                    </button>


                    <!-- =========================================
                         LINKS
                         ========================================= -->

                    <div
                        class="collapse navbar-collapse text-center"
                        id="navbarNav"
                    >

                        <ul
                            class="navbar-nav mx-auto text-center my-auto"
                        >


                            <!-- =================================
                                 INICIO
                                 ================================= -->

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


                            <!-- =================================
                                 CANCHAS
                                 ================================= -->

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


                            ${usuario ? `
                           <li class="nav-item">
                          <a class="nav-link ${rutaActual === "reservas-cliente.html" ? "active" : " " }" href="${rutaPaginas}reservas-cliente.html">
                            Mis reservas
                           </a>
                          </li>
                           ` : ""}

                            <!-- =================================
                                 NOSOTROS
                                 ================================= -->

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


                            <!-- =================================
                                 CONTACTO
                                 ================================= -->

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


                        <!-- =====================================
                             USUARIO
                             ===================================== -->
<div class="d-flex align-items-center mx-5">
  ${usuario ? `
        <div class="dropdown">
          <button
            class="btn btn-primary dropdown-toggle"
            type="button"
            id="menuUsuario"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i class="bi bi-person-circle me-1"></i>
            ${nombreUsuario}
          </button>

          <ul
            class="dropdown-menu dropdown-menu-end dropdown-menu-dark"
            aria-labelledby="menuUsuario"
          >
            <li>
              <a class="dropdown-item" href="${rutaPaginas}pagar-reserva.html">
                <i class="bi bi-calendar-check me-2"></i>
                Mis reservas
              </a>
            </li>

            <li><hr class="dropdown-divider"></li>

            <li>
              <button
                type="button"
                id="btn-logout"
                class="dropdown-item text-danger"
              >
                <i class="bi bi-box-arrow-right me-2"></i>
                Cerrar sesión
              </button>
            </li>
          </ul>
        </div>
      `
      : `
        <a href="${rutaPaginas}registro.html" class="btn btn-primary">
          Únete
        </a>
      `
  }
</div>

                    </div>

                </div>

            </nav>

        `;


        /* =====================================================
           CERRAR SESIÓN
           ===================================================== */

        const btnLogout =
            this.querySelector("#btn-logout");


        if (btnLogout) {

            btnLogout.addEventListener(
                "click",
                async () => {

                    btnLogout.disabled = true;

                    btnLogout.textContent =
                        "Cerrando sesión...";


                    try {

                        const token =
                            sessionStorage.getItem(
                                "access_token"
                            );


                        /* =====================================
                           CERRAR SESIÓN EN SUPABASE
                           ===================================== */

                        if (token) {

                            await fetch(
                                `${window.TuCanchaConfig.supabaseUrl}/auth/v1/logout`,
                                {
                                    method: "POST",

                                    headers: {
                                        "apikey":
                                            window.TuCanchaConfig
                                                .supabaseAnonKey,

                                        "Authorization":
                                            `Bearer ${token}`,

                                        "Content-Type":
                                            "application/json"
                                    }
                                }
                            );
                        }


                    } catch (error) {

                        console.error(
                            "Error al cerrar sesión:",
                            error
                        );

                    } finally {

                        /* ===============================
                           LIMPIAR SESIÓN LOCAL
                           =============================== */

                        sessionStorage.removeItem(
                            "usuario"
                        );

                        sessionStorage.removeItem(
                            "access_token"
                        );


                        /* ===============================
                           VOLVER AL INICIO
                           =============================== */

                        window.location.href =
                            rutaInicio;
                    }

                }
            );
        }

    }

}


customElements.define(
    "mi-navbar",
    MiNavbar
);