import { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { navigationGroups } from '../config/navigation';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase';

// Inline MobileMenu for performance optimization (avoid separate chunk loading)
const MobileMenu = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    // Random Post Logic
    const handleRandomPost = async (e) => {
        e.preventDefault();
        onClose();
        try {
            const q = query(collection(db, 'posts'), where('status', '==', 'published'));
            const querySnapshot = await getDocs(q);
            const posts = querySnapshot.docs.map(doc => doc.data());

            if (posts.length > 0) {
                const randomPost = posts[Math.floor(Math.random() * posts.length)];
                navigate(`/posts/${randomPost.slug}`);
            }
        } catch (error) {
            console.error("Error fetching random post:", error);
        }
    };

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

    // Modal Animation Variants (Centered with Jelly effect)
    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 }
    };

    const modalVariants = {
        hidden: {
            opacity: 0,
            scale: 0.9,
            y: "50%" // Start slightly lower for popup effect
        },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                type: "spring",
                damping: 25, // Higher damping = less bounce ("smooth")
                stiffness: 320, // High stiffness = fast response
                mass: 1
            }
        },
        exit: {
            opacity: 0,
            scale: 0.9,
            y: "50%",
            transition: {
                duration: 0.2,
                ease: "easeOut"
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0 }
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

                    {/* Centered Modal Container */}
                    <div className="fixed inset-0 z-50 lg:hidden flex items-center justify-center pointer-events-none p-4">
                        <motion.div
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="w-full max-w-sm bg-white dark:bg-[#1c1c1e] rounded-[30px] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] border border-gray-200 dark:border-white/10 pointer-events-auto"
                        >
                            {/* Valid Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 dark:border-white/10">
                                        <img
                                            src="https://cloud.dragoncode.dev/f/BgjC8/avatar.jpg"
                                            alt="Avatar"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <span className="font-bold text-gray-900 dark:text-white text-lg block leading-tight">夢想家音響工作室</span>
                                        <span className="text-xs text-gray-500 font-medium">Dreamers Audio Blog</span>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/10 text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/20 transition-colors"
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>

                            {/* Scrollable Content */}
                            <div className="overflow-y-auto overscroll-contain p-4 pb-6 custom-scrollbar flex-1">
                                {/* Main Links (Home) */}
                                <div className="mb-4">
                                    <Link
                                        to="/"
                                        onClick={onClose}
                                        className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-white/5 active:bg-gray-100 dark:active:bg-white/10 transition-colors border border-gray-100 dark:border-white/5"
                                    >
                                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 text-lg">
                                            <i className="fas fa-home"></i>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-gray-900 dark:text-white font-bold text-base">首頁</span>
                                            <span className="text-gray-500 text-xs">回到網站首頁</span>
                                        </div>
                                    </Link>
                                </div>

                                {/* Dynamic Groups */}
                                <div className="space-y-4">
                                    {navigationGroups.map((group, idx) => {
                                        // Inject Random Post into '關於' (About/Author) group
                                        let items = group.items;
                                        if (group.title === "關於") {
                                            items = [
                                                {
                                                    label: "隨便逛逛",
                                                    icon: "fas fa-random",
                                                    color: "text-yellow-400",
                                                    bg: "bg-yellow-500/20",
                                                    isAction: true,
                                                    onClick: handleRandomPost
                                                },
                                                ...group.items
                                            ];
                                        }
                                        // Determine Layout based on group
                                        const isAboutGroup = group.title === "關於";
                                        const gridClass = isAboutGroup ? "grid-cols-2" : "grid-cols-3";

                                        return (
                                            <div key={idx}>
                                                {!['文庫', '創作'].includes(group.title) && (
                                                    <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 px-1">
                                                        {group.title}
                                                    </h4>
                                                )}
                                                <div className={`grid ${gridClass} gap-2`}>
                                                    {items.map((item, itemIdx) => (
                                                        item.isAction ? (
                                                            <button
                                                                key={itemIdx}
                                                                onClick={item.onClick}
                                                                className={clsx(
                                                                    "flex items-center justify-center p-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-white/10 active:scale-[0.98] transition-all w-full group",
                                                                    isAboutGroup ? "flex-row gap-3 h-10 text-left" : "flex-col gap-0.5 h-16 text-center"
                                                                )}
                                                            >
                                                                <div className={clsx(
                                                                    "rounded-lg flex items-center justify-center text-sm shadow-sm group-active:scale-95 transition-transform shrink-0",
                                                                    item.color, item.bg,
                                                                    isAboutGroup ? "w-6 h-6" : "w-6 h-6 mb-0.5"
                                                                )}>
                                                                    <i className={clsx("fas", item.icon.replace('fas ', '').replace('fa ', ''))}></i>
                                                                </div>
                                                                <span className={clsx("text-gray-600 dark:text-gray-300 font-medium leading-tight line-clamp-1", isAboutGroup ? "text-[10px]" : "text-[10px] px-0.5")}>{item.label}</span>
                                                            </button>
                                                        ) : (
                                                            <Link
                                                                key={itemIdx}
                                                                to={item.to}
                                                                onClick={onClose}
                                                                className={clsx(
                                                                    "flex items-center justify-center p-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-white/10 active:scale-[0.98] transition-all w-full group",
                                                                    isAboutGroup ? "flex-row gap-3 h-10 text-left" : "flex-col gap-0.5 h-16 text-center"
                                                                )}
                                                            >
                                                                <div className={clsx(
                                                                    "rounded-lg flex items-center justify-center text-sm shadow-sm group-active:scale-95 transition-transform shrink-0",
                                                                    item.color, item.bg,
                                                                    isAboutGroup ? "w-6 h-6" : "w-6 h-6 mb-0.5"
                                                                )}>
                                                                    <i className={clsx("fas", item.icon.replace('fas ', '').replace('fa ', ''))}></i>
                                                                </div>
                                                                <span className={clsx("text-gray-600 dark:text-gray-300 font-medium leading-tight line-clamp-1", isAboutGroup ? "text-[10px]" : "text-[10px] px-0.5")}>{item.label}</span>
                                                            </Link>
                                                        )
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
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
