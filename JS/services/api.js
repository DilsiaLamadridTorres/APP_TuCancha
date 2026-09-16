const API_BASE_URL = 'https://tucanchabackend.onrender.com';

/**
 * Generic HTTP Fetch Handler
 */
async function apiFetch(endpoint, method = 'GET', body = null) {
    const headers = {
        'Content-Type': 'application/json',
    };

    // Attach JWT Token if saved in LocalStorage
    const token = localStorage.getItem('token');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        method,
        headers,
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        
        if (response.status === 204) {
            return null; // No content
        }

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.mensaje || `Error ${response.status}: ${response.statusText}`);
        }

        return data;
    } catch (error) {
        console.error(`API Error [${method} ${endpoint}]:`, error);
        throw error;
    }
}

/* =========================================================
   CANCHAS SERVICE
   ========================================================= */
export const CanchaService = {
    getAll: () => apiFetch('/api/canchas'),
    getById: (id) => apiFetch(`/api/canchas/${id}`),
    getByComplejo: (complejoId) => apiFetch(`/api/canchas/complejo/${complejoId}`),
    getByEstado: (estado) => apiFetch(`/api/canchas/estado/${estado}`),
    create: (data) => apiFetch('/api/canchas', 'POST', data),
    update: (id, data) => apiFetch(`/api/canchas/${id}`, 'PUT', data),
    updateEstado: (id, estado) => apiFetch(`/api/canchas/${id}/estado?estado=${estado}`, 'PATCH')
};

/* =========================================================
   HORARIOS SERVICE
   ========================================================= */
export const HorarioService = {
    getAll: () => apiFetch('/api/horarios'),
    getById: (id) => apiFetch(`/api/horarios/${id}`),
    getByCancha: (canchaId) => apiFetch(`/api/horarios/cancha/${canchaId}`),
    getByCanchaAndFecha: (canchaId, fecha) => apiFetch(`/api/horarios/cancha/${canchaId}/fecha/${fecha}`),
    getDisponibles: (canchaId, fecha) => apiFetch(`/api/horarios/cancha/${canchaId}/disponibles?fecha=${fecha}`),
    create: (data) => apiFetch('/api/horarios', 'POST', data),
    update: (id, data) => apiFetch(`/api/horarios/${id}`, 'PUT', data),
    delete: (id) => apiFetch(`/api/horarios/${id}`, 'DELETE')
};

/* =========================================================
   RESERVAS SERVICE
   ========================================================= */
export const ReservaService = {
    getAll: () => apiFetch('/api/reservas'),
    getById: (id) => apiFetch(`/api/reservas/${id}`),
    create: (data) => apiFetch('/api/reservas', 'POST', data)
};

/* =========================================================
   COMPLEJOS SERVICE
   ========================================================= */
export const ComplejoService = {
    getAll: () => apiFetch('/complejos'),
    getById: (id) => apiFetch(`/complejos/${id}`),
    create: (data) => apiFetch('/complejos', 'POST', data),
    update: (id, data) => apiFetch(`/complejos/${id}`, 'PUT', data),
    delete: (id) => apiFetch(`/complejos/${id}`, 'DELETE')
};

/* =========================================================
   PAGOS SERVICE
   ========================================================= */
export const PagoService = {
    getAll: () => apiFetch('/api/pagos'),
    create: (data) => apiFetch('/api/pagos', 'POST', data)
};

/* =========================================================
   USUARIOS SERVICE
   ========================================================= */
export const UsuarioService = {
    getAll: () => apiFetch('/api/usuarios'),
    getById: (id) => apiFetch(`/api/usuarios/${id}`),
    create: (data) => apiFetch('/api/usuarios', 'POST', data),
    delete: (id) => apiFetch(`/api/usuarios/${id}`, 'DELETE')
};