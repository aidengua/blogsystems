import { useEffect, useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { subscribeToStats, subscribeToChartStats, subscribeToStatsSettings } from '../../services/stats';
import { AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import LogoLoader from '../../components/LogoLoader';

const Stats = () => {
    const [stats, setStats] = useState({ total: 0, uniqueDevices: 0, today: 0, yesterday: 0, regions: {} });
    const [chartStats, setChartStats] = useState([]);
    const [chartRange, setChartRange] = useState('7days');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [tooltipContent, setTooltipContent] = useState("");
    const [settings, setSettings] = useState({
        showPageViewsCurve: true,
        showUniqueDevicesCurve: true,
        showUniqueDevicesCard: true,
        showYesterdayViewsCard: true
    });

    useEffect(() => {
        const unsubscribeStats = subscribeToStats((data) => {
            setStats(data);
            setLoading(false);
        });

        const unsubscribeSettings = subscribeToStatsSettings((data) => {
            setSettings(data);
        });

        return () => {
            unsubscribeStats();
            unsubscribeSettings();
        };
    }, []);

    useEffect(() => {
        const unsubscribeChart = subscribeToChartStats(chartRange, (data) => {
            setChartStats(data);
        });
        return () => unsubscribeChart();
    }, [chartRange]);

    const visibleCardsCount = 2 + (settings.showUniqueDevicesCard ? 1 : 0) + (settings.showYesterdayViewsCard ? 1 : 0);
    const gridColsClass = visibleCardsCount === 4 ? "lg:grid-cols-4" : visibleCardsCount === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2";

    return (
        <MainLayout>
            <div className="min-h-screen pt-24 pb-12 px-4 container mx-auto max-w-7xl">
                <div className="flex flex-col items-center justify-center py-8 mb-8 animate-fade-in text-center">
                    <h1 className="text-3xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">數據統計</h1>
                    <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 font-medium max-w-2xl">
                        專業級實時追蹤控制台，掌握網站的全球訪問流量與歷史趨勢數據。
                    </p>
                </div>

                <div className={`grid grid-cols-1 md:grid-cols-2 ${gridColsClass} gap-6 mb-6`}>
                    {/* KPI 1: Total Views */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden group h-full flex flex-col justify-center">
                            <div className="relative z-10">
                                <div className="text-blue-100 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <i className="fas fa-eye"></i> 總瀏覽次數
                                </div>
                                <div className="text-4xl font-black tracking-tight">{stats.total.toLocaleString()}</div>
                            </div>
                            <i className="fas fa-chart-line absolute -right-4 -bottom-4 text-7xl text-white/10 group-hover:scale-110 transition-transform"></i>
                        </div>
                    </motion.div>

                    {/* KPI 2: Unique Devices */}
                    {settings.showUniqueDevicesCard && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                            <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/5 rounded-3xl p-6 shadow-lg relative overflow-hidden group h-full flex flex-col justify-center">
                                <div className="relative z-10">
                                    <div className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                                        <i className="fas fa-users text-purple-500"></i> 實際訪問裝置
                                    </div>
                                    <div className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">{stats.uniqueDevices.toLocaleString()}</div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* KPI 3: Today's Views */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                        <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/5 rounded-3xl p-6 shadow-lg relative overflow-hidden group h-full flex flex-col justify-center">
                            <div className="relative z-10">
                                <div className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <i className="fas fa-calendar-day text-green-500"></i> 今日瀏覽
                                </div>
                                <div className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">{stats.today.toLocaleString()}</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* KPI 4: Yesterday's Views */}
                    {settings.showYesterdayViewsCard && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                            <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/5 rounded-3xl p-6 shadow-lg relative overflow-hidden group h-full flex flex-col justify-center">
                                <div className="relative z-10">
                                    <div className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                                        <i className="fas fa-history text-orange-500"></i> 昨日瀏覽
                                    </div>
                                    <div className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">{stats.yesterday.toLocaleString()}</div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Trend Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                        className="lg:col-span-3"
                    >
                        <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl p-6 md:p-8 text-gray-900 dark:text-white shadow-xl border border-gray-200 dark:border-white/5 h-[400px] flex flex-col">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                                        <i className="fas fa-chart-area text-xl"></i>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold tracking-tight">
                                            {chartRange === '7days' ? '近 7 日流量趨勢' : '整年回顧趨勢'}
                                        </h3>
                                        <p className="text-xs text-gray-500 font-medium">總瀏覽次數 vs 實際訪問裝置</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-4">
                                    <div className="relative">
                                        <button 
                                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                            className="flex items-center gap-2 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 text-gray-900 dark:text-white text-xs font-bold rounded-xl px-4 py-2 transition-all shadow-sm focus:outline-none"
                                        >
                                            <i className="fas fa-calendar-alt text-gray-500 dark:text-gray-400"></i>
                                            {chartRange === '7days' ? '過去回顧 (7天)' : '整年回顧 (12個月)'}
                                            <i className={`fas fa-chevron-down text-[10px] text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}></i>
                                        </button>
                                        
                                        <AnimatePresence>
                                            {isDropdownOpen && (
                                                <>
                                                    <div 
                                                        className="fixed inset-0 z-40" 
                                                        onClick={() => setIsDropdownOpen(false)}
                                                    ></div>
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#252525] border border-gray-100 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 p-1.5"
                                                    >
                                                        <button
                                                            onClick={() => { setChartRange('7days'); setIsDropdownOpen(false); }}
                                                            className={`w-full text-left px-3 py-2.5 text-xs font-bold rounded-lg transition-colors flex items-center justify-between ${chartRange === '7days' ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                                                        >
                                                            <span>過去回顧 (7天)</span>
                                                            {chartRange === '7days' && <i className="fas fa-check text-[10px]"></i>}
                                                        </button>
                                                        <button
                                                            onClick={() => { setChartRange('thisYear'); setIsDropdownOpen(false); }}
                                                            className={`w-full text-left px-3 py-2.5 text-xs font-bold rounded-lg transition-colors flex items-center justify-between mt-1 ${chartRange === 'thisYear' ? 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                                                        >
                                                            <span>整年回顧 (12個月)</span>
                                                            {chartRange === 'thisYear' && <i className="fas fa-check text-[10px]"></i>}
                                                        </button>
                                                    </motion.div>
                                                </>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                    <div className="flex gap-4 text-xs font-bold">
                                        {settings.showPageViewsCurve && (
                                            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div> 總瀏覽次數</div>
                                        )}
                                        {settings.showUniqueDevicesCurve && (
                                            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(139,92,246,0.5)]"></div> 實際訪問裝置</div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex-grow w-full">
                                {chartStats.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={chartStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.6} />
                                                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05} />
                                                </linearGradient>
                                                <linearGradient id="colorUnique" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.6} />
                                                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.05} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(156, 163, 175, 0.1)" />
                                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                                            <RechartsTooltip
                                                contentStyle={{ backgroundColor: 'rgba(17, 24, 39, 0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', backdropFilter: 'blur(8px)', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)' }}
                                                itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                                                cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1, strokeDasharray: '5 5' }}
                                            />
                                            {settings.showPageViewsCurve && (
                                                <Area 
                                                    type="monotone" 
                                                    dataKey="visits" 
                                                    name="總瀏覽次數" 
                                                    stroke="#3B82F6" 
                                                    strokeWidth={4} 
                                                    fillOpacity={1} 
                                                    fill="url(#colorVisits)"
                                                    animationDuration={1500}
                                                    animationEasing="ease-out"
                                                    activeDot={{ r: 6, strokeWidth: 0, fill: '#3B82F6', filter: 'drop-shadow(0px 0px 4px rgba(59,130,246,0.8))' }}
                                                />
                                            )}
                                            {settings.showUniqueDevicesCurve && (
                                                <Area 
                                                    type="monotone" 
                                                    dataKey="uniqueDevices" 
                                                    name="實際訪問裝置" 
                                                    stroke="#8B5CF6" 
                                                    strokeWidth={4} 
                                                    fillOpacity={1} 
                                                    fill="url(#colorUnique)"
                                                    animationDuration={1500}
                                                    animationEasing="ease-out"
                                                    activeDot={{ r: 6, strokeWidth: 0, fill: '#8B5CF6', filter: 'drop-shadow(0px 0px 4px rgba(139,92,246,0.8))' }}
                                                />
                                            )}
                                        </AreaChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <LogoLoader size="w-8 h-8" animate={true} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Stats;
