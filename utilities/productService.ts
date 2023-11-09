import { Producto } from "../pages/types";

export default class ProductService {
  static async getAll(page: number, size: number) {
    try {
      const response = await fetch(
        `${process.env
          .NEXT_PUBLIC_API_URL!}/api/productos/busqueda?es=PUBLICO&page=${page}&size=${size}`
      );

      const data = (await response.json()) as any;

      return data;
    } catch {
      return false;
    }
  }
  static async getByNombre(nombre: string, page: number, size: number) {
    try {
      const response = await fetch(
        `${process.env
          .NEXT_PUBLIC_API_URL!}/api/productos/busqueda?exactitud=INEXACTA&nombre=${nombre}&page=${page}&size=${size}&es=PUBLICO`
      );

      if (response.status > 300) {
        return false;
      }

      const data = (await response.json()) as any;

      if (data.rows.length === 0) {
        return false;
      }

      return data;
    } catch {
      return false;
    }
  }

  static async getBySlug(slug: string) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL!}/api/productos/${slug}?mode=SLUG`
      );

      if (response.status > 300) {
        return false;
      }

      const data = (await response.json()) as Producto;

      return data;
    } catch {
      return false;
    }
  }

  static async getByDescripcion(nombre: string, page: number, size: number) {
    try {
      const response = await fetch(
        `${process.env
          .NEXT_PUBLIC_API_URL!}/api/productos/busqueda?exactitud=INEXACTA&descripcion=${nombre}&page=${page}&size=${size}&es=PUBLICO`
      );

      if (response.status > 300) {
        return false;
      }

      const data = (await response.json()) as any;

      if (data.rows.length === 0) {
        return false;
      }

      return data;
    } catch {
      return false;
    }
  }

  static async getNew(page: number, size: number) {
    try {
      const response = await fetch(
        `${process.env
          .NEXT_PUBLIC_API_URL!}/api/reportes/productos/nuevos?page=${page}&size=${size}`
      );

      if (response.status > 300) {
        return false;
      }

      const data = (await response.json()) as any;

      if (data.rows.length === 0) {
        return false;
      }

      return data;
    } catch {
      return false;
    }
  }
}
