import { useEffect, useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
import { motion } from 'framer-motion';
import { subscribeToStats, subscribeToWeeklyStats, subscribeToStatsSettings } from '../../services/stats';
import { ComposableMap, Geographies, Geography, Sphere, Graticule } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import { Tooltip } from 'react-tooltip';
import { AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import LogoLoader from '../../components/LogoLoader';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Map ipapi region names to world-atlas country names if they differ
const REGION_MAPPINGS = {
    "United States": "United States of America",
    "Macao": "Macau"
};

const Stats = () => {
    const [stats, setStats] = useState({ total: 0, uniqueDevices: 0, today: 0, yesterday: 0, regions: {} });
    const [weeklyStats, setWeeklyStats] = useState([]);
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

        const unsubscribeWeekly = subscribeToWeeklyStats((data) => {
            setWeeklyStats(data);
        });

        const unsubscribeSettings = subscribeToStatsSettings((data) => {
            setSettings(data);
        });

        return () => {
            unsubscribeStats();
            unsubscribeWeekly();
            unsubscribeSettings();
        };
    }, []);

    // Process regions data
    const regionData = Object.entries(stats.regions || {})
        .map(([name, value]) => ({
            name: REGION_MAPPINGS[name] || name,
            originalName: name,
            value
        }))
        .sort((a, b) => b.value - a.value);

    const maxViews = Math.max(...regionData.map(d => d.value), 1);

    const colorScale = scaleLinear()
        .domain([0, maxViews])
        .range(["#E5E7EB", "#3B82F6"]); // Light gray to Blue

    const darkColorScale = scaleLinear()
        .domain([0, maxViews])
        .range(["#374151", "#60A5FA"]); // Dark gray to Light Blue

    const topRegions = regionData.slice(0, 6);
    const totalRegionsCount = regionData.reduce((acc, curr) => acc + curr.value, 0);

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
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20">
                                        <i className="fas fa-chart-area text-xl"></i>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold tracking-tight">近 7 日流量趨勢</h3>
                                        <p className="text-xs text-gray-500 font-medium">總瀏覽次數 vs 實際訪問裝置</p>
                                    </div>
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

                            <div className="flex-grow w-full">
                                {weeklyStats.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={weeklyStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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

                    {/* Regional Distribution Map */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                        className="lg:col-span-2"
                    >
                        <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl p-6 md:p-8 text-gray-900 dark:text-white shadow-xl border border-gray-200 dark:border-white/5 h-full flex flex-col relative overflow-hidden min-h-[400px]">
                            <div className="flex items-center gap-4 mb-2 border-b border-gray-100 dark:border-white/5 pb-4 relative z-10">
                                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500 border border-green-500/20">
                                    <i className="fas fa-map-marked-alt text-xl"></i>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold tracking-tight">全球流量熱力圖</h3>
                                </div>
                            </div>

                            {loading ? (
                                <div className="flex-grow flex items-center justify-center">
                                    <LogoLoader size="w-10 h-10" animate={true} />
                                </div>
                            ) : (
                                <div className="flex-grow flex items-center justify-center relative w-full h-full mt-2">
                                    <ComposableMap
                                        projectionConfig={{ scale: 145 }}
                                        className="w-full h-full object-contain"
                                        style={{ outline: 'none' }}
                                    >
                                        <Sphere stroke="#E4E5E6" strokeWidth={0.5} />
                                        <Graticule stroke="#E4E5E6" strokeWidth={0.5} />
                                        <Geographies geography={geoUrl}>
                                            {({ geographies }) =>
                                                geographies.map((geo) => {
                                                    const d = regionData.find((s) => s.name === geo.properties.name);
                                                    const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
                                                    const scaleToUse = isDark ? darkColorScale : colorScale;
                                                    const defaultFill = isDark ? "#2D3748" : "#F3F4F6";
                                                    const hoverFill = isDark ? "#4A5568" : "#D1D5DB";
                                                    const strokeColor = isDark ? "#1a1a1a" : "#FFFFFF";

                                                    return (
                                                        <Geography
                                                            key={geo.rsmKey}
                                                            geography={geo}
                                                            fill={d ? scaleToUse(d.value) : defaultFill}
                                                            stroke={strokeColor}
                                                            strokeWidth={0.5}
                                                            style={{
                                                                default: { outline: "none", transition: "fill 0.2s" },
                                                                hover: {
                                                                    fill: d ? "#2563EB" : hoverFill,
                                                                    outline: "none",
                                                                    transition: "fill 0.2s",
                                                                    cursor: "pointer"
                                                                },
                                                                pressed: { outline: "none" }
                                                            }}
                                                            onMouseEnter={() => {
                                                                const value = d ? d.value.toLocaleString() : 0;
                                                                setTooltipContent(`${geo.properties.name}: ${value} devices`);
                                                            }}
                                                            onMouseLeave={() => {
                                                                setTooltipContent("");
                                                            }}
                                                            data-tooltip-id="map-tooltip"
                                                        />
                                                    );
                                                })
                                            }
                                        </Geographies>
                                    </ComposableMap>
                                    <Tooltip
                                        id="map-tooltip"
                                        content={tooltipContent}
                                        float
                                        style={{
                                            backgroundColor: 'rgba(17, 24, 39, 0.9)',
                                            color: '#fff',
                                            borderRadius: '8px',
                                            padding: '8px 12px',
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                            backdropFilter: 'blur(4px)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            zIndex: 50
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Top Regions Ranking */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
                        className="lg:col-span-1 flex flex-col"
                    >
                        <div className="bg-white dark:bg-[#1a1a1a] rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-white/5 flex-grow">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-500 flex items-center justify-center">
                                    <i className="fas fa-trophy"></i>
                                </div>
                                Top Regions
                            </h3>
                            {loading ? (
                                <div className="flex justify-center py-8">
                                    <LogoLoader size="w-8 h-8" animate={true} />
                                </div>
                            ) : topRegions.length > 0 ? (
                                <div className="flex flex-col gap-5">
                                    {topRegions.map((item, index) => {
                                        const percentage = ((item.value / totalRegionsCount) * 100).toFixed(1);
                                        return (
                                            <div key={index} className="flex flex-col gap-1.5 group">
                                                <div className="flex justify-between items-end text-sm">
                                                    <span className="font-bold text-gray-700 dark:text-gray-300 group-hover:text-blue-500 transition-colors flex items-center gap-2">
                                                        <span className="text-gray-400 font-mono text-xs w-3">{index + 1}.</span> {item.originalName}
                                                    </span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-mono font-bold text-gray-900 dark:text-white">{item.value.toLocaleString()}</span>
                                                        <span className="text-xs text-gray-400 w-10 text-right">{percentage}%</span>
                                                    </div>
                                                </div>
                                                <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${percentage}%` }}
                                                        transition={{ duration: 1, ease: "easeOut" }}
                                                        className="bg-gradient-to-r from-blue-400 to-blue-600 h-full rounded-full"
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 text-center py-4">尚無數據</p>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Stats;
