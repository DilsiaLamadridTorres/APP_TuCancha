class MiNavbar extends HTMLElement {
    connectedCallback() {
        const rutaActual = (window.location.pathname.split('/').pop() || "Index.html").toLowerCase();
        const estaEnHtml = window.location.pathname.includes('/html/');
        const enlace = (archivo) => {
            if (archivo === 'index.html') return estaEnHtml ? '../index.html' : 'index.html';
            return estaEnHtml ? archivo : `html/${archivo}`;
        };
        const rutaLogo = estaEnHtml ? '../img/logo/Logo.png' : 'img/logo/Logo.png';

        this.innerHTML = `<nav class="navbar navbar-expand-lg bg-dark shadow-sm">
            <div class="container-fluid">
                <img src="${rutaLogo}" alt="Logo" width="100" height="100"
                    class="me-2 rounded-circle object-fit-cover">
                <div class="d-flex flex-column ">
                    <a href="${enlace('index.html')}" class="text-decoration-none d-flex flex-column">
                        <span class="fw-bold text-white lh-1 fs-2">TuCancha</span>
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
                            <a class="nav-link ${rutaActual === 'index.html' ? 'active' : ''}" href="${enlace('index.html')}">Inicio</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link ${rutaActual === 'canchas.html' ? 'active' : ''}" href="${enlace('canchas.html')}">Canchas</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link ${rutaActual === 'reservas.html' ? 'active' : ''}" href="${enlace('reservas.html')}">Reservas</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link ${rutaActual === 'precios.html' ? 'active' : ''}" href="${enlace('precios.html')}">Precios</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link ${rutaActual === 'nosotros.html' ? 'active' : ''}" href="${enlace('nosotros.html')}">Nosotros</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link ${rutaActual === 'contacto.html' ? 'active' : ''}" href="${enlace('contacto.html')}">Contacto</a>
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
