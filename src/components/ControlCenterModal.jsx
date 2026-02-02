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

const ControlCenterModal = ({ isOpen, onClose, origin }) => {
    const [activeTab, setActiveTab] = useState('interactive');
    const [comments, setComments] = useState([]);
    const [tags, setTags] = useState([]);
    const [loadingComments, setLoadingComments] = useState(true);
    const [loadingTags, setLoadingTags] = useState(true);
    const [page, setPage] = useState(1);
    const [lastDocs, setLastDocs] = useState([]);
    const { isDark, toggleTheme } = useTheme();
    const {
        smoothScrollEnabled,
        toggleSmoothScroll,
        customContextMenuEnabled,
        toggleCustomContextMenu,
        customCursorEnabled,
        toggleCustomCursor
    } = useSettings();

    // Fetch Tags
    const fetchTags = async () => {
        setLoadingTags(true);
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
        } finally {
            setLoadingTags(false);
        }
    };

    // Fetch Comments with Pagination
    const fetchComments = async (targetPage) => {
        setLoadingComments(true);
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
            setLoadingComments(false);
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

    // Calculate start position relative to center
    const startX = origin ? origin.x - window.innerWidth / 2 : 0;
    const startY = origin ? origin.y - window.innerHeight / 2 : 0;

    const mobileModalVariants = {
        hidden: {
            opacity: 0,
            scale: 0.1,
            x: startX,
            y: startY,
        },
        visible: {
            opacity: 1,
            scale: 1,
            x: 0,
            y: 0,
            transition: {
                type: "spring",
                damping: 25,
                stiffness: 200
            }
        },
        exit: {
            opacity: 0,
            scale: 0.1,
            x: startX,
            y: startY,
            transition: { duration: 0.2 }
        }
    };

    const desktopModalVariants = {
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

    const slideVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 100 : -100, // Reduced distance for cleaner effect? No, percent is safer for responsiveness
            opacity: 0,
            position: 'absolute' // Important for overlapping slides
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            position: 'relative' // Reset to relative when active
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? 100 : -100,
            opacity: 0,
            position: 'absolute'
        })
    };

    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset, velocity) => {
        return Math.abs(offset) * velocity;
    };

    // Derived state for direction
    const [[pageState, direction], setPageState] = useState([0, 0]);
    // Sync pageState with activeTab
    useEffect(() => {
        if (activeTab === 'interactive') setPageState([0, -1]);
        if (activeTab === 'tags') setPageState([1, 1]);
    }, [activeTab]);

    const changeTab = (tab) => {
        const newDir = tab === 'tags' ? 1 : -1;
        setActiveTab(tab);
        setPageState([tab === 'interactive' ? 0 : 1, newDir]);
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
                        className="absolute inset-0 bg-black/60"
                        onClick={onClose}
                    ></div>

                    {/* Main Container Wrapper */}
                    <div className="relative w-full max-w-6xl h-[85vh] flex flex-col gap-6 pointer-events-none">

                        {/* Mobile Layout (Single Card with Slide) */}
                        <motion.div
                            variants={mobileModalVariants}
                            className="flex lg:hidden flex-col h-full bg-gray-50 dark:bg-[#0f0f11] border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden relative shadow-xl pointer-events-auto origin-center"
                        >
                            {/* Mobile Header with Tabs */}
                            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-white/10 bg-white/50 dark:bg-[#1c1c1e]/50 backdrop-blur-sm z-10">
                                <div className="flex items-center bg-gray-200 dark:bg-white/10 rounded-full p-1">
                                    <button
                                        onClick={() => changeTab('interactive')}
                                        className={clsx(
                                            "px-4 py-1.5 rounded-full text-xs font-bold transition-all",
                                            activeTab === 'interactive'
                                                ? "bg-white dark:bg-[#1c1c1e] text-black dark:text-white shadow-sm"
                                                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                                        )}
                                    >
                                        互動
                                    </button>
                                    <button
                                        onClick={() => changeTab('tags')}
                                        className={clsx(
                                            "px-4 py-1.5 rounded-full text-xs font-bold transition-all",
                                            activeTab === 'tags'
                                                ? "bg-white dark:bg-[#1c1c1e] text-black dark:text-white shadow-sm"
                                                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                                        )}
                                    >
                                        標籤
                                    </button>
                                </div>
                                <div className="text-xs text-gray-400 dark:text-gray-500 font-mono">
                                    {activeTab === 'interactive' ? `Page ${page}` : `${tags.length} Tags`}
                                </div>
                            </div>
                            {/* Mobile Content (Sliding) */}
                            <div className="flex-1 relative overflow-hidden">
                                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                                    {activeTab === 'interactive' ? (
                                        <motion.div
                                            key="interactive"
                                            custom={direction}
                                            variants={slideVariants}
                                            initial="enter"
                                            animate="center"
                                            exit="exit"
                                            transition={{
                                                x: { type: "spring", stiffness: 300, damping: 30 },
                                                opacity: { duration: 0.2 }
                                            }}
                                            className="absolute inset-0 p-4 flex flex-col h-full w-full"
                                        >
                                            {/* Interaction Content Reuse */}
                                            <div className="flex items-center justify-between mb-4">
                                                <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">最近評論</h2>
                                                <div className="flex items-center gap-2">
                                                    {page > 1 && (
                                                        <button
                                                            onClick={handlePrevPage}
                                                            className="group w-8 h-8 rounded-full bg-white/50 dark:bg-white/5 backdrop-blur-md border border-gray-200/50 dark:border-white/10 flex items-center justify-center transition-all duration-300 hover:bg-white dark:hover:bg-white/20 hover:shadow-lg dark:hover:shadow-black/50"
                                                        >
                                                            <i className="fas fa-chevron-left text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors text-[10px]"></i>
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={handleNextPage}
                                                        disabled={comments.length < 6}
                                                        className={clsx(
                                                            "group w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 border backdrop-blur-md",
                                                            comments.length < 6
                                                                ? "bg-gray-100/50 dark:bg-white/5 border-transparent opacity-50 cursor-not-allowed"
                                                                : "bg-white/50 dark:bg-white/5 border-gray-200/50 dark:border-white/10 hover:bg-white dark:hover:bg-white/20 hover:shadow-lg dark:hover:shadow-black/50"
                                                        )}
                                                    >
                                                        <i className={clsx(
                                                            "fas fa-chevron-right transition-colors text-[10px]",
                                                            comments.length < 6
                                                                ? "text-gray-400 dark:text-gray-600"
                                                                : "text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                                                        )}></i>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar pr-1 pb-16"> {/* pb-16 for extra scroll space */}
                                                <div className="grid grid-cols-1 gap-3">
                                                    {comments.map((comment) => (
                                                        <div key={comment.id} className="relative group/card">
                                                            <Link
                                                                to={comment.postSlug ? `/posts/${comment.postSlug}#comment-${comment.id}` : '/essay'}
                                                                onClick={onClose}
                                                                className="block bg-white dark:bg-[#18181b] p-3 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm"
                                                            >
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#709CEF] to-[#5B89E5] flex items-center justify-center text-[10px] text-white">
                                                                        {comment.author?.charAt(0).toUpperCase() || 'U'}
                                                                    </div>
                                                                    <span className="font-bold text-gray-800 dark:text-gray-200 text-xs">{comment.author}</span>
                                                                    <span className="text-[10px] text-gray-400 ml-auto">{comment.createdAt.toLocaleDateString()}</span>
                                                                </div>
                                                                <div className="text-gray-600 dark:text-gray-400 text-xs line-clamp-2 leading-relaxed mb-2">
                                                                    <ReactMarkdown components={{ p: ({ node, ...props }) => <span {...props} /> }}>{comment.content}</ReactMarkdown>
                                                                </div>
                                                                <div className="flex items-center gap-1 text-[10px] text-gray-400">
                                                                    <i className="fas fa-arrow-turn-up rotate-90"></i>
                                                                    <span className="truncate">{comment.postTitle || '文章'}</span>
                                                                </div>
                                                            </Link>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="tags"
                                            custom={direction}
                                            variants={slideVariants}
                                            initial="enter"
                                            animate="center"
                                            exit="exit"
                                            transition={{
                                                x: { type: "spring", stiffness: 300, damping: 30 },
                                                opacity: { duration: 0.2 }
                                            }}
                                            className="absolute inset-0 p-4 flex flex-col h-full w-full"
                                        >
                                            {/* Tags Content Reuse */}
                                            <div className="mb-4">
                                                <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">感興趣的領域</h2>
                                            </div>
                                            <div className="flex-1 overflow-y-auto custom-scrollbar pb-16">
                                                <div className="flex flex-wrap gap-2">
                                                    {tags.map(([tag, count], index) => (
                                                        <Link
                                                            key={tag}
                                                            to={`/tags/${tag}`}
                                                            onClick={onClose}
                                                            className={clsx(
                                                                "inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold transition-all border",
                                                                index < 3
                                                                    ? "bg-white dark:bg-white text-gray-900 dark:text-black border-gray-200 dark:border-white"
                                                                    : "bg-gray-100 dark:bg-[#18181b] text-gray-600 dark:text-gray-300 border-gray-200 dark:border-white/10"
                                                            )}
                                                        >
                                                            <span>{tag}</span>
                                                            <sup className="ml-1 text-[9px] text-gray-400">{count}</sup>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                        </motion.div>

                        <motion.div
                            variants={desktopModalVariants}
                            className="hidden lg:flex flex-col gap-6 min-h-0 pointer-events-auto flex-1"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0 flex-1">
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
                                            {page > 1 && (
                                                <button
                                                    onClick={handlePrevPage}
                                                    className="group w-10 h-10 rounded-full bg-white/50 dark:bg-white/5 backdrop-blur-md border border-gray-200/50 dark:border-white/10 flex items-center justify-center transition-all duration-300 hover:bg-white dark:hover:bg-white/20 hover:shadow-lg dark:hover:shadow-black/50"
                                                >
                                                    <i className="fas fa-chevron-left text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors text-xs"></i>
                                                </button>
                                            )}
                                            <button
                                                onClick={handleNextPage}
                                                disabled={comments.length < 6}
                                                className={clsx(
                                                    "group w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border backdrop-blur-md",
                                                    comments.length < 6
                                                        ? "bg-gray-100/50 dark:bg-white/5 border-transparent opacity-50 cursor-not-allowed"
                                                        : "bg-white/50 dark:bg-white/5 border-gray-200/50 dark:border-white/10 hover:bg-white dark:hover:bg-white/20 hover:shadow-lg dark:hover:shadow-black/50"
                                                )}
                                            >
                                                <i className={clsx(
                                                    "fas fa-chevron-right transition-colors text-xs",
                                                    comments.length < 6
                                                        ? "text-gray-400 dark:text-gray-600"
                                                        : "text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                                                )}></i>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar pr-2 -mr-2 space-y-4">
                                        {loadingComments && comments.length === 0 ? (
                                            <div className="flex items-center justify-center h-full text-gray-500">
                                                <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mr-2"></div>
                                                Loading...
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
                                <div className="bg-gray-50 dark:bg-[#0f0f11] border border-gray-200 dark:border-white/10 rounded-3xl p-6 flex flex-col overflow-hidden relative shadow-xl transition-all">
                                    {/* Close Button Inside Tags Card */}
                                    <button
                                        onClick={onClose}
                                        className="group absolute top-6 right-6 w-10 h-10 rounded-full bg-white/50 dark:bg-white/5 backdrop-blur-md border border-gray-200/50 dark:border-white/10 flex items-center justify-center transition-all duration-300 hover:bg-white dark:hover:bg-white/20 hover:shadow-lg dark:hover:shadow-black/50 z-50"
                                    >
                                        <i className="fas fa-times text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors text-xs"></i>
                                    </button>

                                    <div className="mb-6">
                                        <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-1">標籤</h3>
                                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">尋找感興趣的領域</h2>
                                    </div>

                                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                                        {loadingTags ? (
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


                            {/* Bottom Bar: Settings */}
                            <div className="bg-white/80 dark:bg-[#0f0f11]/80 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-full p-2 flex items-center justify-between shadow-2xl">
                                <div className="flex items-center gap-2 px-3">
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">偏好設定</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    {/* Theme Toggle */}
                                    <button
                                        onClick={(e) => toggleTheme(e)}
                                        className="flex items-center justify-center lg:justify-start gap-0 lg:gap-3 p-2 lg:px-4 lg:py-2 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors aspect-square lg:aspect-auto"
                                    >
                                        <div className={clsx(
                                            "w-6 h-6 rounded-full flex items-center justify-center transition-colors",
                                            isDark ? "bg-amber-400 text-black" : "bg-blue-500 text-white"
                                        )}>
                                            <i className={clsx("fas text-xs", isDark ? "fa-moon" : "fa-sun")}></i>
                                        </div>
                                        <span className="hidden lg:inline text-sm font-bold text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                                            {isDark ? '深色模式' : '淺色模式'}
                                        </span>
                                    </button>

                                    {/* Smooth Scroll Toggle */}
                                    <button
                                        onClick={toggleSmoothScroll}
                                        className={clsx(
                                            "flex items-center justify-center lg:justify-start gap-0 lg:gap-3 p-2 lg:px-4 lg:py-2 rounded-full transition-all duration-300 group border aspect-square lg:aspect-auto",
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
                                            "hidden lg:inline text-sm font-bold transition-colors",
                                            smoothScrollEnabled
                                                ? "text-orange-600 dark:text-orange-400"
                                                : "text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white"
                                        )}>
                                            滑動阻尼
                                        </span>
                                    </button>

                                    {/* Custom Context Menu Toggle */}
                                    <button
                                        onClick={toggleCustomContextMenu}
                                        className={clsx(
                                            "hidden lg:flex items-center gap-3 px-4 py-2 rounded-full transition-all duration-300 group border",
                                            customContextMenuEnabled
                                                ? "bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/20"
                                                : "bg-gray-100 dark:bg-white/5 border-transparent hover:bg-gray-200 dark:hover:bg-white/10"
                                        )}
                                    >
                                        <div className={clsx(
                                            "w-6 h-6 rounded-full flex items-center justify-center transition-colors",
                                            customContextMenuEnabled ? "bg-indigo-500 text-white" : "bg-gray-400 text-white"
                                        )}>
                                            <i className="fas fa-mouse-pointer text-xs"></i>
                                        </div>
                                        <span className={clsx(
                                            "text-sm font-bold transition-colors",
                                            customContextMenuEnabled
                                                ? "text-indigo-600 dark:text-indigo-400"
                                                : "text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white"
                                        )}>
                                            右鍵菜單
                                        </span>
                                    </button>

                                    {/* Custom Cursor Toggle */}
                                    <button
                                        onClick={toggleCustomCursor}
                                        className={clsx(
                                            "hidden lg:flex items-center gap-3 px-4 py-2 rounded-full transition-all duration-300 group border",
                                            customCursorEnabled
                                                ? "bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20"
                                                : "bg-gray-100 dark:bg-white/5 border-transparent hover:bg-gray-200 dark:hover:bg-white/10"
                                        )}
                                    >
                                        <div className={clsx(
                                            "w-6 h-6 rounded-full flex items-center justify-center transition-colors",
                                            customCursorEnabled ? "bg-rose-500 text-white" : "bg-gray-400 text-white"
                                        )}>
                                            <i className="fas fa-location-arrow text-xs transform -rotate-45"></i>
                                        </div>
                                        <span className={clsx(
                                            "text-sm font-bold transition-colors",
                                            customCursorEnabled
                                                ? "text-rose-600 dark:text-rose-400"
                                                : "text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white"
                                        )}>
                                            風格游標
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence >,
        document.body
    );
};
export default ControlCenterModal;
