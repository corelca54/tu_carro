// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Vehiculo } from "@/types/schema";
import Link from "next/link";
import { ChevronRight, MapPin, Gauge } from "lucide-react"; 

// Datos del carrusel con tus rutas de imágenes locales
const NISSAN_SLIDES = [
    {
        id: 0,
        title: "ES TU MOMENTO DE ESTRENAR LA EMOCIÓN",
        subtitle: "Vehículos y Camionetas. 65 años en Colombia.",
        bgUrl: "/innovacion.webp", 
        buttonText: "CONOCE MÁS",
        link: "https://www.nissan.com.co/estrenar-emocion"
    },
    {
        id: 1,
        title: "X-TRAIL E-POWER: PODER PARA CADA HOY",
        subtitle: "Impulso 100% eléctrico que recargas con gasolina.",
        bgUrl: "/nissan_xtrail.webp",
        buttonText: "VER X-TRAIL",
        link: "https://www.nissan.com.co/modelos/x-trail-e-power"
    },
    {
        id: 2,
        title: "NUEVO KICKS: IMPULSO QUE TE MUEVE",
        subtitle: "Descubre la tecnología y el diseño del Kicks.",
        bgUrl: "/nissan_kicks.webp",
        buttonText: "VER MODELO KICKS",
        link: "https://www.nissan.com.co/modelos/kicks"
    },
];
const SLIDE_INTERVAL = 5000; // 5 segundos

// Datos de marcas con tus rutas de archivos en /public
const PRINCIPAL_BRANDS = [
    { name: "Nissan", logo: "/Nissan_logo.png", link: "/?marca=Nissan" },
    { name: "Volkswagen", logo: "/Volswaguen_logo.png", link: "/?marca=Volkswagen" },
    { name: "Chevrolet", logo: "/Chevrolet_logo.png", link: "/?marca=Chevrolet" },
    { name: "Renault", logo: "/Renault_logo.jpeg", link: "/?marca=Renault" },
    { name: "Toyota", logo: "/Toyota_logo.png", link: "/?marca=Toyota" },
];


export default function HomePage() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0); 
  
  const availableBrands = ["Toyota", "Mazda", "Chevrolet", "Nissan", "Ford"];
  const [searchMarca, setSearchMarca] = useState<string>('');

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === NISSAN_SLIDES.length - 1 ? 0 : prev + 1));
  };
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? NISSAN_SLIDES.length - 1 : prev - 1));
  };
  const currentData = NISSAN_SLIDES[currentSlide];
  
  // FUNCIÓN PARA CARRUSEL AUTOMÁTICO
  useEffect(() => {
    const autoSlide = setInterval(() => {
      nextSlide();
    }, SLIDE_INTERVAL);
    
    return () => clearInterval(autoSlide); // Limpiar al desmontar
  }, [currentSlide]); 

  const fetchVehiculos = async () => {
    setLoading(true);
    setError(null);
    let query = supabase
      .from("vehiculos")
      .select(`id, marca, modelo, año, precio, kilometraje, transmision, color, ciudad, estado, imagenes`)
      .eq('estado', 'activo'); 
    
    if (searchMarca) { query = query.ilike('marca', `%${searchMarca}%`); }
    const { data, error } = await query.order('creado_en', { ascending: false }).limit(5);

    if (error) {
      setError("❌ Error al cargar vehículos: " + error.message); 
      setVehiculos([]);
    } else {
        const formattedData: Vehiculo[] = data.map((v: any) => ({
            ...v,
            imagen_url: v.imagenes && v.imagenes.length > 0 ? v.imagenes[0] : 'https://via.placeholder.com/300x200?text=IMAGEN+NO+DISPONIBLE', 
            titulo: `${v.marca} ${v.modelo} ${v.año}` 
        }));
      setVehiculos(formattedData);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchVehiculos();
  }, [searchMarca]);


  return (
    <div className="w-full bg-white pb-12"> 
        
        {/* ======================================================= */}
        {/* SECCIÓN 1: CARRUSEL DE ANCHO COMPLETO Y BARRA DE BÚSQUEDA */}
        {/* ======================================================= */}
        
        {/* 1.1 CARRUSEL DE ANCHO COMPLETO */}
        <section className="w-full relative h-[400px] bg-gray-900 overflow-hidden my-0">
            
            {/* Fondo con URL de Imagen */}
            <div 
                key={currentData.id}
                className="absolute inset-0 bg-cover bg-center transition-opacity duration-500 ease-in-out fade-in" 
                style={{ 
                    backgroundImage: `url('${currentData.bgUrl}')`,
                    filter: 'brightness(90%)' 
                }}
            ></div>
            
            {/* Contenedor de Texto y Botón */}
            <div className="absolute inset-0 flex items-center p-10 z-20">
                <div key={currentData.title} className="text-white p-6 w-full md:w-1/2 fade-in" style={{ maxWidth: '1215px', margin: '0 auto', marginLeft: '5%' }}>
                    
                    <p className="text-sm font-semibold fade-in">INNOVACIÓN JAPONESA</p>
                    <h2 className="text-4xl font-extrabold mb-2 fade-in">{currentData.title}</h2>
                    <p className="text-lg mb-4 fade-in">{currentData.subtitle}</p>
                    
                    {/* ENLACE EXTERNO: Botón que lleva a la página del anuncio */}
                    <a 
                        href={currentData.link} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-block mt-2 bg-blue-600 text-white py-3 px-8 rounded-lg font-bold hover:bg-blue-700 transition"
                    >
                        {currentData.buttonText}
                    </a>
                    
                    <p className="text-xs mt-4">NISSAN LOGO | Aplicar términos y condiciones.</p>
                </div>
            </div>
            
            {/* Controles de carrusel */}
            <button onClick={prevSlide} className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full ml-4 shadow-lg hover:shadow-xl z-30"><ChevronRight className="w-6 h-6 rotate-180" /></button>
            <button onClick={nextSlide} className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full mr-4 shadow-lg hover:shadow-xl z-30"><ChevronRight className="w-6 h-6" /></button>
            
            {/* Indicadores */}
            <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
                {NISSAN_SLIDES.map((_, index) => (
                    <div key={index} className={`w-3 h-3 rounded-full cursor-pointer ${index === currentSlide ? 'bg-white' : 'bg-gray-400'}`} onClick={() => setCurrentSlide(index)}></div>
                ))}
            </div>
        </section>


        {/* Contenedor principal de la página (aplica max-width para el contenido) */}
        <div className="mx-auto" style={{ maxWidth: '1215px' }}>
            
            {/* 1.2 BARRA DE BÚSQUEDA FLOTANTE (Funcional) */}
            <div className="relative z-10 -mt-8 mx-4">
                <div className="bg-white p-4 shadow-xl border rounded-lg flex flex-wrap lg:flex-nowrap gap-4 items-center justify-center">
                    
                    {/* Filtros Funcionales */}
                    <select className="border p-2 rounded w-full lg:w-auto text-sm"><option>Carros y Camionetas</option></select>
                    <select value={searchMarca} onChange={(e) => setSearchMarca(e.target.value)} className="border p-2 rounded w-full lg:w-48 text-sm">
                        <option value="">Todas las marcas</option>
                        {availableBrands.map(brand => (<option key={brand} value={brand}>{brand}</option>))}
                    </select>
                    <select className="border p-2 rounded w-full lg:w-48 text-sm"><option>Modelo</option></select>

                    <div className="flex items-center ml-0 lg:ml-auto mr-0 lg:mr-4 text-sm w-full lg:w-auto">
                        <input type="checkbox" id="financiable" className="mr-2" />
                        <label htmlFor="financiable">Es financiable</label>
                    </div>

                    <button onClick={fetchVehiculos} className="bg-blue-600 text-white py-2 px-6 rounded-lg font-bold hover:bg-blue-700 transition w-full lg:w-auto">
                        Buscar
                    </button>
                </div>
            </div>

            {/* 1.3 SECCIÓN VENDER Y FINANCIAR (Funcionalidad añadida) */}
            <div className="flex flex-wrap lg:flex-nowrap gap-4 mb-10 mt-10 mx-4">
                <Link href="/vender" className="flex-1 bg-white p-10 shadow-lg border rounded-lg flex flex-col items-center justify-center hover:shadow-xl transition duration-300 w-full md:w-1/2 lg:w-auto">
                    <p className="text-sm font-semibold text-gray-500">RÁPIDO Y GRATIS</p>
                    <h2 className="text-3xl font-bold text-gray-800 mt-1">Vender</h2>
                </Link>
                {/* ENLACE FUNCIONAL A FINANCIAMIENTO */}
                <Link href="/financiamiento" className="flex-1 bg-white p-10 shadow-lg border rounded-lg flex flex-col items-center justify-center hover:shadow-xl transition duration-300 w-full md:w-1/2 lg:w-auto">
                    <p className="text-sm font-semibold text-gray-500">Carros y camionetas</p>
                    <h2 className="text-3xl font-bold text-gray-800 mt-1">Financiados</h2>
                </Link>
            </div>
            
            {/* 1.4 BANNER SOAT (Sección de publicidad intermedio) */}
            <div className="w-full h-32 bg-yellow-100 flex items-center justify-center relative my-8 rounded-lg overflow-hidden mx-4">
                <span className="text-2xl font-bold text-purple-800">COMPRA TU SOAT FÁCIL Y RÁPIDO.</span>
                {/* BOTÓN FUNCIONAL A SOAT (Simulación de página externa) */}
                <a href="https://www.mapfre.com.co" target="_blank" rel="noopener noreferrer" className="bg-purple-600 text-white py-2 px-4 rounded-lg ml-6 hover:bg-purple-700 transition">Comprar SOAT</a>
            </div>


            {/* 1.5 LISTADO DE VEHÍCULOS (Tarjetas) */}
            <div className="my-8 mx-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">CARROS Y CAMIONETAS PUBLICADOS HOY</h2>
                    <Link href="#" className="text-blue-600 text-sm font-semibold flex items-center">
                        Ver más <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            {/* Tarjetas de Listado (Grid de 5 columnas para desktop, 2 para mobile) */}
            {loading && <p className="text-center text-lg mt-10">Cargando anuncios...</p>}
            {error && <p className="text-center text-red-600 mt-10">{error}</p>}
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 px-4 pb-12">
                {vehiculos.map((v) => (
                    <Link href={`/vehiculos/${v.id}`} key={v.id} className="bg-white rounded-lg shadow-md overflow-hidden border hover:shadow-xl transition duration-300 block">
                        <img src={v.imagen_url} alt={v.titulo} className="w-full h-32 object-cover" />
                        <div className="p-3">
                            <h3 className="font-bold text-sm text-gray-900 line-clamp-1">{v.titulo}</h3>
                            <p className="text-lg font-extrabold text-green-600 mt-1">
                                {Number(v.precio).toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}
                            </p>
                            <div className="text-xs text-gray-500 mt-2 flex justify-between">
                                <span>{v.ciudad}</span>
                                <span>{v.kilometraje.toLocaleString('es-CO')} km</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>

        
        {/* ======================================================= */}
        {/* SECCIONES MODULARES INFERIORES (FUNCIONALES Y ESTILO CORREGIDO) */}
        {/* ======================================================= */}

        <section className="bg-gray-100 py-12 w-full mt-8">
            <div className="mx-auto" style={{ maxWidth: '1215px' }}>
                
                {/* 2.1 CONCESIONARIOS OFICIALES */}
                <h2 className="text-xl font-bold text-gray-800 mb-8 text-center">CONCESIONARIOS OFICIALES EN TU CARRO Y MERCADO LIBRE</h2>
                <div className="flex flex-wrap lg:flex-nowrap gap-8 px-4">
                    
                    {/* Tarjeta 1: Tus Concesionarios Preferidos (Añadimos imagen de fondo) */}
                    <Link href="https://sanautos.com.co/" target="_blank" rel="noopener noreferrer" className="flex-1 bg-white p-8 shadow-lg rounded-lg border w-full md:w-1/2 hover:shadow-xl transition relative overflow-hidden h-52">
                        <h3 className="text-xl font-semibold relative z-10">TUS CONCESIONARIOS PREFERIDOS ESTÁN EN TU CARRO</h3>
                        {/* IMAGEN DE FONDO (Ajuste de Contenedor) */}
                        <div className="absolute inset-0 opacity-70 bg-cover bg-right flex items-end justify-center">
                            <img src="/toyota_yaris.jpg" alt="Toyota Yaris" className="w-full h-full object-cover" /> 
                        </div>
                    </Link>
                    
                    {/* Tarjeta 2: Regístrate y Publica (Añadimos imagen de fondo) */}
                    <Link href="/vender" className="flex-1 bg-white p-8 shadow-lg rounded-lg border w-full md:w-1/2 hover:shadow-xl transition relative overflow-hidden h-52">
                         <h3 className="text-xl font-semibold relative z-10">REGÍSTRATE Y PUBLICA COMO CONCESIONARIO</h3>
                        {/* IMAGEN DE FONDO (Ajuste de Contenedor) */}
                        <div className="absolute inset-0 opacity-70 bg-cover bg-right flex items-end justify-center">
                            <img src="./ktm_adventure.png" alt="KTM Adventure" className="w-full h-full object-cover" />
                        </div>
                    </Link>
                </div>

                {/* 2.2 COMPLEMENTARIOS / ACCESORIOS (Funcionalidad añadida) */}
                <h2 className="text-xl font-bold text-gray-800 mt-12 mb-8 text-center">COMPLEMENTARIOS</h2>
                <div className="flex flex-wrap lg:flex-nowrap gap-4 px-4">
                    
                    {/* Complementario 1: Vehículos (Encuentra lo Mejor) */}
                    <a href="https://lujosyaccesoriostincars.com/" target="_blank" rel="noopener noreferrer" className="flex-1 h-64 text-white p-6 rounded-lg w-full md:w-1/3 hover:shadow-xl transition relative overflow-hidden" style={{ backgroundColor: '#2f436e' }}>
                        <p className="text-2xl font-bold mt-2 relative z-10">ENCUENTRA LO MEJOR PARA TU VEHÍCULO</p>
                        {/* IMAGEN DE FONDO (Simulación de accesorios/casco) */}
                        <div className="absolute inset-0 opacity-50 bg-cover bg-right flex items-end justify-center">
                             <img src="./casco.jpg" alt="Casco" className="w-full h-full object-cover" />
                        </div>
                    </a>
                    
                    {/* Complementario 2: Moto */}
                    <a href="https://www.mercadolibre.com.co" target="_blank" rel="noopener noreferrer" className="flex-1 h-64 text-white p-6 rounded-lg w-full md:w-1/3 hover:shadow-xl transition relative overflow-hidden" style={{ backgroundColor: '#212529' }}>
                        <p className="text-2xl font-bold mt-2 relative z-10">TU MOTO Y TODO LO QUE NECESITAS ESTÁ AQUÍ</p>
                        {/* IMAGEN DE FONDO (Simulación de moto) */}
                        <div className="absolute inset-0 opacity-50 bg-cover bg-right flex items-end justify-center">
                            <img src="./accesorios.webp" alt="Moto accesorios" className="w-full h-full object-cover" />
                        </div>
                    </a>
                    
                    {/* Complementario 3: Financiación */}
                    <Link href="https://www.bbva.com.co/" className="flex-1 h-64 text-white p-6 rounded-lg w-full md:w-1/3 hover:shadow-xl transition relative overflow-hidden" style={{ backgroundColor: '#b88d3e' }}>
                        <p className="text-2xl font-bold mt-2 relative z-10">CONOCE LAS OPCIONES PARA FINANCIAR</p>
                        {/* IMAGEN DE FONDO (Simulación de dinero/tarjeta) */}
                        <div className="absolute inset-0 opacity-50 bg-cover bg-right flex items-end justify-center">
                            <img src="./Financiar.jpg" alt="Financiación" className="w-full h-full object-cover" />
                        </div>
                    </Link>
                </div>
            </div>
        </section>
        
        {/* 2.3 MARCAS Y LLANTAS (Hacemos funcional el click de los logos) */}
        <section className="bg-white py-12">
            <div className="mx-auto" style={{ maxWidth: '1215px' }}>
                <h2 className="text-xl font-bold text-gray-800 mb-8 text-center">PRINCIPALES MARCAS</h2>
                <div className="flex justify-center gap-10 px-4 items-center">
                    {PRINCIPAL_BRANDS.map(brand => (
                        // Hacemos el logo clicable que lleva a la página de búsqueda
                        <Link key={brand.name} href={brand.link} className="h-20 hover:opacity-75 transition cursor-pointer">
                           <img src={brand.logo} alt={`${brand.name} Logo`} className="h-full w-auto object-contain grayscale" />
                        </Link>
                    ))}
                </div>
                
                <h2 className="text-xl font-bold text-gray-800 mt-12 mb-8 text-center">LAS MEJORES LLANTAS PARA TU VEHÍCULO</h2>
                <div className="flex justify-center gap-10 px-4 items-center">
                    {/* TOYO TIRES */}
                    <a href="https://www.toyotires.com/" target="_blank" rel="noopener noreferrer" className="h-20 hover:opacity-75 transition cursor-pointer">
                        <img src="/Toyotires.png" alt="Toyo Tires Logo" className="h-full w-auto object-contain grayscale" />
                    </a>
                    {/* MICHELIN TIRES */}
                    <a href="https://www.michelin.com/" target="_blank" rel="noopener noreferrer" className="h-20 hover:opacity-75 transition cursor-pointer">
                        <img src="/michelin-logo-2-1.png" alt="Michelin Tires Logo" className="h-full w-auto object-contain grayscale" />
                    </a>
                </div>
            </div>
        </section>

    </div>
  );
}