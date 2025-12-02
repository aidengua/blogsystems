import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { db, storage } from '../../firebase';
import Navbar from '../../components/Navbar';

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

    // ... handleImageUpload ...

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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pt-20 pb-12 transition-colors duration-300">
            {/* ... Navbar and Header ... */}
            <Navbar />
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{id ? '編輯文章' : '新增文章'}</h1>
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => setPreviewMode(!previewMode)}
                            className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                        >
                            {previewMode ? '編輯模式' : '預覽模式'}
                        </button>
                        <button
                            onClick={() => navigate('/admin')}
                            className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                        >
                            取消
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400 transition-colors shadow-lg shadow-blue-500/30"
                        >
                            {loading ? '儲存中...' : '發布文章'}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Editor Column */}
                    <div className={`space-y-6 ${previewMode ? 'hidden lg:block' : ''}`}>
                        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl dark:shadow-gray-950/50 p-6 border border-gray-100 dark:border-gray-800">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">文章標題</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white transition-all"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="輸入標題..."
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">網址 Slug</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white transition-all"
                                        value={slug}
                                        onChange={(e) => setSlug(e.target.value)}
                                        placeholder="post-url-slug"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">標籤 (以逗號分隔)</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white transition-all"
                                        value={tags}
                                        onChange={(e) => setTags(e.target.value)}
                                        placeholder="React, Firebase, Tutorial"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">封面圖片</label>
                                    <div className="flex items-center space-x-4">
                                        <input
                                            type="file"
                                            onChange={handleImageUpload}
                                            className="block w-full text-sm text-gray-500 dark:text-gray-400
                                                file:mr-4 file:py-2 file:px-4
                                                file:rounded-full file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-blue-50 file:text-blue-700
                                                hover:file:bg-blue-100
                                                dark:file:bg-gray-800 dark:file:text-gray-300
                                            "
                                        />
                                    </div>
                                    {imageUrl && (
                                        <div className="mt-4 relative h-48 rounded-xl overflow-hidden">
                                            <img src={imageUrl} alt="Cover" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">內容 (Markdown)</label>
                                    <textarea
                                        className="w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white font-mono h-[500px] transition-all resize-none"
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        placeholder="開始撰寫..."
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Preview Column */}
                    <div className={`space-y-6 ${!previewMode ? 'hidden lg:block' : ''}`}>
                        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl dark:shadow-gray-950/50 p-8 border border-gray-100 dark:border-gray-800 min-h-[800px]">
                            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">即時預覽</h2>
                            <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-6">{title || '文章標題'}</h1>
                            {imageUrl && (
                                <img src={imageUrl} alt="Cover" className="w-full h-64 object-cover rounded-xl mb-8 shadow-md" />
                            )}
                            <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-display prose-headings:font-bold prose-h1:text-4xl prose-h2:text-3xl prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-img:rounded-xl prose-img:shadow-lg text-gray-900 dark:text-gray-100">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {content || '內容預覽區域...'}
                                </ReactMarkdown>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostEditor;
