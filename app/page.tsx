// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Vehiculo } from "@/types/schema";
import { Search, MapPin, Gauge, DollarSign, Car } from "lucide-react"; 

export default function HomePage() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados de Filtro
  const [searchMarca, setSearchMarca] = useState<string>('');
  const [searchCiudad, setSearchCiudad] = useState<string>('');

  const fetchVehiculos = async () => {
    setLoading(true);
    setError(null);

    // 1. Inicia la consulta a la tabla 'vehiculos'
    let query = supabase
      .from("vehiculos")
      .select(`
        id, marca, modelo, año, precio, kilometraje, 
        transmision, color, ciudad, estado, imagenes 
      `)
      .eq('estado', 'activo'); // Solo vehículos activos visibles

    // 2. Aplica Filtros
    if (searchMarca) {
      query = query.ilike('marca', `%${searchMarca}%`);
    }
    if (searchCiudad) {
      query = query.ilike('ciudad', `%${searchCiudad}%`);
    }

    // 3. Ordena y ejecuta
    const { data, error } = await query.order('creado_en', { ascending: false });

    if (error) {
      setError("❌ Error al cargar vehículos: " + error.message);
      setVehiculos([]);
    } else {
        // Mapeamos el array 'imagenes' a la propiedad 'imagen_url' para el tipo Vehiculo
        const formattedData: Vehiculo[] = data.map((v: any) => ({
            ...v,
            imagen_url: v.imagenes && v.imagenes.length > 0 ? v.imagenes[0] : 'https://via.placeholder.com/300x200?text=No+Image',
            titulo: `${v.marca} ${v.modelo} ${v.año}` 
        }));
      setVehiculos(formattedData);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchVehiculos();
  }, [searchMarca, searchCiudad]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-extrabold text-center my-6 text-blue-900 flex items-center justify-center">
        <Car className="w-8 h-8 mr-2 text-yellow-500" />
        Tu Próximo Carro en Colombia
      </h1>
      
      {/* Sección de Filtros/Búsqueda (Siguiendo un estilo tipo TuCarro) */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-8 flex flex-col md:flex-row gap-4">
        <input type="text" placeholder="Marca (Ej: Toyota, Mazda)" value={searchMarca} onChange={(e) => setSearchMarca(e.target.value)} className="flex-1 border p-3 rounded-lg focus:ring-yellow-500 focus:border-yellow-500" />
        <input type="text" placeholder="Ciudad (Ej: Bogotá, Medellín)" value={searchCiudad} onChange={(e) => setSearchCiudad(e.target.value)} className="flex-1 border p-3 rounded-lg focus:ring-yellow-500 focus:border-yellow-500" />
        <button onClick={fetchVehiculos} className="md:mt-0 bg-yellow-500 text-gray-900 font-bold py-3 px-6 rounded-lg hover:bg-yellow-600 transition flex items-center justify-center">
            <Search className="w-5 h-5 mr-2" /> Buscar
        </button>
      </div>

      {/* Resultados y Listado de Tarjetas */}
      {loading && <p className="text-center text-lg mt-10">Cargando anuncios...</p>}
      {error && <p className="text-center text-red-600 mt-10">{error}</p>}
      
      {!loading && vehiculos.length === 0 && (
          <p className="text-center text-gray-500 text-xl mt-10">
              No se encontraron vehículos que coincidan.
          </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {vehiculos.map((v) => (
          <div key={v.id} className="bg-white rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition duration-300">
            <img 
                src={v.imagen_url} 
                alt={v.titulo} 
                className="w-full h-48 object-cover" 
            />
            <div className="p-4">
              <h2 className="text-xl font-bold text-gray-900 mb-2">{v.titulo}</h2>
              <p className="text-2xl font-extrabold text-green-600 mb-3 flex items-center">
                <DollarSign className="w-5 h-5 mr-1" />
                {v.precio.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
              </p>
              <div className="flex justify-between text-sm text-gray-600 border-t pt-3">
                <span className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1 text-blue-500" />
                  {v.ciudad}
                </span>
                <span className="flex items-center">
                  <Gauge className="w-4 h-4 mr-1 text-red-500" />
                  {v.kilometraje.toLocaleString('es-CO')} km
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}