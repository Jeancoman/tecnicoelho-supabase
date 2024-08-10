export interface Producto {
  id?: number;
  código?: string;
  slug: string;
  nombre: string;
  descripción?: string;
  precio: number;
  stock: number;
  esPúblico: boolean;
  categoría_id?: number;
  categoría?: Categoría;
  imagens?: Imagen[];
}

export interface Publicación {
  id?: number;
  slug: string;
  título: string;
  contenido: string;
  esPública: boolean;
  readonly creada?: string;
  modificada?: string;
  imagen?: Imagen;
  imagen_id?: number;
  usuario_id?: number;
  usuario?: Usuario;
}

export interface Imagen {
  id?: number;
  url: string;
  descripción?: string;
  esPública: boolean;
  añadida?: string;
}

export interface Usuario {
  id?: number;
  nombre: string;
  apellido: string;
  nombreUsuario: string;
}

export interface Categoría {
  id?: number;
  nombre: string;
  descripción?: string;
  esDigital: boolean;
}

export interface Cliente {
  id?: number;
  nombre: string;
  apellido: string;
  documento: string;
  email?: string;
  telefono?: string;
  dirección?: string;
  enviarMensajes: boolean;
  readonly registrado?: string;
  contraseña?: string;
}

export interface Elemento {
  id?: number;
  nombre: string;
  descripción: string;
  estado?: "ACTIVO" | "INACTIVO";
  readonly registrado?: string; 
  cliente_id?: number;
  categoría_id: number;
  categoría?: Categoría;
  cliente?: Cliente;
}

export interface Ticket {
  id?: number;
  estado: "ABIERTO" | "CERRADO";
  readonly creado?: string;
  cerrado?: string;
  notas_de_apertura?: String;
  notas_de_cierre?: String;
  elemento_id?: number;
  elemento?: Elemento;
}

export interface Problema {
  id?: number;
  nombre: string;
  descripción?: string;
  causa?: string;
  solución?: string;
  prioridad?: "BAJA" | "MEDIA" | "ALTA";
  estado?: "PENDIENTE" | "RESUELTO";
  readonly detectado?: string;  
  resuelto?: string;  
  ticket_id?: number;
}

export interface Servicio {
  id?: number;
  nombre: string;
  descripción?: string;
  tipo?: "DOMICILIO" | "TIENDA" | "REMOTO";
  estado?:  "PENDIENTE" | "INICIADO" | "COMPLETADO";
  readonly añadido?: string;
  iniciado?: string;
  completado?: string;
  necesidades?: string;
  notas?: string;
  resultado?: string;
  ticket_id?:number;
  categoría_id?: number;
}

export interface Operación {
  id?: number;
  nombre: string;
  descripción?: string;
  estado?:  "PENDIENTE" | "INICIADA" | "COMPLETADA";
  readonly añadida?: string;
  iniciada?: string;
  completada?: string;
  necesidades?: string;
  notas?: string;
  resultado?: string;
  servicio_id?:number;
}

export interface Mensaje {
  id?: number;
  contenido: string;
  estado?: "ENVIADO" | "NO_ENVIADO";
  readonly creado?: string;
  modificado?: string;
  ticket_id?: number;
}

export type Response = {
  count: number;
  pages: number;
  current: number;
  rows: any[];
};

export type ModalProps = {
  isOpen: boolean;
  closeModal: () => void;
  elemento?: Elemento;
  ticket?: Ticket;
  problema?: Problema;
  mensaje?: Mensaje;
  servicio?: Servicio;
  operación?: Operación;
};

export interface JwtPayload {
  cliente: Cliente;
  iat: number;
  exp: number;
}

export interface Session {
  token: string;
}

export type PaginationProps = {
  pages: number;
  current: number;
  next: () => void;
  prev: () => void;
};

export type OptionProps = {
  value: string | number | undefined;
  label: string | undefined;
  onClick: (
    value: string | number | undefined,
    label: string | undefined
  ) => void;
  closeOnClick?: () => void;
};

export type OptionGroupProps = {
  options: OptionProps[];
  close: () => void;
  closeOnOptionClick: () => void;
  drop: boolean;
  top: number;
  left: number;
  width: string;
};

export type SelectProps = {
  selected: Selected;
  options: OptionProps[];
  onChange?: () => void;
  disable?: boolean;
  small?: boolean;
};

export type Selected = {
  value: string | number | undefined;
  label: string | undefined;
};
