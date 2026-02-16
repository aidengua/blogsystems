import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { categories } from '../config/navigation';

const CategoryModal = ({ isOpen, onClose }) => {
    // Backdrop variants
    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.2 } },
        exit: { opacity: 0, transition: { duration: 0.2 } }
    };

    // Responsive variants
    const modalVariants = {
        hidden: {
            opacity: 0,
            scale: 0.95,
            y: 20
        },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { type: "spring", stiffness: 300, damping: 30 }
        },
        exit: {
            opacity: 0,
            scale: 0.95,
            y: 20,
            transition: { duration: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 400, damping: 20 }
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm"
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={onClose}
                    />

                    {/* Modal Container Wrapper */}
                    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            className={clsx(
                                "bg-white/90 dark:bg-[#18181b]/90 backdrop-blur-2xl shadow-2xl overflow-hidden pointer-events-auto relative flex flex-col",
                                "w-full max-h-[85vh] border border-white/20 dark:border-white/10",
                                // Mobile (match MobileMenu)
                                "max-w-sm rounded-[32px]",
                                // Desktop overrides
                                "md:max-w-2xl md:rounded-3xl md:max-h-auto"
                            )}
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            {/* Decorative Background Glows */}
                            <div className="absolute -top-32 -right-32 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                            <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

                            {/* Header */}
                            <div className="relative px-6 py-4 md:px-8 md:py-6 border-b border-gray-200/50 dark:border-white/5 flex items-center justify-between z-10 shrink-0">
                                <div>
                                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                                        分類瀏覽
                                        <span className="text-primary ml-1">.</span>
                                    </h2>
                                    <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">
                                        Explore our content by category
                                    </p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-100/50 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 flex items-center justify-center transition-colors text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>

                            {/* Content - Scrollable */}
                            <div className="p-6 md:p-8 relative z-10 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                                <Link
                                    to="/posts"
                                    onClick={onClose}
                                    className="block mb-6 mx-4 p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-white/5 dark:to-white/10 border border-gray-200 dark:border-white/5 hover:border-primary/50 dark:hover:border-primary/50 transition-all group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-white dark:bg-black/20 flex items-center justify-center shadow-sm text-gray-700 dark:text-gray-300 group-hover:scale-110 transition-transform">
                                            <i className="fas fa-archive text-xl"></i>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">全部文章</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">瀏覽所有已發布的文章內容</p>
                                        </div>
                                        <div className="ml-auto opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">
                                            <i className="fas fa-arrow-right text-gray-400 group-hover:text-primary"></i>
                                        </div>
                                    </div>
                                </Link>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 px-4 pb-4 md:pb-0">
                                    {categories.map((category, idx) => (
                                        <motion.div
                                            key={idx}
                                            variants={itemVariants}
                                            initial="hidden"
                                            animate="visible"
                                            transition={{ delay: idx * 0.05 }}
                                        >
                                            <Link
                                                to={category.to}
                                                onClick={onClose}
                                                className="flex flex-col items-center text-center p-4 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:border-primary/50 dark:hover:border-primary/50 transition-all group h-full aspect-square justify-center"
                                            >
                                                <div className={clsx(
                                                    "w-10 h-10 rounded-2xl flex items-center justify-center text-white text-lg mb-2 shadow-md group-hover:scale-110 transition-transform duration-300",
                                                    category.colorClass
                                                )}>
                                                    <i className={clsx("fas", category.icon)}></i>
                                                </div>
                                                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-0.5 group-hover:text-primary transition-colors">
                                                    {category.title}
                                                </h3>
                                                <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight line-clamp-2 px-1">
                                                    {category.desc}
                                                </p>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CategoryModal;
