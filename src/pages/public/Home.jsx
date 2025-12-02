import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, where } from 'firebase/firestore';
import { db } from '../../firebase';
import MainLayout from '../../layouts/MainLayout';

import HeroDashboard from '../../components/HeroDashboard';
import PostCard from '../../components/PostCard';
import Sidebar from '../../components/Sidebar';

import { motion } from 'framer-motion';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                // Query published posts ordered by creation date
                // Note: This requires a composite index in Firebase (status + createdAt)
                const q = query(
                    collection(db, 'posts'),
                    where('status', '==', 'published'),
                    orderBy('createdAt', 'desc')
                );
                const querySnapshot = await getDocs(q);
                const postsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setPosts(postsData);
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

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


                                {loading ? (
                                    <div className="flex justify-center py-20">
                                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                                    </div>
                                ) : (
                                    posts.map((post, index) => (
                                        <motion.div
                                            key={post.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.5, delay: index * 0.1 }}
                                        >
                                            <PostCard post={post} index={index} />
                                        </motion.div>
                                    ))
                                )}

                                {!loading && posts.length === 0 && (
                                    <div className="text-center py-20 card-glass p-8">
                                        <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300">暫無文章</h3>
                                        <p className="text-gray-500 mt-2">請稍後再回來查看</p>
                                    </div>
                                )}
                            </div>

                            {/* Sidebar (Desktop) */}
                            <div className="hidden lg:block w-1/4">
                                <div className="sticky top-24">
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
