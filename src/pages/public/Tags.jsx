import { useState, useEffect } from 'react';
import { collection, query, getDocs, where, orderBy } from 'firebase/firestore';
import { Link, useParams } from 'react-router-dom';
import { db } from '../../firebase';
import MainLayout from '../../layouts/MainLayout';
import { motion, AnimatePresence } from 'framer-motion';

const Tags = () => {
    const { tag: currentTag } = useParams();
    const [tags, setTags] = useState({});
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

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

                // Calculate tag counts
                const tagCounts = {};
                allPosts.forEach(post => {
                    const postTags = post.tags || [];
                    postTags.forEach(tag => {
                        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                    });
                });
                setTags(tagCounts);

                // Filter posts if a tag is selected
                if (currentTag) {
                    const filtered = allPosts.filter(post =>
                        post.tags && post.tags.includes(currentTag)
                    );
                    setPosts(filtered);
                } else {
                    setPosts([]);
                }

            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentTag]);

    return (
        <MainLayout>
            <div className="min-h-screen pt-24 pb-20 container mx-auto px-4 max-w-5xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">標籤</h1>
                    <p className="text-gray-500 dark:text-gray-400">目前共計 {Object.keys(tags).length} 個標籤</p>
                </div>

                {/* Tags Grid */}
                <div className="flex flex-wrap justify-center gap-4 mb-16">
                    {Object.entries(tags).map(([tagName, count]) => (
                        <Link
                            key={tagName}
                            to={`/tags/${tagName}`}
                            className={`
                                group flex items-center gap-3 px-4 py-2 rounded-lg border transition-all duration-300
                                ${currentTag === tagName
                                    ? 'bg-[#709CEF] border-[#709CEF] text-white shadow-[0_0_15px_rgba(112,156,239,0.5)]'
                                    : 'bg-white dark:bg-[#1e1e1e] border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-blue-500 hover:text-blue-500 dark:hover:text-white'
                                }
                            `}
                        >
                            <span className="text-gray-400 dark:text-gray-500 group-hover:text-blue-400 transition-colors">#</span>
                            <span className="font-medium">{tagName}</span>
                            <span className={`
                                text-xs px-2 py-0.5 rounded-md transition-colors
                                ${currentTag === tagName
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                                }
                            `}>
                                {count}
                            </span>
                        </Link>
                    ))}
                </div>

                {/* Filtered Posts List */}
                <AnimatePresence mode="wait">
                    {currentTag && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {posts.map((post, index) => (
                                    <motion.div
                                        key={post.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="group relative bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg"
                                    >
                                        <Link to={`/posts/${post.slug}`} className="block">
                                            <div className="aspect-video overflow-hidden relative">
                                                <img
                                                    src={post.coverImage || 'https://images.unsplash.com/photo-1499750310159-5b9887034297?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
                                            </div>
                                            <div className="p-6">
                                                <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                                                    <i className="far fa-calendar"></i>
                                                    {new Date(post.createdAt?.seconds * 1000).toLocaleDateString()}
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                                                    {post.title}
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">
                                                    {post.excerpt}
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {post.tags?.slice(0, 3).map(t => (
                                                        <span key={t} className="text-xs text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-1 rounded">
                                                            #{t}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </MainLayout >
    );
};

export default Tags;
