import { API_URL } from "./config.js";

class BackendApiError extends Error {
    constructor(message, status) {
        super(message);
        this.name = "BackendApiError";
        this.status = status;
    }
}

async function request(path, options = {}) {
    let response;

    try {
        response = await fetch(`${API_URL}${path}`, {
            ...options,
            headers: {
                ...options.headers
            }
        });
    } catch (error) {
        throw new BackendApiError(
            "No fue posible comunicarse con el backend.",
            0
        );
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new BackendApiError(
            data?.message || "No fue posible completar la operación.",
            response.status
        );
    }

    return data;
}

function validarId(id, nombre) {
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
        throw new BackendApiError(
            `${nombre} es obligatorio para crear la reserva.`,
            0
        );
    }
}

export const backendApi = {
    obtenerUsuarios() {
        return request("/api/usuarios");
    },

    obtenerCanchas() {
        return request("/api/canchas");
    },

    obtenerComplejos() {
        return request("/complejos");
    },

    obtenerHorariosDisponibles(canchaId, fecha) {
        return request(
            `/api/horarios/cancha/${encodeURIComponent(canchaId)}` +
            `/disponibles?fecha=${encodeURIComponent(fecha)}`
        );
    },

    crearReserva(usuarioId, horarioId) {
        validarId(usuarioId, "usuarioId");
        validarId(horarioId, "horarioId");

        return request("/api/reservas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                usuarioId: Number(usuarioId),
                horarioId: Number(horarioId)
            })
        });
    }
};
