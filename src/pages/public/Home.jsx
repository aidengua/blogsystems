import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { db } from '../../firebase';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
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
                setError("無法讀取文章。如果您安裝了廣告阻擋器 (AdBlock)，請嘗試將其關閉或將此網站加入白名單。");
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    // Skeleton Loading
    if (loading) return (
        <>
            <Navbar />
            <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-950">
                {/* Hero Skeleton */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-20">
                    <div className="container mx-auto px-4">
                        <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-2xl w-2/3 mx-auto mb-6 animate-pulse shadow-lg"></div>
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-xl w-1/2 mx-auto animate-pulse shadow-md"></div>
                    </div>
                </div>

                {/* Posts Grid Skeleton */}
                <div className="container mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                            <div key={n} className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden h-96 animate-pulse shadow-xl dark:shadow-2xl dark:shadow-gray-950/50">
                                <div className="h-48 bg-gray-200 dark:bg-gray-800"></div>
                                <div className="p-6 space-y-4">
                                    <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-lg w-1/2"></div>
                                    <div className="space-y-2">
                                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
                                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
                                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-lg w-3/4"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );

    if (error) return (
        <>
            <Navbar />
            <div className="min-h-screen pt-16 flex items-center justify-center bg-gray-50 dark:bg-gray-950">
                <div className="text-center p-8 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl dark:shadow-gray-950/50 max-w-md mx-4">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">載入失敗</h3>
                    <p className="text-red-600 dark:text-red-400">{error}</p>
                </div>
            </div>
            <Footer />
        </>
    );

    return (
        <>
            <Navbar />

            <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
                {/* Hero Section */}
                <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-24 overflow-hidden">
                    <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="text-center max-w-4xl mx-auto animate-fade-in">
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-gray-900 dark:text-white mb-6 drop-shadow-lg">
                                My Awesome <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Blog</span>
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
                                分享想法、故事與靈感的地方 ✨
                            </p>
                        </div>
                    </div>
                </section>

                {/* Posts Grid */}
                <section className="container mx-auto px-4 py-16">
                    {posts.length === 0 ? (
                        <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl dark:shadow-gray-950/50 max-w-md mx-auto">
                            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-12 h-12 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">尚無文章</h3>
                            <p className="text-gray-600 dark:text-gray-400">開始撰寫您的第一篇文章吧！</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {posts.map((post, index) => (
                                <article
                                    key={post.id}
                                    className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden group hover:-translate-y-2 transition-all duration-500 shadow-xl hover:shadow-2xl dark:shadow-2xl dark:shadow-gray-950/50 dark:hover:shadow-blue-900/30 animate-slide-up border border-gray-100 dark:border-gray-800"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    {/* Cover Image */}
                                    {post.coverImage && (
                                        <div className="relative h-48 overflow-hidden">
                                            <img
                                                src={post.coverImage}
                                                alt={post.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        </div>
                                    )}

                                    <div className="p-6">
                                        {/* Title */}
                                        <h2 className="text-2xl font-bold mb-3 line-clamp-2">
                                            <Link
                                                to={`/post/${post.slug}`}
                                                className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                            >
                                                {post.title}
                                            </Link>
                                        </h2>

                                        {/* Meta */}
                                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <time>{post.createdAt?.toDate().toLocaleDateString('zh-TW')}</time>
                                        </div>

                                        {/* Excerpt */}
                                        <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3">
                                            {post.excerpt || post.content?.substring(0, 150) || '暫無內容'}...
                                        </p>

                                        {/* CTA */}
                                        <Link
                                            to={`/post/${post.slug}`}
                                            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium group/link"
                                        >
                                            閱讀更多
                                            <svg className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </div>

            <Footer />
        </>
    );
};

export default Home;
