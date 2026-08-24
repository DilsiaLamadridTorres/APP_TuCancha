import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const SUPABASE_URL = "https://oqlfvqbfhyufhsmnxoho.supabase.co";
const SUPABASE_KEY = "sb_publishable_sUou4T6wbKp3GrdWH0Uu6Q_1GKUukkm";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

window.TuCanchaConfig = {
    provider: "supabase",
    supabaseUrl: SUPABASE_URL,
    supabaseAnonKey: SUPABASE_KEY
};