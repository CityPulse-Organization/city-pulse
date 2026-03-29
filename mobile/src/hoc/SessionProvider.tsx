import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "../types";
import { tokenStorage } from "../config";

import { jwtDecode } from "jwt-decode";

const decodeToken = (token: string): User | null => {
  try {
    const payload = jwtDecode<{ sub: string; role?: string }>(token);
    return { id: String(payload.sub), role: payload.role ?? "USER" };
  } catch {
    return null;
  }
};

type Session = {
  user: User | null;
  isLoading: boolean;
};

type SessionContextType = {
  session: Session;
  setSession: (user: User | null) => void;
  isLoading: boolean;
};

export const SessionContext = createContext<SessionContextType>({
  session: { user: null, isLoading: true },
  setSession: () => {},
  isLoading: true,
});

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSessionState] = useState<Session>({
    user: null,
    isLoading: true,
  });

  useEffect(() => {
    const initSession = async () => {
      try {
        let user = await tokenStorage.getUser();

        if (!user) {
          const accessToken = await tokenStorage.getAccessToken();
          if (accessToken) {
            user = decodeToken(accessToken);
            if (user) await tokenStorage.setUser(user);
          }
        }

        setSessionState({ user, isLoading: false });
      } catch {
        setSessionState({ user: null, isLoading: false });
      }
    };

    initSession();
  }, []);

  const setSession = (user: User | null) => {
    setSessionState({ user, isLoading: false });
  };

  return (
    <SessionContext.Provider
      value={{
        session,
        setSession,
        isLoading: session.isLoading,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};
