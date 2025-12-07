import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

const MobileMenu = ({ isOpen, onClose }) => {
    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const menuVariants = {
        hidden: {
            y: -20,
            scale: 0.8,
            opacity: 0,
            transformOrigin: "top left",
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30,
                mass: 0.8
            }
        },
        visible: {
            y: 0,
            scale: 1,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 80,
                damping: 15,
                mass: 1
            }
        },
        exit: {
            scale: 0.9,
            opacity: 0,
            transition: {
                duration: 0.3,
                ease: "easeInOut"
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    />

                    {/* Dynamic Island Menu */}
                    <motion.div
                        variants={menuVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="fixed top-2 left-2 right-2 z-50 lg:hidden"
                    >
                        <div className="bg-[#1e1e1e]/90 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden text-white">

                            {/* Header: Profile & Close */}
                            <div className="flex items-center justify-between p-4 border-b border-white/10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20">
                                        <img
                                            src="https://cloudflare-imgbed-5re.pages.dev/file/1759506193400_1000004107.jpg"
                                            alt="Avatar"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm">呂宥德</h3>
                                        <p className="text-xs text-gray-400">夢想家音響工作室</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 active:scale-95 transition-all"
                                >
                                    <i className="fas fa-times text-sm"></i>
                                </button>
                            </div>

                            {/* Main Navigation (Flex/Grid) */}
                            <motion.div
                                className="p-4 grid grid-cols-2 gap-3"
                                initial="hidden"
                                animate="visible"
                                transition={{ staggerChildren: 0.05, delayChildren: 0.1 }}
                            >
                                <MenuLink to="/" icon="fa-home" label="首頁" color="bg-blue-500" onClose={onClose} variants={itemVariants} />
                                <MenuLink to="/archives" icon="fa-archive" label="文章列表" color="bg-purple-500" onClose={onClose} variants={itemVariants} />
                                <MenuLink to="/categories" icon="fa-folder" label="分類" color="bg-green-500" onClose={onClose} variants={itemVariants} />
                                <MenuLink to="/tags" icon="fa-tags" label="標籤" color="bg-orange-500" onClose={onClose} variants={itemVariants} />
                            </motion.div>

                            {/* Secondary Links (Horizontal Scroll) */}
                            <div className="px-4 pb-4">
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 px-1">更多內容</p>
                                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                                    <SecondaryLink to="/essay" icon="fa-pen-fancy" label="短文" onClose={onClose} />
                                    <SecondaryLink to="/changelog" icon="fa-history" label="日誌" onClose={onClose} />
                                    <SecondaryLink to="/equipment" icon="fa-tools" label="裝備" onClose={onClose} />
                                    <SecondaryLink to="/about" icon="fa-user" label="關於" onClose={onClose} />
                                </div>
                            </div>

                            {/* Footer Status */}
                            <div className="bg-black/20 p-3 text-center">
                                <span className="text-xs text-gray-500 font-mono">
                                    Dreamers Audio Blog v1.5.1
                                </span>
                            </div>

                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

const MenuLink = ({ to, icon, label, color, onClose, variants }) => (
    <motion.div variants={variants}>
        <Link
            to={to}
            onClick={onClose}
            className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 active:scale-[0.98] transition-all group"
        >
            <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg", color)}>
                <i className={clsx("fas", icon, "text-lg")}></i>
            </div>
            <span className="font-bold text-sm text-gray-200 group-hover:text-white">{label}</span>
        </Link>
    </motion.div>
);

const SecondaryLink = ({ to, icon, label, onClose }) => (
    <Link
        to={to}
        onClick={onClose}
        className="flex-shrink-0 flex flex-col items-center gap-2 p-3 min-w-[70px] rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 transition-all"
    >
        <div className="text-gray-400 group-hover:text-white">
            <i className={clsx("fas", icon)}></i>
        </div>
        <span className="text-xs font-medium text-gray-400">{label}</span>
    </Link>
);

export default MobileMenu;
