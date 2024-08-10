import { Producto, Response } from "../types";

export default class ProductService {
  static async getAll(page: number, size: number) {
    try {
      const response = await fetch(
        `${process.env
          .NEXT_PUBLIC_API_URL!}/api/productos/anonimo?page=${page}&size=${size}`
      );

      const data = (await response.json()) as Response;

      return data;
    } catch {
      return null;
    }
  }
  static async getByNombre(nombre: string, page: number, size: number) {
    try {
      const response = await fetch(
        `${process.env
          .NEXT_PUBLIC_API_URL!}/api/productos/anonimo/busqueda?exactitud=INEXACTA&nombre=${nombre}&page=${page}&size=${size}`
      );

      if (response.status > 300) {
        return null;
      }

      const data = (await response.json()) as Response;

      if (data.rows.length === 0) {
        return null;
      }

      return data;
    } catch {
      return null;
    }
  }

  static async getBySlug(slug: string) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL!}/api/productos/${slug}/anonimo?mode=SLUG`
      );

      if (response.status > 300) {
        return null;
      }

      const data = (await response.json()) as Producto;

      return data;
    } catch {
      return null;
    }
  }

  static async getByDescripcion(nombre: string, page: number, size: number) {
    try {
      const response = await fetch(
        `${process.env
          .NEXT_PUBLIC_API_URL!}/api/productos/busqueda?exactitud=INEXACTA&descripcion=${nombre}&page=${page}&size=${size}&es=PUBLICO`
      );

      if (response.status > 300) {
        return null;
      }

      const data = (await response.json()) as Response;

      if (data.rows.length === 0) {
        return null;
      }

      return data;
    } catch {
      return null;
    }
  }

  static async getNew(page: number, size: number) {
    try {
      const response = await fetch(
        `${process.env
          .NEXT_PUBLIC_API_URL!}/api/reportes/productos/nuevos?page=${page}&size=${size}`
      );

      if (response.status > 300) {
        return null;
      }

      const data = (await response.json()) as Response;

      if (data.rows.length === 0) {
        return null;
      }

      return data;
    } catch {
      return null;
    }
  }
}
