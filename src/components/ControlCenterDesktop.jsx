import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTheme } from '../contexts/ThemeContext';
import { useSettings } from '../context/SettingsContext';

const ControlCenterDesktop = ({
    isOpen,
    onClose,
    comments,
    tags,
    loadingComments,
    loadingTags,
    page,
    handlePrevPage,
    handleNextPage
}) => {
    const { isDark, toggleTheme } = useTheme();
    const {
        smoothScrollEnabled,
        toggleSmoothScroll,
        customContextMenuEnabled,
        toggleCustomContextMenu,
        customCursorEnabled,
        toggleCustomCursor
    } = useSettings();

    // Desktop Animation Variants
    const desktopModalVariants = {
        hidden: { opacity: 0, scale: 0.95, y: 20 },
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

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.05
            }
        }
    };

    const itemVariants = {
        hidden: { y: 10, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 300, damping: 20 }
        }
    };

    // Track previous page for slide direction
    const prevPage = React.useRef(page);
    useEffect(() => {
        prevPage.current = page;
    }, [page]);

    const slideVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 20 : -20,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
            transition: {
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
            }
        },
        exit: (direction) => ({
            x: direction < 0 ? 20 : -20,
            opacity: 0,
            transition: { duration: 0.2 }
        })
    };

    return (
        <div className="hidden lg:flex fixed inset-0 z-[80] items-center justify-center p-8 pointer-events-none">
            <motion.div
                variants={desktopModalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-white/90 dark:bg-[#18181b]/90 backdrop-blur-2xl w-full max-w-6xl h-[85vh] rounded-3xl shadow-2xl border border-white/20 dark:border-white/10 overflow-hidden flex flex-col pointer-events-auto relative touch-none"
            >
                <div className="flex flex-col h-full gap-6 p-6">
                    <div className="grid grid-cols-2 gap-6 flex-1 min-h-0">
                        {/* Left Column: Recent Comments */}
                        <div className="bg-gray-50 dark:bg-[#0f0f11] border border-gray-200 dark:border-white/10 rounded-3xl p-6 flex flex-col overflow-hidden relative group shadow-xl transition-all">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400">互動</h3>
                                        <span className="bg-white dark:bg-[#1e1e21] text-gray-500 dark:text-gray-400 text-[10px] px-2 py-0.5 rounded-full border border-gray-200 dark:border-white/5 font-mono">
                                            Page {page}
                                        </span>
                                    </div>
                                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">最近評論</h2>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={handlePrevPage}
                                        disabled={page <= 1}
                                        className="group w-10 h-10 rounded-full bg-white/50 dark:bg-white/5 backdrop-blur-md border border-gray-200/50 dark:border-white/10 flex items-center justify-center transition-all duration-300 hover:bg-white dark:hover:bg-white/20 hover:shadow-lg dark:hover:shadow-black/50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <i className="fas fa-chevron-left text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors text-xs"></i>
                                    </button>
                                    <button
                                        onClick={handleNextPage}
                                        disabled={comments.length < 6}
                                        className="group w-10 h-10 rounded-full bg-white/50 dark:bg-white/5 backdrop-blur-md border border-gray-200/50 dark:border-white/10 flex items-center justify-center transition-all duration-300 hover:bg-white dark:hover:bg-white/20 hover:shadow-lg dark:hover:shadow-black/50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <i className="fas fa-chevron-right text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors text-xs"></i>
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 -mr-2 space-y-4 overscroll-contain touch-pan-y">
                                {loadingComments && comments.length === 0 ? (
                                    <div className="flex items-center justify-center h-full text-gray-500">
                                        <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mr-2"></div>
                                        Loading...
                                    </div>
                                ) : comments.length > 0 ? (
                                    <AnimatePresence mode="wait" custom={page > prevPage.current ? 1 : -1}>
                                        <motion.div
                                            key={page}
                                            custom={page > prevPage.current ? 1 : -1}
                                            variants={slideVariants}
                                            initial="enter"
                                            animate="center"
                                            exit="exit"
                                            className="grid grid-cols-2 gap-4"
                                        >
                                            {comments.map((comment) => (
                                                <Link
                                                    key={comment.id}
                                                    to={comment.postSlug ? `/posts/${comment.postSlug}#comment-${comment.id}` : '/essay'}
                                                    onClick={onClose}
                                                    className="block bg-white dark:bg-[#18181b] p-4 rounded-2xl border border-gray-100 dark:border-white/5 hover:border-blue-200 dark:hover:border-white/20 hover:bg-gray-50 dark:hover:bg-[#202025] hover:shadow-md transition-all flex flex-col h-full"
                                                >
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#709CEF] to-[#5B89E5] flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-[#709CEF]/30">
                                                                {comment.author?.charAt(0).toUpperCase() || 'U'}
                                                            </div>
                                                            <span className="font-bold text-gray-800 dark:text-gray-200 text-sm line-clamp-1">{comment.author}</span>
                                                        </div>
                                                        <span className="text-xs text-gray-500 font-mono flex-shrink-0">
                                                            {new Date(comment.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>

                                                    <div className="mb-4 flex-grow">
                                                        <div className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 leading-relaxed">
                                                            <ReactMarkdown remarkPlugins={[remarkGfm]} components={{ p: ({ node, ...props }) => <span {...props} /> }}>
                                                                {comment.content}
                                                            </ReactMarkdown>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-600 mt-auto">
                                                        <i className="fas fa-arrow-turn-up rotate-90"></i>
                                                        <span className="truncate max-w-[200px]">{comment.postTitle || '文章'}</span>
                                                    </div>
                                                </Link>
                                            ))}
                                        </motion.div>
                                    </AnimatePresence>
                                ) : (
                                    <div className="text-center text-gray-500 py-10">暫無評論</div>
                                )}
                            </div>
                        </div>

                        {/* Right Column: Tags */}
                        <div className="bg-gray-50 dark:bg-[#0f0f11] border border-gray-200 dark:border-white/10 rounded-3xl p-6 flex flex-col overflow-hidden relative shadow-xl transition-all">
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/50 dark:bg-white/5 backdrop-blur-md border border-gray-200/50 dark:border-white/10 flex items-center justify-center transition-all duration-300 hover:bg-white dark:hover:bg-white/20 hover:shadow-lg dark:hover:shadow-black/50 z-50"
                            >
                                <i className="fas fa-times text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"></i>
                            </button>

                            <div className="mb-6">
                                <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-1">標籤</h3>
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">尋找感興趣的領域</h2>
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                                {loadingTags ? (
                                    <div className="flex gap-2 animate-pulse">
                                        {[1, 2, 3].map(i => <div key={i} className="h-8 w-16 bg-gray-200 dark:bg-white/5 rounded-lg"></div>)}
                                    </div>
                                ) : (
                                    <motion.div
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="visible"
                                        className="flex flex-wrap gap-2"
                                    >
                                        {tags.map(([tag, count]) => (
                                            <motion.div key={tag} variants={itemVariants}>
                                                <Link
                                                    to={`/tags/${tag}`}
                                                    onClick={onClose}
                                                    className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 border bg-white dark:bg-white/5 border-gray-200 dark:border-white/5 hover:border-blue-400 hover:text-blue-500"
                                                >
                                                    <span className="mr-1">{tag}</span>
                                                    <sup className="text-[10px] opacity-60">{count}</sup>
                                                </Link>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar: Settings */}
                    <div className="bg-white/80 dark:bg-[#0f0f11]/80 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-full p-2 flex items-center justify-between shadow-large">
                        <div className="flex items-center gap-2 px-3">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">偏好設定</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={toggleTheme}
                                className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                            >
                                <i className={clsx("fas", isDark ? "fa-moon" : "fa-sun")}></i>
                                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                                    {isDark ? '深色模式' : '淺色模式'}
                                </span>
                            </button>
                            <button
                                onClick={toggleSmoothScroll}
                                className={clsx(
                                    "flex items-center gap-2 px-4 py-2 rounded-full transition-colors",
                                    smoothScrollEnabled ? "bg-orange-50 text-orange-600 border border-orange-200" : "hover:bg-gray-100 dark:hover:bg-white/5"
                                )}
                            >
                                <i className="fas fa-hand-pointer transform rotate-180"></i>
                                <span className="text-sm font-bold">滑動阻尼</span>
                            </button>
                            <button
                                onClick={toggleCustomContextMenu}
                                className={clsx(
                                    "flex items-center gap-2 px-4 py-2 rounded-full transition-colors",
                                    customContextMenuEnabled ? "bg-indigo-50 text-indigo-600 border border-indigo-200" : "hover:bg-gray-100 dark:hover:bg-white/5"
                                )}
                            >
                                <i className="fas fa-mouse-pointer"></i>
                                <span className="text-sm font-bold">右鍵菜單</span>
                            </button>
                            <button
                                onClick={toggleCustomCursor}
                                className={clsx(
                                    "flex items-center gap-2 px-4 py-2 rounded-full transition-colors",
                                    customCursorEnabled ? "bg-rose-50 text-rose-600 border border-rose-200" : "hover:bg-gray-100 dark:hover:bg-white/5"
                                )}
                            >
                                <i className="fas fa-location-arrow transform -rotate-45"></i>
                                <span className="text-sm font-bold">風格游標</span>
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ControlCenterDesktop;
