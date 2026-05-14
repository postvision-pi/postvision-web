"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { apiGetSessionStatsByUserId } from "@/lib/api";
import { useUser } from "./UserContext";

interface WeeklyData {
    date: string;
    corretos: number;
    total: number;
}

interface MonthlyData {
    date: string;
    totalReps: number;
}

interface SessionStats {
    streak: number;
    weekly: WeeklyData[];
    monthly: MonthlyData[];
}

interface SessionContextType {
    stats: SessionStats | null;
    loading: boolean;
    refresh: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType>({
    stats: null,
    loading: true,
    refresh: async () => { },
});

export function SessionProvider({ children }: { children: ReactNode }) {
    const usuario = useUser();

    const [stats, setStats] = useState<SessionStats | null>(null);
    const [loading, setLoading] = useState(true);

    async function fetchStats() {
        if (!usuario?.id_usuario) return;

        setLoading(true);

        try {
            const res = await apiGetSessionStatsByUserId(usuario.id_usuario);
            const data = await res.json();
            setStats(data);
        } catch (error) {
            console.error("Erro ao buscar estatísticas de sessão:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (!usuario?.id_usuario) return;
        fetchStats();
    }, [usuario?.id_usuario]);

    return (
        <SessionContext.Provider value={{ stats, loading, refresh: fetchStats }}>
            {children}
        </SessionContext.Provider>
    );
}

export function useSession() {
    return useContext(SessionContext);
}
