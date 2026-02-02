import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLoading } from '../context/LoadingContext';
import { useTheme } from '../contexts/ThemeContext';
import LogoLoader from './LogoLoader';

const LoadingScreen = () => {
    const { isLoading, progress } = useLoading();
    const { isDark } = useTheme();

    useEffect(() => {
        if (isLoading) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            // Also reset scroll position to top when loading finishes, optional but good for UX
            window.scrollTo(0, 0);
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isLoading]);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center pointer-events-auto transition-colors duration-300 ${isDark ? 'bg-[#1a1a1a]' : 'bg-[#f5f5f7]'
                        }`}
                >
                    <div className="flex flex-col items-center gap-8">
                        {/* Logo Loader */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                        >
                            <LogoLoader size="w-20 h-20" animate={false} />
                        </motion.div>

                        {/* Simple Progress Bar */}
                        <div className="w-48 flex flex-col items-center gap-2">
                            <div className={`w-full h-1 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-black/10'
                                }`}>
                                <motion.div
                                    className={`h-full rounded-full ${isDark ? 'bg-white' : 'bg-[#2c3e50]'}`}
                                    initial={{ width: "0%" }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ ease: "linear", duration: 0.1 }}
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LoadingScreen;
