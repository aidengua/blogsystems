import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const CommentForm = ({ postId, postTitle, onCommentAdded }) => {
    const [name, setName] = useState('');
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        setIsSubmitting(true);
        setError(null);

        try {
            await addDoc(collection(db, 'comments'), {
                postId,
                postTitle,
                author: name.trim() || '訪客',
                content: content.trim(),
                createdAt: serverTimestamp(),
                isVisible: true
            });

            setName('');
            setContent('');
            if (onCommentAdded) onCommentAdded();
        } catch (err) {
            console.error("Error adding comment:", err);
            setError("留言發布失敗，請稍後再試。");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-[#1e1e1e] rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <i className="far fa-comment-dots text-[#709CEF]"></i>
                發表留言
            </h3>

            {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg">
                    {error}
                </div>
            )}

            <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    暱稱 (選填)
                </label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="訪客"
                    className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-[#709CEF] focus:border-transparent outline-none transition-all dark:text-white"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    留言內容 <span className="text-red-500">*</span>
                </label>
                <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="分享您的想法..."
                    required
                    rows="4"
                    className="w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-[#709CEF] focus:border-transparent outline-none transition-all resize-none dark:text-white"
                />
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isSubmitting || !content.trim()}
                    className="px-6 py-2 bg-[#709CEF] hover:bg-[#5B89E5] text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            發布中...
                        </>
                    ) : (
                        <>
                            <i className="fas fa-paper-plane"></i>
                            發布留言
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};

export default CommentForm;
