import { motion, AnimatePresence } from 'framer-motion';
import { useNotification } from '../context/NotificationContext';

const NotificationToast = () => {
    const { notifications, removeNotification, confirmation, closeConfirmation } = useNotification();

    return (
        <>
            <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
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

            {/* Confirmation Dialog */}
            <AnimatePresence>
                {confirmation && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#1e1e1e] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center mb-4 text-2xl">
                                    <i className="fas fa-exclamation-triangle"></i>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">確認操作</h3>
                                <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                                    {confirmation.message}
                                </p>
                                <div className="flex gap-3 w-full">
                                    <button
                                        onClick={() => {
                                            if (confirmation.onCancel) confirmation.onCancel();
                                            closeConfirmation();
                                        }}
                                        className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all font-medium text-sm"
                                    >
                                        取消
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (confirmation.onConfirm) confirmation.onConfirm();
                                            closeConfirmation();
                                        }}
                                        className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white shadow-lg shadow-red-500/20 transition-all font-bold text-sm"
                                    >
                                        確定
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default NotificationToast;
