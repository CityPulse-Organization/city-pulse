import type { User } from "./auth";

export type Session = {
  user: User | null;
  isLoading: boolean;
};

export type SessionContextType = {
  session: Session;
  setSession: (user: User | null) => void;
  isLoading: boolean;
};
