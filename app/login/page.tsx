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
            setTimeout(() => router.push("/user"), 1500);
        } else {
            setMessage("No se encontró el usuario. Intenta de nuevo.");
        }
    };

    if (loadingCheck) return <p className="text-center mt-10">Verificando sesión...</p>;

    return (
        <div className="max-w-md mx-auto mt-10 p-8 border rounded-xl shadow-lg bg-white">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Ingresa a tu cuenta</h1>
                <p className="text-gray-600">Accede a tu perfil de vendedor</p>
            </div>
            
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input 
                        type="email" 
                        placeholder="Correo electrónico" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        className="w-full border border-gray-300 p-3 pl-10 rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200" 
                    />
                </div>
                
                <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input 
                        type="password" 
                        placeholder="Contraseña" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        className="w-full border border-gray-300 p-3 pl-10 rounded-lg focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200" 
                    />
                </div>
                
                <button 
                    type="submit" 
                    className="bg-yellow-500 text-gray-900 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition duration-200"
                >
                    Iniciar sesión
                </button>
            </form>
            
            {message && (
                <div className={`mt-4 p-3 rounded-lg text-center ${
                    message.startsWith("✅") ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                    {message}
                </div>
            )}

            <div className="mt-6 text-center">
                <p className="text-gray-600">
                    ¿No tienes cuenta?{" "}
                    <Link href="/register" className="text-blue-600 hover:underline font-semibold">
                        Regístrate aquí
                    </Link>
                </p>
            </div>
        </div>
    );
}