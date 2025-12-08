import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, query, where, getDocs, updateDoc, increment, doc, getCountFromServer } from 'firebase/firestore';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import { db } from '../../firebase';
import MainLayout from '../../layouts/MainLayout';
import Sidebar from '../../components/Sidebar';
import CommentSection from '../../components/CommentSection';
import PostGallery from '../../components/PostGallery';

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

const MetaItem = ({ icon, value, label }) => (
    <div className="group relative flex items-center gap-2 cursor-help transition-opacity hover:opacity-100 opacity-80">
        <i className={`${icon} text-sm`}></i>
        <span className="text-sm font-medium font-mono">{value}</span>

        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-black/80 backdrop-blur-md border border-white/10 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 whitespace-nowrap pointer-events-none z-20 shadow-xl">
            {label}
            {/* Triangle/Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-black/80"></div>
        </div>
    </div>
);

const PostDetail = () => {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [toc, setToc] = useState([]);
    const [activeSection, setActiveSection] = useState('');
    const [commentCount, setCommentCount] = useState(0);

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

                    // Fetch comment count
                    const commentsQ = query(collection(db, 'comments'), where('postId', '==', postDoc.id));
                    const snapshot = await getCountFromServer(commentsQ);
                    setCommentCount(snapshot.data().count);
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

    // Generate TOC from rendered DOM elements to ensure ID consistency
    useEffect(() => {
        if (post?.content) {
            // Wait for render cycle to complete
            setTimeout(() => {
                const article = document.querySelector('.prose');
                if (article) {
                    const headings = Array.from(article.querySelectorAll('h1, h2, h3'));
                    const newToc = headings.map(heading => {
                        // Ensure heading has an ID (rehype-slug should have added it, but fallback if missing)
                        if (!heading.id) {
                            heading.id = heading.innerText.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-').replace(/^-+|-+$/g, '');
                        }

                        return {
                            id: heading.id,
                            text: heading.innerText,
                            level: parseInt(heading.tagName.substring(1))
                        };
                    });
                    setToc(newToc);
                }
            }, 100);
        }
    }, [post]);

    // Intersection Observer for Active Section
    useEffect(() => {
        if (toc.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { rootMargin: '-100px 0px -66% 0px' }
        );

        const headings = document.querySelectorAll('.prose h1, .prose h2, .prose h3');
        headings.forEach((heading) => observer.observe(heading));

        return () => {
            headings.forEach((heading) => observer.unobserve(heading));
        };
    }, [toc]);

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
                    <Link to="/" className="inline-block bg-primary text-white px-6 py-2 rounded-full hover:bg-[#5B89E5] transition-colors mt-4">
                        返回首頁
                    </Link>
                </div>
            </div>
        </MainLayout>
    );

    return (
        <MainLayout>
            {/* Post Header */}
            <div className="relative h-[450px] w-full overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center transform scale-105"
                    style={{ backgroundImage: `url(${post.coverImage || 'https://camo.githubusercontent.com/520c5cfb0b63284eeb8c1d869660ffd7ab93b6a1310ffc6da27442f14d37a437/68747470733a2f2f6e706d2e656c656d6563646e2e636f6d2f616e7a686979752d6173736574732f696d6167652f636f6d6d6f6e2f6769746875622d696e666f2f4b6e6f636b2d436f64652e676966'})` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-[#f0f9eb] dark:to-[#121212] backdrop-blur-[2px]"></div>
                </div>

                <div className="relative z-10 h-full container mx-auto px-4 flex flex-col justify-center text-white max-w-7xl pt-12">
                    <div className="w-full lg:w-4/5">
                        {/* Tags & Categories Row */}
                        <div className="flex flex-wrap items-center gap-3 mb-6">
                            {/* Original Badge */}
                            <span className="bg-white/20 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-xs font-medium tracking-wide">
                                原創
                            </span>

                            {/* Category Badge (Simulated if not present in post data, or use first tag) */}
                            {post.category && (
                                <span className="bg-white/20 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-xs font-medium tracking-wide">
                                    {post.category}
                                </span>
                            )}

                            {/* Tags */}
                            {post.tags && post.tags.map(tag => (
                                <span key={tag} className="text-gray-300 text-sm hover:text-white transition-colors cursor-pointer">
                                    #{tag}
                                </span>
                            ))}
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold mb-8 text-shadow-xl leading-tight tracking-tight">
                            {post.title}
                        </h1>

                        {/* Metadata Row */}
                        <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-gray-200">
                            {/* Word Count */}
                            <MetaItem
                                icon="fas fa-file-alt"
                                value={`${(post.content?.length / 1000).toFixed(1)}k`}
                                label="字數統計"
                            />

                            {/* Read Time */}
                            <MetaItem
                                icon="far fa-clock"
                                value={`${Math.ceil((post.content?.length || 0) / 400)} 分鐘`}
                                label="閱讀時長"
                            />

                            {/* Date */}
                            <MetaItem
                                icon="far fa-calendar-alt"
                                value={post.createdAt?.toDate().toLocaleDateString('zh-TW')}
                                label="發布日期"
                            />

                            {/* Location (Placeholder as per design) */}
                            <MetaItem
                                icon="fas fa-map-marker-alt"
                                value="台北"
                                label="發布地點"
                            />

                            {/* Views (Fire icon) */}
                            <MetaItem
                                icon="fas fa-fire"
                                value={post.views || 0}
                                label="熱度"
                            />

                            {/* Comments */}
                            <MetaItem
                                icon="fas fa-comment"
                                value={commentCount}
                                label="評論數"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Post Content */}
            <div className="container mx-auto px-4 py-12 max-w-7xl">
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="w-full lg:w-3/4">
                        <div className="bg-white/80 dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl p-6 md:p-12">
                            <article className="prose prose-lg dark:prose-invert max-w-none 
                                prose-headings:font-display prose-headings:font-bold 
                                prose-a:text-primary hover:prose-a:text-blue-600 
                                prose-img:rounded-xl prose-img:shadow-lg
                                prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-gray-800/50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:not-italic
                            ">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    rehypePlugins={[rehypeSlug]}
                                    components={{
                                        img: (props) => {
                                            if (!props.src) return null;
                                            return <img {...props} />;
                                        },
                                        pre: ({ children, ...props }) => {
                                            // Check if child is a gallery code block
                                            const childProps = children?.props || {};
                                            const className = childProps.className || '';
                                            const isGallery = /language-gallery/.test(className);

                                            if (isGallery) {
                                                return <>{children}</>;
                                            }
                                            return <pre {...props}>{children}</pre>;
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
                                    {preprocessContent(post.content)}
                                </ReactMarkdown>
                            </article>

                            {/* Post Footer */}
                            <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-700">
                                <div className="flex justify-between items-center mb-12">
                                    <Link to="/" className="text-gray-500 hover:text-primary transition-colors">
                                        <i className="fas fa-arrow-left mr-2"></i> 返回首頁
                                    </Link>
                                    <div className="flex gap-2">
                                        {/* Share buttons could go here */}
                                    </div>
                                </div>

                                {/* Comment Section */}
                                <CommentSection postId={post.id} postTitle={post.title} />
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="hidden lg:block w-1/4">
                        <Sidebar toc={toc} activeSection={activeSection} />
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default PostDetail;
