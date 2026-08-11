class AuthError extends Error {
    constructor(message, code = "AUTH_ERROR") {
        super(message);
        this.name = "AuthError";
        this.code = code;
    }
}

class DemoAuthProvider {
    constructor() {
        this.storageKey = "tucancha_demo_users";
    }

    get users() {
        return JSON.parse(localStorage.getItem(this.storageKey) || "[]");
    }

    set users(users) {
        localStorage.setItem(this.storageKey, JSON.stringify(users));
    }

    async checkConnection() {
        return { mode: "demo", message: "Modo demostración activo. Aún no hay una base de datos conectada." };
    }

    async register({ nombreCompleto, correo, telefono, contrasena }) {
        if (this.users.some((user) => user.correo === correo.toLowerCase())) {
            throw new AuthError("Ya existe una cuenta registrada con este correo.", "EMAIL_EXISTS");
        }

        const passwordHash = await this.hash(contrasena);
        this.users = [...this.users, {
            id: crypto.randomUUID(),
            nombreCompleto,
            correo: correo.toLowerCase(),
            telefono,
            passwordHash,
            creadoEn: new Date().toISOString()
        }];

        return { needsEmailConfirmation: false, mode: "demo" };
    }

    async login({ correo, contrasena }) {
        const passwordHash = await this.hash(contrasena);
        const user = this.users.find((item) => item.correo === correo.toLowerCase() && item.passwordHash === passwordHash);
        if (!user) throw new AuthError("Correo o contraseña incorrectos.", "INVALID_CREDENTIALS");
        return user;
    }

    async hash(value) {
        const bytes = new TextEncoder().encode(value);
        const digest = await crypto.subtle.digest("SHA-256", bytes);
        return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
    }
}

class SupabaseAuthProvider {
    constructor(config) {
        this.baseUrl = config.supabaseUrl.replace(/\/$/, "");
        this.key = config.supabaseAnonKey;
    }

    headers() {
        return { "apikey": this.key, "Content-Type": "application/json" };
    }

    async request(path, options = {}) {
        let response;
        try {
            response = await fetch(`${this.baseUrl}${path}`, { ...options, headers: { ...this.headers(), ...options.headers } });
        } catch {
            throw new AuthError("No fue posible comunicarse con la base de datos. Revisa la conexión e inténtalo otra vez.", "NETWORK_ERROR");
        }

        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new AuthError(data.msg || data.message || "No fue posible completar la operación.", data.code || "SUPABASE_ERROR");
        return data;
    }

    async checkConnection() {
        await this.request("/auth/v1/settings");
        return { mode: "supabase", message: "Conexión exitosa con Supabase." };
    }

    async register({ nombreCompleto, correo, telefono, contrasena }) {
        const data = await this.request("/auth/v1/signup", {
            method: "POST",
            body: JSON.stringify({
                email: correo,
                password: contrasena,
                data: { nombre_completo: nombreCompleto, telefono }
            })
        });
        return { needsEmailConfirmation: !data.session, mode: "supabase" };
    }

    async login({ correo, contrasena }) {
        return this.request("/auth/v1/token?grant_type=password", {
            method: "POST",
            body: JSON.stringify({ email: correo, password: contrasena })
        });
    }
}

class AuthService {
    constructor(config = window.TuCanchaConfig) {
        const hasSupabaseConfig = config.provider === "supabase" && config.supabaseUrl && config.supabaseAnonKey;
        this.provider = hasSupabaseConfig ? new SupabaseAuthProvider(config) : new DemoAuthProvider();
    }

    checkConnection() { return this.provider.checkConnection(); }
    register(data) { return this.provider.register(data); }
    login(data) { return this.provider.login(data); }
}

window.authService = new AuthService();
