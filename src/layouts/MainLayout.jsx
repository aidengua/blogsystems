import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { navigationGroups } from '../config/navigation';

// Inline MobileMenu for performance optimization (avoid separate chunk loading)
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

    // ControlCenterModal style animation
    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 }
    };

    const menuVariants = {
        hidden: { y: -100, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                damping: 25,
                stiffness: 200
            }
        },
        exit: {
            y: -50,
            opacity: 0,
            transition: { duration: 0.2 }
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={overlayVariants}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 z-40 lg:hidden touch-none"
                    />

                    {/* Menu Container */}
                    <div className="fixed inset-x-4 top-20 z-50 lg:hidden pointer-events-none flex flex-col items-center">
                        <motion.div
                            variants={menuVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="w-full max-w-sm bg-[#1e1e1e] border border-white/10 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col max-h-[80vh] will-change-transform"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10">
                                        <img
                                            src="https://cloud.dragoncode.dev/f/BgjC8/avatar.jpg"
                                            alt="Avatar"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <span className="font-bold text-white text-sm">夢想家音響工作室</span>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-gray-400 hover:text-white hover:bg-white/20 transition-colors"
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>

                            {/* Scrollable Content */}
                            <div className="overflow-y-auto overscroll-contain p-2 custom-scrollbar">
                                {/* Main Links (Home) */}
                                <div className="mb-2">
                                    <Link
                                        to="/"
                                        onClick={onClose}
                                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 active:bg-white/10 transition-colors"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                                            <i className="fas fa-home"></i>
                                        </div>
                                        <span className="text-gray-200 font-medium text-sm">首頁</span>
                                    </Link>
                                </div>

                                {/* Dynamic Groups */}
                                <div className="space-y-4">
                                    {navigationGroups.map((group, idx) => (
                                        <div key={idx} className="px-2">
                                            <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 ml-2">
                                                {group.title}
                                            </h4>
                                            <div className="flex flex-col gap-2">
                                                {group.items.map((item, itemIdx) => (
                                                    <Link
                                                        key={itemIdx}
                                                        to={item.to}
                                                        onClick={onClose}
                                                        className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 active:scale-[0.98] transition-all"
                                                    >
                                                        <div className={clsx("w-8 h-8 rounded-lg flex items-center justify-center text-sm shadow-sm", item.color, item.bg)}>
                                                            <i className={clsx("fas", item.icon.replace('fas ', '').replace('fa ', ''))}></i>
                                                        </div>
                                                        <span className="text-gray-200 text-sm font-medium">{item.label}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-3 border-t border-white/5 bg-black/20 text-center">
                                <p className="text-[10px] text-gray-600">
                                    &copy; 2025 Dreamers Audio.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

const MainLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();
    const isAdmin = location.pathname.startsWith('/admin');

    return (
        <div className="min-h-screen flex flex-col relative">
            {/* Background Decoration */}
            <div className="fixed inset-0 pointer-events-none z-0">

            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
                {!isAdmin && <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />}

                <main className="flex-grow w-full">
                    {children}
                </main>

                <Footer />

                {/* Mobile Menu Overlay */}
                <MobileMenu isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            </div>
        </div>
    );
};

export default MainLayout;
