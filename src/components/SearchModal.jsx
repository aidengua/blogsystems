import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import Fuse from 'fuse.js';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase';

const SearchModal = ({ isOpen, onClose }) => {
    const [queryText, setQueryText] = useState('');
    const [results, setResults] = useState([]);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef(null);
    const modalRef = useRef(null);

    // Fetch posts for search index
    useEffect(() => {
        const fetchPosts = async () => {
            if (posts.length > 0) return; // Already fetched

            setLoading(true);
            try {
                // Fetch all published posts
                const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
                const querySnapshot = await getDocs(q);
                const postsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    // Create a plain text version of content for better searching if needed
                    // For now, we search raw content which might include markdown, but Fuse handles it okay
                }));
                setPosts(postsData);
            } catch (error) {
                console.error("Error fetching posts for search:", error);
            } finally {
                setLoading(false);
            }
        };

        if (isOpen) {
            fetchPosts();
            // Focus input when opened
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [isOpen]);

    // Perform search
    useEffect(() => {
        if (!queryText.trim() || posts.length === 0) {
            setResults([]);
            return;
        }

        const fuse = new Fuse(posts, {
            keys: [
                { name: 'title', weight: 0.7 },
                { name: 'summary', weight: 0.5 },
                { name: 'content', weight: 0.3 },
                { name: 'tags', weight: 0.4 }
            ],
            includeScore: true,
            threshold: 0.4, // 0.0 is perfect match, 1.0 is match anything
            ignoreLocation: true,
        });

        const searchResults = fuse.search(queryText);
        setResults(searchResults.map(result => result.item).slice(0, 5)); // Limit to top 5
    }, [queryText, posts]);

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    // Close on click outside
    const handleBackdropClick = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            onClose();
        }
    };



    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4 bg-black/60 backdrop-blur-sm"
                    onClick={handleBackdropClick}
                >
                    <motion.div
                        ref={modalRef}
                        initial={{ scale: 0.95, opacity: 0, y: -20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: -20 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="w-full max-w-2xl bg-[#1d1e22] rounded-xl shadow-2xl overflow-hidden border border-gray-700"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header / Input */}
                        <div className="p-4 border-b border-gray-700 flex items-center gap-3">
                            <i className="fas fa-search text-gray-400 text-lg"></i>
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="輸入關鍵字，按 Enter 搜索"
                                className="w-full bg-transparent border-none outline-none text-gray-200 text-lg placeholder-gray-500"
                                value={queryText}
                                onChange={(e) => setQueryText(e.target.value)}
                            />
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-white transition-colors p-1"
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        {/* Results */}
                        <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                            {loading && posts.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                    <i className="fas fa-spinner fa-spin mb-2"></i>
                                    <p>正在加載索引...</p>
                                </div>
                            ) : queryText && results.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                    <p>沒有找到相關結果</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-700/50">
                                    {results.map((post) => (
                                        <Link
                                            key={post.id}
                                            to={`/posts/${post.slug}`}
                                            onClick={onClose}
                                            className="block p-4 hover:bg-blue-600/10 transition-colors group"
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="text-blue-400 group-hover:text-blue-300 font-medium text-lg">
                                                    {post.title}
                                                </h3>
                                                {post.tags && post.tags.length > 0 && (
                                                    <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">
                                                        {post.tags[0]}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-gray-400 text-sm line-clamp-2">
                                                {post.summary || post.content?.substring(0, 100)}
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {!queryText && !loading && (
                                <div className="p-8 text-center text-gray-500 text-sm">
                                    <div className="mb-4">
                                        <i className="fas fa-search text-4xl opacity-20 mb-2"></i>
                                    </div>
                                    <p>輸入標題或內容進行搜索</p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-4 py-3 bg-[#18191c] border-t border-gray-700 text-xs text-gray-500 flex justify-between items-center">
                            <span>
                                搜索由 <span className="font-bold text-gray-400">Fuse.js</span> 提供支持
                            </span>
                            <div className="flex gap-4">
                                <span>按 <kbd className="bg-gray-700 px-1.5 py-0.5 rounded text-gray-300 font-mono">Esc</kbd> 關閉</span>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SearchModal;
