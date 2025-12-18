import { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const showNotification = useCallback((message, type = 'success', duration = 3000) => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message, type }]);

        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, duration);
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    const [confirmation, setConfirmation] = useState(null);

    const showConfirmation = useCallback(({ message, onConfirm, onCancel, type = 'warning' }) => {
        setConfirmation({ message, onConfirm, onCancel, type });
    }, []);

    const closeConfirmation = useCallback(() => {
        setConfirmation(null);
    }, []);

    return (
        <NotificationContext.Provider value={{ notifications, showNotification, removeNotification, confirmation, showConfirmation, closeConfirmation }}>
            {children}
        </NotificationContext.Provider>
    );
};
