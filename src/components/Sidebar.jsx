import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const Sidebar = ({ mobile, close, toc, activeSection }) => {
    const [tags, setTags] = useState({});
    const [stats, setStats] = useState({
        articleCount: 0,
        tagCount: 0,
        categoryCount: 0,
        lastUpdate: '',
        wordCount: '0k', // Placeholder as we don't store word count yet
        daysOnline: 0
    });
    const [activityData, setActivityData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const q = query(collection(db, 'posts'), where('status', '==', 'published'), orderBy('createdAt', 'desc'));
                const querySnapshot = await getDocs(q);
                const posts = querySnapshot.docs.map(doc => ({ ...doc.data(), createdAt: doc.data().createdAt?.toDate() }));

                // 1. Process Tags
                const tagCounts = {};
                posts.forEach(post => {
                    if (post.tags) {
                        post.tags.forEach(tag => {
                            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                        });
                    }
                });
                setTags(tagCounts);

                // 2. Process Stats
                const startDate = new Date('2025-01-01'); // Assume site launch date
                const now = new Date();
                const diffTime = Math.abs(now - startDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                setStats({
                    articleCount: posts.length,
                    tagCount: Object.keys(tagCounts).length,
                    categoryCount: 3, // Hardcoded for now or derive from categories if added
                    lastUpdate: posts.length > 0 ? posts[0].createdAt.toLocaleDateString() : 'N/A',
                    wordCount: (posts.reduce((acc, post) => acc + (post.content?.length || 0), 0) / 1000).toFixed(1) + 'k',
                    daysOnline: diffDays
                });

                // 3. Process Activity Data (Posts per Month) for Chart
                const activityMap = {};
                // Initialize last 6 months
                for (let i = 5; i >= 0; i--) {
                    const d = new Date();
                    d.setMonth(d.getMonth() - i);
                    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
                    activityMap[key] = 0;
                }

                posts.forEach(post => {
                    if (post.createdAt) {
                        const key = `${post.createdAt.getFullYear()}-${String(post.createdAt.getMonth() + 1).padStart(2, '0')}`;
                        if (activityMap[key] !== undefined) {
                            activityMap[key]++;
                        }
                    }
                });

                const chartData = Object.keys(activityMap).map(key => ({
                    name: key,
                    count: activityMap[key]
                }));
                setActivityData(chartData);

            } catch (error) {
                console.error("Error fetching sidebar data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className={`h-full flex flex-col ${mobile ? 'p-6' : ''}`}>
            {mobile && (
                <div className="flex justify-end mb-4">
                    <button onClick={close} className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                        <i className="fas fa-times text-xl"></i>
                    </button>
                </div>
            )}

            {/* Profile Card */}
            <div className="liquid-glass p-6 text-center mb-6">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden ring-4 ring-blue-50 dark:ring-gray-700">
                    <img
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                        alt="Avatar"
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Blog Author</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">分享技術與生活</p>

                <div className="flex justify-center gap-6 mb-6">
                    <div className="text-center">
                        <div className="font-bold text-gray-900 dark:text-white">{stats.articleCount}</div>
                        <div className="text-xs text-gray-500 uppercase">文章</div>
                    </div>
                    <div className="text-center">
                        <div className="font-bold text-gray-900 dark:text-white">{stats.tagCount}</div>
                        <div className="text-xs text-gray-500 uppercase">標籤</div>
                    </div>
                    <div className="text-center">
                        <div className="font-bold text-gray-900 dark:text-white">{stats.categoryCount}</div>
                        <div className="text-xs text-gray-500 uppercase">分類</div>
                    </div>
                </div>

                <div className="flex justify-center gap-4 text-gray-400">
                    <a href="#" className="hover:text-github transition-colors"><i className="fab fa-github text-xl"></i></a>
                    <a href="#" className="hover:text-blue-400 transition-colors"><i className="fab fa-twitter text-xl"></i></a>
                    <a href="#" className="hover:text-blue-600 transition-colors"><i className="fab fa-facebook text-xl"></i></a>
                </div>
            </div>

            {/* Table of Contents (Post Only) */}
            {toc && (
                <div className="bg-[#1e1e1e] rounded-xl p-6 mb-6 shadow-xl border border-gray-800 sticky top-24">
                    <div className="flex items-center gap-2 mb-4 text-white font-bold pb-2">
                        <i className="fas fa-bars text-white"></i>
                        <span>目錄</span>
                    </div>
                    <div className="space-y-1 max-h-[calc(100vh-400px)] overflow-y-auto pr-2 custom-scrollbar">
                        {toc.length > 0 ? (
                            toc.map((item) => (
                                <a
                                    key={item.id}
                                    href={`#${item.id}`}
                                    className={`block text-sm py-2 px-3 rounded-md transition-all duration-300 ${activeSection === item.id
                                        ? 'bg-orange-500/10 text-orange-400 border-l-4 border-orange-400 pl-2'
                                        : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                                        } ${item.level === 1 ? 'font-bold' :
                                            item.level === 2 ? 'ml-2' :
                                                'ml-4'
                                        }`}
                                >
                                    {item.text}
                                </a>
                            ))
                        ) : (
                            <span className="text-sm text-gray-500">No headers found.</span>
                        )}
                    </div>
                </div>
            )}

            {/* Announcement Card */}
            {!toc && (
                <div className="liquid-glass p-4 mb-6 group cursor-pointer overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 opacity-90 dark:opacity-80 transition-all duration-500 group-hover:scale-110"></div>
                    <div className="relative z-10 flex items-center justify-between text-white">
                        <div className="flex flex-col">
                            <span className="text-xs opacity-80 mb-1">公眾號 微信</span>
                            <span className="font-bold text-lg">快人一步獲取最新文章</span>
                        </div>
                        <i className="fab fa-weixin text-3xl opacity-80 group-hover:rotate-12 transition-transform"></i>
                    </div>
                    <i className="fas fa-play absolute right-2 bottom-2 text-white/10 text-4xl"></i>
                </div>
            )}

            {/* Tags Card */}
            {!toc && (
                <div className="liquid-glass p-6 mb-6">
                    <div className="flex items-center gap-2 mb-4 text-gray-900 dark:text-white font-bold border-b border-gray-100 dark:border-gray-700 pb-2">
                        <i className="fas fa-tags text-blue-500"></i>
                        <span>標籤雲</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {loading ? (
                            <span className="text-sm text-gray-500">Loading tags...</span>
                        ) : Object.keys(tags).length > 0 ? (
                            Object.entries(tags).map(([tag, count], i) => (
                                <Link key={i} to={`/tags/${tag}`} className="text-sm px-2 py-1 rounded-md hover:bg-blue-500 hover:text-white text-gray-600 dark:text-gray-300 transition-colors">
                                    {tag} <sup className="text-xs opacity-60">{count}</sup>
                                </Link>
                            ))
                        ) : (
                            <span className="text-sm text-gray-500">No tags found.</span>
                        )}
                    </div>
                </div>
            )}

            {/* Archives Card */}
            {!toc && (
                <div className="liquid-glass p-6 mb-6">
                    <div className="flex items-center gap-2 mb-4 text-gray-900 dark:text-white font-bold border-b border-gray-100 dark:border-gray-700 pb-2">
                        <i className="fas fa-archive text-blue-500"></i>
                        <span>歸檔</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <Link to="/archives/2025-10" className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-blue-500 hover:text-white transition-colors group">
                            <div className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-white/80">十月 2025</div>
                            <div className="font-bold text-gray-900 dark:text-white group-hover:text-white">5 篇</div>
                        </Link>
                    </div>
                </div>
            )}

            {/* Website Info Card with Chart */}
            {!toc && (
                <div className="liquid-glass p-6 mb-6">
                    <div className="flex items-center gap-2 mb-4 text-gray-900 dark:text-white font-bold border-b border-gray-100 dark:border-gray-700 pb-2">
                        <i className="fas fa-chart-line text-blue-500"></i>
                        <span>網站資訊</span>
                    </div>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 dark:text-gray-400">文章總數 :</span>
                            <span className="font-medium text-gray-900 dark:text-white">{stats.articleCount}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 dark:text-gray-400">建站天數 :</span>
                            <span className="font-medium text-gray-900 dark:text-white">{stats.daysOnline} 天</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 dark:text-gray-400">全站字數 :</span>
                            <span className="font-medium text-gray-900 dark:text-white">{stats.wordCount}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 dark:text-gray-400">最後更新 :</span>
                            <span className="font-medium text-gray-900 dark:text-white">{stats.lastUpdate}</span>
                        </div>
                    </div>

                    {/* Trend Chart */}
                    <div className="mt-4 h-32 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={activityData}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="count" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCount)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* Navigation (Mobile Only) */}
            {mobile && (
                <div className="space-y-2">
                    <Link to="/" className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <i className="fas fa-home w-6 text-center text-gray-400"></i> 首頁
                    </Link>
                    <Link to="/archives" className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <i className="fas fa-archive w-6 text-center text-gray-400"></i> 歸檔
                    </Link>
                    <Link to="/tags" className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <i className="fas fa-tags w-6 text-center text-gray-400"></i> 標籤
                    </Link>
                    <Link to="/about" className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <i className="fas fa-user w-6 text-center text-gray-400"></i> 關於
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Sidebar;
