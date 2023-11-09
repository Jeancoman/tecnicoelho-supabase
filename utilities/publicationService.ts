import { Publicación } from "../types";

export default class PublicationService {
  static async getAll(page: number, size: number) {
    try {
      const response = await fetch(
        `${process.env
          .NEXT_PUBLIC_API_URL!}/api/publicaciones?page=${page}&size=${size}`
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
        `${process.env
          .NEXT_PUBLIC_API_URL!}/api/publicaciones/${slug}?mode=SLUG`
      );

      if (response.status > 300) {
        return false;
      }

      const data = (await response.json()) as Publicación;

      return data;
    } catch {
      return false;
    }
  }

  static async getNew(page: number, size: number) {
    try {
      const response = await fetch(
        `${process.env
          .NEXT_PUBLIC_API_URL!}/api/reportes/publicaciones/nuevos?page=${page}&size=${size}`
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
