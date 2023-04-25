export interface IntTipo {
  id: number;
  tipo: string;
  estado: string;
}


export interface DataDateTime {
  fecha: string;
  hora: string;
}



export interface ITA {
  status: boolean;
  message: string;
  data: TipoAsistencia[];
}

export interface TipoAsistencia {
  id: number;
  type: string;
  estado: string;
}