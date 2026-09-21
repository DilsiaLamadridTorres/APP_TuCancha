(function () {
    function ensureToastContainer() {
        let container = document.getElementById("tuCancha-toast-container");

        if (!container) {
            container = document.createElement("div");
            container.id = "tuCancha-toast-container";
            container.setAttribute("aria-live", "polite");
            container.setAttribute("aria-atomic", "true");
            document.body.appendChild(container);
        }

        return container;
    }

    window.showToast = function showToast(message, type = "info") {
        if (!message) return;

        const container = ensureToastContainer();
        const toast = document.createElement("div");
        const tipos = {
            success: {
                icon: "bi-check-circle-fill",
                label: "Éxito"
            },
            error: {
                icon: "bi-exclamation-triangle-fill",
                label: "Error"
            },
            warning: {
                icon: "bi-exclamation-circle-fill",
                label: "Aviso"
            },
            info: {
                icon: "bi-info-circle-fill",
                label: "Información"
            }
        };

        const config = tipos[type] || tipos.info;

        toast.className = `toast-notification toast-notification--${type}`;
        toast.setAttribute("role", "alert");
        toast.innerHTML = `
            <div class="toast-notification__header">
                <i class="bi ${config.icon}"></i>
                <span>${config.label}</span>
            </div>
            <div class="toast-notification__body">${message}</div>
        `;

        container.appendChild(toast);

        requestAnimationFrame(() => {
            toast.classList.add("is-visible");
        });

        setTimeout(() => {
            toast.classList.remove("is-visible");
            setTimeout(() => toast.remove(), 250);
        }, 3200);
    };

    window.showConfirm = function showConfirm(message, title = "Confirmación") {
        return new Promise((resolve) => {
            const existing = document.getElementById("tuCancha-confirm-modal");
            if (existing) existing.remove();

            const overlay = document.createElement("div");
            overlay.id = "tuCancha-confirm-modal";
            overlay.className = "tuCancha-confirm-overlay";

            overlay.innerHTML = `
                <div class="tuCancha-confirm-modal" role="dialog" aria-modal="true" aria-labelledby="tuCancha-confirm-title">
                    <div class="tuCancha-confirm-header">
                        <div class="tuCancha-confirm-icon">
                            <i class="bi bi-question-circle-fill"></i>
                        </div>
                        <div>
                            <h3 id="tuCancha-confirm-title">${title}</h3>
                        </div>
                    </div>
                    <p class="tuCancha-confirm-message">${message}</p>
                    <div class="tuCancha-confirm-actions">
                        <button type="button" class="tuCancha-confirm-btn tuCancha-confirm-btn--cancel">Cancelar</button>
                        <button type="button" class="tuCancha-confirm-btn tuCancha-confirm-btn--confirm">Aceptar</button>
                    </div>
                </div>
            `;

            const cancelBtn = overlay.querySelector(".tuCancha-confirm-btn--cancel");
            const confirmBtn = overlay.querySelector(".tuCancha-confirm-btn--confirm");

            const close = (result) => {
                resolve(result);
                overlay.remove();
            };

            cancelBtn.addEventListener("click", () => close(false));
            confirmBtn.addEventListener("click", () => close(true));
            overlay.addEventListener("click", (event) => {
                if (event.target === overlay) close(false);
            });

            document.body.appendChild(overlay);
            requestAnimationFrame(() => {
                overlay.classList.add("is-visible");
            });
        });
    };
})();
