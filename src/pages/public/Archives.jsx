import { useState, useEffect, useMemo } from 'react';
import { collection, query, orderBy, getDocs, where } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { db } from '../../firebase';
import MainLayout from '../../layouts/MainLayout';
import { motion } from 'framer-motion';
import SectionLoader from '../../components/SectionLoader';

const Archives = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const q = query(
                    collection(db, 'posts'),
                    where('status', '==', 'published')
                );
                const querySnapshot = await getDocs(q);
                const postsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })).sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
                setPosts(postsData);
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    // Group posts by year
    const groupedPosts = useMemo(() => {
        return posts.reduce((acc, post) => {
            const year = post.createdAt?.toDate().getFullYear() || 'Unknown';
            if (!acc[year]) {
                acc[year] = [];
            }
            acc[year].push(post);
            return acc;
        }, {});
    }, [posts]);

    const sortedYears = useMemo(() => Object.keys(groupedPosts).sort((a, b) => b - a), [groupedPosts]);

    return (
        <MainLayout>
            <div className="min-h-screen pt-24 pb-12 px-4 container mx-auto max-w-5xl">
                <div className="mb-12 animate-fade-in">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-start gap-2">
                        文章 <span className="text-sm text-gray-500 font-normal mt-1">{posts.length}</span>
                    </h1>
                </div>

                {loading ? (
                    <SectionLoader />
                ) : (
                    <div className="space-y-12">
                        {sortedYears.map((year, yearIndex) => (
                            <motion.div
                                key={year}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: yearIndex * 0.1 }}
                            >
                                {/* Year Header */}
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-1.5 h-8 bg-yellow-500 rounded-full"></div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{year}</h2>
                                </div>

                                {/* Articles Grid */}
                                <div className="grid gap-4">
                                    {groupedPosts[year].map((post, index) => (
                                        <Link to={`/posts/${post.slug}`} key={post.id} className="group">
                                            <div className="liquid-glass p-4 flex flex-col md:flex-row gap-6 items-center hover:bg-white/80 dark:hover:bg-gray-800/80 transition-colors">
                                                {/* Thumbnail */}
                                                <div className="w-full md:w-48 h-32 flex-shrink-0 rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700 relative">
                                                    {post.coverImage ? (
                                                        <img
                                                            src={post.coverImage}
                                                            alt={post.title}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                            <i className="fas fa-image text-3xl"></i>
                                                        </div>
                                                    )}
                                                    {/* Overlay Icon (Optional, matching style) */}
                                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
                                                </div>

                                                {/* Content */}
                                                <div className="flex-grow w-full md:w-auto">
                                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-[#709CEF] transition-colors line-clamp-1">
                                                        {post.title}
                                                    </h3>
                                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                                        <span className="flex items-center gap-1">
                                                            <i className="far fa-calendar"></i>
                                                            {post.createdAt?.toDate().toLocaleDateString('zh-TW')}
                                                        </span>
                                                        {post.tags && post.tags.length > 0 && (
                                                            <span className="flex items-center gap-1">
                                                                <i className="fas fa-tag"></i>
                                                                {post.tags[0]}
                                                            </span>
                                                        )}
                                                        <span className="flex items-center gap-1">
                                                            <i className="far fa-user"></i>
                                                            呂宥德
                                                        </span>
                                                    </div>
                                                    <p className="mt-2 text-gray-600 dark:text-gray-300 line-clamp-2 text-sm">
                                                        {post.excerpt || "點擊閱讀更多..."}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </MainLayout>
    );
};

export default Archives;
