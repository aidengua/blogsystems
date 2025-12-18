import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import Fuse from 'fuse.js';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase';

const SearchModal = ({ isOpen, onClose }) => {
    const [queryText, setQueryText] = useState('');
    const [results, setResults] = useState([]);
    const [searchItems, setSearchItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef(null);
    const modalRef = useRef(null);

    // Fetch data for search index
    useEffect(() => {
        const fetchData = async () => {
            if (searchItems.length > 0) return; // Already fetched

            setLoading(true);
            try {
                // Fetch posts and albums in parallel
                const [postsSnapshot, albumsSnapshot] = await Promise.all([
                    getDocs(query(collection(db, 'posts'), orderBy('createdAt', 'desc'))),
                    getDocs(query(collection(db, 'albums'), orderBy('createdAt', 'desc')))
                ]);

                const postsData = postsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    type: 'post',
                    ...doc.data()
                }));

                const albumsData = albumsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    type: 'album',
                    ...doc.data()
                }));

                setSearchItems([...postsData, ...albumsData]);
            } catch (error) {
                console.error("Error fetching data for search:", error);
            } finally {
                setLoading(false);
            }
        };

        if (isOpen) {
            fetchData();
            // Focus input when opened
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [isOpen]);

    // Perform search
    useEffect(() => {
        if (!queryText.trim() || searchItems.length === 0) {
            setResults([]);
            return;
        }

        const fuse = new Fuse(searchItems, {
            keys: [
                { name: 'title', weight: 0.7 },
                { name: 'summary', weight: 0.5 },
                { name: 'content', weight: 0.3 },
                { name: 'tags', weight: 0.4 },
                { name: 'description', weight: 0.5 } // For albums
            ],
            includeScore: true,
            threshold: 0.4, // 0.0 is perfect match, 1.0 is match anything
            ignoreLocation: true,
        });

        const searchResults = fuse.search(queryText);
        setResults(searchResults.map(result => result.item).slice(0, 5)); // Limit to top 5
    }, [queryText, searchItems]);

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
                        className="w-full max-w-2xl bg-white dark:bg-[#1d1e22] rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header / Input */}
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
                            <i className="fas fa-search text-gray-400 dark:text-gray-500 text-lg"></i>
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="輸入關鍵字，按 Enter 搜索"
                                className="w-full bg-transparent border-none outline-none text-gray-900 dark:text-gray-200 text-lg placeholder-gray-400 dark:placeholder-gray-500"
                                value={queryText}
                                onChange={(e) => setQueryText(e.target.value)}
                            />
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors p-1"
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        {/* Results */}
                        <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                            {loading && searchItems.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                    <i className="fas fa-spinner fa-spin mb-2"></i>
                                    <p>正在加載索引...</p>
                                </div>
                            ) : queryText && results.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                    <p>沒有找到相關結果</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
                                    {results.map((item) => (
                                        <Link
                                            key={`${item.type}-${item.id}`}
                                            to={item.type === 'post' ? `/posts/${item.slug}` : '/album'}
                                            onClick={onClose}
                                            className="block p-4 hover:bg-gray-50 dark:hover:bg-[#709CEF]/10 transition-colors group"
                                        >
                                            <div className="flex items-start gap-4">
                                                {/* Thumbnail for Albums */}
                                                {item.type === 'album' && (
                                                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-gray-700">
                                                        <img src={item.src} alt={item.title} className="w-full h-full object-cover" />
                                                    </div>
                                                )}

                                                <div className="flex-grow min-w-0">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <h3 className="text-blue-600 dark:text-blue-400 group-hover:text-blue-500 dark:group-hover:text-blue-300 font-medium text-lg truncate pr-2">
                                                            {item.title}
                                                            {item.type === 'album' && <span className="ml-2 text-xs text-gray-500 border border-gray-300 dark:border-gray-600 px-1 rounded">相簿</span>}
                                                        </h3>
                                                        {item.tags && item.tags.length > 0 && (
                                                            <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full flex-shrink-0">
                                                                {item.tags[0]}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-gray-400 text-sm line-clamp-2">
                                                        {item.type === 'post'
                                                            ? (item.summary || item.content?.substring(0, 100))
                                                            : (item.description || '無描述')}
                                                    </p>
                                                </div>
                                            </div>
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
                        <div className="px-4 py-3 bg-gray-50 dark:bg-[#18191c] border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 flex justify-between items-center">
                            <span>
                                搜索由 <span className="font-bold text-gray-600 dark:text-gray-400">Fuse.js</span> 提供支持
                            </span>
                            <div className="flex gap-4">
                                <span>按 <kbd className="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-300 font-mono">Esc</kbd> 關閉</span>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )
            }
        </AnimatePresence >
    );
};

export default SearchModal;
