/* eslint-disable react-hooks/set-state-in-effect -- O provider sincroniza notificações com a API após a hidratação. */
"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
    ReactNode
} from "react";

import {
    apiGetAllNotifications,
    apiDeleteNotification,
    apiMarkNotificationAsRead
} from "@/lib/api";

import { useUser } from "./UserContext";



interface Notification {
    _id: string;
    type: string;
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
}

interface NotificationContextType {
    notifications: Notification[];
    loading: boolean;
    refresh: () => Promise<void>;
    markAsRead: (id: string) => Promise<void>;
    deleteNotification: (id: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType>({
    notifications: [],
    loading: true,
    refresh: async () => {},
    markAsRead: async () => {},
    deleteNotification: async () => {},
});

export function NotificationProvider({ children }: { children: ReactNode }) {
    const user = useUser();

    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    const userId = user?.id_usuario;

    // Buscar notificações
    const refresh = useCallback(async () => {
    if (!userId) {
        setLoading(false);
        return;
    }

    setLoading(true);
    try {
        const res = await apiGetAllNotifications(userId);
        const data: Notification[] = await res.json();
        setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
        console.error("Erro ao buscar notificações:", err);
    } finally {
        setLoading(false);
    }
}, [userId]);

    // Marcar como lida (otimista)
    const markAsRead = async (id: string) => {
        // atualização otimista
        setNotifications(prev =>
            prev.map(n =>
                n._id === id ? { ...n, read: true } : n
            )
        );

        try {
            await apiMarkNotificationAsRead(id);
        } catch (err) {
            console.error("Erro ao marcar como lida:", err);
            refresh(); // rollback
        }
    };

    //  Deletar notificação (otimista)
    const deleteNotification = async (id: string) => {
        // remove da UI primeiro
        setNotifications(prev =>
            prev.filter(n => n._id !== id)
        );

        try {
            await apiDeleteNotification(id);
        } catch (err) {
            console.error("Erro ao deletar:", err);
            refresh(); // rollback
        }
    };

    //  carregar quando usuário muda
    useEffect(() => {
        if (userId) {
            refresh();
        } else {
            setLoading(false);
        }
    }, [refresh, userId]);

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                loading,
                refresh,
                markAsRead,
                deleteNotification
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
}

// hook pra usar fácil
export function useNotifications() {
    return useContext(NotificationContext);
}