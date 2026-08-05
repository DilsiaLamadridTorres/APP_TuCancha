class MiFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `<footer class="footer bg-dark text-white pt-5 ">
    <div class="container">
        <div class="row gy-5">
            <!-- Logo -->
            <div class="col-lg-5 col-md-12 text-center text-lg-start">
                <img src="../img/logo/logo corto.png" alt="Logo TuCancha" width="160" class="footer-logo mb-3">
                <h3 class="fw-bold">
                    Arma tu parche y juégatela
                </h3>
                <p class="text-secondary mt-3">
                    Reserva canchas deportivas de forma rápida,
                    segura y sencilla desde cualquier lugar.
                </p>
            </div>
            <!-- Redes -->
            <div class="col-lg-3 col-md-6 text-center text-lg-start">
                <h5 class="footer-title">
                    Síguenos
                </h5>
                <div class="d-flex flex-column gap-2 mt-3">
                    <a href="https://www.instagram.com/_tucancha_?igsh=bDN0c2VodzN1aGsy&utm_source=qr" target="_blank" class="footer-link">
                        <i class="bi bi-instagram me-2"></i>Instagram
                    </a>
                    <a href="https://www.facebook.com/share/1EoRjqjRus/?mibextid=wwXIfr" target="_blank" class="footer-link">
                        <i class="bi bi-facebook me-2"></i>Facebook
                    </a>
                    <a href="https://www.tiktok.com/@tucancha0?_r=1&_t=ZS-98bzxNRtPcW" target="_blank" class="footer-link">
                        <i class="bi bi-tiktok me-2"></i>TikTok
                    </a>
                </div>
            </div>
            <!-- Contacto -->
            <div class="col-lg-4 col-md-6 text-center text-lg-start">
                <h5 class="footer-title">
                    Contacto
                </h5>
                <div class="mt-3">
                    <p>
                        <i class="bi bi-envelope-fill me-2"></i>
                        tucancha.contacto@gmail.com
                    </p>
                    <p>
                        <i class="bi bi-telephone-fill me-2"></i>
                        +57 301300000
                    </p>
                    <p>
                        <i class="bi bi-geo-alt-fill me-2"></i>
                        Medellín, Colombia
                    </p>
                </div>
                <a href="catalogo.html" class="btn btn-warning mt-2 fw-semibold">
                    Reserva ahora
                </a>
            </div>
        </div>
        <hr class="footer-divider my-4">
        <div class="row align-items-center">
            <div class="col-md-6 text-center text-md-start">
                <small>
                    © 2026 TuCancha. Todos los derechos reservados.
                </small>
            </div>
            <div class="col-md-6 text-center text-md-end mt-3 mt-md-0">
                <a href="#" class="footer-bottom-link me-4">
                    Política de privacidad
                </a>
                <a href="#" class="footer-bottom-link">
                    Términos y condiciones
                </a>
            </div>
        </div>
    </div>
</footer>`
    }}

if (!customElements.get("mi-footer")) {
    customElements.define("mi-footer", MiFooter);}