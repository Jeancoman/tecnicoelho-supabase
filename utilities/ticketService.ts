import {
  Cliente,
  Elemento,
  Problema,
  Response,
  Session,
  Ticket,
} from "../types";
import session from "./sessionService";

export default class TicketService {
  static async getAll() {
    try {
      const response = await fetch(
        `${process.env
          .NEXT_PUBLIC_API_URL!}/api/clientes/actual/tickets?page=1&size=100000`,
        {
          headers: {
            Authorization: session.find()?.token!,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
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

  static async get(id: string) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL!}/api/clientes/actual/tickets/${id}`,
        {
          headers: {
            Authorization: session.find()?.token!,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status > 300) {
        return null;
      }

      return (await response.json()) as Ticket;
    } catch {
      return null;
    }
  }

  static async searchLogin(ticket_id: string, contraseña: string) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL!}/api/clientes/login-con-ticket`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ticket_id,
          contraseña,
        }),
      }
    );

    if (response.status > 300) {
      return null;
    }

    const data = (await response.json()) as Session;

    return data;
  }

  static async login(documento: string, contraseña: string) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL!}/api/clientes/login`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documento,
          contraseña,
        }),
      }
    );

    if (response.status > 300) {
      return null;
    }

    const data = (await response.json()) as Session;

    return data;
  }

  static async create(
    ticket: Ticket,
    cliente: Cliente,
    elemento: Elemento,
    problema: Problema
  ) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL!}/api/clientes/anonimo/tickets`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ticket,
          cliente,
          elemento,
          problema,
        }),
      }
    );

    return response.status;
  }

  static async createWithSession(
    ticket: Ticket,
    elemento: Elemento,
    problema: Problema
  ) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL!}/api/clientes/actual/tickets`,
      {
        method: "POST",
        headers: {
          Authorization: session.find()?.token!,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ticket,
          elemento,
          problema,
        }),
      }
    );

    return response.status;
  }

  static async getAllProblemsCountByState(state: string, id: string) {
    try {
      const response = await fetch(
        `${process.env
          .NEXT_PUBLIC_API_URL!}/api/clientes/actual/tickets/${id}/problemas/buscar/count?estado=${state}`,
        {
          headers: {
            Authorization: session.find()?.token!,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status > 300) {
        return 0;
      }

      return (await response.json()) as number;
    } catch {
      return 0;
    }
  }

  static async getAllServicesCountByState(state: string, id: string) {
    try {
      const response = await fetch(
        `${process.env
          .NEXT_PUBLIC_API_URL!}/api/clientes/actual/tickets/${id}/servicios/buscar/count?estado=${state}`,
        {
          headers: {
            Authorization: session.find()?.token!,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status > 300) {
        return 0;
      }

      return (await response.json()) as number;
    } catch {
      return 0;
    }
  }

  static async getAllOperationsCountByState(
    state: string,
    id: number,
    servicio_id: number
  ) {
    try {
      const response = await fetch(
        `${process.env
          .NEXT_PUBLIC_API_URL!}/api/clientes/actual/tickets/${id}/servicios/${servicio_id}/operaciones/buscar/count?estado=${state}`,
        {
          headers: {
            Authorization: session.find()?.token!,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status > 300) {
        return 0;
      }

      return (await response.json()) as number;
    } catch {
      return 0;
    }
  }

  static async getAllMensajesCountByState(state: string, id: string) {
    try {
      const response = await fetch(
        `${process.env
          .NEXT_PUBLIC_API_URL!}/api/clientes/actual/tickets/${id}/mensajes/buscar/count?estado=${state}`,
        {
          headers: {
            Authorization: session.find()?.token!,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status > 300) {
        return 0;
      }

      return (await response.json()) as number;
    } catch {
      return 0;
    }
  }

  static async getAllMensajes(id: string, page: number, size: number) {
    try {
      const response = await fetch(
        `${process.env
          .NEXT_PUBLIC_API_URL!}/api/clientes/actual/tickets/${id}/mensajes?page=${page}&size=${size}`,
        {
          headers: {
            Authorization: session.find()?.token!,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
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

  static async getAllMensajesByNombre(
    id: string,
    page: number,
    size: number,
    nombre: string
  ) {
    try {
      const response = await fetch(
        `${process.env
          .NEXT_PUBLIC_API_URL!}/api/clientes/actual/tickets/${id}/mensajes/buscar?page=${page}&size=${size}&nombre=${nombre}`,
        {
          headers: {
            Authorization: session.find()?.token!,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
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

  static async getAllMensajesByDescripcion(
    id: string,
    page: number,
    size: number,
    desc: string
  ) {
    try {
      const response = await fetch(
        `${process.env
          .NEXT_PUBLIC_API_URL!}/api/clientes/actual/tickets/${id}/mensajes/buscar?page=${page}&size=${size}&desc=${desc}`,
        {
          headers: {
            Authorization: session.find()?.token!,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
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

  static async getAllMensajesByNombreAndState(
    id: string,
    page: number,
    size: number,
    nombre: string,
    estado: string
  ) {
    try {
      const response = await fetch(
        `${process.env
          .NEXT_PUBLIC_API_URL!}/api/clientes/actual/tickets/${id}/mensajes/buscar?page=${page}&size=${size}&nombre=${nombre}&estado=${estado}`,
        {
          headers: {
            Authorization: session.find()?.token!,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
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

  static async getAllMensajesByDescripcionAndState(
    id: string,
    page: number,
    size: number,
    desc: string,
    estado: string
  ) {
    try {
      const response = await fetch(
        `${process.env
          .NEXT_PUBLIC_API_URL!}/api/clientes/actual/tickets/${id}/mensajes/buscar?page=${page}&size=${size}&desc=${desc}&estado=${estado}`,
        {
          headers: {
            Authorization: session.find()?.token!,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
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

  static async getAllMensajesByState(
    id: string,
    state: string,
    page: number,
    size: number
  ) {
    try {
      const response = await fetch(
        `${process.env
          .NEXT_PUBLIC_API_URL!}/api/clientes/actual/tickets/${id}/mensajes/buscar?page=${page}&size=${size}&estado=${state}`,
        {
          headers: {
            Authorization: session.find()?.token!,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
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

  static async getAllProblemas(id: string, page: number, size: number) {
    try {
      const response = await fetch(
        `${process.env
          .NEXT_PUBLIC_API_URL!}/api/clientes/actual/tickets/${id}/problemas?page=${page}&size=${size}`,
        {
          headers: {
            Authorization: session.find()?.token!,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
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

  static async getAllProblemasByNombre(
    id: string,
    page: number,
    size: number,
    nombre: string
  ) {
    try {
      const response = await fetch(
        `${process.env
          .NEXT_PUBLIC_API_URL!}/api/clientes/actual/tickets/${id}/problemas/buscar?page=${page}&size=${size}&nombre=${nombre}`,
        {
          headers: {
            Authorization: session.find()?.token!,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
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

  static async getAllProblemasByDescripcion(
    id: string,
    page: number,
    size: number,
    descripcion: string
  ) {
    try {
      const response = await fetch(
        `${process.env
          .NEXT_PUBLIC_API_URL!}/api/clientes/actual/tickets/${id}/problemas/buscar?page=${page}&size=${size}&desc=${descripcion}`,
        {
          headers: {
            Authorization: session.find()?.token!,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
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

  static async getAllProblemasByNombreAndState(
    id: string,
    page: number,
    size: number,
    nombre: string,
    estado: string
  ) {
    try {
      const response = await fetch(
        `${process.env
          .NEXT_PUBLIC_API_URL!}/api/clientes/actual/tickets/${id}/problemas/buscar?page=${page}&size=${size}&nombre=${nombre}&estado=${estado}`,
        {
          headers: {
            Authorization: session.find()?.token!,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
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

  static async getAllProblemasByDescripcionAndState(
    id: string,
    page: number,
    size: number,
    descripcion: string,
    estado: string
  ) {
    try {
      const response = await fetch(
        `${process.env
          .NEXT_PUBLIC_API_URL!}/api/clientes/actual/tickets/${id}/problemas/buscar?page=${page}&size=${size}&desc=${descripcion}&estado=${estado}`,
        {
          headers: {
            Authorization: session.find()?.token!,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
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

  static async getAllProblemasByState(
    id: string,
    state: string,
    page: number,
    size: number
  ) {
    try {
      const response = await fetch(
        `${process.env
          .NEXT_PUBLIC_API_URL!}/api/clientes/actual/tickets/${id}/problemas/buscar?page=${page}&size=${size}&estado=${state}`,
        {
          headers: {
            Authorization: session.find()?.token!,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
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

  static async getAllElementos(page: number, size: number) {
    try {
      const response = await fetch(
        `${process.env
          .NEXT_PUBLIC_API_URL!}/api/clientes/actual/elementos?page=${page}&size=${size}`,
        {
          headers: {
            Authorization: session.find()?.token!,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
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

  static async getAllElementosByNombre(
    page: number,
    size: number,
    nombre: string
  ) {
    try {
      const response = await fetch(
        `${process.env
          .NEXT_PUBLIC_API_URL!}/api/clientes/actual/elementos/buscar?page=${page}&size=${size}&nombre=${nombre}`,
        {
          headers: {
            Authorization: session.find()?.token!,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
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

  static async getAllElementosByDescripcion(
    page: number,
    size: number,
    descripcion: string
  ) {
    try {
      const response = await fetch(
        `${process.env
          .NEXT_PUBLIC_API_URL!}/api/clientes/actual/elementos/buscar?page=${page}&size=${size}&desc=${descripcion}`,
        {
          headers: {
            Authorization: session.find()?.token!,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
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

  static async getAllServicios(id: string, page: number, size: number) {
    try {
      const response = await fetch(
        `${process.env
          .NEXT_PUBLIC_API_URL!}/api/clientes/actual/tickets/${id}/servicios?page=${page}&size=${size}`,
        {
          headers: {
            Authorization: session.find()?.token!,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
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

  static async getAllServiciosByNombre(
    id: string,
    page: number,
    size: number,
    nombre: string
  ) {
    try {
      const response = await fetch(
        `${process.env
          .NEXT_PUBLIC_API_URL!}/api/clientes/actual/tickets/${id}/servicios/buscar?page=${page}&size=${size}&nombre=${nombre}`,
        {
          headers: {
            Authorization: session.find()?.token!,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
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

  static async getAllServiciosByDescripcion(
    id: string,
    page: number,
    size: number,
    desc: string
  ) {
    try {
      const response = await fetch(
        `${process.env
          .NEXT_PUBLIC_API_URL!}/api/clientes/actual/tickets/${id}/servicios/buscar?page=${page}&size=${size}&desc=${desc}`,
        {
          headers: {
            Authorization: session.find()?.token!,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
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

  static async getAllServiciosByNombreAndState(
    id: string,
    page: number,
    size: number,
    nombre: string,
    estado: string
  ) {
    try {
      const response = await fetch(
        `${process.env
          .NEXT_PUBLIC_API_URL!}/api/clientes/actual/tickets/${id}/servicios/buscar?page=${page}&size=${size}&nombre=${nombre}&estado=${estado}`,
        {
          headers: {
            Authorization: session.find()?.token!,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
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

  static async getAllServiciosByDescripcionAndState(
    id: string,
    page: number,
    size: number,
    desc: string,
    estado: string
  ) {
    try {
      const response = await fetch(
        `${process.env
          .NEXT_PUBLIC_API_URL!}/api/clientes/actual/tickets/${id}/servicios/buscar?page=${page}&size=${size}&desc=${desc}&estado=${estado}`,
        {
          headers: {
            Authorization: session.find()?.token!,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
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

  static async getAllServiciosByState(
    id: string,
    state: string,
    page: number,
    size: number
  ) {
    try {
      const response = await fetch(
        `${process.env
          .NEXT_PUBLIC_API_URL!}/api/clientes/actual/tickets/${id}/servicios/buscar?page=${page}&size=${size}&estado=${state}`,
        {
          headers: {
            Authorization: session.find()?.token!,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
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

  static async getAllOperaciones(
    id: string,
    sid: string,
    page: number,
    size: number
  ) {
    try {
      const response = await fetch(
        `${process.env
          .NEXT_PUBLIC_API_URL!}/api/clientes/actual/tickets/${id}/servicios/${sid}/operaciones?page=${page}&size=${size}`,
        {
          headers: {
            Authorization: session.find()?.token!,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
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

  static async getAllOperacionesByNombre(
    id: string,
    sid: string,
    page: number,
    size: number,
    nombre: string
  ) {
    try {
      const response = await fetch(
        `${process.env
          .NEXT_PUBLIC_API_URL!}/api/clientes/actual/tickets/${id}/servicios/${sid}/operaciones/buscar?page=${page}&size=${size}&nombre=${nombre}`,
        {
          headers: {
            Authorization: session.find()?.token!,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
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

  static async getAllOperacionesByDescripcion(
    id: string,
    sid: string,
    page: number,
    size: number,
    desc: string
  ) {
    try {
      const response = await fetch(
        `${process.env
          .NEXT_PUBLIC_API_URL!}/api/clientes/actual/tickets/${id}/servicios/${sid}/operaciones/buscar?page=${page}&size=${size}&desc=${desc}`,
        {
          headers: {
            Authorization: session.find()?.token!,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
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

  static async getAllOperacionesByNombreAndState(
    id: string,
    sid: string,
    page: number,
    size: number,
    nombre: string,
    estado: string
  ) {
    try {
      const response = await fetch(
        `${process.env
          .NEXT_PUBLIC_API_URL!}/api/clientes/actual/tickets/${id}/servicios/${sid}/operaciones/buscar?page=${page}&size=${size}&nombre=${nombre}&estado=${estado}`,
        {
          headers: {
            Authorization: session.find()?.token!,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
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

  static async getAllOperacionesByDescripcionAndState(
    id: string,
    sid: string,
    page: number,
    size: number,
    desc: string,
    estado: string
  ) {
    try {
      const response = await fetch(
        `${process.env
          .NEXT_PUBLIC_API_URL!}/api/clientes/actual/tickets/${id}/servicios/${sid}/operaciones/buscar?page=${page}&size=${size}&desc=${desc}&estado=${estado}`,
        {
          headers: {
            Authorization: session.find()?.token!,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
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

  static async getAllOperacionesByState(
    id: string,
    sid: string,
    state: string,
    page: number,
    size: number
  ) {
    try {
      const response = await fetch(
        `${process.env
          .NEXT_PUBLIC_API_URL!}/api/clientes/actual/tickets/${id}/servicios/${sid}/operaciones/buscar?page=${page}&size=${size}&estado=${state}`,
        {
          headers: {
            Authorization: session.find()?.token!,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
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
