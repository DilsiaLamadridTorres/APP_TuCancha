// Importar el SDK de Supabase desde CDN ES Module
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// URL base del backend propio. Los módulos que consuman su API deben usar
// `${API_URL}/api/...` para no duplicar esta configuración.
export const API_URL = "http://localhost:8080";
window.API_URL = API_URL;

const SUPABASE_URL = "https://oqlfvqbfhyufhsmnxoho.supabase.co";
const SUPABASE_KEY = "sb_publishable_sUou4T6wbKp3GrdWH0Uu6Q_1GKUukkm";

// 1. Mantienes tu configuración global
window.TuCanchaConfig = {
    provider: "supabase",
    supabaseUrl: SUPABASE_URL,
    supabaseAnonKey: SUPABASE_KEY
};

// 2. Creas y EXPORTAS la instancia del cliente para que main.js la reconozca
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

console.log("Configuración de Supabase cargada");
