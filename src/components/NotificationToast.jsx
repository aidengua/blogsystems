import { motion, AnimatePresence } from 'framer-motion';
import { useNotification } from '../context/NotificationContext';

const NotificationToast = () => {
    const { notifications, removeNotification } = useNotification();

    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
            <AnimatePresence mode="popLayout">
                {notifications.map((notification) => (
                    <motion.div
                        key={notification.id}
                        layout
                        initial={{ opacity: 0, x: 50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 20, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className={`pointer-events-auto min-w-[300px] p-4 rounded-xl shadow-lg border backdrop-blur-md flex items-center gap-3
                            ${notification.type === 'success'
                                ? 'bg-green-500/10 border-green-500/20 text-green-400'
                                : notification.type === 'error'
                                    ? 'bg-red-500/10 border-red-500/20 text-red-400'
                                    : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                            }`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0
                            ${notification.type === 'success' ? 'bg-green-500/20' : notification.type === 'error' ? 'bg-red-500/20' : 'bg-blue-500/20'}`}>
                            <i className={`fas ${notification.type === 'success' ? 'fa-check' : notification.type === 'error' ? 'fa-exclamation' : 'fa-info'}`}></i>
                        </div>
                        <div className="flex-grow font-medium text-sm">
                            {notification.message}
                        </div>
                        <button
                            onClick={() => removeNotification(notification.id)}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            <i className="fas fa-times"></i>
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default NotificationToast;
