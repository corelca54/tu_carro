// types/schema.ts

// 1. Tipo para la tabla 'usuarios' (equivalente a Estudiante en la guía)
export interface Usuario {
  id: string;
  nombre_completo: string; // mi columna es nombre_completo
  correo: string;
  telefono: string | null;
  ciudad: string | null;
}

// 2. Tipo para la tabla 'vehiculos' (equivalente a Actividad en la guía)
export interface Vehiculo {
  id: string;
  usuario_id: string;
  marca: string;
  modelo: string;
  año: number;
  precio: number;
  kilometraje: number;
  transmision: 'manual' | 'automatica';
  ciudad: string;
  descripcion: string | null;
  // Usamos string porque solo mostraremos la primera imagen del array 'imagenes'
  imagen_url: string; 
  titulo: string;
}