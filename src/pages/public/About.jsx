import { useEffect, useState, useRef } from 'react';
import MainLayout from '../../layouts/MainLayout';
import { useMusic } from '../../context/MusicContext';
import { motion, AnimatePresence } from 'framer-motion';
import { incrementVisits, subscribeToStats, subscribeToWeeklyStats } from '../../services/stats';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import SkillsCreativeEngine from '../../components/SkillsCreativeEngine';
import LogoLoader from '../../components/LogoLoader';


const About = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [wordIndex, setWordIndex] = useState(0);
    const [stats, setStats] = useState({ total: 0, today: 0, yesterday: 0 });
    const [weeklyStats, setWeeklyStats] = useState([]);
    const [isFlipped, setIsFlipped] = useState(false);

    // Spotlight Logic for Stats Card
    const statsCardRef = useRef(null);
    const [statsSpotlight, setStatsSpotlight] = useState({ x: 0, y: 0, opacity: 0 });

    const handleStatsMouseMove = (e) => {
        if (!statsCardRef.current) return;
        const rect = statsCardRef.current.getBoundingClientRect();
        setStatsSpotlight(prev => ({
            ...prev,
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            opacity: 1
        }));
    };

    const handleStatsMouseLeave = () => {
        setStatsSpotlight(prev => ({ ...prev, opacity: 0 }));
    };
    const words = ['實踐', '體驗', '創造', '生活', '學習'];

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        const wordTimer = setInterval(() => {
            setWordIndex((prev) => (prev + 1) % words.length);
        }, 2000);

        // Initialize stats
        incrementVisits();
        const unsubscribe = subscribeToStats(setStats);
        const unsubscribeWeekly = subscribeToWeeklyStats(setWeeklyStats);

        return () => {
            clearInterval(timer);
            clearInterval(wordTimer);
            unsubscribe();
            unsubscribeWeekly();
        };
    }, []);

    return (
        <MainLayout>
            <div className="min-h-screen pt-24 pb-12 px-4 container mx-auto max-w-7xl">
                {/* Header Section */}
                {/* Header Section */}
                <div className="flex flex-col items-center justify-center py-8 mb-8 animate-fade-in relative">
                    <div className="flex items-center justify-center gap-4 md:gap-8 w-full max-w-4xl relative">

                        {/* Left Tags */}
                        <div className="hidden lg:flex flex-col gap-3 items-end">
                            <motion.div
                                initial={{ x: -30, opacity: 0 }}
                                animate={{ x: 0, opacity: 1, y: [0, -4, 0] }}
                                transition={{ x: { delay: 0.1 }, opacity: { delay: 0.1 }, y: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0 } }}
                                className="px-2.5 py-1 rounded-full bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 flex items-center gap-2 shadow-lg backdrop-blur-sm hover:scale-105 transition-transform text-xs"
                            >
                                <span className="text-base">🤖</span> <span>熱愛科技產品</span>
                            </motion.div>
                            <motion.div
                                initial={{ x: -30, opacity: 0 }}
                                animate={{ x: 0, opacity: 1, y: [0, -4, 0] }}
                                transition={{ x: { delay: 0.2 }, opacity: { delay: 0.2 }, y: { duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 } }}
                                className="px-2.5 py-1 rounded-full bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 flex items-center gap-2 shadow-lg backdrop-blur-sm hover:scale-105 transition-transform mr-6 text-xs"
                            >
                                <span className="text-base">🔍</span> <span>分享好用網站</span>
                            </motion.div>
                            <motion.div
                                initial={{ x: -30, opacity: 0 }}
                                animate={{ x: 0, opacity: 1, y: [0, -4, 0] }}
                                transition={{ x: { delay: 0.3 }, opacity: { delay: 0.3 }, y: { duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 1 } }}
                                className="px-2.5 py-1 rounded-full bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 flex items-center gap-2 shadow-lg backdrop-blur-sm hover:scale-105 transition-transform mr-3 text-xs"
                            >
                                <span className="text-base">🏠</span> <span>智慧家具專家</span>
                            </motion.div>
                            <motion.div
                                initial={{ x: -30, opacity: 0 }}
                                animate={{ x: 0, opacity: 1, y: [0, -4, 0] }}
                                transition={{ x: { delay: 0.4 }, opacity: { delay: 0.4 }, y: { duration: 3.2, repeat: Infinity, ease: "easeInOut", delay: 0.2 } }}
                                className="px-2.5 py-1 rounded-full bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 flex items-center gap-2 shadow-lg backdrop-blur-sm hover:scale-105 transition-transform text-xs"
                            >
                                <span className="text-base">🔨</span> <span>設計製作專家</span>
                            </motion.div>
                        </div>

                        {/* Central Avatar */}
                        <div className="relative z-10 shrink-0">
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-gray-100 dark:border-gray-800 shadow-2xl relative z-10 bg-white dark:bg-gray-900">
                                <img src="https://cloud.dragoncode.dev/f/BgjC8/avatar.jpg" alt="Avatar" className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 w-6 h-6 md:w-8 md:h-8 bg-green-500 rounded-full border-4 border-white dark:border-gray-900 z-20 shadow-lg"></div>
                        </div>

                        {/* Right Tags */}
                        <div className="hidden lg:flex flex-col gap-3 items-start">
                            <motion.div
                                initial={{ x: 30, opacity: 0 }}
                                animate={{ x: 0, opacity: 1, y: [0, -4, 0] }}
                                transition={{ x: { delay: 0.1 }, opacity: { delay: 0.1 }, y: { duration: 3.1, repeat: Infinity, ease: "easeInOut", delay: 0.3 } }}
                                className="px-2.5 py-1 rounded-full bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 flex items-center gap-2 shadow-lg backdrop-blur-sm hover:scale-105 transition-transform text-xs"
                            >
                                <span>專業點子維修</span> <span className="text-base">🤝</span>
                            </motion.div>
                            <motion.div
                                initial={{ x: 30, opacity: 0 }}
                                animate={{ x: 0, opacity: 1, y: [0, -4, 0] }}
                                transition={{ x: { delay: 0.2 }, opacity: { delay: 0.2 }, y: { duration: 3.4, repeat: Infinity, ease: "easeInOut", delay: 0.8 } }}
                                className="px-2.5 py-1 rounded-full bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 flex items-center gap-2 shadow-lg backdrop-blur-sm hover:scale-105 transition-transform ml-6 text-xs"
                            >
                                <span>腳踏實地實作</span> <span className="text-base">🏃</span>
                            </motion.div>
                            <motion.div
                                initial={{ x: 30, opacity: 0 }}
                                animate={{ x: 0, opacity: 1, y: [0, -4, 0] }}
                                transition={{ x: { delay: 0.3 }, opacity: { delay: 0.3 }, y: { duration: 2.9, repeat: Infinity, ease: "easeInOut", delay: 0.1 } }}
                                className="px-2.5 py-1 rounded-full bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 flex items-center gap-2 shadow-lg backdrop-blur-sm hover:scale-105 transition-transform ml-3 text-xs"
                            >
                                <span>參賽小組實作</span> <span className="text-base">🧱</span>
                            </motion.div>
                            <motion.div
                                initial={{ x: 30, opacity: 0 }}
                                animate={{ x: 0, opacity: 1, y: [0, -4, 0] }}
                                transition={{ x: { delay: 0.4 }, opacity: { delay: 0.4 }, y: { duration: 3.3, repeat: Infinity, ease: "easeInOut", delay: 0.6 } }}
                                className="px-2.5 py-1 rounded-full bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 flex items-center gap-2 shadow-lg backdrop-blur-sm hover:scale-105 transition-transform text-xs"
                            >
                                <span>脾氣相當詭異</span> <span className="text-base">💢</span>
                            </motion.div>
                        </div>
                    </div>

                    <div className="mt-6 text-center">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">關於作者</h1>
                        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 font-medium">音響設計，熱愛創造✨</p>
                    </div>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[minmax(180px,auto)] mb-4">

                    {/* 1. Intro Card (Large Purple) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="col-span-1 md:col-span-2 lg:col-span-2 row-span-1"
                    >
                        <div className="h-full bg-gradient-to-br from-purple-600 to-indigo-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group flex flex-col justify-center">
                            <div className="relative z-10">
                                <div className="text-purple-100 mb-2 flex items-center gap-2">你好，很高興遇見你👋</div>
                                <h2 className="text-4xl font-bold mb-4">我叫 呂宥德</h2>
                                <p className="text-purple-100 text-sm md:text-base leading-relaxed opacity-90">
                                    是一位 音響設計師、網頁前端開發、高中學生、Minecraft玩家、只有千人訂閱的YouTuber
                                </p>
                            </div>
                            <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
                                <i className="fas fa-code text-9xl"></i>
                            </div>
                        </div>
                    </motion.div>

                    {/* 2. Philosophy Card (Restored) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="col-span-1 md:col-span-2 lg:col-span-2 row-span-1"
                    >
                        <div className="h-full bg-white dark:bg-black rounded-3xl p-8 text-gray-900 dark:text-white shadow-xl border border-gray-200 dark:border-gray-800 flex flex-col justify-center relative overflow-hidden group">
                            <div className="relative z-10">
                                <div className="text-gray-500 dark:text-gray-400 text-sm mb-2">設計理念</div>
                                <h3 className="text-2xl font-bold mb-4">Less is More</h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                    我相信好的設計應該是直觀且純粹的。在繁雜的世界中，我致力於透過極簡的視覺語言與直覺的交互體驗，將複雜的功能轉化為優雅的解決方案。無論是音響還是網頁，"簡單" 永遠是最終極的 "複雜"。
                                </p>
                            </div>
                            <div className="absolute right-[-20px] bottom-[-20px] opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                                <i className="fas fa-drafting-compass text-9xl"></i>
                            </div>
                        </div>
                    </motion.div>

                    {/* 3. Skills Card (Creative Engine) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        className="col-span-1 md:col-span-2 lg:col-span-2"
                    >
                        <SkillsCreativeEngine />
                    </motion.div>

                    {/* 4. Career/Education Timeline (Redesigned & Compacted) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                        className="col-span-1 md:col-span-2 lg:col-span-2"
                    >
                        <div className="h-full bg-white dark:bg-black rounded-3xl p-6 text-gray-900 dark:text-white shadow-xl border border-gray-200 dark:border-gray-800 flex flex-col relative overflow-hidden">
                            <div>
                                <div className="text-gray-500 dark:text-gray-400 text-sm mb-1">追求</div>
                                <h3 className="text-2xl font-bold mb-2">無限進步</h3>
                            </div>

                            <div className="flex-grow flex items-center justify-center w-full">
                                {/* Desktop Horizontal Timeline */}
                                <div className="hidden md:flex w-full items-center justify-between relative px-2 py-4">
                                    {/* Connecting Line */}
                                    <div className="absolute top-1/2 left-8 right-8 h-1 bg-gray-200 dark:bg-gray-800 rounded-full -translate-y-1/2 overflow-hidden z-0">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: "100%" }}
                                            transition={{ duration: 1.5, ease: "easeInOut", delay: 0.6 }}
                                            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500"
                                        />
                                    </div>

                                    {/* Nodes */}
                                    {[
                                        { year: '2022', title: 'Web Design', color: 'bg-blue-500', icon: 'fa-code' },
                                        { year: '2024', title: 'Industrial Design', color: 'bg-purple-500', icon: 'fa-cube' },
                                        { year: '2025', title: 'Product Design', color: 'bg-orange-500', icon: 'fa-layer-group' }
                                    ].map((item, index) => (
                                        <motion.div
                                            key={item.year}
                                            initial={{ scale: 0, opacity: 0, y: 20 }}
                                            animate={{ scale: 1, opacity: 1, y: 0 }}
                                            transition={{ delay: 1 + (index * 0.4), type: "spring", stiffness: 200 }}
                                            className="relative z-10 flex flex-col items-center group cursor-pointer"
                                        >
                                            <div className={`w-10 h-10 rounded-full ${item.color} border-4 border-white dark:border-gray-900 shadow-xl flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300`}>
                                                <i className={`fas ${item.icon} text-white text-xs`}></i>
                                            </div>
                                            <div className="text-center absolute top-12 w-32 transition-all duration-300 group-hover:-translate-y-1">
                                                <div className="text-lg font-bold text-gray-900 dark:text-white mb-0.5 drop-shadow-md">{item.year}</div>
                                                <div className={`text-[10px] font-bold tracking-wider uppercase opacity-80 group-hover:opacity-100 transition-opacity ${item.color.replace('bg-', 'text-').replace('500', '400')}`}>{item.title}</div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Mobile Vertical Timeline */}
                                <div className="md:hidden w-full relative pl-6 border-l-2 border-gray-200 dark:border-gray-800 space-y-6 py-2 ml-1">
                                    {[
                                        { year: '2022', title: 'Web Design', color: 'text-blue-400', dot: 'bg-blue-500' },
                                        { year: '2024', title: 'Industrial Design', color: 'text-purple-400', dot: 'bg-purple-500' },
                                        { year: '2025', title: 'Product Design', color: 'text-orange-400', dot: 'bg-orange-500' }
                                    ].map((item, index) => (
                                        <motion.div
                                            key={item.year}
                                            initial={{ x: -20, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.6 + (index * 0.2) }}
                                            className="relative group"
                                        >
                                            <div className={`absolute -left-[33px] top-1 w-4 h-4 rounded-full ${item.dot} border-2 border-white dark:border-gray-900 box-content shadow-lg z-10`}></div>
                                            <div className="flex flex-col">
                                                <span className="text-2xl font-bold text-gray-900 dark:text-white leading-none mb-1">{item.year}</span>
                                                <span className={`text-xs font-bold ${item.color} uppercase tracking-wide`}>{item.title}</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* 5. Statistics Card (Flip Card) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                        className="col-span-1 md:col-span-1 lg:col-span-1 h-[300px] perspective-1000"
                    >
                        <motion.div
                            animate={{ rotateY: isFlipped ? 180 : 0 }}
                            transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                            style={{ transformStyle: 'preserve-3d' }}
                            className="relative w-full h-full"
                        >
                            {/* Front Side */}
                            {/* Front Side */}
                            <div
                                ref={statsCardRef}
                                onMouseMove={handleStatsMouseMove}
                                onMouseLeave={handleStatsMouseLeave}
                                className={`absolute inset-0 bg-white dark:bg-gradient-to-br dark:from-black dark:to-gray-900 rounded-3xl p-5 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 flex flex-col justify-between group overflow-hidden ${isFlipped ? 'pointer-events-none' : 'pointer-events-auto'}`}
                                style={{ backfaceVisibility: 'hidden' }}
                            >
                                {/* Spotlight Overlay */}
                                <div
                                    className="pointer-events-none absolute -inset-px transition duration-300 z-0"
                                    style={{
                                        opacity: statsSpotlight.opacity,
                                        background: `radial-gradient(600px circle at ${statsSpotlight.x}px ${statsSpotlight.y}px, rgba(59, 130, 246, 0.15), transparent 40%)`
                                    }}
                                />

                                <div className="absolute top-0 right-0 p-3 opacity-5 pointer-events-none z-0">
                                    <i className="fas fa-chart-pie text-8xl transform rotate-12"></i>
                                </div>
                                <div className="relative z-10 top-1">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <div className="text-gray-400 text-xs mb-0.5 uppercase tracking-wider font-bold">數據</div>
                                            <h3 className="text-xl font-bold">訪問統計</h3>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                            <i className="fas fa-chart-line text-blue-400 text-sm"></i>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-2.5 backdrop-blur-sm border border-gray-200 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                                            <div className="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5 flex items-center gap-1 font-bold uppercase"><i className="fas fa-user-clock text-blue-400 text-[10px]"></i> 今日人數</div>
                                            <div className="text-lg font-bold text-gray-900 dark:text-white tracking-tight leading-none">{stats.today}</div>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-2.5 backdrop-blur-sm border border-gray-200 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                                            <div className="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5 flex items-center gap-1 font-bold uppercase"><i className="fas fa-eye text-green-400 text-[10px]"></i> 總訪問量</div>
                                            <div className="text-lg font-bold text-gray-900 dark:text-white tracking-tight leading-none">{stats.total}</div>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-2.5 backdrop-blur-sm border border-gray-200 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                                            <div className="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5 flex items-center gap-1 font-bold uppercase"><i className="fas fa-history text-purple-400 text-[10px]"></i> 昨日人數</div>
                                            <div className="text-lg font-bold text-gray-900 dark:text-white/90 tracking-tight leading-none">{stats.yesterday}</div>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-2.5 backdrop-blur-sm border border-gray-200 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                                            <div className="text-[10px] text-gray-500 dark:text-gray-400 mb-0.5 flex items-center gap-1 font-bold uppercase"><i className="fas fa-calendar-alt text-orange-400 text-[10px]"></i> 昨日訪問</div>
                                            <div className="text-lg font-bold text-gray-900 dark:text-white/90 tracking-tight leading-none">{stats.yesterday}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="relative z-20">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsFlipped(true);
                                        }}
                                        className="w-full py-2 rounded-xl bg-[#709CEF] hover:bg-[#5f8bd6] text-white transition-all text-xs font-bold flex items-center justify-center gap-2 active:scale-95 pointer-events-auto cursor-pointer"
                                    >
                                        <i className="fas fa-chart-bar"></i> 查看詳細圖表
                                    </button>
                                </div>
                            </div>

                            {/* Back Side */}
                            {/* Back Side */}
                            <div
                                className={`absolute inset-0 bg-white dark:bg-black rounded-3xl p-6 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 flex flex-col justify-between ${isFlipped ? 'pointer-events-auto' : 'pointer-events-none'}`}
                                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                            >
                                <div className="h-full flex flex-col">
                                    <div className="flex justify-between items-center mb-2 shrink-0">
                                        <h3 className="text-lg font-bold flex items-center gap-2"><i className="fas fa-chart-bar text-blue-500"></i> 近7日趨勢</h3>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIsFlipped(false);
                                            }}
                                            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors relative z-20 pointer-events-auto cursor-pointer"
                                        >
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </div>
                                    <div className="flex-grow min-h-0 w-full relative -ml-2">
                                        {isFlipped ? (
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={weeklyStats}>
                                                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} dy={10} />
                                                    <Tooltip
                                                        contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                                        itemStyle={{ color: '#fff' }}
                                                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                                    />
                                                    <Bar dataKey="visits" radius={[4, 4, 0, 0]}>
                                                        {weeklyStats.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={index === weeklyStats.length - 1 ? '#3b82f6' : '#4b5563'} />
                                                        ))}
                                                    </Bar>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-500 text-sm gap-2">
                                                <LogoLoader size="w-4 h-4" animate={true} />
                                                Loading...
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* 6. Location Map */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                        className="col-span-1 md:col-span-1 lg:col-span-3"
                    >
                        <div className="h-full bg-white dark:bg-black rounded-3xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-800 relative group min-h-[250px]">
                            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    frameBorder="0"
                                    scrolling="no"
                                    marginHeight="0"
                                    marginWidth="0"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d231263.27350692698!2d121.39668902562224!3d25.085315080787836!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442ac6b61dbbd8b%3A0xbcd1baad5c06a482!2z6Ie65YyX5biC!5e0!3m2!1szh-TW!2stw!4v1770092190457!5m2!1szh-TW!2stw"
                                    className="w-full h-[130%] -mt-[10%] opacity-80 hover:opacity-100 transition-opacity duration-500"
                                ></iframe>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white/90 via-white/60 to-transparent dark:from-black/90 dark:via-black/60 dark:to-transparent p-6 pt-12 pointer-events-none">
                                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">台北</div>
                                <div className="text-gray-600 dark:text-gray-300">我現在住在 <span className="text-gray-900 dark:text-white font-bold">台灣，台北市</span></div>
                            </div>
                        </div>
                    </motion.div>

                    {/* 7. Info Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
                        className="col-span-1 md:col-span-2 lg:col-span-2"
                    >
                        <div className="h-full bg-white dark:bg-black rounded-3xl p-6 text-gray-900 dark:text-white shadow-xl border border-gray-200 dark:border-gray-800 relative overflow-hidden group">
                            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#4b5563_1px,transparent_1px)] [background-size:16px_16px]"></div>

                            <div className="relative z-10 h-full flex flex-col justify-between gap-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
                                    {/* Birth Year Box */}
                                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 border border-gray-200 dark:border-gray-700/50 flex flex-col justify-between hover:border-blue-500/30 transition-colors group/box">
                                        <div className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Since</div>
                                        <div className="flex items-end justify-between">
                                            <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-cyan-300">2007</div>
                                            <i className="fas fa-crown text-gray-400 dark:text-gray-700 text-4xl transform rotate-12 group-hover/box:rotate-0 transition-transform duration-500"></i>
                                        </div>
                                    </div>

                                    {/* Occupation Box */}
                                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 border border-gray-200 dark:border-gray-700/50 flex flex-col justify-between hover:border-purple-500/30 transition-colors group/box">
                                        <div className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Status</div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-2xl font-bold text-gray-900 dark:text-white">高二學生</div>
                                                <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">Student @ Taipei</div>
                                            </div>
                                            <div className="w-12 h-12 rounded-full bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center">
                                                <i className="fas fa-graduation-cap text-purple-600 dark:text-purple-400 text-xl"></i>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Skills Box (Spans full width on mobile, col-span on desktop if desired, but 2x2 grid fits here) */}
                                    <div className="col-span-1 sm:col-span-2 bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 border border-gray-200 dark:border-gray-700/50 flex flex-col justify-center hover:border-orange-500/30 transition-colors">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">Specialties</div>
                                            <i className="fas fa-layer-group text-gray-400 dark:text-gray-600"></i>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="px-3 py-1.5 rounded-lg bg-orange-500/10 dark:bg-orange-500/20 border border-orange-500/20 dark:border-orange-500/30 text-orange-600 dark:text-orange-300 text-sm font-bold flex items-center gap-2">
                                                <i className="fas fa-music"></i> 音響設計
                                            </span>
                                            <span className="px-3 py-1.5 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/20 dark:border-blue-500/30 text-blue-600 dark:text-blue-300 text-sm font-bold flex items-center gap-2">
                                                <i className="fas fa-code"></i> 網頁設計
                                            </span>
                                            <span className="px-3 py-1.5 rounded-lg bg-green-500/10 dark:bg-green-500/20 border border-green-500/20 dark:border-green-500/30 text-green-600 dark:text-green-300 text-sm font-bold flex items-center gap-2">
                                                <i className="fas fa-cube"></i> Product Design
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* 8. Personality Card (Expanded to fill gap) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
                        className="col-span-1 md:col-span-1 lg:col-span-2"
                    >
                        <div className="h-full bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/40 dark:to-black/80 rounded-3xl p-6 text-gray-900 dark:text-white shadow-xl border border-gray-200 dark:border-gray-800 relative overflow-hidden flex flex-col justify-between group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 dark:bg-purple-600/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>

                            <div className="relative z-10">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="text-purple-600 dark:text-purple-300 text-sm font-bold tracking-wider mb-2 uppercase">Personality</div>
                                        <h3 className="text-4xl font-black text-gray-900 dark:text-white mb-1">INTJ-A</h3>
                                        <div className="text-xl font-bold text-gray-500 dark:text-gray-400 mb-6">建築師 (Architect)</div>
                                    </div>
                                    <div className="hidden sm:block">
                                        <i className="fas fa-chess-knight text-purple-500/30 text-5xl"></i>
                                    </div>
                                </div>

                                <div className="space-y-3 max-w-[240px] relative z-20">
                                    <div className="flex items-center gap-2 text-xs">
                                        <span className="w-16 text-gray-500 dark:text-gray-400 font-bold">Introverted</span>
                                        <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700/50 rounded-full overflow-hidden">
                                            <motion.div initial={{ width: 0 }} whileInView={{ width: '52%' }} transition={{ duration: 1, delay: 0.5 }} className="h-full bg-purple-500 rounded-full"></motion.div>
                                        </div>
                                        <span className="w-8 text-right text-purple-600 dark:text-purple-300 font-mono">52%</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                                        <span className="w-16 text-gray-500 dark:text-gray-400 font-bold">Intuitive</span>
                                        <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700/50 rounded-full overflow-hidden">
                                            <motion.div initial={{ width: 0 }} whileInView={{ width: '63%' }} transition={{ duration: 1, delay: 0.6 }} className="h-full bg-purple-500 rounded-full"></motion.div>
                                        </div>
                                        <span className="w-8 text-right text-purple-600 dark:text-purple-300 font-mono">63%</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                                        <span className="w-16 text-gray-500 dark:text-gray-400 font-bold">Thinking</span>
                                        <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700/50 rounded-full overflow-hidden">
                                            <motion.div initial={{ width: 0 }} whileInView={{ width: '52%' }} transition={{ duration: 1, delay: 0.7 }} className="h-full bg-purple-500 rounded-full"></motion.div>
                                        </div>
                                        <span className="w-8 text-right text-purple-600 dark:text-purple-300 font-mono">52%</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                                        <span className="w-16 text-gray-500 dark:text-gray-400 font-bold">Judging</span>
                                        <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700/50 rounded-full overflow-hidden">
                                            <motion.div initial={{ width: 0 }} whileInView={{ width: '68%' }} transition={{ duration: 1, delay: 0.8 }} className="h-full bg-purple-500 rounded-full"></motion.div>
                                        </div>
                                        <span className="w-8 text-right text-purple-600 dark:text-purple-300 font-mono">68%</span>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute right-[-20px] bottom-[-20px] w-48 h-48 opacity-80 mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-500">
                                <img src="https://cloud.dragoncode.dev/f/pgBiA/%E5%89%AA%E8%B2%BC%E7%B0%BF%201768222519965.png" alt="INTJ-A Icon" className="w-full h-full object-contain drop-shadow-2xl" />
                            </div>
                        </div>
                    </motion.div>

                </div>

                {/* New Section: Personal Intro & Stories */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* Personal Introduction Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}
                        className="col-span-1 md:col-span-2 bg-white dark:bg-black rounded-3xl p-8 text-gray-900 dark:text-white shadow-xl border border-gray-200 dark:border-gray-800"
                    >
                        <div className="text-gray-500 dark:text-gray-400 text-sm mb-4">簡單來認識我</div>
                        <div className="prose prose-gray dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                            <p>歡迎來到我的部落格呀 ٩(ˊᗜˋ*)و，這邊是我記錄生活和專案歷程的站，我目前在台北市無界塾實驗教育機構的高中藝術類群，我常常忘記做課堂筆記或比賽後記錄 ~ 但是現在這個站內紀錄了我最多的筆記內容，慢慢去累積每一次紀錄，回看過去的紀錄能夠拿出來重新交給別人！這才是真正的學習與筆記。每周我都會記錄自主時間過程和專案進展，如果哪一周連續沒有更新紀錄就是太忙忘記啦！但是我還是會在想起來時補上，有時候專注在創作上會忘記其他事情。別學我去熬夜做事平時睡覺 希望大家都能架設屬於自己的個人部落格。</p>
                        </div>

                        <div className="space-y-2 mb-6">
                            <div className="flex items-center gap-2">
                                <i className="fas fa-check-square text-[#709CEF]"></i>
                                <span>成為音響設計帶著自己的作品參賽 🔊</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <i className="fas fa-check-square text-[#709CEF]"></i>
                                <span>超級Skidder <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">Ctrl</code> + <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">C</code>、<code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">Ctrl</code> + <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">V</code> 高級java工程師</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <i className="fas fa-times-circle text-red-500"></i>
                                <span>精熟Pr、Ps、Ai等軟體技巧</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <i className="fas fa-times-circle text-red-500"></i>
                                <span>精熟Hexo搭建和HTML, CSS, JavaScript</span>
                            </div>
                        </div>

                        <h4 className="text-xl font-bold text-gray-500 dark:text-gray-400 mb-4">TodoList</h4>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <i className="fas fa-check-square text-[#709CEF]"></i>
                                <span>設計與不同文化結合的音響</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <i className="fas fa-check-square text-[#709CEF]"></i>
                                <span>完成Hexo部落格搭建</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <i className="fas fa-check-square text-[#709CEF]"></i>
                                <span>高中養成撰寫部落格和筆記好習慣</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <i className="far fa-square text-gray-500 dark:text-gray-500"></i>
                                <span>精通CloudFlare DNS服務</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <i className="far fa-square text-gray-500 dark:text-gray-500"></i>
                                <span>繪製自己的D類擴大器PCB</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <i className="far fa-square text-gray-500 dark:text-gray-500"></i>
                                <span>設計自己的品牌</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <i className="far fa-square text-gray-500 dark:text-gray-500"></i>
                                <span>量產自己的藍芽音響</span>
                            </div>
                        </div>
                    </motion.div>


                    {/* Career Path Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}
                        className="col-span-1 bg-white dark:bg-black rounded-3xl p-8 text-gray-900 dark:text-white shadow-xl border border-gray-200 dark:border-gray-800 flex flex-col"
                    >
                        <div className="text-gray-500 dark:text-gray-400 text-sm mb-4">我要走工業設計!</div>
                        <div className="prose prose-gray dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 mb-6 leading-relaxed flex-grow">
                            <p>其實到了高中，我還不確定未來要讀什麼科系。我相信這也是許多無界塾的學生在完成國中升學後，會面臨的共同難題——三年後的自己究竟適合哪條道路？但也我堅信，只要在學校中找到自己的興趣，並願意為之努力，一定會有適合你的科系。像我一樣，到了高二之後，因為認識了一位音響設計老師，接觸到更多音響品牌以及設計相關的知識，才逐漸確定自己未來要走的方向是工業設計系。其實在此之前，我從沒想過這個科系的出路或前景，只是單純翻開簡章時，發現這正是我喜歡的領域。因此，我決定將大學四年的時間投入在這樣的學習環境中，實現我的產品設計夢想。不論是製作、創新、研發還是生產，我希望能讓音響設計成為我學業生涯中持續前進的動力。</p>
                        </div>
                        <div className="text-yellow-500 dark:text-yellow-400 font-bold text-lg mt-4">迷茫時跟隨自己心靈深處的想法永遠是對的。</div>
                    </motion.div>

                </div>
            </div>

            <style>{`
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-scroll {
                    animation: scroll 20s linear infinite;
                }
            `}</style>
        </MainLayout>
    );
};

export default About;