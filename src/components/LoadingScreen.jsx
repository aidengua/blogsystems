import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLoading } from '../context/LoadingContext';

const LoadingScreen = () => {
    const { isLoading, progress, loadingText } = useLoading();

    useEffect(() => {
        if (isLoading) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
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
                    className="fixed inset-0 z-[9999] bg-[#1a1a1a] flex flex-col items-center justify-center pointer-events-auto"
                >
                    <div className="w-full max-w-md px-8 flex flex-col items-center gap-8">
                        {/* Liquid Glass Progress Bar */}
                        <div className="relative w-full h-3 bg-white/5 rounded-full overflow-hidden backdrop-blur-sm border border-white/10 shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]">
                            {/* Liquid Bar */}
                            <motion.div
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#709CEF] via-[#a8c0ff] to-[#709CEF] bg-[length:200%_100%]"
                                initial={{ width: "0%" }}
                                animate={{
                                    width: `${progress}%`,
                                    backgroundPosition: ["0% 50%", "100% 50%"]
                                }}
                                transition={{
                                    width: { ease: "linear", duration: 0.1 },
                                    backgroundPosition: { duration: 2, repeat: Infinity, ease: "linear" }
                                }}
                                style={{
                                    boxShadow: "0 0 15px rgba(112, 156, 239, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.4)"
                                }}
                            >
                                {/* Light Field / Shine Effect */}
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 animate-shine" />
                            </motion.div>
                        </div>

                        {/* Loading Text */}
                        <div className="flex flex-col items-center gap-3 font-sans">
                            <motion.span
                                key={loadingText}
                                initial={{ opacity: 0, y: 5, filter: "blur(4px)" }}
                                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                exit={{ opacity: 0, y: -5, filter: "blur(4px)" }}
                                className="text-gray-300 text-sm tracking-wide font-medium"
                            >
                                {loadingText}
                            </motion.span>
                            <span className="text-[#709CEF] text-xs font-semibold tracking-wider">
                                {Math.round(progress)}%
                            </span>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LoadingScreen;
