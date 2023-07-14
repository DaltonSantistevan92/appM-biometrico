export interface IntSexo {
  status: boolean;
  message: string;
  data: Sexo[];
}

export interface Sexo {
  id: number;
  detalle: string;
  status: string;
}