import { Response } from "../types";

export default class ImageService {
    static async getAll(page: number, size: number) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL!}/api/imagenes/anonimo?page=${page}&size=${size}`
        );
  
        if (response.status > 300) {
          return false;
        }
  
        const data = (await response.json()) as Response;
  
        if (data.rows.length === 0) {
          return false;
        }
  
        return data;
      } catch {
        return false;
      }
    }
}  