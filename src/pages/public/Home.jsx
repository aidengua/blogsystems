import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, where } from 'firebase/firestore';
import { db } from '../../firebase';
import MainLayout from '../../layouts/MainLayout';
import { useSearchParams } from 'react-router-dom';

import HeroDashboard from '../../components/HeroDashboard';
import PostCard from '../../components/PostCard';
import Sidebar from '../../components/Sidebar';
import Pagination from '../../components/Pagination';

import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchParams, setSearchParams] = useSearchParams();
    const currentCategory = searchParams.get('category');
    const ITEMS_PER_PAGE = 14;

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                // Query published posts (Client-side sorting to avoid composite index requirement)
                let q = query(
                    collection(db, 'posts'),
                    where('status', '==', 'published')
                );

                const querySnapshot = await getDocs(q);
                let postsData = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        ...data,
                        // Ensure createdAt is a Date object for sorting
                        createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt)
                    };
                });

                // Sort by createdAt desc (Newest first)
                postsData.sort((a, b) => b.createdAt - a.createdAt);

                if (currentCategory) {
                    postsData = postsData.filter(post => post.category === currentCategory);
                }

                setPosts(postsData);
                setCurrentPage(1); // Reset to page 1 when category changes
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [currentCategory]);

    // Calculate pagination
    const totalPages = Math.ceil(posts.length / ITEMS_PER_PAGE);
    const currentPosts = posts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <MainLayout>
            <div className="relative min-h-screen">
                {/* Dashboard Overlay */}
                <div className="relative z-10">
                    <HeroDashboard posts={posts} />

                    <div className="container mx-auto px-4 pb-12 pt-0 max-w-7xl">
                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Main Content */}
                            <div className="w-full lg:w-3/4 space-y-8">
                                <AnimatePresence mode="wait">
                                    {currentCategory && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                            animate={{ opacity: 1, height: 'auto', marginBottom: 32 }}
                                            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                            className="overflow-hidden"
                                        >
                                            <div className="flex items-center justify-between bg-[#1e1e1e] p-4 rounded-xl border border-gray-800">
                                                <div className="flex items-center gap-2 text-white">
                                                    <i className="fas fa-filter text-[#709CEF]"></i>
                                                    <span className="font-bold">目前分類：{currentCategory}</span>
                                                </div>
                                                <button
                                                    onClick={() => setSearchParams({})}
                                                    className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                                                >
                                                    <i className="fas fa-times"></i> 清除篩選
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {loading ? (
                                    <div className="flex justify-center py-20">
                                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {currentPosts.map((post, index) => (
                                                <motion.div
                                                    key={post.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    viewport={{ once: true, margin: "-50px" }}
                                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                                >
                                                    <PostCard post={post} index={index} />
                                                </motion.div>
                                            ))}
                                        </div>

                                        {/* Pagination */}
                                        <Pagination
                                            currentPage={currentPage}
                                            totalPages={totalPages}
                                            onPageChange={handlePageChange}
                                        />
                                    </>
                                )
                                }

                                {!loading && posts.length === 0 && (
                                    <div className="text-center py-20 card-glass p-8">
                                        <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                                            {currentCategory ? `分類 "${currentCategory}" 尚無文章` : '暫無文章'}
                                        </h3>
                                        <p className="text-gray-500 mt-2">請稍後再回來查看</p>
                                        {currentCategory && (
                                            <button
                                                onClick={() => setSearchParams({})}
                                                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
                                            >
                                                查看所有文章
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Sidebar (Desktop) */}
                            <div className="hidden lg:block w-1/4">
                                <div>
                                    <Sidebar />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Home;
