// app/layout.tsx (versión mejorada)
"use client"; 

import type { ReactNode } from "react";
import "./globals.css";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { Search, MapPin, Heart, Bell, MessageCircle, User, Car } from "lucide-react"; 

export default function RootLayout({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser(); 
      setUser(data.user ?? null);
      setLoading(false);
    };
    checkAuth();
    
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  if (loading) return (
    <html lang="es">
      <body className="bg-gray-100 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando tucarro.com.co</p>
        </div>
      </body>
    </html>
  );

  return (
    <html lang="es">
      <body className="bg-gray-100">
        {/* HEADER SUPERIOR AMARILLO */}
        <header className="bg-yellow-400 shadow-sm">
          <div className="max-w-7xl mx-auto">
            {/* PRIMERA FILA: Logo, búsqueda y usuario */}
            <div className="flex items-center justify-between px-4 py-3">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-2">
                <div className="text-gray-900">
                  <span className="text-sm font-bold block leading-3">MERCADO</span>
                  <span className="text-2xl italic font-black">tucarro</span>
                </div>
              </Link>

              {/* Barra de búsqueda */}
              <div className="flex-1 max-w-2xl mx-8">
                <div className="relative flex items-center bg-white rounded-md shadow-sm h-12">
                  <input 
                    type="text" 
                    placeholder="Buscar en tucarro.com" 
                    className="w-full px-4 py-3 rounded-l-md focus:outline-none text-gray-700 text-sm"
                  />
                  <button className="bg-gray-100 hover:bg-gray-200 px-6 h-12 flex items-center justify-center border-l rounded-r-md">
                    <Search className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Navegación usuario */}
              <div className="flex items-center space-x-4">
                {user ? (
                  <>
                    <button className="flex flex-col items-center text-xs text-gray-700 hover:text-blue-600">
                      <MessageCircle className="w-6 h-6" />
                      <span>Mensajes</span>
                    </button>
                    <button className="flex flex-col items-center text-xs text-gray-700 hover:text-blue-600">
                      <Bell className="w-6 h-6" />
                      <span>Notificaciones</span>
                    </button>
                    <button className="flex flex-col items-center text-xs text-gray-700 hover:text-blue-600">
                      <Heart className="w-6 h-6" />
                      <span>Favoritos</span>
                    </button>
                    <Link href="/user" className="flex flex-col items-center text-xs text-gray-700 hover:text-blue-600">
                      <User className="w-6 h-6" />
                      <span>Mi cuenta</span>
                    </Link>
                  </>
                ) : (
                  <div className="flex items-center space-x-4 text-sm">
                    <Link href="/register" className="text-gray-700 hover:text-blue-600">Crea tu cuenta</Link>
                    <Link href="/login" className="text-gray-700 hover:text-blue-600">Ingresa</Link>
                  </div>
                )}
              </div>
            </div>

            {/* SEGUNDA FILA: Categorías y ubicación */}
            <div className="flex items-center justify-between px-4 py-2 bg-yellow-500 border-t border-yellow-600">
              <div className="flex items-center space-x-6 text-sm">
                <Link href="/" className="text-gray-900 font-semibold hover:text-blue-800 flex items-center">
                  <Car className="w-4 h-4 mr-1" />
                  Carros y Camionetas
                </Link>
                <Link href="/motos" className="text-gray-700 hover:text-blue-800">Motos</Link>
                <Link href="/accesorios" className="text-gray-700 hover:text-blue-800">Accesorios</Link>
                <Link href="/soat" className="text-gray-700 hover:text-blue-800">SOAT</Link>
                <Link href="/financiamiento" className="text-gray-700 hover:text-blue-800">Financiamiento</Link>
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-700">
                <MapPin className="w-4 h-4" />
                <span>Bogotá</span>
                <Link href="/vender" className="ml-4 bg-gray-900 text-white px-4 py-2 rounded-md font-semibold hover:bg-gray-800">
                  Vender
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="min-h-screen">{children}</main>

        {/* FOOTER MEJORADO */}
        <footer className="bg-white border-t mt-12">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Tucarro</h3>
                <ul className="space-y-2 text-gray-600">
                  <li><Link href="/" className="hover:text-blue-600">Carros y Camionetas</Link></li>
                  <li><Link href="/motos" className="hover:text-blue-600">Motos</Link></li>
                  <li><Link href="/vender" className="hover:text-blue-600">Vender mi carro</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Ayuda</h3>
                <ul className="space-y-2 text-gray-600">
                  <li><Link href="/ayuda" className="hover:text-blue-600">Centro de ayuda</Link></li>
                  <li><Link href="/contacto" className="hover:text-blue-600">Contáctanos</Link></li>
                  <li><Link href="/pqr" className="hover:text-blue-600">PQR</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Legal</h3>
                <ul className="space-y-2 text-gray-600">
                  <li><Link href="/terminos" className="hover:text-blue-600">Términos y condiciones</Link></li>
                  <li><Link href="/privacidad" className="hover:text-blue-600">Privacidad</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Síguenos</h3>
                <div className="text-gray-600 text-xs">
                  <p>© 1999-2025 MercadoLibre Colombia LTDA.</p>
                  <p>NIT: 830.067394-6</p>
                  <p className="mt-2">Tucarro una marca de Mercado Libre</p>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}