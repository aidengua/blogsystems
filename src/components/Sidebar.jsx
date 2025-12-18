import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { AreaChart, Area, XAxis, Tooltip, BarChart, Bar, Cell, YAxis, PieChart, Pie } from 'recharts';
import ProfileCard from './ProfileCard';
import LineCard from './LineCard';
import { subscribeToWeeklyStats } from '../services/stats';
import { navigationGroups } from '../config/navigation';

const Sidebar = ({ mobile, close, toc, activeSection, posts: initialPosts }) => {
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
    const [viewData, setViewData] = useState([]);
    const [tagChartData, setTagChartData] = useState([]);
    const [categoryChartData, setCategoryChartData] = useState([]);
    const [visitChartData, setVisitChartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [chartDims, setChartDims] = useState({ width: 0, height: 0 });
    const chartContainerRef = useRef(null);
    const [isTocHovered, setIsTocHovered] = useState(false);
    const [forceChartRender, setForceChartRender] = useState(0);

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
    }, [toc, loading]);

    const processPostsData = (posts) => {
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

        // Prepare Tag Chart Data (Top 5)
        const sortedTags = Object.entries(tagCounts)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);
        setTagChartData(sortedTags);

        // Prepare Category Chart Data
        const categoryCounts = {};
        posts.forEach(post => {
            const cat = post.category || "未分類";
            categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        });
        const sortedCategories = Object.entries(categoryCounts)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);
        setCategoryChartData(sortedCategories);

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

        // 3. Process Growth Data (Cumulative)
        const sortedPosts = [...posts].sort((a, b) => a.createdAt - b.createdAt);

        let cumulative = 0;
        const fullHistoryMap = new Map();

        sortedPosts.forEach(post => {
            cumulative++;
            const key = `${post.createdAt.getFullYear()}-${String(post.createdAt.getMonth() + 1).padStart(2, '0')}`;
            fullHistoryMap.set(key, cumulative);
        });

        const chartData = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

            let count = 0;
            if (fullHistoryMap.has(key)) {
                count = fullHistoryMap.get(key);
            } else {
                for (let [k, v] of fullHistoryMap) {
                    if (k < key) count = v;
                    if (k > key) break;
                }
            }

            chartData.push({
                name: key,
                count: count
            });
        }

        const startDateStr = chartData[0].name;
        const postsBeforeWindow = sortedPosts.filter(p => {
            const k = `${p.createdAt.getFullYear()}-${String(p.createdAt.getMonth() + 1).padStart(2, '0')}`;
            return k < startDateStr;
        }).length;

        let currentTotal = postsBeforeWindow;

        const finalChartData = chartData.map(item => {
            const postsInMonth = sortedPosts.filter(p => {
                const k = `${p.createdAt.getFullYear()}-${String(p.createdAt.getMonth() + 1).padStart(2, '0')}`;
                return k === item.name;
            }).length;

            currentTotal += postsInMonth;
            return { ...item, count: currentTotal };
        });

        setActivityData(finalChartData);

        // 4. Process Top Views
        const topPosts = [...posts].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);
        const viewsChartData = topPosts.map(p => ({
            name: p.title.length > 4 ? p.title.substring(0, 4) + '..' : p.title,
            fullName: p.title,
            views: p.views || 0
        }));
        setViewData(viewsChartData);
        setLoading(false);
    };

    useEffect(() => {
        if (initialPosts && initialPosts.length > 0) {
            processPostsData(initialPosts);
        } else if (!initialPosts) {
            // Only fetch if initialPosts is NOT provided (undefined/null, not just empty array)
            // However, for now, let's assume we fetch if empty array is passed but we want to be sure it's not just "loading empty"
            // If we rely on Home to pass posts, we might not need this fall back if Home always passes "posts" even if empty.
            // But if specific pages like PostDetail render Sidebar, they might not pass "all posts".
            // So we should fetch if initialPosts is missing.

            setLoading(true);
            const q = query(collection(db, 'posts'), where('status', '==', 'published'));

            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                try {
                    let posts = querySnapshot.docs.map(doc => ({
                        ...doc.data(),
                        createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date(doc.data().createdAt)
                    }));
                    processPostsData(posts);
                } catch (error) {
                    console.error("Error fetching sidebar data:", error);
                    setLoading(false); // Ensure loading stops on error
                }
            }, (error) => {
                console.error("Error listening to sidebar data:", error);
                setLoading(false);
            });

            return () => unsubscribe();
        } else {
            // initialPosts is [] (empty array), meaning loaded but no posts? Or just not loaded yet?
            // Usually Home will pass [] initially, then [posts].
            // If we don't want to duplicate logic, we can just wait.
            // But sidebar logic here is "if posts provided, use them".
            setLoading(false);
        }
    }, [initialPosts]);

    // Subscribe to Weekly Stats
    useEffect(() => {
        const unsubscribe = subscribeToWeeklyStats((data) => {
            setVisitChartData(data);
        });
        return () => unsubscribe();
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
                    <div className="space-y-2">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-2">導航</p>
                        <Link to="/" onClick={close} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                                <i className="fas fa-home"></i>
                            </div>
                            <span className="font-medium">首頁</span>
                        </Link>
                    </div>

                    {/* Navigation Groups from Config */}
                    {navigationGroups.map((group, idx) => (
                        <div key={idx} className="space-y-2">
                            {/* Only show label if it's not the first group or if we want labels for all */}
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-2">{group.title}</p>
                            {group.items.map((item, itemIdx) => (
                                <Link key={itemIdx} to={item.to} onClick={close} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                                    <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center ${item.color}`}>
                                        <i className={item.icon}></i>
                                    </div>
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            ))}
                        </div>
                    ))}

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
                    className="bg-white/80 dark:bg-white/5 backdrop-blur-md border border-gray-200 dark:border-white/10 rounded-2xl p-6 mb-6 shadow-xl sticky top-24 relative group group/toc transition-all duration-300"
                    onMouseEnter={() => setIsTocHovered(true)}
                    onMouseLeave={() => setIsTocHovered(false)}
                >
                    {/* Background Glow Effect */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/30 transition-colors duration-500"></div>

                    <div className="flex items-center gap-2 mb-4 text-gray-900 dark:text-white font-bold pb-2 border-b border-gray-200 dark:border-white/5 relative z-10">
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

            {/* Website Info Card with Animated Growth Chart */}
            {!toc && (
                <motion.div
                    className="liquid-glass p-6 mb-6 overflow-hidden relative"
                    viewport={{ once: false, margin: "-100px" }}
                    onViewportEnter={() => setForceChartRender(prev => prev + 1)}
                    ref={chartContainerRef}
                >
                    <div className="relative z-10 flex flex-col gap-2 mb-6">
                        <div className="flex items-center gap-2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 w-fit">
                                <i className="fas fa-chart-line text-[#709CEF] text-xs"></i>
                                <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">文章成長趨勢</span>
                            </div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 w-fit">
                                <span className="text-xs font-bold text-gray-900 dark:text-white tracking-wide">{stats.articleCount}</span>
                                <span className="text-xs text-gray-500">篇</span>
                            </div>
                        </div>
                    </div>

                    {/* Chart 1: Growth Trend */}
                    <div className="bg-gray-50 dark:bg-black/20 rounded-xl border border-gray-200 dark:border-white/5 mb-4 h-20 w-full relative overflow-hidden">
                        {chartDims.width > 0 && (

                            <AreaChart width={chartDims.width} height={80}
                                key={`growth-${forceChartRender}`}
                                data={activityData}
                                margin={{ top: 5, right: 0, left: 0, bottom: 0 }}
                            >
                                <defs>
                                    <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#709CEF" stopOpacity={0.5} />
                                        <stop offset="95%" stopColor="#709CEF" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" hide />
                                <Tooltip
                                    cursor={{ stroke: 'rgba(112, 156, 239, 0.5)', strokeWidth: 1, strokeDasharray: '4 4' }}
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.9 }}
                                                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                                    className="bg-white/90 dark:bg-[#1e1e1e]/90 backdrop-blur-md border border-gray-200 dark:border-white/10 p-2 rounded-lg shadow-xl"
                                                >
                                                    <p className="text-gray-500 dark:text-gray-400 text-[10px] mb-0.5">{payload[0].payload.name}</p>
                                                    <p className="text-gray-900 dark:text-white font-bold text-xs">
                                                        {payload[0].value} <span className="text-[10px] font-normal text-gray-500">篇文章</span>
                                                    </p>
                                                </motion.div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#709CEF"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorGrowth)"
                                    animationDuration={1500}
                                    animationEasing="ease-out"
                                    isAnimationActive={true}
                                />
                            </AreaChart>

                        )}
                    </div>

                    {/* Chart 2: Popular Articles */}
                    <div className="relative z-10 flex justify-between items-start mb-3 pt-4 border-t border-gray-100 dark:border-white/5">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 w-fit">
                            <i className="fas fa-fire text-orange-400 text-xs"></i>
                            <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">熱門文章排行</span>
                        </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-black/20 rounded-xl border border-gray-200 dark:border-white/5 h-20 w-full relative overflow-hidden">
                        {chartDims.width > 0 && (

                            <AreaChart width={chartDims.width} height={80}
                                key={`views-${forceChartRender}`}
                                data={viewData}
                                margin={{ top: 5, right: 0, left: 0, bottom: 0 }}
                            >
                                <defs>
                                    <linearGradient id="colorFire" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#FB923C" stopOpacity={0.5} />
                                        <stop offset="95%" stopColor="#FB923C" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" hide />
                                <Tooltip
                                    cursor={{ stroke: 'rgba(251, 146, 60, 0.5)', strokeWidth: 1, strokeDasharray: '4 4' }}
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.9 }}
                                                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                                    className="bg-white/90 dark:bg-[#1e1e1e]/90 backdrop-blur-md border border-gray-200 dark:border-white/10 p-2 rounded-lg shadow-xl max-w-[200px]"
                                                >
                                                    <p className="text-gray-900 dark:text-white font-bold text-xs mb-0.5 break-words line-clamp-2">
                                                        {payload[0].payload.fullName}
                                                    </p>
                                                    <p className="text-orange-400 font-bold text-xs">
                                                        {payload[0].value} <span className="text-[10px] font-normal text-gray-500">觀看</span>
                                                    </p>
                                                </motion.div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="views"
                                    stroke="#FB923C"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorFire)"
                                    animationDuration={1500}
                                    animationEasing="ease-out"
                                    isAnimationActive={true}
                                />
                            </AreaChart>

                        )}
                    </div>

                    {/* Chart 3: Tags & Categories Ratio */}
                    <div className="relative z-10 flex justify-between items-start mb-3 pt-4 border-t border-gray-100 dark:border-white/5">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 w-fit">
                            <i className="fas fa-chart-pie text-pink-400 text-xs"></i>
                            <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">標籤與分類佔比</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        {/* Tags Pie */}
                        <div className="bg-gray-50 dark:bg-black/20 rounded-xl p-2 border border-gray-200 dark:border-white/5 flex flex-col items-center h-24 justify-center relative w-full">
                            {chartDims.width > 0 && (

                                <PieChart width={(chartDims.width - 8) / 2 - 16} height={96} key={`tags-${forceChartRender}`}>
                                    <Pie
                                        data={tagChartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={25}
                                        outerRadius={35}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                        isAnimationActive={true}
                                        animationDuration={1500}
                                    >
                                        {tagChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={['#709CEF', '#C982A1', '#83A17E', '#C3B579', '#FFA500'][index % 5]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        cursor={false}
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                return (
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                                        exit={{ opacity: 0, scale: 0.9 }}
                                                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                                        className="bg-white/90 dark:bg-[#1e1e1e]/90 backdrop-blur-md border border-gray-200 dark:border-white/10 p-2 rounded-lg shadow-xl z-50"
                                                    >
                                                        <p className="text-gray-900 dark:text-white font-bold text-xs">
                                                            {payload[0].name}: {payload[0].value}
                                                        </p>
                                                    </motion.div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                </PieChart>

                            )}
                            <span className="absolute text-[10px] text-gray-500 font-bold pointer-events-none">Top 5</span>
                        </div>
                        {/* Category Pie */}
                        <div className="bg-gray-50 dark:bg-black/20 rounded-xl p-2 border border-gray-200 dark:border-white/5 flex flex-col items-center h-24 justify-center relative w-full">
                            {chartDims.width > 0 && (

                                <PieChart width={(chartDims.width - 8) / 2 - 16} height={96} key={`cats-${forceChartRender}`}>
                                    <Pie
                                        data={categoryChartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={25}
                                        outerRadius={35}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                        isAnimationActive={true}
                                        animationDuration={1500}
                                    >
                                        {categoryChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={['#C982A1', '#83A17E', '#709CEF', '#C3B579'][index % 4]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        cursor={false}
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                return (
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                                        exit={{ opacity: 0, scale: 0.9 }}
                                                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                                        className="bg-white/90 dark:bg-[#1e1e1e]/90 backdrop-blur-md border border-gray-200 dark:border-white/10 p-2 rounded-lg shadow-xl z-50"
                                                    >
                                                        <p className="text-gray-900 dark:text-white font-bold text-xs">
                                                            {payload[0].name}: {payload[0].value}
                                                        </p>
                                                    </motion.div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                </PieChart>

                            )}
                            <span className="absolute text-[10px] text-gray-500 font-bold pointer-events-none">分類</span>
                        </div>
                    </div>

                    {/* Chart 4: Recent Visits (7 Days) */}
                    <div className="relative z-10 flex justify-between items-start mb-3 pt-4 border-t border-gray-100 dark:border-white/5">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 w-fit">
                            <i className="fas fa-chart-bar text-purple-400 text-xs"></i>
                            <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">近期訪問活躍</span>
                        </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-black/20 rounded-xl p-3 border border-gray-200 dark:border-white/5 h-20 w-full relative overflow-hidden">
                        <div className="h-full w-full">
                            {chartDims.width > 0 && (

                                <BarChart width={chartDims.width} height={80}
                                    key={`visits-${forceChartRender}`}
                                    data={visitChartData}
                                    margin={{ top: 5, right: 0, left: 0, bottom: 0 }}
                                    barSize={20}
                                >
                                    <XAxis dataKey="date" hide />
                                    <YAxis hide />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(0,0,0,0.05)', opacity: 1 }}
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                return (
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                                        exit={{ opacity: 0, scale: 0.9 }}
                                                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                                        className="bg-white/90 dark:bg-[#1e1e1e]/90 backdrop-blur-md border border-gray-200 dark:border-white/10 p-2 rounded-lg shadow-xl"
                                                    >
                                                        <p className="text-gray-500 dark:text-gray-400 text-[10px] mb-0.5">
                                                            {payload[0].payload.date}
                                                        </p>
                                                        <p className="text-purple-400 font-bold text-xs">
                                                            {payload[0].value} <span className="text-[10px] font-normal text-gray-500">人次</span>
                                                        </p>
                                                    </motion.div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Bar dataKey="visits" radius={[4, 4, 0, 0]} animationDuration={1500}>
                                        {visitChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index === visitChartData.length - 1 ? '#A78BFA' : 'rgba(167, 139, 250, 0.3)'} />
                                        ))}
                                    </Bar>
                                </BarChart>

                            )}
                        </div>
                    </div>

                </motion.div>
            )
            }
        </div >
    );
};

export default Sidebar;
