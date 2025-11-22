// app/user/page.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient"; 
import { useRouter } from "next/navigation";
import { Usuario } from "@/types/schema"; 
import { LogOut, User as UserIcon, Save, Phone, MapPin } from "lucide-react"; 

export default function UsuarioPage() {
    const router = useRouter();
    const [usuario, setUsuario] = useState<Usuario | null>(null); 
    const [nombre, setNombre] = useState<string>("");
    const [telefono, setTelefono] = useState<string>("");
    const [ciudad, setCiudad] = useState<string>("");
    const [mensaje, setMensaje] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // Restricción de página (Paso 17 de la guía)
    useEffect(() => {
        const checkUser = async () => {
            const { data } = await supabase.auth.getUser();
            if (!data.user) {
                router.push("/login"); // Redirige a login si no hay sesión
            } else {
                fetchUsuario();
            }
        };
        checkUser();
    }, [router]);
    
    // Cargar datos del usuario logueado (Paso 13 de la guía)
    const fetchUsuario = async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            setLoading(false);
            return;
        }

        const { data, error } = await supabase
            .from("usuarios") // Tu tabla de perfiles
            .select("*") 
            .eq("id", user.id) 
            .single();

        if (data) {
            setUsuario(data as Usuario);
            setNombre(data.nombre_completo); 
            setTelefono(data.telefono || "");
            setCiudad(data.ciudad || "");
        }
        setLoading(false);
    };

    // Actualizar datos del usuario (Paso 13 de la guía)
    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!usuario) return;

        const { error } = await supabase
            .from("usuarios")
            .update({ nombre_completo: nombre, telefono: telefono, ciudad: ciudad }) 
            .eq("id", usuario.id);

        if (error) {
            setMensaje("❌ Error al actualizar: " + error.message);
        } else {
            setMensaje("✅ Datos actualizados correctamente");
            fetchUsuario();
        }
    };

    // Cerrar sesión (Paso 16 de la guía)
    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    if (loading) return <p className="text-center mt-10">Cargando perfil...</p>;
    
    return (
        <div className="max-w-md mx-auto mt-10 p-6 border rounded-xl shadow-lg bg-white">
            <h1 className="text-2xl font-bold mb-6 text-center text-blue-800 flex items-center justify-center">
                <UserIcon className="w-6 h-6 mr-2" /> Mi Perfil
            </h1>
            
            {usuario ? (
                <form onSubmit={handleUpdate} className="flex flex-col gap-4">
                    {/* Nombre Completo */}
                    <div className="relative">
                        <UserIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre completo" required className="border p-3 pl-10 rounded-lg focus:border-blue-500 w-full" />
                    </div>
                    
                    {/* Teléfono */}
                    <div className="relative">
                        <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="Teléfono" className="border p-3 pl-10 rounded-lg focus:border-blue-500 w-full" />
                    </div>
                    
                    {/* Ciudad */}
                    <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input type="text" value={ciudad} onChange={(e) => setCiudad(e.target.value)} placeholder="Ciudad" className="border p-3 pl-10 rounded-lg focus:border-blue-500 w-full" />
                    </div>

                    {/* Correo (Solo lectura) */}
                    <input type="email" value={usuario.correo} readOnly className="border p-3 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed" />
                    
                    <button type="submit" className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center">
                        <Save className="w-5 h-5 mr-2" /> Guardar cambios
                    </button>
                    
                    <button type="button" onClick={handleLogout} className="bg-gray-400 text-white py-3 rounded-lg font-semibold hover:bg-gray-500 transition flex items-center justify-center mt-2">
                        <LogOut className="w-5 h-5 mr-2" /> Cerrar sesión
                    </button>
                </form>
            ) : (
                <p className="text-center text-red-500">No se pudo cargar la información del usuario.</p>
            )}
            
            {mensaje && (
                <p className={`mt-4 text-center font-medium ${mensaje.startsWith("✅") ? 'text-green-600' : 'text-red-600'}`}>
                    {mensaje}
                </p>
            )}
        </div>
    );
}