"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getToken, decodeTokenPayload } from "@/lib/api";

interface Usuario {
  id_usuario: string;
  nome_usuario: string;
  cpf_usuario?: string;
  sobrenome_usuario: string;
  email_usuario: string;
  telefone_usuario: string;
  genero_usuario: string;
  data_nascimento_usuario: string;
  created_at_usuario?: string;
}

const UserContext = createContext<Usuario | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    // Tenta carregar do localStorage primeiro (dados salvos no login)
    const stored = localStorage.getItem("usuario");
    if (stored) {
      try {
        setUsuario(JSON.parse(stored));
        return;
      } catch {
        // fallback: decodifica o token
      }
    }

    // Fallback: decodifica o payload do JWT
    const token = getToken();
    if (token) {
      const payload = decodeTokenPayload<Usuario>(token);
      if (payload) setUsuario(payload);
    }
  }, []);

  return <UserContext.Provider value={usuario}>{children}</UserContext.Provider>;
}

export function useUser() {
  return useContext(UserContext);
}
