class AuthError extends Error {
    constructor(message, code = "AUTH_ERROR") {
        super(message);
        this.name = "AuthError";
        this.code = code;
    }
}


/* =========================
   PROVEEDOR DEMO
   ========================= */

class DemoAuthProvider {
    constructor() {
        this.storageKey = "tucancha_demo_users";
    }

    get users() {
        return JSON.parse(
            localStorage.getItem(this.storageKey) || "[]"
        );
    }

    set users(users) {
        localStorage.setItem(
            this.storageKey,
            JSON.stringify(users)
        );
    }

    async checkConnection() {
        return {
            mode: "demo",
            message: "Modo demostración activo."
        };
    }

    async register({
        nombreCompleto,
        correo,
        telefono,
        contrasena
    }) {
        const correoNormalizado = correo.toLowerCase();

        if (
            this.users.some(
                (user) => user.correo === correoNormalizado
            )
        ) {
            throw new AuthError(
                "Ya existe una cuenta registrada con este correo.",
                "EMAIL_EXISTS"
            );
        }

        const passwordHash = await this.hash(contrasena);

        this.users = [
            ...this.users,
            {
                id: crypto.randomUUID(),
                nombreCompleto,
                correo: correoNormalizado,
                telefono,
                passwordHash,
                creadoEn: new Date().toISOString()
            }
        ];

        return {
            needsEmailConfirmation: false,
            mode: "demo"
        };
    }

    async login({ correo, contrasena }) {
        const passwordHash = await this.hash(contrasena);

        const user = this.users.find(
            (item) =>
                item.correo === correo.toLowerCase() &&
                item.passwordHash === passwordHash
        );

        if (!user) {
            throw new AuthError(
                "Correo o contraseña incorrectos.",
                "INVALID_CREDENTIALS"
            );
        }

        return user;
    }

    async hash(value) {
        const bytes = new TextEncoder().encode(value);

        const digest = await crypto.subtle.digest(
            "SHA-256",
            bytes
        );

        return Array.from(
            new Uint8Array(digest)
        )
            .map((byte) =>
                byte.toString(16).padStart(2, "0")
            )
            .join("");
    }
}


/* =========================
   PROVEEDOR SUPABASE
   ========================= */

class SupabaseAuthProvider {
    constructor(config) {
        this.baseUrl = config.supabaseUrl.replace(/\/$/, "");
        this.key = config.supabaseAnonKey;
    }

    headers() {
        return {
            "apikey": this.key,
            "Content-Type": "application/json"
        };
    }

    async request(path, options = {}) {
        let response;

        try {
            response = await fetch(
                `${this.baseUrl}${path}`,
                {
                    ...options,
                    headers: {
                        ...this.headers(),
                        ...options.headers
                    }
                }
            );
        } catch (error) {
            throw new AuthError(
                "No fue posible comunicarse con Supabase. Revisa tu conexión.",
                "NETWORK_ERROR"
            );
        }

        const data = await response
            .json()
            .catch(() => ({}));

        if (!response.ok) {
            throw new AuthError(
                data.msg ||
                data.message ||
                "No fue posible completar la operación.",
                data.code ||
                "SUPABASE_ERROR"
            );
        }

        return data;
    }

    async checkConnection() {
        await this.request("/auth/v1/settings");

        return {
            mode: "supabase",
            message: "Conexión exitosa con Supabase."
        };
    }

    async register({
        nombreCompleto,
        correo,
        telefono,
        contrasena
    }) {
        const data = await this.request(
            "/auth/v1/signup",
            {
                method: "POST",

                body: JSON.stringify({
                    email: correo,
                    password: contrasena,

                    data: {
                        nombre_completo: nombreCompleto,
                        telefono: telefono
                    }
                })
            }
        );

        return {
            needsEmailConfirmation: !data.session,
            mode: "supabase"
        };
    }

    async login({
        correo,
        contrasena
    }) {
        return await this.request(
            "/auth/v1/token?grant_type=password",
            {
                method: "POST",

                body: JSON.stringify({
                    email: correo,
                    password: contrasena
                })
            }
        );
    }
    async logout(accessToken) {
    return await this.request("/auth/v1/logout", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    });
}
}


/* =========================
   SERVICIO DE AUTENTICACIÓN
   ========================= */

class AuthService {
    constructor(config = window.TuCanchaConfig || {}) {

        const hasSupabaseConfig =
            config.provider === "supabase" &&
            config.supabaseUrl &&
            config.supabaseAnonKey;

        if (hasSupabaseConfig) {
            console.log("Usando Supabase");
            this.provider =
                new SupabaseAuthProvider(config);
        } else {
            console.log("Usando modo Demo");
            this.provider =
                new DemoAuthProvider();
        }
    }

    checkConnection() {
        return this.provider.checkConnection();
    }

    register(data) {
        return this.provider.register(data);
    }

    login(data) {
        return this.provider.login(data);
    }
    logout() {
    return this.provider.logout();
}
}


/* =========================
   CREAR SERVICIO
   ========================= */

window.authService = new AuthService();

console.log(
    "AuthService iniciado:",
    window.authService.provider.constructor.name
);