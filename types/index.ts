export interface Producto {
  id?: number;
  código?: string;
  slug: string;
  nombre: string;
  descripción?: string;
  precioCompra: number;
  precioVenta: number;
  exento: boolean;
  existencias: number;
  esPúblico: boolean;
  categoría_id?: number;
  categoría?: Categoría;
  imagens?: Imagen[];
}

export interface Publicación {
  id?: number;
  slug: string;
  título: string;
  portada: string;
  descripcionPortada: string;
  contenido: string;
  esPública: boolean;
  autor?: string;
  readonly creada?: Date;
  modificada?: Date;
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

export interface Ticket {
  id?: number;
  asunto: string;
  prioridad: "BAJA" | "MEDIA" | "ALTA";
  estado: "ABIERTO" | "CERRADO";
  descripción?: string;
  tipo: "DOMICILIO" | "TIENDA" | "REMOTO";
  readonly creado?: string;
  readonly cerrado?: string;
  cliente_id?: number;
  cliente?: Cliente;
  categoría_id?: number;
  categoría?: Categoría;

}

export interface Mensaje {
  id?: number;
  contenido: string;
  estado?: "ENVIADO" | "NO_ENVIADO";
  readonly creado?: string;
  modificado?: string;
  servicio_id?: number;
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
  ticket?: Ticket;
  mensaje?: Mensaje;
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
