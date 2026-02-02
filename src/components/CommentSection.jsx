import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { db } from '../firebase';
import CommentForm from './CommentForm';
import SectionLoader from './SectionLoader';

const CommentSection = ({ postId, postTitle }) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!postId) return;

        const q = query(
            collection(db, 'comments'),
            where('postId', '==', postId),
            where('isVisible', '==', true),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const commentsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setComments(commentsData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching comments:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [postId]);

    // Handle initial scroll to comment from URL hash
    useEffect(() => {
        if (!loading && comments.length > 0 && window.location.hash) {
            const hash = window.location.hash.substring(1); // remove '#'
            if (hash.startsWith('comment-')) {
                // Short timeout to ensure DOM render
                setTimeout(() => {
                    const element = document.getElementById(hash);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        // Add temporary highlight effect
                        element.classList.add('ring-2', 'ring-[#709CEF]', 'ring-offset-2', 'dark:ring-offset-[#121212]');
                        setTimeout(() => {
                            element.classList.remove('ring-2', 'ring-[#709CEF]', 'ring-offset-2', 'dark:ring-offset-[#121212]');
                        }, 2000);
                    }
                }, 500);
            }
        }
    }, [loading, comments]);

    return (
        <div className="space-y-8">
            <CommentForm postId={postId} postTitle={postTitle} />

            <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <i className="far fa-comments"></i>
                    留言列表 ({comments.length})
                </h3>

                {loading ? (
                    <SectionLoader className="min-h-[100px]" />
                ) : comments.length > 0 ? (
                    <div className="space-y-4">
                        <AnimatePresence mode="popLayout">
                            {comments.map((comment) => (
                                <motion.div
                                    key={comment.id}
                                    id={`comment-${comment.id}`}
                                    layout
                                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.3 }}
                                    className="bg-white dark:bg-[#1e1e1e] p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm scroll-mt-24"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#709CEF] to-[#5B89E5] flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-[#709CEF]/30">
                                                {comment.author.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 dark:text-white">
                                                    {comment.author}
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    {comment.createdAt?.toDate() ? comment.createdAt.toDate().toLocaleDateString('zh-TW', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    }) : '剛剛'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-gray-700 dark:text-gray-300 leading-relaxed text-[15px]">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                img: ({ node, ...props }) => (
                                                    <img
                                                        {...props}
                                                        className="inline-block w-6 h-6 align-text-bottom mx-0.5"
                                                        loading="lazy"
                                                    />
                                                ),
                                                p: ({ node, ...props }) => <div {...props} className="mb-1 last:mb-0" />
                                            }}
                                        >
                                            {comment.content}
                                        </ReactMarkdown>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12 bg-gray-50 dark:bg-[#1e1e1e]/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-800"
                    >
                        <div className="text-4xl text-gray-300 dark:text-gray-600 mb-3">
                            <i className="far fa-comment-alt"></i>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400">
                            目前還沒有留言，成為第一個留言的人吧！
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default CommentSection;
