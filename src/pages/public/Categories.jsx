import { useState, useEffect } from 'react';
import { collection, query, getDocs, where, orderBy } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { db } from '../../firebase';
import MainLayout from '../../layouts/MainLayout';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import LazyImage from '../../components/LazyImage';

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
                    where('status', '==', 'published'),
                    orderBy('createdAt', 'desc')
                );
                const querySnapshot = await getDocs(q);
                const allPosts = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

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
            <div className="min-h-screen pt-24 pb-20 container mx-auto px-4 max-w-7xl">
                {/* Header */}
                <div className="text-center mb-12 animate-fade-in">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        文章分類
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        探索 {Object.keys(categories).length} 個不同的主題領域
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <>
                        {/* Categories Grid */}
                        <motion.div
                            layout
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
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
                                            "relative h-32 rounded-2xl overflow-hidden cursor-pointer transition-all duration-500",
                                            isSelected ? "ring-4 ring-offset-4 ring-offset-[#121212] ring-[#709CEF] scale-105 z-10 shadow-2xl" : "hover:scale-[1.02] opacity-80 hover:opacity-100"
                                        )}
                                    >
                                        {/* Background Gradient */}
                                        <div className={clsx(
                                            "absolute inset-0 bg-gradient-to-br transition-transform duration-700",
                                            meta.gradient
                                        )}></div>

                                        {/* Content */}
                                        <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                                            <div className="flex justify-between items-start">
                                                <i className={clsx("fas text-2xl text-white", meta.icon)}></i>
                                                <span className="text-2xl font-bold text-white/40 font-display">
                                                    {count}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-bold text-white tracking-wide">
                                                {catName}
                                            </h3>
                                        </div>

                                        {/* Decorative Icon */}
                                        <i className={clsx(
                                            "fas absolute -bottom-4 -right-4 text-[6rem] text-white/10 pointer-events-none",
                                            meta.icon
                                        )}></i>
                                    </motion.div>
                                );
                            })}
                        </motion.div>

                        {/* Filtered Posts Grid */}
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
                                        className="group relative bg-[#1e1e1e] border border-gray-800 rounded-xl overflow-hidden hover:border-[#709CEF]/50 transition-all duration-300 hover:shadow-lg flex flex-col"
                                    >
                                        <Link to={`/posts/${post.slug}`} className="block flex-grow">
                                            <div className="aspect-video overflow-hidden relative">
                                                <LazyImage
                                                    src={post.coverImage || 'https://images.unsplash.com/photo-1499750310159-5b9887034297?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    wrapperClassName="w-full h-full"
                                                />
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
                                                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-[#709CEF] transition-colors">
                                                    {post.title}
                                                </h3>
                                                <p className="text-gray-400 text-sm line-clamp-2 mb-4">
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
