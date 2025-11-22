// lib/supabaseClient.tsx
import { createClient } from "@supabase/supabase-js";

// REEMPLAZA estas cadenas con tu Project URL y Anon Key.
const supabaseUrl = "TU_PROJECT_URL_DE_SUPABASE"; 
const supabaseAnonKey = "TU_ANON_PUBLIC_KEY_DE_SUPABASE";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);