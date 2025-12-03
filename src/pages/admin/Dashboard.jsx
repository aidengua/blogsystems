import { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { collection, deleteDoc, doc, query, orderBy, onSnapshot, addDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import MainLayout from '../../layouts/MainLayout';
import AdminCommentTable from '../../components/AdminCommentTable';
import { useNotification } from '../../context/NotificationContext';
import {
    PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';

const Dashboard = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ totalPosts: 0, totalViews: 0 });
    const [tagData, setTagData] = useState([]);
    const [viewData, setViewData] = useState([]);

    // Essay State
    const [essayContent, setEssayContent] = useState('');
    const [publishingEssay, setPublishingEssay] = useState(false);
    const [isEssayModalOpen, setIsEssayModalOpen] = useState(false);
    const [essays, setEssays] = useState([]);
    const [activeTab, setActiveTab] = useState('posts');
    const { showNotification } = useNotification(); // 'posts' or 'essays'
    const [editingEssay, setEditingEssay] = useState(null);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

    useEffect(() => {
        const q = query(collection(db, 'posts'), orderBy('createdAt', 'asc'));

        // Real-time listener
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const postsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Sort for table (descending)
            const sortedPosts = [...postsData].sort((a, b) =>
                b.createdAt?.toDate() - a.createdAt?.toDate()
            );
            setPosts(sortedPosts);

            // Calculate stats
            const totalViews = postsData.reduce((acc, post) => acc + (post.views || 0), 0);
            setStats({
                totalPosts: postsData.length,
                totalViews
            });

            // Prepare Tag Data for Pie Chart
            const tagCounts = {};
            postsData.forEach(post => {
                if (post.tags && Array.isArray(post.tags)) {
                    post.tags.forEach(tag => {
                        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                    });
                }
            });
            const pieData = Object.entries(tagCounts).map(([name, value]) => ({ name, value }));
            setTagData(pieData);

            // Prepare View Trend Data for Line Chart (Post Sequence)
            // Sort posts by date ascending for the chart
            const sortedPostsForChart = [...postsData].sort((a, b) =>
                a.createdAt?.toDate() - b.createdAt?.toDate()
            );

            const lineData = sortedPostsForChart.map((post, index) => ({
                name: `Post ${index + 1}`,
                title: post.title,
                views: post.views || 0,
                date: post.createdAt?.toDate().toLocaleDateString('zh-TW')
            }));

            setViewData(lineData);

            setLoading(false);
        }, (error) => {
            console.error("Error fetching posts:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Fetch Essays
    useEffect(() => {
        const q = query(collection(db, 'essays'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const essaysData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setEssays(essaysData);
        });
        return () => unsubscribe();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('確定要刪除這篇文章嗎？')) {
            try {
                await deleteDoc(doc(db, 'posts', id));
                showNotification('文章已刪除', 'success');
            } catch (error) {
                console.error("Error deleting post:", error);
                showNotification('刪除失敗', 'error');
            }
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/admin/login');
    };

    const handleDeleteEssay = async (id) => {
        if (window.confirm('確定要刪除這則短文嗎？')) {
            try {
                await deleteDoc(doc(db, 'essays', id));
                showNotification('短文已刪除', 'success');
            } catch (error) {
                console.error("Error deleting essay:", error);
                showNotification('刪除失敗', 'error');
            }
        }
    };

    const handleEditEssay = (essay) => {
        setEditingEssay(essay);
        setEssayContent(essay.content);
        setIsEssayModalOpen(true);
    };

    const handleSaveEssay = async (e) => {
        e.preventDefault();
        if (!essayContent.trim()) return;

        setPublishingEssay(true);
        try {
            if (editingEssay) {
                await updateDoc(doc(db, 'essays', editingEssay.id), {
                    content: essayContent,
                    updatedAt: new Date()
                });
                setEditingEssay(null);
                showNotification('短文已更新', 'success');
            } else {
                await addDoc(collection(db, 'essays'), {
                    content: essayContent,
                    createdAt: new Date(),
                    authorId: auth.currentUser.uid
                });
                showNotification('短文已發布', 'success');
            }
            setEssayContent('');
            setIsEssayModalOpen(false);
        } catch (error) {
            console.error("Error saving essay:", error);
            showNotification('儲存失敗', 'error');
        } finally {
            setPublishingEssay(false);
        }
    };

    // Custom Tooltip for Line Chart
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-[#1e1e1e] border border-gray-700 p-3 rounded-lg shadow-xl">
                    <p className="text-gray-300 text-sm mb-1">{data.date}</p>
                    <p className="text-[#709CEF] font-bold text-sm mb-1 line-clamp-1 max-w-[200px]">
                        {data.title}
                    </p>
                    <p className="text-white font-bold text-lg">
                        {data.views} <span className="text-xs text-gray-500 font-normal">瀏覽</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    if (loading) return (
        <MainLayout>
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            </div>
        </MainLayout>
    );

    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-12 max-w-7xl">
                {/* ... existing content ... */}
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
                            管理儀表板
                        </h1>
                        <p className="text-gray-400 text-sm">
                            歡迎回來，<span className="text-blue-400 font-medium">{auth.currentUser?.email}</span>
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => {
                                setEditingEssay(null);
                                setEssayContent('');
                                setIsEssayModalOpen(true);
                            }}
                            className="inline-flex items-center px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-all shadow-lg shadow-purple-500/20 font-medium text-sm group"
                        >
                            <i className="fas fa-pen-fancy mr-2 group-hover:-rotate-12 transition-transform"></i>
                            新增短文
                        </button>
                        <Link
                            to="/admin/posts/new"
                            className="inline-flex items-center px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all shadow-lg shadow-blue-500/20 font-medium text-sm group"
                        >
                            <i className="fas fa-plus mr-2 group-hover:rotate-90 transition-transform"></i>
                            新增文章
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="inline-flex items-center px-5 py-2.5 bg-[#1e1e1e] border border-gray-800 text-gray-300 hover:text-white hover:bg-gray-800 rounded-xl transition-all text-sm"
                        >
                            <i className="fas fa-sign-out-alt mr-2"></i>
                            登出
                        </button>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* ... charts ... */}
                    {/* Pie Chart: Tag Distribution */}
                    <div className="bg-[#1e1e1e] border border-gray-800 rounded-2xl p-6 shadow-xl hover:border-gray-700 transition-colors">
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-gray-200">文章分類統計</h3>
                            <p className="text-gray-500 text-sm">總文章數: {stats.totalPosts}</p>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={tagData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {tagData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0.2)" />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e1e1e', borderColor: '#374151', borderRadius: '0.5rem' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Line Chart: View Trends */}
                    <div className="bg-[#1e1e1e] border border-gray-800 rounded-2xl p-6 shadow-xl hover:border-gray-700 transition-colors">
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-gray-200">文章瀏覽量趨勢</h3>
                            <p className="text-gray-500 text-sm">總瀏覽次數: {stats.totalViews}</p>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={viewData}
                                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                >
                                    <defs>
                                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        stroke="#9ca3af"
                                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#9ca3af"
                                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                                        tickLine={false}
                                        axisLine={false}
                                        domain={[0, 1000]}
                                        allowDataOverflow={true}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area
                                        type="monotone"
                                        dataKey="views"
                                        stroke="#3b82f6"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorViews)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Tab Switcher */}
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setActiveTab('posts')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'posts'
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-400 hover:text-white hover:bg-gray-800'
                            }`}
                    >
                        文章列表
                    </button>
                    <button
                        onClick={() => setActiveTab('essays')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'essays'
                            ? 'bg-purple-600 text-white'
                            : 'text-gray-400 hover:text-white hover:bg-gray-800'
                            }`}
                    >
                        短文列表
                    </button>
                    <button
                        onClick={() => setActiveTab('comments')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'comments'
                            ? 'bg-green-600 text-white'
                            : 'text-gray-400 hover:text-white hover:bg-gray-800'
                            }`}
                    >
                        留言管理
                    </button>
                </div>

                {/* Content Table */}
                {activeTab === 'comments' ? (
                    <AdminCommentTable />
                ) : (
                    <div className="bg-[#1e1e1e] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
                        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-900/30">
                            <h2 className="text-lg font-bold text-white">
                                {activeTab === 'posts' ? '文章列表' : '短文列表'}
                            </h2>
                            <div className="text-xs text-gray-500 bg-gray-800 px-3 py-1 rounded-full">
                                共 {activeTab === 'posts' ? posts.length : essays.length} 篇
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            {activeTab === 'posts' ? (
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                                            <th className="px-6 py-4 font-semibold">文章標題</th>
                                            <th className="px-6 py-4 font-semibold">狀態</th>
                                            <th className="px-6 py-4 font-semibold">數據</th>
                                            <th className="px-6 py-4 font-semibold">發布日期</th>
                                            <th className="px-6 py-4 font-semibold text-right">操作</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800">
                                        {posts.map((post) => (
                                            <tr key={post.id} className="hover:bg-gray-800/30 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <div className="w-12 h-12 rounded-lg overflow-hidden mr-4 bg-gray-800 flex-shrink-0 border border-gray-700 relative group-hover:border-blue-500/50 transition-colors">
                                                            {post.coverImage ? (
                                                                <img src={post.coverImage} alt="" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-gray-600">
                                                                    <i className="fas fa-image"></i>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-gray-200 group-hover:text-blue-400 transition-colors line-clamp-1 text-sm">{post.title}</p>
                                                            <p className="text-xs text-gray-500 truncate max-w-[150px] font-mono mt-0.5">/{post.slug}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                                                        ${post.status === 'published'
                                                            ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                                            : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                                        }`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${post.status === 'published' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                                                        {post.status === 'published' ? '已發布' : '草稿'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center text-gray-400 font-medium text-sm">
                                                        <i className="far fa-eye mr-2 text-xs opacity-50"></i>
                                                        {post.views || 0}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                                                    {post.createdAt?.toDate().toLocaleDateString('zh-TW')}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Link
                                                            to={`/admin/posts/${post.id}`}
                                                            className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                                                            title="編輯"
                                                        >
                                                            <i className="fas fa-edit"></i>
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(post.id)}
                                                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
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
                                                <td colSpan="5" className="px-6 py-24 text-center text-gray-500">
                                                    <div className="flex flex-col items-center">
                                                        <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
                                                            <i className="fas fa-inbox text-2xl text-gray-600"></i>
                                                        </div>
                                                        <p className="text-lg font-medium text-gray-400">尚無文章</p>
                                                        <p className="text-sm mt-1 text-gray-600">點擊上方按鈕新增您的第一篇文章</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            ) : (
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                                            <th className="px-6 py-4 font-semibold w-1/2">內容預覽</th>
                                            <th className="px-6 py-4 font-semibold">發布日期</th>
                                            <th className="px-6 py-4 font-semibold text-right">操作</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-800">
                                        {essays.map((essay) => (
                                            <tr key={essay.id} className="hover:bg-gray-800/30 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <p className="text-gray-300 line-clamp-2 text-sm">{essay.content}</p>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                                                    {essay.createdAt?.toDate().toLocaleDateString('zh-TW')}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => handleEditEssay(essay)}
                                                            className="p-2 text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-all"
                                                            title="編輯"
                                                        >
                                                            <i className="fas fa-edit"></i>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteEssay(essay.id)}
                                                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                                            title="刪除"
                                                        >
                                                            <i className="fas fa-trash-alt"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {essays.length === 0 && (
                                            <tr>
                                                <td colSpan="3" className="px-6 py-24 text-center text-gray-500">
                                                    <div className="flex flex-col items-center">
                                                        <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
                                                            <i className="fas fa-pen-fancy text-2xl text-gray-600"></i>
                                                        </div>
                                                        <p className="text-lg font-medium text-gray-400">尚無短文</p>
                                                        <p className="text-sm mt-1 text-gray-600">點擊上方按鈕新增您的第一則短文</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Essay Modal */}
            {isEssayModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                    <div className="bg-[#1e1e1e] border border-gray-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl transform transition-all scale-100">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-white">
                                {editingEssay ? '編輯短文' : '快速發布短文'}
                            </h2>
                            <button
                                onClick={() => setIsEssayModalOpen(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="flex flex-col gap-4">
                            <textarea
                                value={essayContent}
                                onChange={(e) => setEssayContent(e.target.value)}
                                placeholder="寫下你的短文心事..."
                                className="w-full h-48 bg-gray-900 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                                autoFocus
                            />
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setIsEssayModalOpen(false)}
                                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                                >
                                    取消
                                </button>
                                <button
                                    onClick={handleSaveEssay}
                                    disabled={publishingEssay || !essayContent.trim()}
                                    className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {publishingEssay ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            {editingEssay ? '更新中...' : '發布中...'}
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-paper-plane"></i>
                                            {editingEssay ? '更新' : '發布'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
};

export default Dashboard;
