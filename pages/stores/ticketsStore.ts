import { create } from "zustand";
import { Ticket } from "../../types";

interface TicketStore {
  tickets: Ticket[] | [];
  setTickets: (tickets: Ticket[]) => void;
}

export const useTicketsStore = create<TicketStore>((set) => ({
  tickets: [],
  setTickets: (args: Ticket[] | []) =>
    set(() => ({
      tickets: args,
    })),
}));
