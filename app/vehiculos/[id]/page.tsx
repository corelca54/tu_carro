// app/vehiculos/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Vehiculo } from "@/types/schema";
import Link from "next/link";
import { ArrowLeft, Star, MapPin, Calendar, Gauge, Fuel } from "lucide-react";

export default function VehiculoDetailPage() {
  const params = useParams();
  const [vehiculo, setVehiculo] = useState<Vehiculo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehiculo = async () => {
      const { data, error } = await supabase
        .from("vehiculos")
        .select(`
          *,
          usuarios(nombre_completo, telefono, ciudad)
        `)
        .eq('id', params.id)
        .single();

      if (data) {
        setVehiculo(data);
      }
      setLoading(false);
    };

    fetchVehiculo();
  }, [params.id]);

  if (loading) return <div className="text-center py-12">Cargando...</div>;
  if (!vehiculo) return <div className="text-center py-12">Vehículo no encontrado</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver a la búsqueda
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Galería de imágenes */}
        <div className="lg:col-span-2">
          <img 
            src={vehiculo.imagen_url} 
            alt={vehiculo.titulo}
            className="w-full h-96 object-cover rounded-xl shadow-lg"
          />
        </div>

        {/* Información del vehículo */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{vehiculo.titulo}</h1>
          <p className="text-3xl font-black text-green-600 mb-4">
            ${vehiculo.precio?.toLocaleString('es-CO')}
          </p>

          <div className="space-y-3 mb-6">
            <div className="flex items-center text-gray-600">
              <MapPin className="w-5 h-5 mr-2" />
              <span>{vehiculo.ciudad}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Calendar className="w-5 h-5 mr-2" />
              <span>Año: {vehiculo.año}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Gauge className="w-5 h-5 mr-2" />
              <span>{vehiculo.kilometraje?.toLocaleString('es-CO')} km</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Fuel className="w-5 h-5 mr-2" />
              <span>Transmisión: {vehiculo.transmision === 'automatica' ? 'Automática' : 'Manual'}</span>
            </div>
          </div>

          <button className="w-full bg-yellow-500 text-gray-900 py-3 rounded-lg font-bold hover:bg-yellow-400 transition mb-4">
            Contactar al vendedor
          </button>
          
          <button className="w-full border border-yellow-500 text-yellow-500 py-3 rounded-lg font-bold hover:bg-yellow-50 transition flex items-center justify-center">
            <Star className="w-5 h-5 mr-2" />
            Agregar a favoritos
          </button>
        </div>
      </div>
    </div>
  );
}