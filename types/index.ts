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
    readonly creada?: Date;
    modificada?: Date;
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
    añadida?: Date;
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

  export type Response = {
  count: number;
  pages: number;
  current: number;
  rows: any[];
};