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

    normalizeUser(user) {
        if (!user || typeof user !== "object") {
            return null;
        }

        const correo = String(
            user.correo ?? user.email ?? user.correoElectronico ?? ""
        ).trim().toLowerCase();

        if (!correo) {
            return null;
        }

        const passwordHash = user.passwordHash ?? user.password ?? user.contrasenaHash ?? user.hash ?? "";

        return {
            id: user.id || crypto.randomUUID(),
            nombreCompleto: user.nombreCompleto ?? user.nombre ?? user.name ?? "",
            correo,
            telefono: user.telefono ?? user.phone ?? "",
            passwordHash: String(passwordHash),
            rol: user.rol ?? "JUGADOR",
            creadoEn: user.creadoEn || new Date().toISOString()
        };
    }

    get users() {
        try {
            const users = JSON.parse(
                localStorage.getItem(this.storageKey) || "[]"
            );

            const normalizados = users
                .map((user) => this.normalizeUser(user))
                .filter(Boolean);

            if (normalizados.length !== users.length) {
                this.users = normalizados;
            }

            return normalizados;
        } catch (error) {
            return [];
        }
    }

    set users(users) {
        const usuariosValidos = (users || [])
            .map((user) => this.normalizeUser(user))
            .filter(Boolean);

        localStorage.setItem(
            this.storageKey,
            JSON.stringify(usuariosValidos)
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
        const correoNormalizado = String(correo || "").trim().toLowerCase();

        if (!correoNormalizado) {
            throw new AuthError(
                "Ingresa un correo válido para continuar.",
                "INVALID_EMAIL"
            );
        }

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
                nombreCompleto: nombreCompleto || "",
                correo: correoNormalizado,
                telefono: telefono || "",
                passwordHash,
                rol: "JUGADOR",
                creadoEn: new Date().toISOString()
            }
        ];

        return {
            needsEmailConfirmation: false,
            mode: "demo"
        };
    }

    async login({ correo, contrasena }) {
        const correoNormalizado = String(correo || "").trim().toLowerCase();
        const passwordHash = await this.hash(contrasena);

        const user = this.users.find(
            (item) =>
                item.correo === correoNormalizado &&
                (item.passwordHash === passwordHash || item.passwordHash === String(contrasena))
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
            typeof config.supabaseUrl === "string" &&
            config.supabaseUrl.trim() &&
            typeof config.supabaseAnonKey === "string" &&
            config.supabaseAnonKey.trim();

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
        const accessToken = sessionStorage.getItem("access_token");

        if (typeof this.provider.logout !== "function") {
            return Promise.resolve();
        }

        return this.provider.logout(accessToken);
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