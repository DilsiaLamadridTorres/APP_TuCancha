/* ============================================================
   TUCANCHA
   LAYOUT GENERAL DEL PANEL ADMINISTRATIVO
   ============================================================ */


/* ============================================================
   COMPONENTE SIDEBAR
   ============================================================ */

class AdminSidebar extends HTMLElement {

    connectedCallback() {

        /* =====================================================
           OBTENER LA PÁGINA ACTUAL
           ===================================================== */

        const paginaActual =
            window.location.pathname
                .split("/")
                .pop()
                .toLowerCase();


        /* =====================================================
           DETERMINAR OPCIÓN ACTIVA
           ===================================================== */

        const inicioActivo =
            paginaActual === "inicio-admin.html";


        const solicitudesActivo =
            paginaActual === "solicitudes-admin.html";


        /* =====================================================
           CREAR SIDEBAR
           ===================================================== */

        this.innerHTML = `

            <aside class="admin-sidebar">


                <!-- =========================================
                     LOGO
                     ========================================= -->

                <div class="sidebar-brand">


                    <img
                        src="../../img/logo/Logo.png"
                        alt="Logo TuCancha"
                        class="sidebar-logo"
                    >


                    <div class="sidebar-brand-text">

                        <strong>
                            TuCancha
                        </strong>

                        <span>
                            Panel Administrativo
                        </span>

                    </div>


                </div>



                <!-- =========================================
                     NAVEGACIÓN
                     ========================================= -->

                <nav class="sidebar-nav">


                    <!-- =====================================
                         INICIO
                         ===================================== -->

                    <a
                        href="inicio-admin.html"
                        class="sidebar-link ${inicioActivo
                ? "active"
                : ""
            }"
                    >

                        <i class="bi bi-house-door-fill"></i>

                        <span>
                            Inicio
                        </span>

                    </a>



                    <!-- =====================================
                         SOLICITUDES
                         ===================================== -->

                    <a
                        href="solicitudes-admin.html"
                        class="sidebar-link ${solicitudesActivo
                ? "active"
                : ""
            }"
                    >

                        <i class="bi bi-file-earmark-text"></i>

                        <span>
                            Solicitudes
                        </span>

                    </a>


                </nav>



                <!-- =========================================
                     PARTE INFERIOR DEL SIDEBAR
                     ========================================= -->

                <div class="sidebar-footer">


                    <!-- =====================================
                         INFORMACIÓN DEL ADMIN
                         ===================================== -->

                    <div class="admin-profile">


                        <div class="admin-avatar">
                            A
                        </div>


                        <div class="admin-profile-info">

                            <strong>
                                Administrador
                            </strong>

                            <span>
                                admin@tucancha.com
                            </span>

                        </div>


                    </div>



                    <!-- =====================================
                         CERRAR SESIÓN
                         ===================================== -->

                    <button
                        type="button"
                        class="btn-logout"
                        id="btnLogout"
                    >

                        <i class="bi bi-box-arrow-right"></i>

                        <span>
                            Cerrar sesión
                        </span>

                    </button>


                </div>


            </aside>

        `;

        this.configurarCerrarSesion();

    }


    configurarCerrarSesion() {

        const botonLogout =
            this.querySelector(
                "#btnLogout"
            );


        botonLogout?.addEventListener(
            "click",
            () => {

                sessionStorage.removeItem(
                    "usuario"
                );


                sessionStorage.removeItem(
                    "access_token"
                );


                window.location.replace(
                    "../login.html"
                );

            }
        );

    }

}


/* ============================================================
   REGISTRAR COMPONENTE
   ============================================================ */

customElements.define(
    "admin-sidebar",
    AdminSidebar
);
