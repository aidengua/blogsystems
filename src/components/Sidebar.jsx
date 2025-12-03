import { useState, useEffect, useRef } from 'react';
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

    const [lineCardRotate, setLineCardRotate] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);
    const lineCardRef = useRef(null);

    const handleLineCardMouseMove = (e) => {
        if (!lineCardRef.current) return;
        const rect = lineCardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Subtle tilt: max +/- 10 degrees
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        setLineCardRotate({ x: rotateX, y: rotateY });
        setIsHovered(true);
    };

    const handleLineCardMouseLeave = () => {
        setLineCardRotate({ x: 0, y: 0 });
        setIsHovered(false);
    };

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
            <div className="liquid-glass p-6 mb-6 relative overflow-hidden group">
                {/* Status Pill */}
                <div className="absolute top-4 left-0 right-0 flex justify-center z-10">
                    <div className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs text-white/90 font-medium shadow-lg">
                        晚上就是拿來敲代碼的
                    </div>
                </div>

                {/* Avatar */}
                <div
                    className="relative z-10 mt-8 mb-12 flex justify-center perspective-[1000px]"
                    onMouseMove={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        const centerX = rect.width / 2;
                        const centerY = rect.height / 2;
                        // Max +/- 15 degrees
                        const rotateX = ((y - centerY) / centerY) * -15;
                        const rotateY = ((x - centerX) / centerX) * 15;
                        e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
                    }}
                    style={{ transition: 'transform 0.1s ease-out' }}
                >
                    <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-white/20 shadow-2xl transition-all duration-300 transform-style-3d">
                        <img
                            src="https://cloudflare-imgbed-5re.pages.dev/file/1759506193400_1000004107.jpg"
                            alt="Avatar"
                            className="w-full h-full object-cover"
                        />
                    </div>

                </div>

                {/* Bottom Info */}
                <div className="flex justify-between items-end relative z-10">
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-1">呂宥德</h3>
                        <p className="text-sm text-white/60 font-medium">夢想家音響工作室</p>
                    </div>

                    <a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-all hover:scale-110"
                    >
                        <i className="fab fa-github text-xl"></i>
                    </a>
                </div>

                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#709CEF]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
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

            {/* Announcement Card (Line 3D Flip) */}
            {!toc && (
                <div
                    ref={lineCardRef}
                    onMouseMove={handleLineCardMouseMove}
                    onMouseLeave={handleLineCardMouseLeave}
                    className="group perspective-[1000px] h-28 mb-6 cursor-pointer"
                >
                    <div
                        className="relative w-full h-full transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] transform-style-3d"
                        style={{
                            transform: `rotateX(${lineCardRotate.x}deg) rotateY(${lineCardRotate.y + (isHovered ? 180 : 0)}deg)`
                        }}
                    >
                        {/* Front Face (Line Info) */}
                        <div className="absolute inset-0 backface-hidden liquid-glass p-4 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#06C755] to-[#00B900] opacity-90 dark:opacity-80"></div>
                            <div className="relative z-10 flex items-center justify-between text-white h-full">
                                <div className="flex flex-col">
                                    <span className="text-xs opacity-80 mb-1">官方帳號 Line</span>
                                    <span className="font-bold text-lg">加入好友獲取最新資訊</span>
                                </div>
                                <i className="fab fa-line text-3xl opacity-80"></i>
                            </div>
                            <i className="fas fa-comment-dots absolute right-2 bottom-2 text-white/10 text-4xl"></i>
                        </div>

                        {/* Back Face (QR Code) */}
                        <div className="absolute inset-0 h-full w-full rotate-y-180 backface-hidden bg-white dark:bg-[#1e1e1e] rounded-xl overflow-hidden flex items-center justify-center border border-[#06C755]/30 shadow-[0_0_15px_rgba(6,199,85,0.2)]">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#06C755]/5 to-transparent"></div>
                            <div className="relative z-10 p-3 bg-white rounded-lg shadow-sm">
                                <img
                                    src="https://cloudflare-imgbed-5re.pages.dev/file/1764755896344_1000037754.jpg"
                                    alt="Line QR Code"
                                    className="w-20 h-20 object-contain"
                                />
                            </div>
                            <div className="absolute bottom-2 text-[10px] text-[#06C755] font-bold tracking-wider opacity-80">
                                SCAN ME
                            </div>
                        </div>
                    </div>
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
                    <div className="mt-4 h-32 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={activityData}>
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
