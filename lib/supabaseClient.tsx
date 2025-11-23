// lib/supabaseClient.tsx
import { createClient } from "@supabase/supabase-js";

// Tus credenciales (estas son las que debes usar)
const supabaseUrl = "https://plkpzebrpxoweorbusys.supabase.co"; 
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsa3B6ZWJycHhvd2VvcmJ1c3lzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzODM4MzUsImV4cCI6MjA3Nzk1OTgzNX0.y3DdKky559hpvDHbdJ32Ycac5jIOvUbhKjPtbUETGSE";

// NO USAMOS 'throw' aquí, solo console.error
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Faltan las variables de entorno de Supabase");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);