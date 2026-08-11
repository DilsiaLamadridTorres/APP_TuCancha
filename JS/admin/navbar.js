class MiNavbar extends HTMLElement {
    connectedCallback() {
        const rutaActual = (window.location.pathname.split('/').pop() || "Index.html").toLowerCase();
    this.innerHTML = `<nav class="navbar navbar-expand-lg bg-dark shadow-sm">
            <div class="container-fluid">
                <img src="../img/logo/Logo.png" alt="Logo" width="100" height="100" href="#"
                    class="me-2 rounded-circle object-fit-cover">
                <div class="d-flex flex-column ">
                    <a href="Index.html" class="text-decoration-none d-flex flex-column">
                        <span class="fw-bold text-white lh-1 fs-2" href="#" >TuCancha</span>
                        <small class="fst-italic fs-6">¡Arma tu parche y juégatela!</small>
                    </a>
                </div>
                <button class="navbar-toggler   " type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                    aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse text-center" id="navbarNav">
                    <ul class="navbar-nav mx-auto text-center my-auto">
                        <li class="nav-item">
                            <a class="nav-link ${rutaActual === 'index.html' || rutaActual === '' ? 'active' : ''}" href="Index.html">Inicio</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link ${rutaActual === 'canchas.html' || rutaActual === '' ? 'active' : ''}" href="canchas.html">Canchas</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link ${rutaActual === 'reservas.html' || rutaActual === '' ? 'active' : ''}" href="reservas.html">Reservas</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link ${rutaActual === 'precios.html' || rutaActual === '' ? 'active' : ''}" href="precios.html">Precios</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link ${rutaActual === 'nosotros.html' || rutaActual === '' ? 'active' : ''}" href="nosotros.html">Nosotros</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link ${rutaActual === 'contacto.html' || rutaActual === '' ? 'active' : ''}" href="contacto.html">Contacto</a>
                        </li>
                    </ul>
                    <div class=""></div>
                    <button type="button" class="btn btn-primary mx-5">Únete</button>
                </div>
            </div>
            </div>
        </nav>`;
    }
}

customElements.define('mi-navbar', MiNavbar);
