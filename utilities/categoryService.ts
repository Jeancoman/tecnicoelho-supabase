import { Categoría } from "../types";

export default class CategoryService {
    static async getAllDigitales() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL!}/api/categorias/anonimo/digitales`
        );
  
        if (response.status > 300) {
          return null;
        }
  
        const data = (await response.json()) as Categoría[];
  
        if (data.length === 0) {
          return null;
        }
  
        return data;
      } catch {
        return null;
      }
    }
}  