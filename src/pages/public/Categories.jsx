import { useState, useEffect } from 'react';
import { collection, query, getDocs, where, orderBy } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { db } from '../../firebase';
import MainLayout from '../../layouts/MainLayout';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import LazyImage from '../../components/LazyImage';
import SectionLoader from '../../components/SectionLoader';

const Categories = () => {
    const [categories, setCategories] = useState({});
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(null);

    // Category Metadata Mapping (Colors & Icons)
    const categoryMeta = {
        "作品紀錄": { icon: "fa-clipboard-list", color: "bg-[#72B5AD]", gradient: "from-[#72B5AD] to-[#5a968f]" },
        "日常生活": { icon: "fa-mug-hot", color: "bg-[#C982A1]", gradient: "from-[#C982A1] to-[#a86580]" },
        "時事新聞": { icon: "fa-newspaper", color: "bg-[#83A17E]", gradient: "from-[#83A17E] to-[#6b8567]" },
        "課堂筆記": { icon: "fa-book", color: "bg-[#C3B579]", gradient: "from-[#C3B579] to-[#a3965f]" },
        // Default fallback
        "default": { icon: "fa-folder", color: "bg-blue-500", gradient: "from-blue-500 to-blue-600" }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch all published posts
                const q = query(
                    collection(db, 'posts'),
                    where('status', '==', 'published')
                );
                const querySnapshot = await getDocs(q);
                const allPosts = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })).sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);

                setPosts(allPosts);

                // Calculate category counts
                const catCounts = {};
                allPosts.forEach(post => {
                    if (post.category) {
                        catCounts[post.category] = (catCounts[post.category] || 0) + 1;
                    }
                });
                setCategories(catCounts);

            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getMeta = (name) => categoryMeta[name] || categoryMeta["default"];

    const filteredPosts = selectedCategory
        ? posts.filter(post => post.category === selectedCategory)
        : posts;

    return (
        <MainLayout>
            <div className="min-h-screen pt-20 md:pt-24 pb-20 container mx-auto px-4 max-w-7xl">
                {/* Header */}
                <div className="text-center mb-8 md:mb-12 animate-fade-in">
                    <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2 md:mb-4">
                        文章分類
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg">
                        探索 {Object.keys(categories).length} 個不同的主題領域
                    </p>
                </div>

                {loading ? (
                    <SectionLoader />
                ) : (
                    <>
                        {/* Categories Grid */}
                        <motion.div
                            layout
                            className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6 mb-8 md:mb-16"
                        >
                            {Object.entries(categories).map(([catName, count]) => {
                                const meta = getMeta(catName);
                                const isSelected = selectedCategory === catName;

                                return (
                                    <motion.div
                                        layout
                                        key={catName}
                                        onClick={() => setSelectedCategory(isSelected ? null : catName)}
                                        className={clsx(
                                            "relative h-16 md:h-32 rounded-xl md:rounded-2xl overflow-hidden cursor-pointer touch-manipulation transform-gpu transition-all duration-300 ease-out",
                                            isSelected
                                                ? "ring-2 md:ring-4 ring-offset-2 md:ring-offset-4 ring-offset-white dark:ring-offset-[#121212] ring-[#709CEF] z-10 shadow-lg scale-[1.02]"
                                                : "active:scale-95 opacity-90 hover:opacity-100 hover:scale-[1.02]"
                                        )}
                                        style={{ WebkitTapHighlightColor: 'transparent' }}
                                    >
                                        {/* Background Gradient */}
                                        <div className={clsx(
                                            "absolute inset-0 bg-gradient-to-br transition-all duration-300",
                                            meta.gradient
                                        )}></div>

                                        {/* Content */}
                                        <div className="absolute inset-0 p-2 md:p-6 flex flex-col justify-between z-10">
                                            <div className="flex justify-between items-start">
                                                <i className={clsx("fas text-white opacity-80", meta.icon, "text-sm md:text-2xl")}></i>
                                                <span className="font-bold text-white/40 font-display text-sm md:text-2xl">
                                                    {count}
                                                </span>
                                            </div>
                                            <h3 className="font-bold text-white tracking-wide text-xs md:text-xl line-clamp-1 break-all">
                                                {catName}
                                            </h3>
                                        </div>

                                        {/* Decorative Icon - Hidden on mobile for cleaner look or resized */}
                                        <i className={clsx(
                                            "fas absolute -bottom-2 -right-2 text-white/10 pointer-events-none",
                                            meta.icon,
                                            "text-[2.5rem] md:text-[6rem]"
                                        )}></i>
                                    </motion.div>
                                );
                            })}
                        </motion.div>

                        {/* Filtered Posts Grid */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0 mb-6">
                            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                {selectedCategory ? (
                                    <>
                                        <i className={`fas ${getMeta(selectedCategory).icon} text-[#709CEF]`}></i>
                                        {selectedCategory}
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-layer-group text-[#709CEF]"></i>
                                        全部文章
                                    </>
                                )}
                            </h2>

                            {selectedCategory && (
                                <button
                                    onClick={() => setSelectedCategory(null)}
                                    className="px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-red-500 hover:text-white transition-all flex items-center gap-2 text-sm font-medium w-full md:w-auto justify-center"
                                >
                                    <i className="fas fa-times"></i>
                                    清除篩選
                                </button>
                            )}
                        </div>

                        <motion.div
                            layout
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            <AnimatePresence mode="popLayout">
                                {filteredPosts.map((post) => (
                                    <motion.div
                                        layout
                                        key={post.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3 }}
                                        className="group relative bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden hover:border-[#709CEF]/50 transition-all duration-300 hover:shadow-lg flex flex-col"
                                    >
                                        <Link to={`/posts/${post.slug}`} className="block flex-grow">
                                            <div className="aspect-video overflow-hidden relative">
                                                <div className="w-full h-full overflow-hidden">
                                                    <img
                                                        src={post.coverImage || 'https://images.unsplash.com/photo-1499750310159-5b9887034297?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                                                        alt={post.title}
                                                        className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] group-hover:scale-110"
                                                    />
                                                </div>
                                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>

                                                {/* Category Badge */}
                                                {post.category && (
                                                    <div className={clsx(
                                                        "absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg backdrop-blur-md",
                                                        getMeta(post.category).color
                                                    )}>
                                                        {post.category}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-6">
                                                <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                                                    <i className="far fa-calendar"></i>
                                                    {new Date(post.createdAt?.seconds * 1000).toLocaleDateString()}
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-[#709CEF] transition-colors">
                                                    {post.title}
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">
                                                    {post.excerpt}
                                                </p>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>

                        {/* Empty State */}
                        {filteredPosts.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-20"
                            >
                                <div className="text-6xl text-gray-300 dark:text-gray-700 mb-4">
                                    <i className="fas fa-search"></i>
                                </div>
                                <p className="text-gray-500">此分類暫無文章</p>
                            </motion.div>
                        )}
                    </>
                )}
            </div>
        </MainLayout>
    );
};

export default Categories;
