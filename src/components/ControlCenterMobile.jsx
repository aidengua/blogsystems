import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import ReactMarkdown from 'react-markdown';

const ControlCenterMobile = ({
    isOpen,
    onClose,
    origin,
    activeTab,
    setActiveTab,
    comments,
    tags,
    loadingComments,
    handlePrevPage,
    handleNextPage,
    page
}) => {
    // Animation Variants (Exact match to MobileMenu)
    const startX = origin ? origin.x - window.innerWidth / 2 : 0;
    const startY = origin ? origin.y - window.innerHeight / 2 : 0;

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
            x: startX,
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

    const slideVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 30 : -30,
            opacity: 0,
            scale: 0.95
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1,
            transition: {
                x: { type: "spring", stiffness: 350, damping: 25 },
                opacity: { duration: 0.2 },
                scale: { duration: 0.2 }
            }
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? 30 : -30,
            opacity: 0,
            scale: 0.95,
            transition: { duration: 0.15 }
        })
    };

    // Derived state for direction
    const [[pageState, direction], setPageState] = useState([0, 0]);
    const prevPage = React.useRef(page);

    useEffect(() => {
        prevPage.current = page;
    }, [page]);

    useEffect(() => {
        if (activeTab === 'interactive') setPageState([0, -1]);
        if (activeTab === 'tags') setPageState([1, 1]);
    }, [activeTab]);

    const changeTab = (tab) => {
        const newDir = tab === 'tags' ? 1 : -1;
        setActiveTab(tab);
        setPageState([tab === 'interactive' ? 0 : 1, newDir]);
    };

    return (
        <div className="fixed inset-0 z-[80] lg:hidden flex items-center justify-center p-4 pointer-events-none">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-white/80 dark:bg-black/80 backdrop-blur-2xl rounded-[32px] w-full max-w-sm h-[85vh] shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/20 dark:border-white/10 overflow-hidden flex flex-col pointer-events-auto origin-center relative"
            >
                {/* Decorative Background Glows */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

                {/* Header with Tabs */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200/50 dark:border-white/5 relative z-10 shrink-0">
                    <div className="flex items-center bg-gray-100/50 dark:bg-white/5 rounded-full p-1 border border-white/10">
                        <button
                            onClick={() => changeTab('interactive')}
                            className={clsx(
                                "px-4 py-1.5 rounded-full text-xs font-bold transition-all relative",
                                activeTab === 'interactive'
                                    ? "text-gray-900 dark:text-white"
                                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                            )}
                        >
                            {activeTab === 'interactive' && (
                                <motion.div
                                    layoutId="activeTabMobile"
                                    className="absolute inset-0 bg-white dark:bg-white/10 rounded-full shadow-sm"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10">互動</span>
                        </button>
                        <button
                            onClick={() => changeTab('tags')}
                            className={clsx(
                                "px-4 py-1.5 rounded-full text-xs font-bold transition-all relative",
                                activeTab === 'tags'
                                    ? "text-gray-900 dark:text-white"
                                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                            )}
                        >
                            {activeTab === 'tags' && (
                                <motion.div
                                    layoutId="activeTabMobile"
                                    className="absolute inset-0 bg-white dark:bg-white/10 rounded-full shadow-sm"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10">標籤</span>
                        </button>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100/50 dark:bg-white/10 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-white/20 transition-all active:scale-90"
                    >
                        <i className="fas fa-times text-lg"></i>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden p-0 relative z-10 flex flex-col"> {/* Changed to overflow-hidden, flex-col */}

                    <AnimatePresence mode="popLayout" initial={false} custom={direction}>
                        <motion.div
                            key={activeTab}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 }
                            }}
                            className="p-4 h-full w-full overflow-y-auto overscroll-contain custom-scrollbar touch-pan-y"
                        >
                            {activeTab === 'interactive' ? (
                                <>
                                    {/* Latest Comments */}
                                    <div className="space-y-4 relative min-h-[420px]">
                                        <div className="flex items-center justify-between px-1">
                                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">最新留言</h3>
                                            <div className="flex gap-2">
                                                <button onClick={handlePrevPage} disabled={page <= 1} className="text-gray-400 hover:text-gray-900 disabled:opacity-30">
                                                    <i className="fas fa-chevron-left text-xs"></i>
                                                </button>
                                                <button onClick={handleNextPage} disabled={comments.length < (window.innerWidth < 1024 ? 4 : 6)} className="text-gray-400 hover:text-gray-900 disabled:opacity-30">
                                                    <i className="fas fa-chevron-right text-xs"></i>
                                                </button>
                                            </div>
                                        </div>

                                        {loadingComments ? (
                                            <div className="animate-pulse space-y-3">
                                                {[1, 2, 3, 4].map(i => (
                                                    <div key={i} className="h-[88px] bg-gray-100 dark:bg-white/5 rounded-2xl" />
                                                ))}
                                            </div>
                                        ) : comments.length > 0 ? (
                                            <AnimatePresence mode="wait" custom={direction}>
                                                <motion.div
                                                    key={page}
                                                    custom={direction}
                                                    variants={slideVariants}
                                                    initial="enter"
                                                    animate="center"
                                                    exit="exit"
                                                    className="grid grid-cols-1 gap-3"
                                                >
                                                    {comments.map((comment) => (
                                                        <Link
                                                            key={comment.id}
                                                            to={comment.postSlug ? `/posts/${comment.postSlug}#comment-${comment.id}` : '/essay'}
                                                            onClick={onClose}
                                                            className="flex flex-col justify-center h-[96px] px-4 py-3 bg-white/50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 active:scale-[0.98] transition-transform overflow-hidden relative group"
                                                        >
                                                            <div className="flex items-center gap-3 mb-2 shrink-0">
                                                                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 shrink-0 text-xs font-bold shadow-sm">
                                                                    {comment.author?.[0]?.toUpperCase() || 'A'}
                                                                </div>
                                                                <div className="min-w-0 flex-1">
                                                                    <div className="flex items-baseline justify-between gap-2">
                                                                        <span className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[120px]">{comment.author}</span>
                                                                        <span className="text-[10px] text-gray-400 font-mono tabular-nums shrink-0">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed h-[36px] overflow-hidden">
                                                                <ReactMarkdown components={{ p: ({ node, ...props }) => <span {...props} /> }}>{comment.content}</ReactMarkdown>
                                                            </div>
                                                            {/* Hover effect indicator */}
                                                            <div className="absolute right-0 top-0 bottom-0 w-1 bg-blue-500/0 group-hover:bg-blue-500/50 transition-colors" />
                                                        </Link>
                                                    ))}
                                                </motion.div>
                                            </AnimatePresence>
                                        ) : (
                                            <div className="text-center py-4 text-gray-400 text-sm">暫無留言</div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                /* Tags Cloud */
                                <div className="flex flex-wrap gap-2 content-start">
                                    {tags.map(([tag, count]) => (
                                        <Link
                                            key={tag}
                                            to={`/tags/${tag}`}
                                            onClick={onClose}
                                            className="px-3 py-1.5 rounded-xl bg-white/50 dark:bg-white/5 border border-gray-100 dark:border-white/5 text-xs text-gray-600 dark:text-gray-300 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all flex items-center gap-1"
                                        >
                                            #{tag}
                                            <span className="opacity-60 text-[9px]">{count}</span>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default ControlCenterMobile;
