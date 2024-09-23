import React, { createContext, useState, useContext, useEffect } from 'react';
import NotificationServices from "@/src/api/NotificationServices";

// 通知の種類
export enum NotificationTypeEnum {
    WARNING = "warning",
    ERROR = "error",
    INFO = "info",
}

export type NotificationType = {
    id: number;
    title: string;
    message: string;
    created_at: string;
    is_read: boolean;
    possible_url?: string;
    notification_read_id: number;
    notification_type: NotificationTypeEnum;
}

interface NotificationContextType {
    notifications: NotificationType[];
    loading: boolean;
    unreadNotificationCount: number;
    getNotificationList: () => void;
    markNotificationAsRead: (notificationId: number) => void;
}

const NotificationContext = createContext<NotificationContextType>({
    notifications: [],
    loading: false,
    unreadNotificationCount: 0,
    getNotificationList: () => {},
    markNotificationAsRead: () => {},
});

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
    const [notifications, setNotifications] = useState<NotificationType[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(1);
    const [unreadNotificationCount, setUnreadNotificationCount] = useState<number>(0);

    useEffect(() => {
        getNotificationList();
    }, []);

    useEffect(() => {
        setUnreadNotificationCount(notifications.filter(notification => !notification.is_read).length);
    }, [notifications]); // Update unread count whenever notifications change

    const getNotificationList = async () => {
        if (loading || currentPage > totalPage) return;

        setLoading(true);
        try {
            const result = await NotificationServices.getNotificationList(currentPage, 50);
    
            const newNotifications = result.data.items;
            setNotifications(prevNotifications => {
                const existingIds = new Set(prevNotifications.map(notification => notification.id));
                return [
                    ...prevNotifications,
                    ...newNotifications.filter(notification => !existingIds.has(notification.id))
                ];
            });

            setTotalPage(result.data.pages);
            setCurrentPage(prevPage => prevPage + 1);
        } catch (error) {
            console.error("Failed to get notification list.");
        } finally {
            setLoading(false);
        }
    };

    const markNotificationAsRead = async (notificationId: number) => {
        try {
            await NotificationServices.markAsRead(notificationId);
            setNotifications(prevNotifications =>
                prevNotifications.map(n =>
                    n.notification_read_id === notificationId ? { ...n, is_read: true } : n
                )
            );
        } catch (error) {
            console.error("Failed to mark notification as read.");
        }
    };

    return (
        <NotificationContext.Provider value={{ notifications, loading, unreadNotificationCount, getNotificationList, markNotificationAsRead }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);
export default NotificationContext;
