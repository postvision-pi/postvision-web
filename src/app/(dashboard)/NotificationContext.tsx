/* eslint-disable react-hooks/set-state-in-effect -- O provider sincroniza notificações com a API após a hidratação. */
"use client";

import { createContext, useContext, useEffect, useState, useCallback, useRef, ReactNode } from "react";
import { apiGetAllNotifications, apiDeleteNotification, apiMarkNotificationAsRead } from "@/lib/api";
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
    notifications: [], loading: true,
    refresh: async () => {}, markAsRead: async () => {}, deleteNotification: async () => {},
});

export function NotificationProvider({ children }: { children: ReactNode }) {
    const user = useUser();
    const userId = user?.id_usuario;
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const requestId = useRef(0);
    const owner = useRef(userId);

    const refresh = useCallback(async () => {
        const currentRequest = ++requestId.current;
        if (!userId) {
            setNotifications([]);
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const res = await apiGetAllNotifications(userId);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data: Notification[] = await res.json();
            if (currentRequest === requestId.current) {
                setNotifications(Array.isArray(data) ? data : []);
            }
        } catch (err) {
            if (currentRequest === requestId.current) console.error("Erro ao buscar notificações:", err);
        } finally {
            if (currentRequest === requestId.current) setLoading(false);
        }
    }, [userId]);

    const markAsRead = async (id: string) => {
        const previous = notifications.find(n => n._id === id);
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
        try {
            const res = await apiMarkNotificationAsRead(id);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
        } catch (err) {
            if (owner.current !== userId) return;
            console.error("Erro ao marcar como lida:", err);
            // Restaura mesmo se uma nova consulta também falhar.
            if (previous) setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: previous.read } : n));
            await refresh();
        }
    };

    const deleteNotification = async (id: string) => {
        const previousIndex = notifications.findIndex(n => n._id === id);
        const previous = notifications[previousIndex];
        setNotifications(prev => prev.filter(n => n._id !== id));
        try {
            const res = await apiDeleteNotification(id);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
        } catch (err) {
            if (owner.current !== userId) return;
            console.error("Erro ao deletar:", err);
            if (previous) setNotifications(prev => {
                if (prev.some(n => n._id === id)) return prev;
                const restored = [...prev];
                restored.splice(previousIndex, 0, previous);
                return restored;
            });
            await refresh();
        }
    };

    useEffect(() => {
        owner.current = userId;
        setNotifications([]);
        void refresh();
        return () => { requestId.current += 1; owner.current = undefined; };
    }, [refresh, userId]);

    return (
        <NotificationContext.Provider value={{ notifications, loading, refresh, markAsRead, deleteNotification }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    return useContext(NotificationContext);
}
