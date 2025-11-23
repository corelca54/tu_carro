// app/layout.tsx
"use client"; 

import type { ReactNode } from "react";
import "./globals.css";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
// Importaciones requeridas para iconos y funcionalidad
import { Search, MapPin, Heart, Bell, MessageCircle, User, Car, Menu, X, Send, Handshake } from "lucide-react"; 
import { useRouter } from "next/navigation"; 

// Componente de Menú Móvil (Se mantiene igual)
const MobileMenu = ({ user, isOpen, onClose }: { user: any, isOpen: boolean, onClose: () => void }) => {
    const router = useRouter();
    
    const handleLogout = async () => {
        await supabase.auth.signOut();
        onClose();
        router.push("/login");
    };

    return (
        <div className={`fixed inset-0 z-40 bg-white shadow-xl transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'} lg:hidden`}>
            <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-xl font-bold">{user ? user.email : "Menú"}</h2>
                <button onClick={onClose} className="p-2"><X className="w-6 h-6" /></button>
            </div>
            
            <nav className="flex flex-col p-4 space-y-4 text-lg">
                <Link href="/" onClick={onClose} className="hover:text-blue-600 flex items-center"><Car className="w-5 h-5 mr-2" /> Carros y Camionetas</Link>
                <Link href="/motos" onClick={onClose} className="hover:text-blue-600 ml-7">Motos</Link>
                <Link href="/accesorios" onClick={onClose} className="hover:text-blue-600 ml-7">Accesorios</Link>
                <Link href="/soat" onClick={onClose} className="hover:text-blue-600 ml-7">SOAT</Link>
                <Link href="/financiamiento" onClick={onClose} className="hover:text-blue-600 ml-7">Financiamiento</Link>
                
                <hr className="my-2" />

                {user ? (
                    <>
                        <Link href="/user" onClick={onClose} className="hover:text-blue-600 flex items-center"><User className="w-5 h-5 mr-2" /> Mi Cuenta</Link>
                        <Link href="/vender" onClick={onClose} className="bg-yellow-400 text-center py-2 rounded font-semibold">Vender mi Vehículo</Link>
                        <button onClick={handleLogout} className="text-left text-red-600 font-semibold">Cerrar Sesión</button>
                    </>
                ) : (
                    <>
                        <Link href="/register" onClick={onClose} className="hover:text-blue-600">Crea tu cuenta</Link>
                        <Link href="/login" onClick={onClose} className="hover:text-blue-600">Ingresa</Link>
                        <Link href="/vender" onClick={onClose} className="bg-yellow-400 text-center py-2 rounded font-semibold">Publica tu Vehículo</Link>
                    </>
                )}
            </nav>
        </div>
    );
};


export default function RootLayout({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null); 
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Estado para el menú hamburguesa

  // Lógica de autenticación
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser(); 
      setUser(data.user ?? null);
      setLoading(false);
    };
    checkAuth();
    
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser (session?.user ?? null);
    });
    
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) return (
    <html lang="es">
      <body className="bg-gray-100 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="loading-spinner mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando tucarro.com.co</p>
        </div>
      </body>
    </html>
  );

  return (
    <html lang="es">
      <body className="bg-white">
        
        {/* Componente del Menú Móvil */}
        <MobileMenu user={user} isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

        {/* ======================================================= */}
        {/* HEADER IDÉNTICO Y RESPONSIVE (Desktop y Mobile) */}
        {/* ======================================================= */}
        <header className="shadow-sm">
          {/* BARRA PRINCIPAL (Color: #FFE000, Alto: 70px) */}
          <div style={{ backgroundColor: '#FFE000', height: '70px' }} className="flex items-center">
            <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between w-full">
              
              {/* Lado Izquierdo: Logo, Buscador y Botón Menú (Mobile) */}
              <div className="flex items-center space-x-4 w-full lg:w-auto">
                
                {/* BOTÓN MENÚ HAMBURGUESA (Móvil) */}
                <button 
                    onClick={() => setIsMobileMenuOpen(true)} 
                    className="p-2 lg:hidden"
                >
                    <Menu className="w-6 h-6 text-gray-800" />
                </button>

                {/* LOGO COMPUESTO: MERCADO LIBRE + TUCARRO (CORREGIDO) */}
                <div className="flex items-center relative pr-4">
                    
                    {/* ENLACE 1: LOGO MERCADO LIBRE (ENLACE EXTERNO) */}
                    <a href="https://www.mercadolibre.com.co/" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 pr-1 border-r border-gray-600">
                        {/* Escudo/Icono ML */}
                        <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-blue-800 mr-1">
                            <Handshake className="w-4 h-4 text-white" style={{ strokeWidth: 3 }} />
                        </div>
                        {/* Texto MERCADO LIBRE */}
                        <div className="leading-none text-gray-900">
                             <span className="text-[10px] font-bold block tracking-tight">MERCADO</span>
                             <span className="text-[10px] font-bold block tracking-tight">LIBRE</span>
                        </div>
                    </a>
                    
                    {/* ENLACE 2: TUCARRO (ENLACE INTERNO) */}
                    <Link href="/" className="text-2xl italic font-black tracking-tight text-gray-900 ml-2">tucarro</Link>
                </div>

                {/* Centro: Barra de Búsqueda (Ajustada para ser más larga en desktop) */}
                <div className="flex-1 max-w-xl hidden lg:flex bg-white rounded-sm shadow-sm h-10">
                    <input 
                      type="text" 
                      placeholder="Buscar en tucarro.com" 
                      className="w-full px-4 py-2 rounded-l-sm focus:outline-none text-gray-700 text-sm placeholder-gray-400"
                    />
                    <button className="bg-gray-100 hover:bg-gray-200 px-4 h-10 flex items-center justify-center border-l border-gray-300 rounded-r-sm transition-colors">
                      <Search className="w-4 h-4 text-gray-500" />
                    </button>
                </div>
              </div>

              {/* Lado Derecho: Navegación usuario (Desktop) */}
              <div className="hidden lg:flex items-center space-x-4">
                {user ? (
                  <div className="flex items-center space-x-4 text-xs">
                    <Link href="#" className="flex flex-col items-center text-gray-700 hover:text-blue-600 transition-colors"><MessageCircle className="w-5 h-5 mb-1" /><span>Mensajes</span></Link>
                    <Link href="#" className="flex flex-col items-center text-gray-700 hover:text-blue-600 transition-colors"><Bell className="w-5 h-5 mb-1" /><span>Notificaciones</span></Link>
                    <Link href="#" className="flex flex-col items-center text-gray-700 hover:text-blue-600 transition-colors"><Heart className="w-5 h-5 mb-1" /><span>Favoritos</span></Link>
                    <Link href="/user" className="flex flex-col items-center text-gray-700 hover:text-blue-600 transition-colors"><User className="w-5 h-5 mb-1" /><span>Mi cuenta</span></Link>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4 text-sm font-semibold">
                    <Link href="/register" className="text-gray-700 hover:text-blue-600 transition-colors">Crea tu cuenta</Link>
                    <Link href="/login" className="text-gray-700 hover:text-blue-600 transition-colors">Ingresa</Link>
                    <Link href="/ayuda" className="text-gray-700 hover:text-blue-600 transition-colors">Ayuda / PQR</Link>
                    <Link href="/contacto" className="text-gray-700 hover:text-blue-600 transition-colors">Contacto</Link>
                  </div>
                )}
                
                {/* Botón Publicar Vehículo Destacado */}
                <Link 
                    href="/vender" 
                    style={{ backgroundColor: '#FFD900' }}
                    className="text-gray-900 px-4 py-2 rounded-sm font-bold border border-gray-900 text-sm transition"
                >
                    Publica tu Vehículo
                </Link>
              </div>
            </div>
          </div>

          {/* Tercera línea - Navegación de Categorías (Desktop Only) */}
          <div className="bg-yellow-400 py-1 hidden lg:block" style={{ backgroundColor: '#FFE000' }}>
            <div className="max-w-7xl mx-auto px-4 py-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6 text-sm">
                  <Link href="/" className="text-gray-900 font-semibold hover:text-blue-800 flex items-center transition-colors">
                    <Car className="w-4 h-4 mr-1" /> Carros y Camionetas
                  </Link>
                  <Link href="/motos" className="text-gray-700 hover:text-blue-800 transition-colors">Motos</Link>
                  <Link href="/accesorios" className="text-gray-700 hover:text-blue-800 transition-colors">Accesorios</Link>
                  <Link href="/soat" className="text-gray-700 hover:text-blue-800 transition-colors">SOAT</Link>
                  <Link href="/financiamiento" className="text-gray-700 hover:text-blue-800 transition-colors">Financiamiento</Link>
                </div>

                {/* Botón Destacado Vender */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1 text-sm text-gray-700">
                    <MapPin className="w-4 h-4" />
                    <span>Bogotá</span>
                  </div>
                  <Link 
                    href="/vender" 
                    className="bg-gray-900 text-white px-4 py-2 rounded-sm font-semibold hover:bg-gray-800 transition-colors text-sm"
                  >
                    Vender
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="min-h-screen">{children}</main>

        {/* FOOTER */}
        <footer className="bg-white border-t mt-12">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Tucarro</h3>
                <ul className="space-y-2 text-gray-600">
                  <li><Link href="/" className="hover:text-blue-600 transition-colors">Carros y Camionetas</Link></li>
                  <li><Link href="/motos" className="hover:text-blue-600 transition-colors">Motos</Link></li>
                  <li><Link href="/vender" className="hover:text-blue-600 transition-colors">Vender mi carro</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Ayuda</h3>
                <ul className="space-y-2 text-gray-600">
                  <li><Link href="/ayuda" className="hover:text-blue-600 transition-colors">Centro de ayuda</Link></li>
                  <li><Link href="/contacto" className="hover:text-blue-600 transition-colors">Contáctanos</Link></li>
                  <li><Link href="/pqr" className="hover:text-blue-600 transition-colors">PQR</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Legal</h3>
                <ul className="space-y-2 text-gray-600">
                  <li><Link href="/terminos" className="hover:text-blue-600 transition-colors">Términos y condiciones</Link></li>
                  <li><Link href="/privacidad" className="hover:text-blue-600 transition-colors">Privacidad</Link></li>
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