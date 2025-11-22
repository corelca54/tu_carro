// app/vender/page.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { Send, Car, MapPin, DollarSign } from "lucide-react"; 

// Tipo simplificado para listar los anuncios del usuario
interface VehiculoAnuncio {
    id: string;
    titulo: string; // Marca + Modelo + Año
    precio: number;
    ciudad: string;
    publicado_en: string;
    imagen_url: string;
}

export default function VenderPage() {
    const router = useRouter();
    
    // ESTADOS DEL FORMULARIO DE PUBLICACIÓN
    const [marca, setMarca] = useState("");
    const [modelo, setModelo] = useState("");
    const [año, setAño] = useState("");
    const [precio, setPrecio] = useState("");
    const [kilometraje, setKilometraje] = useState("");
    const [transmision, setTransmision] = useState<"manual" | "automatica">("manual");
    const [descripcion, setDescripcion] = useState("");
    const [ciudad, setCiudad] = useState("");
    const [imagenUrl, setImagenUrl] = useState("");

    // ESTADOS DE LA PÁGINA
    const [misVehiculos, setMisVehiculos] = useState<VehiculoAnuncio[]>([]);
    const [mensaje, setMensaje] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // FUNCIÓN DE RESTRICCIÓN DE PÁGINA (Paso 18 de la guía)
    useEffect(() => {
        const checkUser = async () => {
            const { data } = await supabase.auth.getUser();
            if (!data.user) {
                router.push("/login"); // Redirige si no está logueado
            } else {
                fetchMisVehiculos(data.user.id);
            }
        };
        checkUser();
    }, [router]);

    // FUNCIÓN PARA CARGAR LOS VEHÍCULOS DEL USUARIO ACTUAL (Similar a fetchActividades)
    const fetchMisVehiculos = async (userId: string) => {
        const { data, error } = await supabase
            .from("vehiculos")
            .select(`
                id, marca, modelo, año, precio, ciudad, 
                publicado_en, imagenes
            `)
            .eq("usuario_id", userId) 
            .order("publicado_en", { ascending: false });

        if (error) {
            console.error("Error al cargar vehículos:", error.message);
        } else if (data) {
            const formattedData: VehiculoAnuncio[] = data.map((v: any) => ({
                id: v.id,
                titulo: `${v.marca} ${v.modelo} ${v.año}`,
                precio: v.precio,
                ciudad: v.ciudad,
                publicado_en: v.publicado_en,
                imagen_url: v.imagenes && v.imagenes.length > 0 ? v.imagenes[0] : 'https://via.placeholder.com/300x200?text=No+Image',
            }));
            setMisVehiculos(formattedData);
        }
        setLoading(false);
    };

    // FUNCIÓN PARA PUBLICAR UN NUEVO VEHÍCULO (Similar a handleSubmit)
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setMensaje(null);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            setMensaje("Debes iniciar sesión para publicar un vehículo.");
            return;
        }

        // Insertar la nueva actividad en la base de datos (Paso 17 de la guía, adaptado)
        const { error } = await supabase
            .from("vehiculos")
            .insert([
                {
                    usuario_id: user.id, 
                    marca: marca,
                    modelo: modelo,
                    año: parseInt(año),
                    precio: parseFloat(precio),
                    kilometraje: parseInt(kilometraje),
                    transmision: transmision,
                    descripcion: descripcion,
                    ciudad: ciudad,
                    imagenes: [imagenUrl], 
                }
            ]);

        if (error) {
            setMensaje("❌ Error al publicar: " + error.message);
        } else {
            setMensaje("✅ Vehículo publicado correctamente");
            
            // Limpiar formulario
            setMarca(""); setModelo(""); setAño(""); setPrecio(""); setKilometraje("");
            setDescripcion(""); setCiudad(""); setImagenUrl("");
            
            fetchMisVehiculos(user.id); 
        }
    };

    if (loading) return <p className="text-center mt-10">Cargando...</p>;

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 space-y-10 bg-gray-50 rounded-xl shadow-2xl">
            <h1 className="text-3xl font-bold text-center text-blue-800">
                Publicar Nuevo Vehículo
            </h1>
            
            {mensaje && (
                <p className={`text-center font-medium p-3 rounded-lg ${mensaje.startsWith("✅") ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {mensaje}
                </p>
            )}

            {/* FORMULARIO DE PUBLICACIÓN */}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white rounded-xl border">
                
                <input type="text" placeholder="Marca (Ej: Mazda)" value={marca} onChange={(e) => setMarca(e.target.value)} required className="border p-3 rounded-lg focus:border-yellow-500" />
                <input type="text" placeholder="Modelo (Ej: CX-5)" value={modelo} onChange={(e) => setModelo(e.target.value)} required className="border p-3 rounded-lg focus:border-yellow-500" />
                
                <input type="number" placeholder="Año (Ej: 2022)" value={año} onChange={(e) => setAño(e.target.value)} required min="1900" max={new Date().getFullYear()} className="border p-3 rounded-lg focus:border-yellow-500" />
                <input type="number" placeholder="Precio (COP)" value={precio} onChange={(e) => setPrecio(e.target.value)} required min="1000000" className="border p-3 rounded-lg focus:border-yellow-500" />
                
                <input type="number" placeholder="Kilometraje (km)" value={kilometraje} onChange={(e) => setKilometraje(e.target.value)} required min="0" className="border p-3 rounded-lg focus:border-yellow-500" />
                <select value={transmision} onChange={(e) => setTransmision(e.target.value as "manual" | "automatica")} required className="border p-3 rounded-lg focus:border-yellow-500">
                    <option value="manual">Transmisión Manual</option>
                    <option value="automatica">Transmisión Automática</option>
                </select>
                
                <input type="text" placeholder="Ciudad (Ej: Bogotá)" value={ciudad} onChange={(e) => setCiudad(e.target.value)} required className="border p-3 rounded-lg focus:border-yellow-500" />
                <input type="url" placeholder="URL de la Imagen Principal" value={imagenUrl} onChange={(e) => setImagenUrl(e.target.value)} className="border p-3 rounded-lg focus:border-yellow-500" />

                <textarea placeholder="Descripción detallada del vehículo" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={3} className="border p-3 rounded-lg col-span-full focus:border-yellow-500" />
                
                <button type="submit" className="col-span-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center">
                    <Send className="w-5 h-5 mr-2" />
                    Publicar Carro
                </button>
            </form>

            {/* LISTADO DE MIS VEHÍCULOS */}
            <section>
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">Mis Anuncios Publicados</h2>
                
                {misVehiculos.length === 0 ? (
                    <p className="text-center text-gray-500">No has publicado ningún vehículo aún.</p>
                ) : (
                    <div className="space-y-4">
                        {misVehiculos.map((v) => (
                            <div key={v.id} className="flex items-center p-4 bg-white border rounded-lg shadow-sm">
                                <img src={v.imagen_url} alt={v.titulo} className="w-20 h-20 object-cover rounded-md mr-4" />
                                <div className="flex-grow">
                                    <h3 className="font-semibold text-lg">{v.titulo}</h3>
                                    <p className="text-xl font-bold text-yellow-600">${v.precio.toLocaleString('es-CO')}</p>
                                    <p className="text-sm text-gray-500 flex items-center mt-1">
                                        <MapPin className="w-4 h-4 mr-1" /> {v.ciudad}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}