import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, orderBy, limit, getDocs, where, startAfter } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import ReactDOM from 'react-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTheme } from '../contexts/ThemeContext';
import { useSettings } from '../context/SettingsContext';

const ControlCenterModal = ({ isOpen, onClose }) => {
    const [comments, setComments] = useState([]);
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [lastDocs, setLastDocs] = useState([]);
    const { isDark, toggleTheme } = useTheme();
    const {
        smoothScrollEnabled,
        toggleSmoothScroll,
        glslBackgroundEnabled,
        toggleGlslBackground,
        currentGlslEffect,
        setCurrentGlslEffect
    } = useSettings();

    // Fetch Tags
    const fetchTags = async () => {
        try {
            const postsQuery = query(
                collection(db, 'posts'),
                where('status', '==', 'published')
            );
            const postsSnap = await getDocs(postsQuery);
            const tagCounts = {};
            postsSnap.docs.forEach(doc => {
                const postTags = doc.data().tags || [];
                postTags.forEach(tag => {
                    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                });
            });
            const sortedTags = Object.entries(tagCounts)
                .sort(([, a], [, b]) => b - a);
            setTags(sortedTags);
        } catch (error) {
            console.error("Error fetching tags:", error);
        }
    };

    // Fetch Comments with Pagination
    const fetchComments = async (targetPage) => {
        setLoading(true);
        try {
            let commentsQuery;

            if (targetPage === 1) {
                commentsQuery = query(
                    collection(db, 'comments'),
                    orderBy('createdAt', 'desc'),
                    limit(6)
                );
            } else {
                const lastDoc = lastDocs[targetPage - 2];
                if (!lastDoc) { // Should not happen if navigation is controlled
                    setLoading(false);
                    return;
                }
                commentsQuery = query(
                    collection(db, 'comments'),
                    orderBy('createdAt', 'desc'),
                    startAfter(lastDoc),
                    limit(6)
                );
            }

            const commentsSnap = await getDocs(commentsQuery);

            // If page > 1 and no results, stay on current page (or handle empty)
            if (targetPage > 1 && commentsSnap.empty) {
                setLoading(false);
                return;
            }

            const commentsData = commentsSnap.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date()
            }));
            setComments(commentsData);
            setPage(targetPage);

            // Update cursors
            if (commentsSnap.docs.length > 0) {
                const newLastDoc = commentsSnap.docs[commentsSnap.docs.length - 1];
                setLastDocs(prev => {
                    const newDocs = [...prev];
                    newDocs[targetPage - 1] = newLastDoc;
                    return newDocs;
                });
            }

        } catch (error) {
            console.error("Error fetching comments:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isOpen) return;
        setPage(1);
        setLastDocs([]);
        fetchComments(1);
        fetchTags();
    }, [isOpen]);

    // Handle Pagination
    const handleNextPage = () => {
        // Optimistic check: if we have 6 items, assume there might be next page
        if (comments.length === 6) {
            fetchComments(page + 1);
        }
    };

    const handlePrevPage = () => {
        if (page > 1) {
            fetchComments(page - 1);
        }
    };

    // Close on Escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.1,
                duration: 0.3
            }
        },
        exit: { opacity: 0, transition: { duration: 0.3 } }
    };

    const modalVariants = {
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

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 300, damping: 20 }
        }
    };

    return ReactDOM.createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    key="control-center-modal"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={containerVariants}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
                >
                    {/* Backdrop - Removed blur as requested */}
                    <div
                        className="absolute inset-0 bg-black/80"
                        onClick={onClose}
                    ></div>

                    {/* Main Container */}
                    <motion.div
                        variants={modalVariants}
                        className="relative w-full max-w-6xl h-[85vh] flex flex-col gap-6"
                    >
                        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
                            {/* Left Column: Recent Comments */}
                            <div className="bg-gray-50 dark:bg-[#0f0f11] border border-gray-200 dark:border-white/10 rounded-3xl p-6 flex flex-col overflow-hidden relative group shadow-xl">
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
                                    <div className="flex items-center gap-2">
                                        {page > 1 && (
                                            <button
                                                onClick={handlePrevPage}
                                                className="w-10 h-10 rounded-full bg-gray-200 dark:bg-white/5 hover:bg-gray-300 dark:hover:bg-white/10 flex items-center justify-center transition-colors text-gray-900 dark:text-white"
                                            >
                                                <i className="fas fa-chevron-left text-gray-600 dark:text-gray-400"></i>
                                            </button>
                                        )}
                                        <button
                                            onClick={handleNextPage}
                                            disabled={comments.length < 6}
                                            className={clsx(
                                                "w-10 h-10 rounded-full flex items-center justify-center transition-colors text-gray-900 dark:text-white",
                                                comments.length < 6
                                                    ? "bg-gray-100 dark:bg-white/5 opacity-50 cursor-not-allowed text-gray-400"
                                                    : "bg-gray-200 dark:bg-white/5 hover:bg-gray-300 dark:hover:bg-white/10"
                                            )}
                                        >
                                            <i className="fas fa-chevron-right text-gray-600 dark:text-gray-400"></i>
                                        </button>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 -mr-2 space-y-4">
                                    {loading ? (
                                        <div className="flex items-center justify-center h-full text-gray-500">
                                            <i className="fas fa-circle-notch fa-spin mr-2"></i> Loading...
                                        </div>
                                    ) : comments.length > 0 ? (
                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={page}
                                                initial={{ opacity: 0, x: 50 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -50 }}
                                                transition={{ duration: 0.3, ease: "easeOut" }}
                                                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                                            >
                                                {comments.map((comment) => (
                                                    <div
                                                        key={comment.id}
                                                        className="relative group/card h-full"
                                                    >
                                                        <Link
                                                            to={comment.postSlug ? `/posts/${comment.postSlug}#comment-${comment.id}` : '/essay'}
                                                            onClick={onClose}
                                                            className="block bg-white dark:bg-[#18181b] p-4 rounded-2xl border border-gray-100 dark:border-white/5 hover:border-blue-200 dark:hover:border-white/20 hover:bg-gray-50 dark:hover:bg-[#202025] hover:shadow-md transition-all h-full flex flex-col"
                                                        >
                                                            <div className="flex items-center justify-between mb-3">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#709CEF] to-[#5B89E5] flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-[#709CEF]/30">
                                                                        {comment.author?.charAt(0).toUpperCase() || 'U'}
                                                                    </div>
                                                                    <span className="font-bold text-gray-800 dark:text-gray-200 text-sm line-clamp-1">{comment.author}</span>
                                                                </div>
                                                                <span className="text-xs text-gray-500 font-mono flex-shrink-0">
                                                                    {comment.createdAt.toLocaleDateString()}
                                                                </span>
                                                            </div>

                                                            <div className="mb-4 flex-grow">
                                                                <div className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 leading-relaxed group-hover/card:text-gray-900 dark:group-hover/card:text-gray-300 transition-colors">
                                                                    <ReactMarkdown
                                                                        remarkPlugins={[remarkGfm]}
                                                                        components={{
                                                                            img: ({ node, ...props }) => (
                                                                                <img
                                                                                    {...props}
                                                                                    className="inline-block w-6 h-6 align-text-bottom mx-0.5"
                                                                                    loading="lazy"
                                                                                />
                                                                            ),
                                                                            p: ({ node, ...props }) => <span {...props} className="mb-0" />
                                                                        }}
                                                                    >
                                                                        {comment.content}
                                                                    </ReactMarkdown>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-600 group-hover/card:text-blue-500 dark:group-hover/card:text-blue-400 transition-colors mt-auto">
                                                                <i className="fas fa-arrow-turn-up rotate-90"></i>
                                                                <span className="truncate max-w-[200px]">{comment.postTitle || '文章'}</span>
                                                            </div>
                                                        </Link>
                                                    </div>
                                                ))}
                                            </motion.div>
                                        </AnimatePresence>
                                    ) : (
                                        <div className="text-center text-gray-500 py-10 flex flex-col items-center">
                                            <i className="far fa-comments text-4xl mb-3 opacity-50"></i>
                                            <span>暫無評論</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right Column: Tags */}
                            <div className="bg-gray-50 dark:bg-[#0f0f11] border border-gray-200 dark:border-white/10 rounded-3xl p-6 flex flex-col overflow-hidden relative shadow-xl">
                                {/* Close Button Inside Tags Card */}
                                <button
                                    onClick={onClose}
                                    className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 dark:bg-white/5 hover:bg-gray-300 dark:hover:bg-white/20 text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white transition-colors z-50"
                                >
                                    <i className="fas fa-times"></i>
                                </button>

                                <div className="mb-6">
                                    <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-1">標籤</h3>
                                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">尋找感興趣的領域</h2>
                                </div>

                                <div className="flex-1 overflow-y-auto custom-scrollbar">
                                    {loading ? (
                                        <div className="flex gap-2">
                                            {[1, 2, 3].map(i => <div key={i} className="h-8 w-16 bg-white/5 rounded-lg animate-pulse"></div>)}
                                        </div>
                                    ) : (
                                        <motion.div
                                            variants={containerVariants}
                                            initial="hidden"
                                            animate="visible"
                                            className="flex flex-wrap gap-2"
                                        >
                                            {tags.map(([tag, count], index) => (
                                                <motion.div key={tag} variants={itemVariants}>
                                                    <Link
                                                        to={`/tags/${tag}`}
                                                        onClick={onClose}
                                                        className={clsx(
                                                            "inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 border",
                                                            index < 3
                                                                ? "bg-white dark:bg-white text-gray-900 dark:text-black border-gray-200 dark:border-white hover:bg-gray-50 dark:hover:bg-gray-200"
                                                                : "bg-gray-100 dark:bg-[#18181b] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:border-blue-400 dark:hover:border-[#709CEF] hover:text-blue-500 dark:hover:text-[#709CEF]"
                                                        )}
                                                    >
                                                        <span className="mr-1">{tag}</span>
                                                        <sup className={clsx(
                                                            "text-[10px] ml-0.5",
                                                            index < 3 ? "text-gray-400 dark:text-gray-500" : "text-gray-400 dark:text-gray-500"
                                                        )}>{count}</sup>
                                                    </Link>
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Middle Bar: Lab Experiments */}
                        <div className="bg-white/80 dark:bg-[#0f0f11]/80 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-3xl p-4 flex flex-col gap-3 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-2 opacity-10 pointer-events-none">
                                <i className="fas fa-flask text-6xl text-purple-500"></i>
                            </div>
                            <div className="flex items-center gap-2 px-1">
                                <i className="fas fa-flask text-purple-500"></i>
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">實驗室 Lab</span>
                            </div>

                            <div
                                className={clsx(
                                    "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 border group overflow-hidden relative",
                                    glslBackgroundEnabled
                                        ? "bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/20"
                                        : "bg-gray-100 dark:bg-white/5 border-transparent hover:bg-gray-200 dark:hover:bg-white/10"
                                )}
                            >
                                <div
                                    onClick={toggleGlslBackground}
                                    className="flex items-center gap-3 cursor-pointer flex-1 select-none"
                                >
                                    <div className={clsx(
                                        "w-8 h-8 rounded-lg flex items-center justify-center transition-colors flex-shrink-0",
                                        glslBackgroundEnabled ? "bg-purple-500 text-white" : "bg-gray-400/20 text-gray-500 dark:text-gray-400"
                                    )}>
                                        <i className="fas fa-dna"></i>
                                    </div>
                                    <div className="text-left">
                                        <div className={clsx(
                                            "text-sm font-bold transition-colors",
                                            glslBackgroundEnabled ? "text-purple-700 dark:text-purple-400" : "text-gray-700 dark:text-gray-300"
                                        )}>
                                            動態背景 GLSL
                                        </div>
                                        <div className="text-[10px] text-gray-400 dark:text-gray-500 font-mono">
                                            Experimental
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <AnimatePresence mode="wait">
                                        {glslBackgroundEnabled ? (
                                            <motion.div
                                                key="options"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                transition={{ duration: 0.3, ease: "easeOut" }}
                                                className="flex items-center gap-2"
                                            >
                                                {[0, 1, 2, 3].map((index) => (
                                                    <button
                                                        key={index}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setCurrentGlslEffect(index);
                                                        }}
                                                        className={clsx(
                                                            "relative w-7 h-7 rounded-md border flex-shrink-0 overflow-hidden transition-all",
                                                            currentGlslEffect === index
                                                                ? "border-purple-500 ring-1 ring-purple-500"
                                                                : "border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20"
                                                        )}
                                                    >
                                                        <div className={clsx(
                                                            "absolute inset-0 opacity-80",
                                                            index === 0 && "bg-gradient-to-br from-blue-400 to-purple-600",
                                                            index === 1 && "bg-gradient-to-br from-emerald-400 to-cyan-600",
                                                            index === 2 && "bg-gradient-to-br from-orange-400 to-rose-600",
                                                            index === 3 && "bg-gradient-to-br from-slate-700 to-black",
                                                        )}></div>
                                                        {currentGlslEffect === index && (
                                                            <div className="absolute inset-0 flex items-center justify-center text-white text-[10px] bg-black/10">
                                                                <i className="fas fa-check text-[8px]"></i>
                                                            </div>
                                                        )}
                                                    </button>
                                                ))}
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="dot"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                exit={{ scale: 0 }}
                                                onClick={toggleGlslBackground}
                                                className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 cursor-pointer"
                                            ></motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Bar: Settings */}
                        <div className="bg-white/80 dark:bg-[#0f0f11]/80 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-full p-2 flex items-center justify-between shadow-2xl">
                            <div className="flex items-center gap-2 px-3">
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">偏好設定</span>
                            </div>

                            <div className="flex items-center gap-2">
                                {/* Theme Toggle */}
                                <button
                                    onClick={toggleTheme}
                                    className="flex items-center gap-3 px-4 py-2 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors group"
                                >
                                    <div className={clsx(
                                        "w-6 h-6 rounded-full flex items-center justify-center transition-colors",
                                        isDark ? "bg-amber-400 text-black" : "bg-blue-500 text-white"
                                    )}>
                                        <i className={clsx("fas text-xs", isDark ? "fa-moon" : "fa-sun")}></i>
                                    </div>
                                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                                        {isDark ? '深色模式' : '淺色模式'}
                                    </span>
                                </button>

                                {/* Smooth Scroll Toggle */}
                                <button
                                    onClick={toggleSmoothScroll}
                                    className={clsx(
                                        "flex items-center gap-3 px-4 py-2 rounded-full transition-all duration-300 group border",
                                        smoothScrollEnabled
                                            ? "bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/20"
                                            : "bg-gray-100 dark:bg-white/5 border-transparent hover:bg-gray-200 dark:hover:bg-white/10"
                                    )}
                                >
                                    <div className={clsx(
                                        "w-6 h-6 rounded-full flex items-center justify-center transition-colors",
                                        smoothScrollEnabled ? "bg-orange-500 text-white" : "bg-gray-400 text-white"
                                    )}>
                                        <i className="fas fa-hand-pointer text-xs transform rotate-180"></i>
                                    </div>
                                    <span className={clsx(
                                        "text-sm font-bold transition-colors",
                                        smoothScrollEnabled
                                            ? "text-orange-600 dark:text-orange-400"
                                            : "text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white"
                                    )}>
                                        滑動阻尼
                                    </span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default ControlCenterModal;
