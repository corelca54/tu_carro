// app/register/page.tsx
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient"; 
import { useRouter } from "next/navigation"; 
import Link from "next/link";
import { UserPlus, Mail, Lock, User } from "lucide-react";

export default function RegisterPage() {
    const [nombre, setNombre] = useState<string>(""); 
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [message, setMessage] = useState<string | null>(null);
    const [loadingCheck, setLoadingCheck] = useState(true);
    const router = useRouter(); 

    // Restricción Inversa (Si ya está logueado, redirige a /user)
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

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); 
        setMessage(null);

        // 1. Registrar usuario en Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                // Pasamos el nombre para que tu trigger lo use en 'usuarios'
                data: { nombre_completo: nombre }, 
            },
        });

        if (authError) {
            setMessage("❌ Error en registro: " + authError.message);
            return;
        }

        if (authData.user) {
            // Nota: Gracias a tu trigger, el perfil en 'usuarios' se crea automáticamente.
            setMessage("✅ Registro exitoso. Revisa tu correo para confirmar la cuenta.");
        } else {
            setMessage("¡Registro pendiente! Por favor, revisa tu correo electrónico.");
        }
    };

    if (loadingCheck) return <p className="text-center mt-10">Verificando sesión...</p>;

    return (
        <div className="max-w-sm mx-auto mt-10 p-6 border rounded-xl shadow-lg bg-white">
            <h1 className="text-2xl font-bold mb-6 text-center text-blue-800 flex items-center justify-center">
                <UserPlus className="w-6 h-6 mr-2" /> Crear Cuenta de Vendedor
            </h1>
            
            <form onSubmit={handleRegister} className="flex flex-col gap-4">
                
                <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input type="text" placeholder="Nombre Completo" value={nombre} onChange={(e) => setNombre(e.target.value)} required className="w-full border p-3 pl-10 rounded-lg focus:border-yellow-500" />
                </div>
                
                <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input type="email" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full border p-3 pl-10 rounded-lg focus:border-yellow-500" />
                </div>
                
                <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full border p-3 pl-10 rounded-lg focus:border-yellow-500" />
                </div>

                <button type="submit" className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                    Registrarse
                </button>
            </form>
            
            {message && <p className={`mt-4 text-center text-sm font-medium ${message.startsWith("✅") ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}

            <p className="mt-4 text-center text-sm">
                ¿Ya tienes cuenta?{" "}
                <Link href="/login" className="text-blue-600 hover:underline font-semibold">
                    Inicia sesión aquí
                </Link>
            </p>
        </div>
    );
}