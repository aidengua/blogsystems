import { useState, useEffect } from 'react';
import LazyImage from '../../components/LazyImage';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { db } from '../../firebase';
import MainLayout from '../../layouts/MainLayout';
import { motion } from 'framer-motion';

const PostEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [slug, setSlug] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [tags, setTags] = useState('');
    const [loading, setLoading] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);

    useEffect(() => {
        if (id) {
            const fetchPost = async () => {
                const docRef = doc(db, 'posts', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setTitle(data.title);
                    setContent(data.content);
                    setSlug(data.slug);
                    setImageUrl(data.coverImage);
                    setTags(data.tags ? data.tags.join(', ') : '');
                }
            };
            fetchPost();
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

        // Auto-generate slug if empty
        let finalSlug = slug;
        if (!finalSlug) {
            finalSlug = title.toLowerCase()
                .replace(/[^\w\s-]/g, '') // Remove non-word chars
                .replace(/\s+/g, '-') // Replace spaces with -
                .replace(/--+/g, '-') // Replace multiple - with single -
                .trim();
            // If slug is still empty (e.g. all special chars), use timestamp
            if (!finalSlug) {
                finalSlug = `post-${Date.now()}`;
            }
        }

        const postData = {
            title,
            content,
            slug: finalSlug,
            coverImage: imageUrl,
            tags: tagsArray,
            updatedAt: serverTimestamp(),
        };

        try {
            if (id) {
                await setDoc(doc(db, 'posts', id), postData, { merge: true });
            } else {
                await addDoc(collection(db, 'posts'), {
                    ...postData,
                    createdAt: serverTimestamp(),
                    status: 'published',
                    views: 0
                });
            }
            navigate('/admin');
        } catch (error) {
            console.error("Error saving post: ", error);
            alert("Error saving post");
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-24 max-w-7xl">
                {/* Sticky Header */}
                <div className="sticky top-20 z-20 bg-[#0a0a0a]/80 backdrop-blur-md py-4 -mx-4 px-4 mb-6 border-b border-gray-800 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-white">
                            {id ? '編輯文章' : '撰寫新文章'}
                        </h1>
                        <p className="text-sm text-gray-400 hidden md:block mt-1">
                            {title || '未命名文章'}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            onClick={() => setPreviewMode(!previewMode)}
                            className="px-4 py-2 rounded-xl bg-[#1e1e1e] border border-gray-800 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors flex items-center"
                        >
                            <i className={`fas ${previewMode ? 'fa-edit' : 'fa-eye'} mr-2`}></i>
                            {previewMode ? '返回編輯' : '預覽'}
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/admin')}
                            className="px-4 py-2 rounded-xl bg-[#1e1e1e] border border-gray-800 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                        >
                            取消
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSubmit}
                            disabled={loading}
                            className="px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/30 flex items-center font-medium"
                        >
                            {loading ? (
                                <>
                                    <i className="fas fa-spinner fa-spin mr-2"></i>
                                    儲存中...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-paper-plane mr-2"></i>
                                    發布
                                </>
                            )}
                        </motion.button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Editor Column */}
                    <div className={`space-y-6 ${previewMode ? 'hidden lg:block' : ''}`}>
                        <div className="bg-[#1e1e1e] border border-gray-800 rounded-2xl p-6 shadow-xl">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2">
                                        文章標題
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full p-4 bg-black/30 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white transition-all text-lg font-bold placeholder-gray-600"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="輸入引人入勝的標題..."
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-400 mb-2">
                                            網址 Slug (選填)
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-3.5 text-gray-500 font-mono text-sm">/posts/</span>
                                            <input
                                                type="text"
                                                className="w-full pl-20 p-3 bg-black/30 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-300 transition-all font-mono text-sm placeholder-gray-600"
                                                value={slug}
                                                onChange={(e) => setSlug(e.target.value)}
                                                placeholder="留空則使用標題"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-400 mb-2">
                                            標籤
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-3.5 text-gray-500"><i className="fas fa-tags"></i></span>
                                            <input
                                                type="text"
                                                className="w-full pl-10 p-3 bg-black/30 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-300 transition-all text-sm placeholder-gray-600"
                                                value={tags}
                                                onChange={(e) => setTags(e.target.value)}
                                                placeholder="React, Firebase, Tutorial"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2">
                                        封面圖片網址
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-3.5 text-gray-500"><i className="fas fa-link"></i></span>
                                        <input
                                            type="text"
                                            className="w-full pl-10 p-3 bg-black/30 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-300 transition-all text-sm placeholder-gray-600 font-mono"
                                            value={imageUrl}
                                            onChange={(e) => setImageUrl(e.target.value)}
                                            placeholder="https://example.com/image.jpg"
                                        />
                                    </div>
                                    {imageUrl && (
                                        <div className="mt-4 relative w-full h-48 rounded-xl overflow-hidden border border-gray-700 group">
                                            <LazyImage
                                                src={imageUrl}
                                                alt="Cover Preview"
                                                className="w-full h-full object-cover"
                                                wrapperClassName="w-full h-full"
                                            />
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="text-white font-medium text-sm">預覽</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2">
                                        內容 (Markdown)
                                    </label>
                                    <textarea
                                        className="w-full p-4 bg-black/30 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-300 font-mono h-[600px] transition-all resize-none text-sm leading-relaxed placeholder-gray-600"
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        placeholder="# Hello World..."
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Preview Column */}
                    <div className={`space-y-6 ${!previewMode ? 'hidden lg:block' : ''}`}>
                        <div className="bg-[#1e1e1e] border border-gray-800 rounded-2xl p-8 min-h-[800px] sticky top-32 shadow-xl">
                            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-800">
                                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">即時預覽</h2>
                                <div className="flex gap-2">
                                    <span className="w-3 h-3 rounded-full bg-red-500/50"></span>
                                    <span className="w-3 h-3 rounded-full bg-yellow-500/50"></span>
                                    <span className="w-3 h-3 rounded-full bg-green-500/50"></span>
                                </div>
                            </div>

                            <article className="prose prose-lg prose-invert max-w-none 
                                prose-headings:font-bold prose-headings:text-white
                                prose-a:text-blue-400 hover:prose-a:text-blue-300 
                                prose-img:rounded-xl prose-img:shadow-lg
                                prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-gray-800/50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:not-italic prose-blockquote:text-gray-300
                                prose-code:text-blue-300 prose-code:bg-gray-800/50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                                prose-pre:bg-[#0a0a0a] prose-pre:border prose-pre:border-gray-800
                            ">
                                {imageUrl && (
                                    <div className="w-full h-64 mb-8 shadow-md rounded-xl overflow-hidden">
                                        <LazyImage src={imageUrl} alt="Cover" className="w-full h-64 object-cover" wrapperClassName="w-full h-full" />
                                    </div>
                                )}
                                <h1 className="mb-4 text-4xl">{title || '文章標題'}</h1>
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {content || '內容預覽區域...'}
                                </ReactMarkdown>
                            </article>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default PostEditor;
