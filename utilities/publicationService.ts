import { Publicación, Response } from "../types";

export default class PublicationService {
  static async getAll(page: number, size: number) {
    try {
      const response = await fetch(
        `${process.env
          .NEXT_PUBLIC_API_URL!}/api/publicaciones/anonimo?page=${page}&size=${size}`
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
        `${process.env
          .NEXT_PUBLIC_API_URL!}/api/publicaciones/${slug}/anonimo?mode=SLUG`
      );

      if (response.status > 300) {
        return null;
      }

      const data = (await response.json()) as Publicación;

      return data;
    } catch {
      return null;
    }
  }

  static async getNew(page: number, size: number) {
    try {
      const response = await fetch(
        `${process.env
          .NEXT_PUBLIC_API_URL!}/api/reportes/publicaciones/nuevos?page=${page}&size=${size}`
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
