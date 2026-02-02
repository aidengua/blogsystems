import { useState, useEffect, useRef } from 'react';
import LazyImage from '../../components/LazyImage';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc, addDoc, collection, serverTimestamp, Timestamp } from 'firebase/firestore';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { db } from '../../firebase';
import MainLayout from '../../layouts/MainLayout';
import { motion, AnimatePresence } from 'framer-motion';
import SpotlightCard from '../../components/SpotlightCard';
import { formatContentWithGemini } from '../../services/gemini';
import PostGallery from '../../components/PostGallery';
import LogoLoader from '../../components/LogoLoader';

// Helper to preprocess gallery tags
const preprocessContent = (content) => {
    if (!content) return '';
    return content.replace(
        /\{% gallery true %\}([\s\S]*?)\{% endgallery %\}/g,
        (match, galleryContent) => {
            return `\`\`\`gallery\n${galleryContent.trim()}\n\`\`\``;
        }
    );
};

// --- Constants & Helpers ---

const CATEGORIES = ["作品紀錄", "日常生活", "時事新聞", "課堂筆記"];

// --- Sub-Components ---

const CustomDropdown = ({ value, onChange, options }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative group" ref={dropdownRef}>
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#709CEF] transition-colors z-10 pointer-events-none">
                <i className="fas fa-folder"></i>
            </span>

            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full pl-10 p-3 bg-black/20 border ${isOpen ? 'border-[#709CEF] ring-2 ring-[#709CEF]' : 'border-white/10'} rounded-xl text-gray-300 transition-all text-sm cursor-pointer hover:bg-white/5 flex items-center justify-between`}
            >
                <span>{value || "選擇分類"}</span>
                <i className={`fas fa-chevron-down text-xs text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}></i>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-[#1e1e1e] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
                    >
                        {options.map((cat) => (
                            <div
                                key={cat}
                                onClick={() => {
                                    onChange(cat);
                                    setIsOpen(false);
                                }}
                                className={`px-4 py-3 text-sm cursor-pointer transition-colors flex items-center justify-between ${value === cat ? 'bg-[#709CEF]/20 text-[#709CEF]' : 'text-gray-300 hover:bg-white/5'}`}
                            >
                                <span>{cat}</span>
                                {value === cat && <i className="fas fa-check text-xs"></i>}
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const formatDateForInput = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const pad = (n) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const EditorSection = ({
    title, setTitle, category, setCategory, slug, setSlug, tags, setTags, imageUrl, setImageUrl,
    publishDate, setPublishDate,
    content, contentRef, displayedContent, isAnimating, isFormatting, handleContentChange,
    showGeminiPrompt, geminiButtonPosition, handleGeminiFormat,
    previewMode, setPreviewMode, handleSubmit, loading
}) => {
    return (
        <SpotlightCard className="p-6 md:p-8 space-y-6 relative h-full" spotlightColor="rgba(112, 156, 239, 0.1)">
            {/* Title Input */}
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    文章標題
                </label>
                <input
                    type="text"
                    className="w-full p-4 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-[#709CEF] focus:border-transparent text-white transition-all text-xl md:text-2xl font-bold placeholder-gray-700"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="輸入引人入勝的標題..."
                    required
                />
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        文章分類 <span className="text-red-500">*</span>
                    </label>
                    <CustomDropdown
                        value={category}
                        onChange={setCategory}
                        options={CATEGORIES}
                    />
                </div>
            </div>

            {/* Date & URL Slug */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        發布時間 (選填)
                    </label>
                    <div className="relative group">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#709CEF] transition-colors pointer-events-none">
                            <i className="far fa-calendar-alt"></i>
                        </span>
                        <input
                            type="datetime-local"
                            className="w-full pl-10 p-3 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-[#709CEF] focus:border-transparent text-gray-300 transition-all text-sm placeholder-gray-700 disabled:opacity-50"
                            value={publishDate}
                            onChange={(e) => setPublishDate(e.target.value)}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        網址 Slug
                    </label>
                    <div className="relative group">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-mono text-sm group-focus-within:text-[#709CEF] transition-colors">/posts/</span>
                        <input
                            type="text"
                            className="w-full pl-20 p-3 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-[#709CEF] focus:border-transparent text-gray-300 transition-all font-mono text-sm placeholder-gray-700"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            placeholder="auto-generated"
                        />
                    </div>
                </div>
            </div>

            {/* Tags & Image */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        標籤 (逗號分隔)
                    </label>
                    <div className="relative group">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#709CEF] transition-colors"><i className="fas fa-tags"></i></span>
                        <input
                            type="text"
                            className="w-full pl-10 p-3 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-[#709CEF] focus:border-transparent text-gray-300 transition-all text-sm placeholder-gray-700"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            placeholder="React, Firebase..."
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        封面圖片網址
                    </label>
                    <div className="relative group">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#709CEF] transition-colors"><i className="fas fa-link"></i></span>
                        <input
                            type="text"
                            className="w-full pl-10 p-3 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-[#709CEF] focus:border-transparent text-gray-300 transition-all text-sm placeholder-gray-700 font-mono"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="https://..."
                        />
                    </div>
                </div>
            </div>

            {/* Image Preview */}
            <AnimatePresence>
                {imageUrl && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="relative w-full h-48 rounded-xl overflow-hidden border border-white/10 group"
                    >
                        <LazyImage
                            src={imageUrl}
                            alt="Cover Preview"
                            className="w-full h-full object-cover"
                            wrapperClassName="w-full h-full"
                        />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white font-medium text-sm backdrop-blur-md px-3 py-1 rounded-full bg-white/10">封面預覽</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Content Editor */}
            <div className="relative flex-grow">
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                        內容 (Markdown)
                    </label>
                    {isFormatting && (
                        <span className="text-xs text-[#709CEF] flex items-center gap-2 animate-pulse">
                            <i className="fas fa-magic fa-spin"></i>
                            Gemini 正在施展魔法...
                        </span>
                    )}
                </div>
                <div className="relative h-full">
                    <textarea
                        ref={contentRef}
                        className="w-full p-4 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-[#709CEF] focus:border-transparent text-gray-300 font-mono min-h-[400px] h-full transition-all resize-none text-sm leading-relaxed placeholder-gray-700 custom-scrollbar"
                        value={isAnimating ? displayedContent : content}
                        onChange={handleContentChange}
                        placeholder="在此輸入內容，支援 Markdown..."
                        required
                        readOnly={isFormatting || isAnimating}
                    />
                </div>
                {/* Helper Text */}
                <div className="absolute bottom-4 left-4 text-xs text-gray-600 pointer-events-none">
                    {content.length} characters
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10 mt-auto">
                {/* Gemini AI Button (Fixed Position) */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={handleGeminiFormat}
                    disabled={isFormatting || isAnimating || !content}
                    className="group relative rounded-xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-300 hover:text-white hover:border-indigo-400 px-4 py-2 flex items-center gap-2 text-sm overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <i className="fas fa-sparkles text-xs group-hover:animate-pulse"></i>
                    <span>AI 排版</span>
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setPreviewMode(!previewMode)}
                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition-colors flex items-center text-sm"
                >
                    <i className={`fas ${previewMode ? 'fa-edit' : 'fa-eye'} mr-2`}></i>
                    {previewMode ? '返回編輯' : '預覽'}
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSubmit}
                    disabled={loading || isFormatting || isAnimating}
                    className="px-6 py-2 rounded-xl bg-[#709CEF] text-white hover:bg-[#5a8bd6] disabled:bg-blue-900/50 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(112,156,239,0.3)] flex items-center font-medium text-sm"
                >
                    {loading ? (
                        <>
                            <LogoLoader size="w-4 h-4" animate={true} className="mr-2 inline-flex" />
                            儲存中...
                        </>
                    ) : (
                        <>
                            <i className="fas fa-paper-plane mr-2"></i>
                            發布文章
                        </>
                    )}
                </motion.button>
            </div>
        </SpotlightCard>
    );
};

const PreviewSection = ({ title, imageUrl, isAnimating, displayedContent, content, setPreviewMode }) => {
    return (
        <div className="bg-[#1e1e1e]/80 backdrop-blur-md border border-white/10 rounded-2xl p-8 min-h-[800px] sticky top-8 shadow-2xl h-full overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setPreviewMode(false)}
                        className="lg:hidden w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                    >
                        <i className="fas fa-arrow-left"></i>
                    </button>
                    <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">即時預覽</h2>
                </div>
                <div className="flex gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/50"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/50"></span>
                </div>
            </div>

            <article className="prose prose-invert max-w-none 
                prose-headings:font-bold prose-headings:text-white prose-headings:tracking-tight
                prose-p:text-gray-300 prose-p:leading-relaxed
                prose-a:text-[#709CEF] hover:prose-a:text-blue-300 prose-a:no-underline hover:prose-a:underline
                prose-img:rounded-xl prose-img:shadow-lg prose-img:border prose-img:border-white/10
                prose-blockquote:border-l-4 prose-blockquote:border-[#709CEF] prose-blockquote:bg-white/5 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:not-italic prose-blockquote:text-gray-300 prose-blockquote:rounded-r-lg
                prose-code:text-[#709CEF] prose-code:bg-white/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                prose-pre:bg-[#0a0a0a] prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl
                prose-li:text-gray-300
                prose-hr:border-white/10
            ">
                {imageUrl && (
                    <div className="w-full h-64 mb-8 shadow-2xl rounded-xl overflow-hidden border border-white/10">
                        <LazyImage src={imageUrl} alt="Cover" className="w-full h-64 object-cover" wrapperClassName="w-full h-full" />
                    </div>
                )}
                <h1 className="mb-4 text-4xl md:text-5xl font-display">{title || '文章標題'}</h1>
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        img: (props) => {
                            if (!props.src) return null;
                            return <img {...props} />;
                        },
                        code({ node, inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || '');
                            const isGallery = match && match[1] === 'gallery';

                            if (!inline && isGallery) {
                                const images = [];
                                // Parse image markdown: ![alt](src) within the code block content
                                const lines = String(children).split('\n');
                                const imgRegex = /!\[(.*?)\]\((.*?)\)/;

                                lines.forEach(line => {
                                    const imgMatch = line.match(imgRegex);
                                    if (imgMatch) {
                                        images.push({
                                            alt: imgMatch[1],
                                            src: imgMatch[2]
                                        });
                                    }
                                });

                                return <PostGallery images={images} />;
                            }

                            return (
                                <code className={className} {...props}>
                                    {children}
                                </code>
                            );
                        }
                    }}
                >
                    {preprocessContent((isAnimating ? displayedContent : content) || '內容預覽區域...')}
                </ReactMarkdown>
            </article>
        </div>
    );
};

// --- Main Component ---

const PostEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [slug, setSlug] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [tags, setTags] = useState('');
    const [category, setCategory] = useState('');
    const [publishDate, setPublishDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);
    const [isFormatting, setIsFormatting] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Animation states
    const [isAnimating, setIsAnimating] = useState(false);
    const [displayedContent, setDisplayedContent] = useState('');
    const contentRef = useRef(null);

    // Mobile detection
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024); // lg breakpoint
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (id) {
            const fetchPost = async () => {
                const docRef = doc(db, 'posts', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setTitle(data.title);
                    setContent(data.content);
                    setDisplayedContent(data.content);
                    setSlug(data.slug);
                    setImageUrl(data.coverImage);
                    setTags(data.tags ? data.tags.join(', ') : '');
                    setCategory(data.category || '');
                    if (data.createdAt) {
                        setPublishDate(formatDateForInput(data.createdAt.toDate()));
                    }
                }
            };
            fetchPost();
        }
    }, [id]);

    // Sync displayed content with content when not animating
    useEffect(() => {
        if (!isAnimating) {
            setDisplayedContent(content);
        }
    }, [content, isAnimating]);

    const handleContentChange = (e) => {
        const newContent = e.target.value;
        setContent(newContent);
    };

    const animateText = async (targetText) => {
        setIsAnimating(true);
        setDisplayedContent('');

        let currentText = '';
        const chunkSize = 5;

        for (let i = 0; i < targetText.length; i += chunkSize) {
            await new Promise(resolve => setTimeout(resolve, 5));
            currentText += targetText.slice(i, i + chunkSize);
            setDisplayedContent(currentText);

            if (contentRef.current) {
                contentRef.current.scrollTop = contentRef.current.scrollHeight;
            }
        }

        setContent(targetText);
        setIsAnimating(false);
    };

    const handleGeminiFormat = async () => {
        if (!content.trim()) return;

        setIsFormatting(true);

        try {
            const formatted = await formatContentWithGemini(content);
            await animateText(formatted);
        } catch (error) {
            alert("Gemini API Error: " + error.message);
            setIsFormatting(false);
        } finally {
            setIsFormatting(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!category) {
            alert("請選擇一個文章分類");
            return;
        }
        setLoading(true);

        const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

        try {
            const finalSlug = slug || (title.toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/--+/g, '-')
                .trim() || `post-${Date.now()}`);

            const commonData = {
                title,
                content,
                slug: finalSlug,
                coverImage: imageUrl,
                tags: tagsArray,
                category,
                updatedAt: serverTimestamp(),
            };

            // If user explicitly set a date, we update createdAt. 
            // Note: usually 'createdAt' is immutable, but user wants "Custom Publish Date". 
            // So we treat 'createdAt' as 'publishDate'.
            if (publishDate) {
                commonData.createdAt = Timestamp.fromDate(new Date(publishDate));
            } else if (!id) {
                // New post and no date -> Now
                commonData.createdAt = serverTimestamp();
            }

            if (id) {
                await setDoc(doc(db, 'posts', id), commonData, { merge: true });
            } else {
                await addDoc(collection(db, 'posts'), {
                    ...commonData,
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

    // Flip Animation Variants
    const flipVariants = {
        initial: (direction) => ({
            rotateY: direction > 0 ? 90 : -90,
            opacity: 0,
            scale: 0.9,
        }),
        animate: {
            rotateY: 0,
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.6,
                ease: [0.23, 1, 0.32, 1], // cubic-bezier for smooth feel
            },
        },
        exit: (direction) => ({
            rotateY: direction > 0 ? -90 : 90,
            opacity: 0,
            scale: 0.9,
            transition: {
                duration: 0.6,
                ease: [0.23, 1, 0.32, 1],
            },
        }),
    };

    // Determine direction: 1 for Editor -> Preview, -1 for Preview -> Editor
    const direction = previewMode ? 1 : -1;

    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-12 max-w-7xl min-h-screen relative perspective-[2000px]">
                {/* Back Button */}
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => navigate('/admin')}
                    className="mb-6 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors border border-white/5"
                >
                    <i className="fas fa-arrow-left"></i>
                </motion.button>

                {isMobile ? (
                    // Mobile View with Flip Animation
                    <AnimatePresence mode="wait" custom={direction}>
                        {!previewMode ? (
                            <motion.div
                                key="editor"
                                custom={direction}
                                variants={flipVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                className="w-full"
                                style={{ transformStyle: 'preserve-3d' }}
                            >
                                <EditorSection
                                    title={title} setTitle={setTitle}
                                    category={category} setCategory={setCategory}
                                    slug={slug} setSlug={setSlug}
                                    tags={tags} setTags={setTags}
                                    imageUrl={imageUrl} setImageUrl={setImageUrl}
                                    publishDate={publishDate} setPublishDate={setPublishDate}
                                    content={content} contentRef={contentRef}
                                    displayedContent={displayedContent}
                                    isAnimating={isAnimating} isFormatting={isFormatting}
                                    handleContentChange={handleContentChange}
                                    handleGeminiFormat={handleGeminiFormat}
                                    previewMode={previewMode} setPreviewMode={setPreviewMode}
                                    handleSubmit={handleSubmit} loading={loading}
                                />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="preview"
                                custom={direction}
                                variants={flipVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                className="w-full"
                                style={{ transformStyle: 'preserve-3d' }}
                            >
                                <PreviewSection
                                    title={title}
                                    imageUrl={imageUrl}
                                    isAnimating={isAnimating}
                                    displayedContent={displayedContent}
                                    content={content}
                                    setPreviewMode={setPreviewMode}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                ) : (
                    // Desktop View (Side-by-Side)
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <EditorSection
                                title={title} setTitle={setTitle}
                                category={category} setCategory={setCategory}
                                slug={slug} setSlug={setSlug}
                                tags={tags} setTags={setTags}
                                imageUrl={imageUrl} setImageUrl={setImageUrl}
                                publishDate={publishDate} setPublishDate={setPublishDate}
                                content={content} contentRef={contentRef}
                                displayedContent={displayedContent}
                                isAnimating={isAnimating} isFormatting={isFormatting}
                                handleContentChange={handleContentChange}
                                handleGeminiFormat={handleGeminiFormat}
                                previewMode={previewMode} setPreviewMode={setPreviewMode}
                                handleSubmit={handleSubmit} loading={loading}
                            />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <PreviewSection
                                title={title}
                                imageUrl={imageUrl}
                                isAnimating={isAnimating}
                                displayedContent={displayedContent}
                                content={content}
                                setPreviewMode={setPreviewMode}
                            />
                        </motion.div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
};

export default PostEditor;
