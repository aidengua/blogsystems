import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, query, where, getDocs, updateDoc, increment, doc } from 'firebase/firestore';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { db } from '../../firebase';
import MainLayout from '../../layouts/MainLayout';
import Sidebar from '../../components/Sidebar';

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
                    const postDoc = querySnapshot.docs[0];
                    setPost({ id: postDoc.id, ...postDoc.data() });

                    // Increment view count (fire and forget)
                    const docRef = doc(db, 'posts', postDoc.id);
                    updateDoc(docRef, {
                        views: increment(1)
                    }).catch(err => console.log("View increment failed:", err));
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
        <MainLayout>
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            </div>
        </MainLayout>
    );

    if (!post) return (
        <MainLayout>
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center p-8 card-glass max-w-md mx-4">
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">找不到文章</h3>
                    <Link to="/" className="inline-block bg-primary text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors mt-4">
                        返回首頁
                    </Link>
                </div>
            </div>
        </MainLayout>
    );

    return (
        <MainLayout>
            {/* Post Header */}
            <div className="relative h-[400px] w-full overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${post.coverImage || 'https://camo.githubusercontent.com/520c5cfb0b63284eeb8c1d869660ffd7ab93b6a1310ffc6da27442f14d37a437/68747470733a2f2f6e706d2e656c656d6563646e2e636f6d2f616e7a686979752d6173736574732f696d6167652f636f6d6d6f6e2f6769746875622d696e666f2f4b6e6f636b2d436f64652e676966'})` }}
                >
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"></div>
                </div>

                <div className="relative z-10 h-full container mx-auto px-4 flex flex-col justify-center text-white">
                    <h1 className="text-3xl md:text-5xl font-display font-bold mb-6 text-shadow-lg leading-tight max-w-4xl">
                        {post.title}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-sm md:text-base opacity-90">
                        <div className="flex items-center gap-2">
                            <i className="far fa-calendar-alt"></i>
                            <time>{post.createdAt?.toDate().toLocaleDateString('zh-TW')}</time>
                        </div>
                        <span className="hidden md:inline">|</span>
                        <div className="flex items-center gap-2">
                            <i className="far fa-eye"></i>
                            <span>{post.views || 0} 閱讀</span>
                        </div>
                        {post.tags && post.tags.length > 0 && (
                            <>
                                <span className="hidden md:inline">|</span>
                                <div className="flex items-center gap-2">
                                    <i className="fas fa-tag"></i>
                                    {post.tags.map(tag => (
                                        <span key={tag} className="bg-white/20 px-2 py-0.5 rounded text-xs">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Post Content */}
            <div className="container mx-auto px-4 py-12 max-w-7xl">
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="w-full lg:w-3/4">
                        <div className="card-glass p-8 md:p-12">
                            <article className="prose prose-lg dark:prose-invert max-w-none 
                                prose-headings:font-display prose-headings:font-bold 
                                prose-a:text-primary hover:prose-a:text-blue-600 
                                prose-img:rounded-xl prose-img:shadow-lg
                                prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-gray-800/50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:not-italic
                            ">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {post.content}
                                </ReactMarkdown>
                            </article>

                            {/* Post Footer */}
                            <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-700">
                                <div className="flex justify-between items-center">
                                    <Link to="/" className="text-gray-500 hover:text-primary transition-colors">
                                        <i className="fas fa-arrow-left mr-2"></i> 返回首頁
                                    </Link>
                                    <div className="flex gap-2">
                                        {/* Share buttons could go here */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="hidden lg:block w-1/4">
                        <div className="sticky top-24">
                            <Sidebar />
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default PostDetail;
