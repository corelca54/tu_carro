// lib/supabaseClient.tsx
import { createClient } from "@supabase/supabase-js";

// REEMPLAZA estas cadenas con tu Project URL y Anon Key.
const supabaseUrl = "https://plkpzebrpxoweorbusys.supabase.co"; 
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsa3B6ZWJycHhvd2VvcmJ1c3lzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzODM4MzUsImV4cCI6MjA3Nzk1OTgzNX0.y3DdKky559hpvDHbdJ32Ycac5jIOvUbhKjPtbUETGSE";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);