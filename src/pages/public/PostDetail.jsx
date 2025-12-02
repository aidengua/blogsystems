import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { db } from '../../firebase';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const PostDetail = () => {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const q = query(collection(db, 'posts'), where('slug', '==', slug));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    setPost({ id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() });
                }
            } catch (error) {
                console.error("Error fetching post:", error);
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchPost();
        }
    }, [slug]);

    if (loading) return (
        <>
            <Navbar />
            <div className="min-h-screen pt-16 flex items-center justify-center bg-gray-50 dark:bg-gray-950">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent dark:border-blue-400 dark:border-t-transparent"></div>
            </div>
            <Footer />
        </>
    );

    if (!post) return (
        <>
            <Navbar />
            <div className="min-h-screen pt-16 flex items-center justify-center bg-gray-50 dark:bg-gray-950">
                <div className="text-center p-8 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl dark:shadow-gray-950/50 max-w-md mx-4">
                    <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-12 h-12 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">找不到文章</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">此文章不存在或已被刪除</p>
                    <Link to="/" className="inline-block bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium px-6 py-2.5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/30">
                        返回首頁
                    </Link>
                </div>
            </div>
            <Footer />
        </>
    );

    return (
        <>
            <Navbar />

            <article className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-950">
                {/* Cover Image */}
                {post.coverImage ? (
                    <div className="relative h-96 overflow-hidden">
                        <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    </div>
                ) : (
                    <div className="h-20 bg-gradient-to-b from-blue-50 to-gray-50 dark:from-gray-900 dark:to-gray-950"></div>
                )}

                {/* Content */}
                <div className={`container mx-auto px-4 relative z-10 pb-16 ${post.coverImage ? '-mt-32' : '-mt-10'}`}>
                    <div className="max-w-4xl mx-auto">
                        {/* Header Card */}
                        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl dark:shadow-gray-950/50 p-8 md:p-12 mb-8 border border-gray-100 dark:border-gray-800">
                            {/* Back Button */}
                            <Link
                                to="/"
                                className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6 transition-colors group"
                            >
                                <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                返回首頁
                            </Link>

                            {/* Title */}
                            <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                                {post.title}
                            </h1>

                            {/* Meta */}
                            <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400 pb-6 border-b border-gray-200 dark:border-gray-800">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <time>{post.createdAt?.toDate().toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
                                </div>
                                {post.author && (
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <span>{post.author}</span>
                                    </div>
                                )}
                                {post.tags && post.tags.length > 0 && (
                                    <div className="flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                        </svg>
                                        <div className="flex flex-wrap gap-2">
                                            {post.tags.map(tag => (
                                                <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-md text-sm">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="prose prose-lg dark:prose-invert max-w-none mt-8 prose-headings:font-display prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-img:rounded-xl prose-img:shadow-lg">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
                            </div>
                        </div>
                    </div>
                </div>
            </article>

            <Footer />
        </>
    );
};

export default PostDetail;
