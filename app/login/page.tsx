// app/login/page.tsx
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient"; 
import { useRouter } from "next/navigation"; 
import Link from "next/link";
import { LogIn, Mail, Lock } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState<string>(""); 
    const [password, setPassword] = useState<string>(""); 
    const [message, setMessage] = useState<string | null>(null);
    const [loadingCheck, setLoadingCheck] = useState(true);
    const router = useRouter();

    // Restricción Inversa (Redirige a /user si ya está logueado)
    useEffect(() => {
        const checkUser = async () => {
            const { data } = await supabase.auth.getUser();
            if (data.user) {
                router.push("/user"); 
            } else {
                setLoadingCheck(false);
            }
        };
        checkUser();
    }, [router]);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); 
        setMessage(null);

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setMessage("❌ Error al iniciar sesión: " + error.message);
            return;
        }

        if (data.user) {
            setMessage("✅ Bienvenido, sesión iniciada correctamente.");
            router.push("/user"); // Redirecciona a la página de perfil
        } else {
            setMessage("No se encontró el usuario. Intenta de nuevo.");
        }
    };

    if (loadingCheck) return <p className="text-center mt-10">Verificando sesión...</p>;

    return (
        <div className="max-w-sm mx-auto mt-10 p-6 border rounded-xl shadow-lg bg-white">
            <h1 className="text-2xl font-bold mb-6 text-center text-blue-800 flex items-center justify-center">
                <LogIn className="w-6 h-6 mr-2" /> Inicio de Sesión
            </h1>
            
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input type="email" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full border p-3 pl-10 rounded-lg focus:border-yellow-500" />
                </div>
                
                <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full border p-3 pl-10 rounded-lg focus:border-yellow-500" />
                </div>
                
                <button type="submit" className="bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition">
                    Iniciar sesión
                </button>
            </form>
            
            {message && <p className="mt-4 text-center text-sm font-medium text-red-600">{message}</p>}

            <p className="mt-4 text-center text-sm">
                ¿No tienes cuenta?{" "}
                <Link href="/register" className="text-blue-600 hover:underline font-semibold">
                    Regístrate aquí
                </Link>
            </p>
        </div>
    );
}