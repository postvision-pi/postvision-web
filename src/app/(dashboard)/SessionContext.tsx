/* eslint-disable react-hooks/set-state-in-effect -- O provider carrega dados da API após a hidratação. */
"use client";

import { createContext, useContext, useEffect, useState, useCallback, useRef, ReactNode } from "react";
import { apiGetSessionStatsByUserId } from "@/lib/api";
import { useUser } from "./UserContext";

export interface SessionStats {
    streak: number;
    avgDuration: number;
    avgAccuracy: number;
    weekly: { date: string; corretos: number; total: number }[];
    monthly: { date: string; totalReps: number }[];
    lastSession: {
        date: string;
        corretos: number;
        incorretos: number;
        total: number;
        accuracy: number;
    } | null;
}

interface SessionContextType {
    stats: SessionStats | null;
    loading: boolean;
    hasSessions: boolean;
    refresh: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType>({
    stats: null, loading: true, hasSessions: false, refresh: async () => {},
});

export function SessionProvider({ children }: { children: ReactNode }) {
    const usuario = useUser();
    const userId = usuario?.id_usuario;
    const [stats, setStats] = useState<SessionStats | null>(null);
    const [loading, setLoading] = useState(true);
    const requestId = useRef(0);

    const refresh = useCallback(async () => {
        const currentRequest = ++requestId.current;
        if (!userId) {
            setStats(null);
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const res = await apiGetSessionStatsByUserId(userId);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data: SessionStats = await res.json();
            if (currentRequest === requestId.current) setStats(data);
        } catch (error) {
            if (currentRequest === requestId.current) {
                setStats(null);
                console.error("Erro ao buscar estatísticas de sessão:", error);
            }
        } finally {
            if (currentRequest === requestId.current) setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        void refresh();
        // Ignora respostas antigas após troca de usuário/desmontagem.
        return () => { requestId.current += 1; };
    }, [refresh]);

    const hasSessions = !!stats && (
        (stats.monthly?.length ?? 0) > 0 ||
        (stats.weekly?.length ?? 0) > 0 ||
        (typeof stats.avgDuration === "number" && stats.avgDuration > 0) ||
        stats.lastSession != null
    );

    return (
        <SessionContext.Provider value={{ stats, loading, hasSessions, refresh }}>
            {children}
        </SessionContext.Provider>
    );
}

export function useSession() {
    return useContext(SessionContext);
}
