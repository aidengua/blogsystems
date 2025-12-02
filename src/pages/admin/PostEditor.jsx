import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { db, storage } from '../../firebase';
import MainLayout from '../../layouts/MainLayout';
import { motion } from 'framer-motion';

const PostEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [slug, setSlug] = useState('');
    const [coverImage, setCoverImage] = useState(null);
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

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const storageRef = ref(storage, `covers/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            const url = await getDownloadURL(snapshot.ref);
            setImageUrl(url);
            setCoverImage(file);
        } catch (error) {
            console.error("Error uploading image: ", error);
            alert("Error uploading image");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

        const postData = {
            title,
            content,
            slug,
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
                    status: 'published'
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
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Sticky Header */}
                <div className="sticky top-20 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md py-4 -mx-4 px-4 mb-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {id ? '編輯文章' : '撰寫新文章'}
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 hidden md:block">
                            {title || '未命名文章'}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            onClick={() => setPreviewMode(!previewMode)}
                            className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center"
                        >
                            <i className={`fas ${previewMode ? 'fa-edit' : 'fa-eye'} mr-2`}></i>
                            {previewMode ? '返回編輯' : '預覽'}
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/admin')}
                            className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                            取消
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSubmit}
                            disabled={loading}
                            className="px-6 py-2 rounded-xl bg-primary text-white hover:bg-blue-600 disabled:bg-blue-400 transition-all shadow-lg shadow-blue-500/30 flex items-center"
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
                        <div className="card-glass p-6">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                        文章標題
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full p-4 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary dark:text-white transition-all text-lg font-medium placeholder-gray-400"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="輸入引人入勝的標題..."
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                            網址 Slug
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-3.5 text-gray-400">/posts/</span>
                                            <input
                                                type="text"
                                                className="w-full pl-16 p-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary dark:text-white transition-all font-mono text-sm"
                                                value={slug}
                                                onChange={(e) => setSlug(e.target.value)}
                                                placeholder="my-awesome-post"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                            標籤
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-3.5 text-gray-400"><i className="fas fa-tags"></i></span>
                                            <input
                                                type="text"
                                                className="w-full pl-10 p-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary dark:text-white transition-all text-sm"
                                                value={tags}
                                                onChange={(e) => setTags(e.target.value)}
                                                placeholder="React, Firebase, Tutorial"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                        封面圖片
                                    </label>
                                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 text-center hover:border-primary transition-colors bg-white/30 dark:bg-gray-800/30">
                                        <input
                                            type="file"
                                            id="cover-upload"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                        <label htmlFor="cover-upload" className="cursor-pointer flex flex-col items-center">
                                            {imageUrl ? (
                                                <div className="relative w-full h-48 rounded-lg overflow-hidden group">
                                                    <img src={imageUrl} alt="Cover" className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <span className="text-white font-medium">更換圖片</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-2"></i>
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">點擊上傳封面圖片</span>
                                                </>
                                            )}
                                        </label>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                        內容 (Markdown)
                                    </label>
                                    <textarea
                                        className="w-full p-4 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary dark:text-white font-mono h-[600px] transition-all resize-none text-sm leading-relaxed"
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
                        <div className="card-glass p-8 min-h-[800px] sticky top-32">
                            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">即時預覽</h2>
                                <div className="flex gap-2">
                                    <span className="w-3 h-3 rounded-full bg-red-400"></span>
                                    <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                                    <span className="w-3 h-3 rounded-full bg-green-400"></span>
                                </div>
                            </div>

                            <article className="prose prose-lg dark:prose-invert max-w-none 
                                prose-headings:font-display prose-headings:font-bold 
                                prose-a:text-primary hover:prose-a:text-blue-600 
                                prose-img:rounded-xl prose-img:shadow-lg
                                prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-gray-800/50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:not-italic
                            ">
                                {imageUrl && (
                                    <img src={imageUrl} alt="Cover" className="w-full h-64 object-cover rounded-xl mb-8 shadow-md" />
                                )}
                                <h1 className="mb-4">{title || '文章標題'}</h1>
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
