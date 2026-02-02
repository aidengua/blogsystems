import {
    PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { motion } from 'framer-motion';
import SpotlightCard from '../SpotlightCard';

const parseDateForTooltip = (dateStr) => {
    // Simple check if it matches expected format if needed, 
    // but the data passed in should already be formatted or consistent.
    return dateStr;
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-[#1e1e1e]/90 backdrop-blur-md border border-white/10 p-3 rounded-lg shadow-xl z-50">
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

const DashboardStats = ({ stats, tagData, viewData, COLORS }) => {
    return (
        <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="h-full"
            >
                <SpotlightCard className="p-6 h-full flex flex-col rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm" spotlightColor="rgba(112, 156, 239, 0.1)">
                    <div className="mb-6 flex justify-between items-end border-b border-white/5 pb-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <i className="fas fa-chart-pie text-[#709CEF] text-sm"></i>
                                <h3 className="text-lg font-bold text-white">文章分類統計</h3>
                            </div>
                            <p className="text-gray-500 text-xs">Tag Distribution Analysis</p>
                        </div>
                        <div className="text-right">
                            <span className="text-3xl font-display font-bold text-white tracking-tight">{stats.totalPosts}</span>
                            <span className="text-xs text-gray-500 ml-1 font-medium">篇總文章</span>
                        </div>
                    </div>
                    <div className="flex-grow h-[300px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={tagData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={4}
                                    dataKey="value"
                                    stroke="none"
                                    cornerRadius={4}
                                >
                                    {tagData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                            className="hover:opacity-80 transition-opacity cursor-pointer"
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'rgba(30, 30, 30, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '0.75rem', backdropFilter: 'blur(10px)' }}
                                    itemStyle={{ color: '#fff', fontSize: '12px' }}
                                />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    iconType="circle"
                                    wrapperStyle={{ fontSize: '12px', color: '#9ca3af', paddingTop: '20px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        {tagData.length === 0 && (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
                                尚無數據
                            </div>
                        )}
                    </div>
                </SpotlightCard>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="h-full"
            >
                <SpotlightCard className="p-6 h-full flex flex-col rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm" spotlightColor="rgba(112, 156, 239, 0.1)">
                    <div className="mb-6 flex justify-between items-end border-b border-white/5 pb-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <i className="fas fa-chart-area text-[#709CEF] text-sm"></i>
                                <h3 className="text-lg font-bold text-white">瀏覽量趨勢</h3>
                            </div>
                            <p className="text-gray-500 text-xs">View Traffic Trends</p>
                        </div>
                        <div className="text-right">
                            <span className="text-3xl font-display font-bold text-white tracking-tight">{stats.totalViews}</span>
                            <span className="text-xs text-gray-500 ml-1 font-medium">次總瀏覽</span>
                        </div>
                    </div>
                    <div className="flex-grow h-[300px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={viewData}
                                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                            >
                                <defs>
                                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#709CEF" stopOpacity={0.4} />
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
                                    animationDuration={1500}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                        {viewData.length === 0 && (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
                                尚無數據
                            </div>
                        )}
                    </div>
                </SpotlightCard>
            </motion.div>
        </div>
    );
};

export default DashboardStats;
