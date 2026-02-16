import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase';
import { navigationGroups } from '../config/navigation';

const MobileMenu = ({ isOpen, onClose, origin, onOpenCategoryModal }) => {
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
            // Ensure style is cleaned up on unmount
            document.body.style.removeProperty('overflow');
        };
    }, [isOpen]);


    // Animation Variants
    const startX = origin ? origin.x - window.innerWidth / 2 : 0;
    const startY = origin ? origin.y - window.innerHeight / 2 : 0;

    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.3 } },
        exit: { opacity: 0, transition: { duration: 0.2 } }
    };

    const containerVariants = {
        hidden: {
            opacity: 0,
            scale: 0.8,
            x: startX,
            y: startY,
            clipPath: "circle(0% at 50% 50%)"
        },
        visible: {
            opacity: 1,
            scale: 1,
            x: 0,
            y: 0,
            clipPath: "circle(150% at 50% 50%)",
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30,
                mass: 0.8,
                staggerChildren: 0.05,
                delayChildren: 0.1
            }
        },
        exit: {
            opacity: 0,
            scale: 0.9,
            x: startX, // Optional: return to origin
            y: startY,
            clipPath: "circle(0% at 50% 50%)",
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.9 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { type: "spring", stiffness: 400, damping: 20 }
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
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 lg:hidden"
                    />

                    {/* Menu Container */}
                    <div className="fixed inset-0 z-[60] lg:hidden flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="bg-white/80 dark:bg-black/80 backdrop-blur-2xl rounded-[32px] w-full max-w-sm max-h-[85vh] shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/20 dark:border-white/10 overflow-hidden flex flex-col pointer-events-auto origin-center relative"
                        >
                            {/* Decorative Background Glows */}
                            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
                            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200/50 dark:border-white/5 relative z-10">
                                <motion.div
                                    className="flex items-center gap-3"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
                                >
                                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/50 dark:border-white/10 shadow-sm">
                                        <img
                                            src="https://cloud.dragoncode.dev/f/BgjC8/avatar.jpg"
                                            alt="Avatar"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <span className="font-bold text-gray-900 dark:text-white text-lg block leading-tight">夢想家音響工作室</span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Dreamers Audio Blog</span>
                                    </div>
                                </motion.div>
                                <motion.button
                                    initial={{ opacity: 0, rotate: -90 }}
                                    animate={{ opacity: 1, rotate: 0, transition: { delay: 0.2 } }}
                                    onClick={onClose}
                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100/50 dark:bg-white/10 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/20 transition-all active:scale-90"
                                >
                                    <i className="fas fa-times text-lg"></i>
                                </motion.button>
                            </div>

                            {/* Scrollable Content */}
                            <div className="overflow-y-auto overscroll-contain p-4 space-y-6 flex-1 relative z-10 custom-scrollbar">

                                {/* Home Section */}
                                <motion.div variants={itemVariants}>
                                    <Link
                                        to="/"
                                        onClick={onClose}
                                        className="flex items-center gap-4 p-4 rounded-2xl bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 active:scale-[0.98] transition-all border border-gray-100/50 dark:border-white/5 shadow-sm group"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center text-blue-500 dark:text-blue-400 text-xl group-hover:scale-110 transition-transform">
                                            <i className="fas fa-home"></i>
                                        </div>
                                        <div>
                                            <span className="text-gray-900 dark:text-white font-bold text-base block">首頁</span>
                                            <span className="text-gray-500 dark:text-gray-400 text-xs">回到網站首頁</span>
                                        </div>
                                    </Link>
                                </motion.div>

                                {/* Navigation Groups */}
                                <div className="space-y-6">
                                    {navigationGroups.map((group, idx) => {
                                        let items = group.items.map(item => {
                                            if (item.id === 'category-modal') {
                                                return {
                                                    ...item,
                                                    isAction: true,
                                                    onClick: onOpenCategoryModal
                                                };
                                            }
                                            return item;
                                        });
                                        // Inject Random Post into '關於'
                                        if (group.title === "關於") {
                                            items = [
                                                {
                                                    label: "隨便逛逛",
                                                    icon: "fas fa-random",
                                                    color: "text-yellow-500",
                                                    bg: "bg-yellow-500/10 dark:bg-yellow-500/20",
                                                    isAction: true,
                                                    onClick: handleRandomPost
                                                },
                                                ...group.items
                                            ];
                                        }

                                        const isAboutGroup = group.title === "關於";
                                        const gridClass = isAboutGroup ? "grid-cols-2" : "grid-cols-3";

                                        return (
                                            <motion.div key={idx} variants={itemVariants} className="space-y-2">
                                                {!['文庫', '創作'].includes(group.title) && (
                                                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-1 flex items-center gap-2">
                                                        <span className="w-full h-px bg-gray-200 dark:bg-white/10"></span>
                                                        <span className="whitespace-nowrap">{group.title}</span>
                                                        <span className="w-full h-px bg-gray-200 dark:bg-white/10"></span>
                                                    </h4>
                                                )}

                                                <div className={`grid ${gridClass} gap-2`}>
                                                    {items.map((item, itemIdx) => {
                                                        const Content = () => (
                                                            <>
                                                                <div className={clsx(
                                                                    "rounded-xl flex items-center justify-center text-lg shadow-sm group-active:scale-90 transition-transform duration-300",
                                                                    item.color, item.bg,
                                                                    isAboutGroup ? "w-8 h-8" : "w-10 h-10 mb-1"
                                                                )}>
                                                                    <i className={clsx("fas", item.icon.replace('fas ', '').replace('fa ', ''))}></i>
                                                                </div>
                                                                <span className={clsx(
                                                                    "text-gray-600 dark:text-gray-300 font-medium leading-tight line-clamp-1 transition-colors group-hover:text-gray-900 dark:group-hover:text-white",
                                                                    isAboutGroup ? "text-xs" : "text-[11px] px-1"
                                                                )}>
                                                                    {item.label}
                                                                </span>
                                                            </>
                                                        );

                                                        const className = clsx(
                                                            "flex items-center justify-center p-2 rounded-2xl bg-white/50 dark:bg-white/5 border border-gray-100/50 dark:border-white/5 hover:bg-white dark:hover:bg-white/10 hover:shadow-md dark:hover:shadow-none active:scale-[0.98] transition-all w-full group relative overflow-hidden",
                                                            isAboutGroup ? "flex-row gap-3 h-12 text-left" : "flex-col gap-1 h-20 text-center"
                                                        );

                                                        // Hover Effect background
                                                        const HoverEffect = () => (
                                                            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                                        );

                                                        if (item.isAction) {
                                                            return (
                                                                <button key={itemIdx} onClick={item.onClick} className={className}>
                                                                    <HoverEffect />
                                                                    <Content />
                                                                </button>
                                                            );
                                                        }

                                                        return (
                                                            <Link key={itemIdx} to={item.to} onClick={onClose} className={className}>
                                                                <HoverEffect />
                                                                <Content />
                                                            </Link>
                                                        );
                                                    })}
                                                </div>
                                            </motion.div>
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

export default MobileMenu;
