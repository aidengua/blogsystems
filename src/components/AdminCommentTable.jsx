import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
import SectionLoader from './SectionLoader';

const AdminCommentTable = () => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showNotification, showConfirmation } = useNotification();

    useEffect(() => {
        const q = query(collection(db, 'comments'), orderBy('createdAt', 'desc'));

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
    }, []);

    const handleDelete = async (id) => {
        showConfirmation({
            message: '確定要刪除這則留言嗎？此操作無法復原。',
            onConfirm: async () => {
                try {
                    await deleteDoc(doc(db, 'comments', id));
                    showNotification('留言已刪除', 'success');
                } catch (error) {
                    console.error("Error deleting comment:", error);
                    showNotification('刪除失敗', 'error');
                }
            }
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <SectionLoader className="min-h-[100px]" />
            </div>
        );
    }

    return (
        <div className="bg-[#1e1e1e] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-900/30">
                <h2 className="text-lg font-bold text-white">留言管理</h2>
                <div className="text-xs text-gray-500 bg-gray-800 px-3 py-1 rounded-full">
                    共 {comments.length} 則
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                            <th className="px-6 py-4 font-semibold">留言者</th>
                            <th className="px-6 py-4 font-semibold w-1/3">內容</th>
                            <th className="px-6 py-4 font-semibold">所屬文章</th>
                            <th className="px-6 py-4 font-semibold">日期</th>
                            <th className="px-6 py-4 font-semibold text-right">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {comments.map((comment) => (
                            <tr key={comment.id} className="hover:bg-gray-800/30 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                                            {comment.author.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="font-medium text-gray-200">{comment.author}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-gray-400 text-sm line-clamp-2" title={comment.content}>
                                        {comment.content}
                                    </p>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm text-blue-400 hover:text-blue-300 transition-colors line-clamp-1">
                                        {comment.postTitle || 'Unknown Post'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                                    {comment.createdAt?.toDate().toLocaleDateString('zh-TW')}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => handleDelete(comment.id)}
                                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                        title="刪除"
                                    >
                                        <i className="fas fa-trash-alt"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {comments.length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-6 py-24 text-center text-gray-500">
                                    <div className="flex flex-col items-center">
                                        <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
                                            <i className="far fa-comments text-2xl text-gray-600"></i>
                                        </div>
                                        <p className="text-lg font-medium text-gray-400">尚無留言</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminCommentTable;
