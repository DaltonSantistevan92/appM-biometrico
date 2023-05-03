export interface IntAdmin {
  status: boolean;
  message: string;
  data: Asistencia[];
}

export interface Asistencia {
  id: number;
  user_id: number;
  tipo_asistencia_id: number;
  tipo_registro_id: number;
  fecha: string;
  hora: string;
  estado: string;
  user: User;
  tipo_asistencia: Tipoasistencia;
  tipo_registro: Tiporegistro;
  ubicacion?: Ubicacion[];//asistencia
  asistencias_departamento?: Asistenciasdepartamento[];//asistencia
  asistencia_evento? : AsistenciaEvento[];//evento
}


export interface AsistenciaEvento {
    id: number;
    asistencia_id: number;
    evento_id: number;
    evento: Evento;
}

export interface Evento {
    id: number;
    nombre: string;
    fecha: Date;
    estado: string;
}


export interface Asistenciasdepartamento {
  id: number;
  asistencia_id: number;
  departamento_id: number;
  departamento: Departamento;
}

export interface Departamento {
  id: number;
  nombre: string;
  estado: string;
}

export interface Ubicacion {
  id: number;
  asistencia_id: number;
  latitud: string;
  longitud: string;
}

export interface Tiporegistro {
  id: number;
  tipo: string;
  estado: string;
}

export interface Tipoasistencia {
  id: number;
  type: string;
  estado: string;
}

export interface User {
  id: number;
  persona_id: number;
  rol_id: number;
  name: string;
  email: string;
  email_verified_at?: any;
  imagen: string;
  estado: string;
  created_at: string;
  updated_at: string;
  persona: Persona;
}

export interface Persona {
  id: number;
  cedula: string;
  nombres: string;
  apellidos: string;
  num_celular: string;
  direccion?: any;
  estado: string;
}