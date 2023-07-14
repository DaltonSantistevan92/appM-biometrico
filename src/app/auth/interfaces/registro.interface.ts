
// interface para el formulario de login y registro
export interface Formulario{
    nombres?: string;
    email: string; 
    password: string;
    sexo_id : number;
}

//request interface registro trabajador
export interface RegIntTrabajador {
  persona: Persona;
  usuario: Usuario;
}

export interface Usuario {
  email: string;
  password: string;
}

export interface Persona {
  nombres?: string;
  sexo_id ? : number;
}

//response trabajador
export interface ResponseTrabajador{
    status: boolean;
    message: string;
}








