"use client";

import { useState } from 'react';
import styles from "./NotificationArea.module.css";
import { Icon } from "@iconify/react";
import { useNotifications } from "@/app/(dashboard)/NotificationContext";

export default function NotificationArea() {
    const [notificationOpen, setNotificationOpen] = useState(false);

    const { notifications, loading, markAsRead } = useNotifications();

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <>
            <div
                className={styles.notificationContainer}
                onClick={() => setNotificationOpen(!notificationOpen)}
            >
                <Icon
                    icon="mingcute:notification-fill"
                    className={styles.notificationIcon}
                />

                {/* bolinha só se tiver não lida */}
                {unreadCount > 0 && (
                    <div className={styles.notificationDot}></div>
                )}
            </div>

            {notificationOpen && (
                <div className={styles.notificationDropdown}>
                    <div className={styles.notificationHeader}>
                        Notificações
                    </div>

                    {loading && <div>Carregando...</div>}

                    {!loading && notifications.length === 0 && (
                        <div className={styles.notificationItem}>
                            Nenhuma notificação
                        </div>
                    )}

                    {!loading && notifications.map(n => (
                        <div
                            key={n._id}
                            className={styles.notificationItem}
                            onClick={() => markAsRead(n._id)}
                            style={{
                                opacity: n.read ? 0.6 : 1,
                                cursor: "pointer"
                            }}
                        >
                            <strong>{n.title}</strong>
                            <p>{n.message}</p>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}