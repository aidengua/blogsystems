import { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { collection, deleteDoc, doc, query, orderBy, onSnapshot, addDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import MainLayout from '../../layouts/MainLayout';
import AdminCommentTable from '../../components/AdminCommentTable';
import { useNotification } from '../../context/NotificationContext';
import {
    PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import SpotlightCard from '../../components/SpotlightCard';

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
    const { showNotification, showConfirmation } = useNotification();
    const [editingEssay, setEditingEssay] = useState(null);

    // Album State
    const [albums, setAlbums] = useState([]);
    const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
    const [photoData, setPhotoData] = useState({ title: '', src: '', description: '', tags: '', date: '' });
    const [publishingPhoto, setPublishingPhoto] = useState(false);
    const [editingPhoto, setEditingPhoto] = useState(null);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

    useEffect(() => {
        const q = query(collection(db, 'posts'), orderBy('createdAt', 'asc'));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const postsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            const sortedPosts = [...postsData].sort((a, b) =>
                b.createdAt?.toDate() - a.createdAt?.toDate()
            );
            setPosts(sortedPosts);

            const totalViews = postsData.reduce((acc, post) => acc + (post.views || 0), 0);
            setStats({
                totalPosts: postsData.length,
                totalViews
            });

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

    useEffect(() => {
        const q = query(collection(db, 'albums'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const albumsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setAlbums(albumsData);
        });
        return () => unsubscribe();
    }, []);

    const handleDelete = async (id) => {
        showConfirmation({
            message: '確定要刪除這篇文章嗎？此操作無法復原。',
            onConfirm: async () => {
                try {
                    await deleteDoc(doc(db, 'posts', id));
                    showNotification('文章已刪除', 'success');
                } catch (error) {
                    console.error("Error deleting post:", error);
                    showNotification('刪除失敗', 'error');
                }
            }
        });
    };

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/admin/login');
    };

    const handleDeleteEssay = async (id) => {
        showConfirmation({
            message: '確定要刪除這則短文嗎？',
            onConfirm: async () => {
                try {
                    await deleteDoc(doc(db, 'essays', id));
                    showNotification('短文已刪除', 'success');
                } catch (error) {
                    console.error("Error deleting essay:", error);
                    showNotification('刪除失敗', 'error');
                }
            }
        });
    };

    const handleEditEssay = (essay) => {
        setEditingEssay(essay);
        setEssayContent(essay.content);
        setIsEssayModalOpen(true);
    };

    const handleEssayModalClose = (e) => {
        if (e.target === e.currentTarget) {
            if (essayContent.trim()) {
                showConfirmation({
                    message: '您有未儲存的內容，確定要關閉嗎？',
                    onConfirm: () => setIsEssayModalOpen(false)
                });
            } else {
                setIsEssayModalOpen(false);
            }
        }
    };

    const handleEssayModalCloseButton = () => {
        if (essayContent.trim()) {
            showConfirmation({
                message: '您有未儲存的內容，確定要關閉嗎？',
                onConfirm: () => setIsEssayModalOpen(false)
            });
        } else {
            setIsEssayModalOpen(false);
        }
    }

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

    const handleDeletePhoto = async (id) => {
        showConfirmation({
            message: '確定要刪除這張照片嗎？',
            onConfirm: async () => {
                try {
                    await deleteDoc(doc(db, 'albums', id));
                    showNotification('照片已刪除', 'success');
                } catch (error) {
                    console.error("Error deleting photo:", error);
                    showNotification('刪除失敗', 'error');
                }
            }
        });
    };

    const handleEditPhoto = (photo) => {
        setEditingPhoto(photo);
        setPhotoData({
            title: photo.title,
            src: photo.src,
            description: photo.description || '',
            tags: photo.tags ? photo.tags.join(', ') : '',
            date: photo.createdAt ? photo.createdAt.toDate().toISOString().split('T')[0] : ''
        });
        setIsPhotoModalOpen(true);
    };

    const handlePhotoModalClose = (e) => {
        if (e.target === e.currentTarget) {
            const hasContent = photoData.title || photoData.src || photoData.description || photoData.tags;
            if (hasContent) {
                showConfirmation({
                    message: '您有未儲存的內容，確定要關閉嗎？',
                    onConfirm: () => setIsPhotoModalOpen(false)
                });
            } else {
                setIsPhotoModalOpen(false);
            }
        }
    };

    const handlePhotoModalCloseButton = () => {
        const hasContent = photoData.title || photoData.src || photoData.description || photoData.tags;
        if (hasContent) {
            showConfirmation({
                message: '您有未儲存的內容，確定要關閉嗎？',
                onConfirm: () => setIsPhotoModalOpen(false)
            });
        } else {
            setIsPhotoModalOpen(false);
        }
    };

    const handleSavePhoto = async (e) => {
        e.preventDefault();
        if (!photoData.src.trim() || !photoData.title.trim()) {
            showNotification('請填寫標題與圖片連結', 'error');
            return;
        }

        setPublishingPhoto(true);
        const submitDate = photoData.date ? new Date(photoData.date) : new Date();

        try {
            if (editingPhoto) {
                await updateDoc(doc(db, 'albums', editingPhoto.id), {
                    ...photoData,
                    tags: photoData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
                    createdAt: submitDate, // Allow updating sort order
                    updatedAt: new Date()
                });
                showNotification('照片已更新', 'success');
                setEditingPhoto(null);
            } else {
                await addDoc(collection(db, 'albums'), {
                    ...photoData,
                    tags: photoData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
                    createdAt: submitDate,
                    authorId: auth.currentUser.uid
                });
                showNotification('照片已發布', 'success');
            }
            setPhotoData({ title: '', src: '', description: '', tags: '', date: '' });
            setIsPhotoModalOpen(false);
        } catch (error) {
            console.error("Error saving photo:", error);
            showNotification('儲存失敗', 'error');
        } finally {
            setPublishingPhoto(false);
        }
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-[#1e1e1e]/90 backdrop-blur-md border border-white/10 p-3 rounded-lg shadow-xl">
                    <p className="text-gray-400 text-xs mb-1">{data.date}</p>
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
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#709CEF] border-t-transparent"></div>
            </div>
        </MainLayout>
    );

    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-24 max-w-7xl min-h-screen">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6"
                >
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
                            管理儀表板
                        </h1>
                        <p className="text-gray-400 text-sm">
                            歡迎回來，<span className="text-[#709CEF] font-medium">{auth.currentUser?.email}</span>
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3 w-full md:w-auto">
                        <button
                            onClick={() => {
                                setEditingEssay(null);
                                setEssayContent('');
                                setIsEssayModalOpen(true);
                            }}
                            className="flex-1 md:flex-none inline-flex justify-center items-center px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-all shadow-lg shadow-purple-500/20 font-medium text-sm group"
                        >
                            <i className="fas fa-pen-fancy mr-2 group-hover:-rotate-12 transition-transform"></i>
                            新增短文
                        </button>
                        <button
                            onClick={() => {
                                setEditingPhoto(null);
                                setPhotoData({ title: '', src: '', description: '', tags: '', date: '' });
                                setIsPhotoModalOpen(true);
                            }}
                            className="flex-1 md:flex-none inline-flex justify-center items-center px-5 py-2.5 bg-pink-600 hover:bg-pink-500 text-white rounded-xl transition-all shadow-lg shadow-pink-500/20 font-medium text-sm group"
                        >
                            <i className="fas fa-camera mr-2"></i>
                            新增照片
                        </button>
                        <Link
                            to="/admin/posts/new"
                            className="flex-1 md:flex-none inline-flex justify-center items-center px-5 py-2.5 bg-[#709CEF] hover:bg-[#5a8bd6] text-white rounded-xl transition-all shadow-lg shadow-blue-500/20 font-medium text-sm group"
                        >
                            <i className="fas fa-plus mr-2 group-hover:rotate-90 transition-transform"></i>
                            新增文章
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex-1 md:flex-none inline-flex justify-center items-center px-5 py-2.5 bg-[#1e1e1e] border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all text-sm"
                        >
                            <i className="fas fa-sign-out-alt mr-2"></i>
                            登出
                        </button>
                    </div>
                </motion.div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <SpotlightCard className="p-6 h-full" spotlightColor="rgba(112, 156, 239, 0.1)">
                            <div className="mb-6 flex justify-between items-end">
                                <div>
                                    <h3 className="text-lg font-bold text-white">文章分類統計</h3>
                                    <p className="text-gray-500 text-xs mt-1">Tag Distribution</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-2xl font-bold text-white">{stats.totalPosts}</span>
                                    <span className="text-xs text-gray-500 ml-1">篇總文章</span>
                                </div>
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
                                            stroke="none"
                                        >
                                            {tagData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'rgba(30, 30, 30, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '0.75rem', backdropFilter: 'blur(10px)' }}
                                            itemStyle={{ color: '#fff', fontSize: '12px' }}
                                        />
                                        <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#9ca3af' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </SpotlightCard>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <SpotlightCard className="p-6 h-full" spotlightColor="rgba(112, 156, 239, 0.1)">
                            <div className="mb-6 flex justify-between items-end">
                                <div>
                                    <h3 className="text-lg font-bold text-white">瀏覽量趨勢</h3>
                                    <p className="text-gray-500 text-xs mt-1">View Trends</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-2xl font-bold text-white">{stats.totalViews}</span>
                                    <span className="text-xs text-gray-500 ml-1">次總瀏覽</span>
                                </div>
                            </div>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart
                                        data={viewData}
                                        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                                    >
                                        <defs>
                                            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#709CEF" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#709CEF" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                        <XAxis
                                            dataKey="name"
                                            stroke="#4b5563"
                                            tick={{ fill: '#6b7280', fontSize: 10 }}
                                            tickLine={false}
                                            axisLine={false}
                                            interval="preserveStartEnd"
                                        />
                                        <YAxis
                                            stroke="#4b5563"
                                            tick={{ fill: '#6b7280', fontSize: 10 }}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area
                                            type="monotone"
                                            dataKey="views"
                                            stroke="#709CEF"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#colorViews)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </SpotlightCard>
                    </motion.div>
                </div>

                {/* Tab Switcher */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                    {[
                        { id: 'posts', label: '文章列表', color: 'bg-[#709CEF]' },
                        { id: 'essays', label: '短文列表', color: 'bg-purple-600' },
                        { id: 'albums', label: '相簿列表', color: 'bg-pink-600' },
                        { id: 'comments', label: '留言管理', color: 'bg-green-600' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-5 py-2.5 rounded-xl font-medium transition-all text-sm whitespace-nowrap ${activeTab === tab.id
                                ? `${tab.color} text-white shadow-lg shadow-${tab.color.split('-')[1]}-500/20`
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Table */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {activeTab === 'comments' ? (
                        <AdminCommentTable />
                    ) : (
                        <SpotlightCard className="overflow-hidden" spotlightColor="rgba(112, 156, 239, 0.05)">
                            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/20">
                                <h2 className="text-lg font-bold text-white">
                                    {activeTab === 'posts' ? '文章列表' : activeTab === 'essays' ? '短文列表' : '相簿列表'}
                                </h2>
                                <div className="text-xs text-gray-400 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                                    共 {activeTab === 'posts' ? posts.length : activeTab === 'essays' ? essays.length : albums.length} 篇
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                {activeTab === 'posts' ? (
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-white/10 text-gray-500 text-xs uppercase tracking-wider">
                                                <th className="px-6 py-4 font-semibold">文章標題</th>
                                                <th className="px-6 py-4 font-semibold">狀態</th>
                                                <th className="px-6 py-4 font-semibold">數據</th>
                                                <th className="px-6 py-4 font-semibold">發布日期</th>
                                                <th className="px-6 py-4 font-semibold text-right">操作</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {posts.map((post) => (
                                                <tr key={post.id} className="hover:bg-white/5 transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center">
                                                            <div className="w-12 h-12 rounded-lg overflow-hidden mr-4 bg-gray-800 flex-shrink-0 border border-white/10 relative group-hover:border-[#709CEF]/50 transition-colors">
                                                                {post.coverImage ? (
                                                                    <img src={post.coverImage} alt="" className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                                                                        <i className="fas fa-image"></i>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold text-gray-200 group-hover:text-[#709CEF] transition-colors line-clamp-1 text-sm">{post.title}</p>
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
                                                                className="p-2 text-gray-400 hover:text-[#709CEF] hover:bg-blue-500/10 rounded-lg transition-all"
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
                                                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
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
                                ) : activeTab === 'essays' ? (
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-white/10 text-gray-500 text-xs uppercase tracking-wider">
                                                <th className="px-6 py-4 font-semibold w-1/2">內容預覽</th>
                                                <th className="px-6 py-4 font-semibold">發布日期</th>
                                                <th className="px-6 py-4 font-semibold text-right">操作</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {essays.map((essay) => (
                                                <tr key={essay.id} className="hover:bg-white/5 transition-colors group">
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
                                                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
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
                                ) : (
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-white/10 text-gray-500 text-xs uppercase tracking-wider">
                                                <th className="px-6 py-4 font-semibold">照片</th>
                                                <th className="px-6 py-4 font-semibold">標題</th>
                                                <th className="px-6 py-4 font-semibold">上傳日期</th>
                                                <th className="px-6 py-4 font-semibold text-right">操作</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {albums.map((photo) => (
                                                <tr key={photo.id} className="hover:bg-white/5 transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <div className="w-16 h-16 rounded-lg overflow-hidden border border-white/10">
                                                            <img src={photo.src} alt="" className="w-full h-full object-cover" />
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <p className="font-bold text-gray-200">{photo.title}</p>
                                                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">{photo.description}</p>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                                                        {photo.createdAt?.toDate().toLocaleDateString('zh-TW')}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button
                                                            onClick={() => handleEditPhoto(photo)}
                                                            className="p-2 text-gray-400 hover:text-pink-400 hover:bg-pink-500/10 rounded-lg transition-all"
                                                            title="編輯"
                                                        >
                                                            <i className="fas fa-edit"></i>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeletePhoto(photo.id)}
                                                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                                            title="刪除"
                                                        >
                                                            <i className="fas fa-trash-alt"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {albums.length === 0 && (
                                                <tr>
                                                    <td colSpan="4" className="px-6 py-24 text-center text-gray-500">
                                                        <div className="flex flex-col items-center">
                                                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                                                <i className="fas fa-images text-2xl text-gray-600"></i>
                                                            </div>
                                                            <p className="text-lg font-medium text-gray-400">尚無照片</p>
                                                            <p className="text-sm mt-1 text-gray-600">點擊上方按鈕上傳您的第一張照片</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </SpotlightCard>
                    )}
                </motion.div>
            </div>

            {/* Essay Modal */}
            <AnimatePresence>
                {isEssayModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleEssayModalClose}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#1e1e1e] border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-white">
                                    {editingEssay ? '編輯短文' : '快速發布短文'}
                                </h2>
                                <button
                                    onClick={handleEssayModalCloseButton}
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
                                    className="w-full h-48 bg-black/30 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none"
                                    autoFocus
                                />
                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={handleEssayModalCloseButton}
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
                        </motion.div>
                    </motion.div>
                )}

                {/* Photo Modal */}
                {isPhotoModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handlePhotoModalClose}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#1e1e1e] border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-white">
                                    {editingPhoto ? '編輯照片' : '新增照片'}
                                </h2>
                                <button
                                    onClick={handlePhotoModalCloseButton}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                            <div className="flex flex-col gap-4">
                                <input
                                    type="text"
                                    value={photoData.title}
                                    onChange={(e) => setPhotoData({ ...photoData, title: e.target.value })}
                                    placeholder="照片標題"
                                    className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                                />
                                <input
                                    type="text"
                                    value={photoData.src}
                                    onChange={(e) => setPhotoData({ ...photoData, src: e.target.value })}
                                    placeholder="圖片連結 (URL)"
                                    className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all font-mono text-sm"
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="date"
                                        value={photoData.date}
                                        onChange={(e) => setPhotoData({ ...photoData, date: e.target.value })}
                                        className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                                    />
                                    <input
                                        type="text"
                                        value={photoData.tags}
                                        onChange={(e) => setPhotoData({ ...photoData, tags: e.target.value })}
                                        placeholder="標籤 (用逗號分隔)"
                                        className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                                    />
                                </div>
                                <textarea
                                    value={photoData.description}
                                    onChange={(e) => setPhotoData({ ...photoData, description: e.target.value })}
                                    placeholder="照片描述..."
                                    className="w-full h-32 bg-black/30 border border-white/10 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all resize-none"
                                />
                                <div className="flex justify-end gap-3 mt-2">
                                    <button
                                        onClick={handlePhotoModalCloseButton}
                                        className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                                    >
                                        取消
                                    </button>
                                    <button
                                        onClick={handleSavePhoto}
                                        disabled={publishingPhoto || !photoData.title}
                                        className="px-6 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {publishingPhoto ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                {editingPhoto ? '更新中...' : '發布中...'}
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-cloud-upload-alt"></i>
                                                {editingPhoto ? '更新' : '發布'}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </MainLayout>
    );
};

export default Dashboard;
