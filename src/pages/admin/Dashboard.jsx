import { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { collection, deleteDoc, doc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import MainLayout from '../../layouts/MainLayout';

const Dashboard = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ totalPosts: 0, totalViews: 0 });

    useEffect(() => {
        const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));

        // Real-time listener
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const postsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setPosts(postsData);

            // Calculate stats
            const totalViews = postsData.reduce((acc, post) => acc + (post.views || 0), 0);
            setStats({
                totalPosts: postsData.length,
                totalViews
            });

            setLoading(false);
        }, (error) => {
            console.error("Error fetching posts:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('確定要刪除這篇文章嗎？此動作無法復原。')) {
            try {
                await deleteDoc(doc(db, 'posts', id));
            } catch (error) {
                console.error("Error deleting post:", error);
                alert("刪除失敗");
            }
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/admin/login');
    };

    if (loading) return (
        <MainLayout>
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            </div>
        </MainLayout>
    );

    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-12 max-w-7xl">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
                            管理儀表板
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">
                            歡迎回來，{auth.currentUser?.email}
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <Link
                            to="/admin/posts/new"
                            className="inline-flex items-center px-6 py-2.5 bg-primary hover:bg-blue-600 text-white rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
                        >
                            <i className="fas fa-plus mr-2"></i>
                            新增文章
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="inline-flex items-center px-6 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-400 rounded-xl transition-all shadow hover:shadow-md border border-gray-200 dark:border-gray-700"
                        >
                            <i className="fas fa-sign-out-alt mr-2"></i>
                            登出
                        </button>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <div className="card-glass p-6 flex items-center justify-between group hover:border-primary/50 transition-colors">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">總文章數</p>
                            <h3 className="text-4xl font-bold text-gray-900 dark:text-white mt-2">{stats.totalPosts}</h3>
                        </div>
                        <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                            <i className="fas fa-file-alt text-2xl"></i>
                        </div>
                    </div>
                    <div className="card-glass p-6 flex items-center justify-between group hover:border-green-500/50 transition-colors">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">總瀏覽次數</p>
                            <h3 className="text-4xl font-bold text-gray-900 dark:text-white mt-2">{stats.totalViews}</h3>
                        </div>
                        <div className="w-16 h-16 rounded-2xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
                            <i className="fas fa-eye text-2xl"></i>
                        </div>
                    </div>
                </div>

                {/* Posts Table */}
                <div className="card-glass overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">文章列表</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700">
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">文章標題</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">狀態</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">數據</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">發布日期</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">操作</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {posts.map((post) => (
                                    <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className="w-12 h-12 rounded-lg overflow-hidden mr-4 bg-gray-100 dark:bg-gray-800 flex-shrink-0 border border-gray-200 dark:border-gray-700">
                                                    {post.coverImage ? (
                                                        <img src={post.coverImage} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                            <i className="fas fa-image"></i>
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-1">{post.title}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px] font-mono mt-0.5">{post.slug}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                                                ${post.status === 'published'
                                                    ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800'
                                                    : 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800'
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${post.status === 'published' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                                                {post.status === 'published' ? '已發布' : '草稿'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center text-gray-600 dark:text-gray-300 font-medium text-sm">
                                                <i className="far fa-eye mr-2 text-gray-400"></i>
                                                {post.views || 0}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            {post.createdAt?.toDate().toLocaleDateString('zh-TW')}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link
                                                    to={`/admin/posts/${post.id}`}
                                                    className="p-2 text-gray-500 hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all"
                                                    title="編輯"
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(post.id)}
                                                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-all"
                                                    title="刪除"
                                                >
                                                    <i className="fas fa-trash-alt"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {posts.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-16 text-center text-gray-500 dark:text-gray-400">
                                            <div className="flex flex-col items-center">
                                                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                                                    <i className="fas fa-inbox text-2xl text-gray-400"></i>
                                                </div>
                                                <p className="text-lg font-medium">尚無文章</p>
                                                <p className="text-sm mt-1">點擊上方按鈕新增您的第一篇文章</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Dashboard;
