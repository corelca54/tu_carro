// app/page.tsx (versión optimizada)
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Vehiculo } from "@/types/schema";
import Link from "next/link";
import { ChevronRight, Star, Shield, Zap } from "lucide-react"; 

export default function HomePage() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVehiculos = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from("vehiculos")
        .select(`
          id, marca, modelo, año, precio, kilometraje, 
          transmision, color, ciudad, estado, imagenes,
          usuarios(nombre_completo)
        `)
        .eq('estado', 'activo')
        .order('creado_en', { ascending: false })
        .limit(8);

      if (error) throw error;

      if (data) {
        const formattedData: Vehiculo[] = data.map((v: any) => ({
          ...v,
          imagen_url: v.imagenes && v.imagenes.length > 0 ? v.imagenes[0] : '/placeholder-car.jpg',
          titulo: `${v.marca} ${v.modelo} ${v.año}`,
          vendedor: v.usuarios?.nombre_completo || 'Vendedor'
        }));
        setVehiculos(formattedData);
      }
    } catch (err: any) {
      setError("Error al cargar vehículos: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehiculos();
  }, []);

  const marcas = ["NISSAN", "VOLKSWAGEN", "CHEVROLET", "RENAULT", "MAZDA", "TOYOTA", "KIA", "FORD"];
  const llantas = ["TOYO TIRES", "CHRANKOOK", "YOKHAMA", "KENDA"];

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      
      {/* BANNER PRINCIPAL NISSAN */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="max-w-2xl">
            <p className="text-yellow-300 text-sm font-semibold mb-2 uppercase tracking-wide">INNOVACIÓN JAPONESA</p>
            <h1 className="text-5xl font-black mb-6 leading-tight">ES TU MOMENTO DE ESTRENAR LA EMOCIÓN</h1>
            <p className="text-xl mb-8 text-blue-100">VEHÍCULOS Y CAMIONETAS<br />65 AÑOS EN COLOMBIA</p>
            <button className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg font-bold hover:bg-yellow-300 transition text-lg shadow-lg">
              CONOCE MÁS
            </button>
            <p className="text-xs mt-6 text-blue-200">
              Asignar términos y condiciones, consultinar en www.ntman.com.co
            </p>
          </div>
        </div>
      </section>

      {/* BARRA DE BÚSQUEDA AVANZADA */}
      <section className="max-w-7xl mx-auto px-4 -mt-10 relative z-10">
        <div className="bg-white rounded-xl shadow-2xl p-6 border border-gray-200">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-end">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo de vehículo</label>
              <select className="w-full border border-gray-300 p-3 rounded-lg focus:border-yellow-500">
                <option>Carros y Camionetas</option>
                <option>Motos</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Marca</label>
              <select className="w-full border border-gray-300 p-3 rounded-lg focus:border-yellow-500">
                <option>Todas las marcas</option>
                {marcas.map(marca => (
                  <option key={marca} value={marca}>{marca}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Modelo</label>
              <select className="w-full border border-gray-300 p-3 rounded-lg focus:border-yellow-500">
                <option>Todos los modelos</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <input type="checkbox" id="financiable" className="w-4 h-4 text-yellow-500" />
              <label htmlFor="financiable" className="text-sm font-semibold text-gray-700">Es financiable</label>
            </div>

            <button 
              onClick={fetchVehiculos} 
              className="bg-yellow-500 text-gray-900 py-3 px-6 rounded-lg font-bold hover:bg-yellow-400 transition w-full text-lg"
            >
              Buscar
            </button>
          </div>
        </div>
      </section>

      {/* SECCIÓN DE SERVICIOS */}
      <section className="max-w-7xl mx-auto px-4 mt-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-8 text-center border border-gray-200 hover:shadow-lg transition-shadow">
            <Zap className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <p className="text-sm font-semibold text-gray-500 mb-2">RÁPIDO Y GRATIS</p>
            <h2 className="text-2xl font-bold text-gray-800">Vender</h2>
          </div>
          <div className="bg-white rounded-xl p-8 text-center border border-gray-200 hover:shadow-lg transition-shadow">
            <Shield className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <p className="text-sm font-semibold text-gray-500 mb-2">Carros y camionetas</p>
            <h2 className="text-2xl font-bold text-gray-800">Financiados</h2>
          </div>
          <div className="bg-white rounded-xl p-8 text-center border border-gray-200 hover:shadow-lg transition-shadow">
            <Star className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <p className="text-sm font-semibold text-gray-500 mb-2">Seguro y confiable</p>
            <h2 className="text-2xl font-bold text-gray-800">Garantía</h2>
          </div>
        </div>
      </section>

      {/* BANNER SOAT */}
      <section className="max-w-7xl mx-auto px-4 mt-16">
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-8 text-white shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <h2 className="text-3xl font-black mb-2">COMPRA TU SOAT FÁCIL Y RÁPIDO.</h2>
              <p className="text-purple-200 font-semibold text-lg">MELISOATS SERVICES</p>
            </div>
            <button className="bg-white text-purple-700 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition text-lg shadow-lg">
              Comprar SOAT
            </button>
          </div>
        </div>
      </section>

      {/* VEHÍCULOS DESTACADOS */}
      <section className="max-w-7xl mx-auto px-4 mt-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-black text-gray-900">CARROS Y CAMIONETAS PUBLICADOS HOY</h2>
          <Link href="/vehiculos" className="text-blue-600 font-semibold flex items-center hover:text-blue-800">
            Ver todos <ChevronRight className="w-5 h-5 ml-1" />
          </Link>
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border animate-pulse">
                <div className="w-full h-48 bg-gray-300 rounded-t-lg"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                  <div className="flex justify-between">
                    <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-12 bg-red-50 rounded-xl">
            <p className="text-red-600 text-lg">{error}</p>
            <button 
              onClick={fetchVehiculos}
              className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
            >
              Reintentar
            </button>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {vehiculos.map((v) => (
            <Link href={`/vehiculos/${v.id}`} key={v.id} className="bg-white rounded-xl shadow-sm border hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="relative">
                <img 
                  src={v.imagen_url} 
                  alt={v.titulo} 
                  className="w-full h-48 object-cover rounded-t-xl" 
                />
                <button className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white">
                  <Star className="w-5 h-5 text-gray-600 hover:text-yellow-500" />
                </button>
                <div className="absolute bottom-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {v.ciudad}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">{v.titulo}</h3>
                <p className="text-xl font-black text-green-600 mb-3">
                  ${v.precio?.toLocaleString('es-CO')}
                </p>
                <div className="flex justify-between text-xs text-gray-500 border-t pt-3">
                  <span>{v.kilometraje?.toLocaleString('es-CO')} km</span>
                  <span>{v.transmision === 'automatica' ? 'Automática' : 'Manual'}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Resto de las secciones (marcas, concesionarios, llantas) se mantienen igual */}
      {/* ... */}
      
    </div>
  );
}