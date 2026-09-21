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
})();
