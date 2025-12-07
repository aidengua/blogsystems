import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import ProfileCard from './ProfileCard';
import LineCard from './LineCard';

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
    const [chartDims, setChartDims] = useState({ width: 0, height: 0 });
    const chartContainerRef = useRef(null);
    const [isTocHovered, setIsTocHovered] = useState(false);

    useEffect(() => {
        // Robust check: Only render chart when container has dimensions
        if (!chartContainerRef.current) return;

        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect;
                if (width > 0 && height > 0) {
                    setChartDims({ width, height });
                } else {
                    setChartDims({ width: 0, height: 0 });
                }
            }
        });

        observer.observe(chartContainerRef.current);

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Query published posts - Client-side sorting/filtering to avoid composite index
                const q = query(collection(db, 'posts'), where('status', '==', 'published'));
                const querySnapshot = await getDocs(q);
                let posts = querySnapshot.docs.map(doc => ({
                    ...doc.data(),
                    createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date(doc.data().createdAt)
                }));

                // Sort by date desc (Newest first) for consistent processing
                posts.sort((a, b) => b.createdAt - a.createdAt);

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

    // Mobile Layout
    if (mobile) {
        return (
            <div className="h-full flex flex-col bg-[#1a1a1a] text-white overflow-hidden">
                {/* Mobile Header */}
                <div className="p-6 flex items-center justify-between border-b border-white/10 bg-white/5 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20">
                            <img
                                src="https://cloudflare-imgbed-5re.pages.dev/file/1759506193400_1000004107.jpg"
                                alt="Avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <h3 className="font-bold text-sm">呂宥德</h3>
                            <p className="text-xs text-gray-400">夢想家音響工作室</p>
                        </div>
                    </div>
                    <button
                        onClick={close}
                        className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                        <i className="fas fa-times text-sm"></i>
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
                    {/* Navigation Links */}
                    <div className="space-y-2">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-2">導航</p>
                        <Link to="/" onClick={close} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                                <i className="fas fa-home"></i>
                            </div>
                            <span className="font-medium">首頁</span>
                        </Link>
                        <Link to="/archives" onClick={close} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                            <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
                                <i className="fas fa-archive"></i>
                            </div>
                            <span className="font-medium">全部文章</span>
                        </Link>
                        <Link to="/categories" onClick={close} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                            <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400">
                                <i className="fas fa-folder"></i>
                            </div>
                            <span className="font-medium">分類列表</span>
                        </Link>
                        <Link to="/tags" onClick={close} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                            <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-400">
                                <i className="fas fa-tags"></i>
                            </div>
                            <span className="font-medium">標籤列表</span>
                        </Link>
                    </div>

                    {/* Content Links */}
                    <div className="space-y-2">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-2">內容</p>
                        <Link to="/essay" onClick={close} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                            <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-400">
                                <i className="fas fa-pen-fancy"></i>
                            </div>
                            <span className="font-medium">短文</span>
                        </Link>
                        <Link to="/changelog" onClick={close} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                            <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center text-yellow-400">
                                <i className="fas fa-history"></i>
                            </div>
                            <span className="font-medium">更新日誌</span>
                        </Link>
                    </div>

                    {/* About Links */}
                    <div className="space-y-2">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-2">關於</p>
                        <Link to="/about" onClick={close} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                            <div className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center text-teal-400">
                                <i className="fas fa-user"></i>
                            </div>
                            <span className="font-medium">關於本站</span>
                        </Link>
                        <Link to="/equipment" onClick={close} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                                <i className="fas fa-tools"></i>
                            </div>
                            <span className="font-medium">我的裝備</span>
                        </Link>
                    </div>

                    {/* Widgets (Simplified for Mobile) */}
                    <div className="pt-4 border-t border-white/10">
                        {/* Status Pill */}
                        <div className="mb-6 flex justify-center">
                            <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300 font-medium">
                                晚上就是拿來敲代碼的
                            </div>
                        </div>

                        {/* Line Card (Compact) */}
                        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#06C755] to-[#00B900] p-4 mb-6">
                            <div className="flex items-center justify-between text-white">
                                <div>
                                    <p className="text-xs opacity-80">官方帳號 Line</p>
                                    <p className="font-bold">加入好友獲取最新資訊</p>
                                </div>
                                <i className="fab fa-line text-2xl"></i>
                            </div>
                        </div>

                        {/* Tags Cloud (Compact) */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 mb-3 text-white font-bold">
                                <i className="fas fa-tags text-[#709CEF]"></i>
                                <span>標籤雲</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {Object.entries(tags).slice(0, 10).map(([tag, count], i) => (
                                    <Link key={i} to={`/tags/${tag}`} onClick={close} className="text-xs px-2 py-1 rounded-md bg-white/5 hover:bg-[#709CEF] hover:text-white text-gray-400 transition-colors">
                                        {tag}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Desktop Layout
    return (
        <div className="h-full flex flex-col">

            {/* Table of Contents (Post Only) */}
            {toc && (
                <div
                    className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 mb-6 shadow-2xl sticky top-24 relative group group/toc transition-all duration-300"
                    onMouseEnter={() => setIsTocHovered(true)}
                    onMouseLeave={() => setIsTocHovered(false)}
                >
                    {/* Background Glow Effect */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/30 transition-colors duration-500"></div>

                    <div className="flex items-center gap-2 mb-4 text-white font-bold pb-2 border-b border-white/5 relative z-10">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <i className="fas fa-list-ul text-white text-xs"></i>
                        </div>
                        <span className="tracking-wide">文章目錄</span>
                    </div>

                    {/* Height allows auto-sizing based on content up to 85vh */}
                    <div className="space-y-1 max-h-[85vh] overflow-y-auto pr-2 relative z-10 scrollbar-hide">
                        {toc.length > 0 ? (
                            toc.map((item) => {
                                const isActive = activeSection === item.id;
                                const isRevealed = isActive || isTocHovered;

                                return (
                                    <a
                                        key={item.id}
                                        href={`#${item.id}`}
                                        className={`group/item flex items-center py-2 px-3 rounded-lg transition-all duration-300 text-sm ${isActive
                                            ? 'blur-none opacity-100 font-bold text-[#709CEF] translate-x-2 scale-105'
                                            : isRevealed
                                                ? 'blur-none opacity-100 text-gray-400 hover:text-[#709CEF] hover:translate-x-1'
                                                : 'text-gray-400 blur-[1px] opacity-60'
                                            } ${item.level === 1 ? '' :
                                                item.level === 2 ? 'ml-4' :
                                                    'ml-8'
                                            }`}
                                    >
                                        {item.text}
                                    </a>
                                );
                            })
                        ) : (
                            <div className="flex flex-col items-center justify-center py-8 text-gray-500 opacity-60">
                                <i className="far fa-file-alt text-2xl mb-2"></i>
                                <span className="text-xs">無目錄內容</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Profile Card (Desktop Only) */}
            {!toc && <ProfileCard />}

            {/* Announcement Card (Line 3D Flip) */}
            {!toc && <LineCard />}

            {/* Tags Card */}
            {!toc && (
                <div className="liquid-glass p-6 mb-6">
                    <div className="flex items-center gap-2 mb-4 text-gray-900 dark:text-white font-bold border-b border-gray-100 dark:border-gray-700 pb-2">
                        <i className="fas fa-tags text-[#709CEF]"></i>
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
                        <i className="fas fa-archive text-[#709CEF]"></i>
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
                        <i className="fas fa-chart-line text-[#709CEF]"></i>
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
                    <div ref={chartContainerRef} className="mt-4 h-32 w-full">
                        {/* Manual render to prevent Recharts width(-1) error */}
                        {chartDims.width > 0 && chartDims.height > 0 && (
                            <AreaChart width={chartDims.width} height={chartDims.height} data={activityData}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#709CEF" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#709CEF" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(30, 30, 30, 0.8)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '12px',
                                        color: '#fff',
                                        backdropFilter: 'blur(8px)',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                    }}
                                    itemStyle={{ color: '#fff' }}
                                    cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#709CEF"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorCount)"
                                />
                            </AreaChart>
                        )}
                    </div>
                </div>
            )}

            {/* Navigation (Mobile Only) */}
            {mobile && (
                <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-100px)] custom-scrollbar pr-2">
                    <Link to="/" className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <i className="fas fa-home w-6 text-center text-gray-400"></i> 首頁
                    </Link>

                    {/* Library Section */}
                    <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">文庫</div>
                    <Link to="/archives" className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <i className="fas fa-archive w-6 text-center text-gray-400"></i> 全部文章
                    </Link>
                    <Link to="/categories" className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <i className="fas fa-folder w-6 text-center text-gray-400"></i> 分類列表
                    </Link>
                    <Link to="/tags" className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <i className="fas fa-tags w-6 text-center text-gray-400"></i> 標籤列表
                    </Link>

                    {/* Content Section */}
                    <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">內容</div>
                    <Link to="/essay" className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <i className="fas fa-pen-fancy w-6 text-center text-gray-400"></i> 短文
                    </Link>
                    <Link to="/changelog" className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <i className="fas fa-history w-6 text-center text-gray-400"></i> 更新日誌
                    </Link>

                    {/* Author Section */}
                    <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">關於</div>
                    <Link to="/about" className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <i className="fas fa-user w-6 text-center text-gray-400"></i> 關於本站
                    </Link>
                    <Link to="/equipment" className="block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                        <i className="fas fa-tools w-6 text-center text-gray-400"></i> 我的裝備
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Sidebar;
