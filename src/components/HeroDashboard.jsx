import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import Typewriter from 'typewriter-effect';

// --- Sub-components ---

const NotificationBar = () => (
    <div className="w-full mb-4 px-4 py-2 liquid-glass flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
        <div className="shrink-0 animate-pulse text-blue-500">
            <i className="fas fa-bullhorn"></i>
        </div>
        <div className="flex-grow overflow-hidden relative h-6">
            <div className="absolute whitespace-nowrap animate-marquee flex items-center h-full text-sm text-gray-600 dark:text-gray-300 group-hover:text-blue-500 transition-colors">
                由於日本不顧我方嚴正聲明與國際抗議，一意孤行，於 2023 年 8 月 24 日將核廢水排入大海... 本著國際環保主義的內心...
            </div>
        </div>
        <i className="fas fa-arrow-right text-gray-400 group-hover:translate-x-1 transition-transform"></i>
    </div>
);

const IntroCard = () => (
    <div className="relative h-64 md:h-80 glass-base overflow-hidden group cursor-pointer hover:shadow-2xl transition-all duration-500">
        {/* Background Image/Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 transition-transform duration-700 group-hover:scale-110">
            {/* Optional: Add an actual image here with opacity */}
            <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1496302662116-35cc4f36df92?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
        </div>

        {/* Content */}
        <div className="absolute inset-0 p-8 flex flex-col justify-between text-white z-10">
            <div>
                <div className="text-sm font-medium opacity-80 mb-2 tracking-wider">ANHEYU.COM</div>
                <h2 className="text-4xl font-bold leading-tight mb-2">
                    生活明朗<br />萬物可愛。
                </h2>
            </div>
            <div className="opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                <span className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-sm font-medium hover:bg-white/30 transition-colors">
                    Welcome to my blog
                </span>
            </div>
        </div>

        {/* Floating Icons Decoration */}
        <div className="absolute top-4 right-4 text-white/20 text-6xl rotate-12 group-hover:rotate-45 transition-transform duration-700">
            <i className="fas fa-sun"></i>
        </div>
    </div>
);

const CategoryCard = ({ title, icon, colorClass, to }) => (
    <Link to={to} className={clsx(
        "relative h-32 glass-base overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] flex-1 hover:flex-[1.5] min-w-0 block",
        colorClass
    )}>
        {/* Text Content */}
        <div className="absolute top-6 left-6 z-10">
            <span className="text-2xl font-bold text-white tracking-wider">{title}</span>
        </div>

        {/* Watermark Icon */}
        <i className={clsx(
            "fas absolute -bottom-6 -right-6 text-[8rem] text-white/20 group-hover:scale-110 group-hover:rotate-0 -rotate-12 transition-all duration-500 ease-out",
            icon
        )}></i>

        {/* Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
    </Link>
);

const FeatureCard = () => (
    <div className="relative h-full min-h-[300px] glass-base overflow-hidden group cursor-pointer hover:shadow-2xl transition-all duration-500 bg-gray-900">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/50 to-black/80 z-0"></div>

        {/* Animated Particles/Stars (Simplified) */}
        <div className="absolute inset-0 opacity-50">
            <div className="absolute top-10 left-10 w-2 h-2 bg-white rounded-full animate-ping"></div>
            <div className="absolute bottom-20 right-20 w-1 h-1 bg-white rounded-full animate-pulse"></div>
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-10 text-white">
            <div className="mb-4">
                <i className="fas fa-exclamation text-4xl mb-2 animate-bounce"></i>
                <div className="text-sm opacity-70">圖片伺服器</div>
                <div className="text-lg font-medium">僅向中國大陸提供服務</div>
            </div>

            <div className="mt-auto w-full flex justify-between items-end">
                <div className="text-left">
                    <div className="text-xs opacity-60">新品主題</div>
                    <div className="text-2xl font-bold">Theme-AnZhiYu</div>
                </div>
                <button className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-sm transition-colors flex items-center gap-2">
                    <i className="fas fa-arrow-right -rotate-45"></i> 更多推薦
                </button>
            </div>
        </div>
    </div>
);

const TagBar = () => {
    const tags = [
        { name: '前端開發', icon: 'fa-code' },
        { name: '網絡安全', icon: 'fa-shield-alt' },
        { name: '平面設計', icon: 'fa-paint-brush' },
        { name: '大學生涯', icon: 'fa-graduation-cap' },
        { name: '年度總結', icon: 'fa-calendar-check' },
        { name: '生活日常', icon: 'fa-coffee' },
    ];

    return (
        <div className="w-full mt-4 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <Link to="/" className="shrink-0 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded-xl font-bold shadow-sm transition-colors flex items-center gap-2">
                <i className="fas fa-home"></i> 首頁
            </Link>

            {tags.map((tag, index) => (
                <Link
                    key={index}
                    to={`/tags/${tag.name}`}
                    className="shrink-0 px-4 py-2 liquid-glass hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium shadow-sm transition-colors whitespace-nowrap group"
                >
                    <span className="group-hover:text-blue-500 transition-colors">{tag.name}</span>
                </Link>
            ))}

            <Link to="/tags" className="shrink-0 px-4 py-2 text-gray-500 hover:text-blue-500 transition-colors flex items-center gap-1">
                <i className="fas fa-angle-double-right"></i> 更多
            </Link>
        </div>
    );
};

// --- Main Component ---

const HeroDashboard = () => {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 pt-24 pb-8 animate-fade-in-up">
            <NotificationBar />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Left Column */}
                <div className="flex flex-col gap-4">
                    <IntroCard />
                    <div className="flex gap-4 w-full">
                        <CategoryCard
                            title="前端"
                            icon="fa-dove"
                            colorClass="bg-gradient-to-r from-blue-400 to-blue-600"
                            to="/category/frontend"
                        />
                        <CategoryCard
                            title="生活"
                            icon="fa-fire"
                            colorClass="bg-gradient-to-r from-orange-400 to-red-500"
                            to="/category/life"
                        />
                        <CategoryCard
                            title="安和魚"
                            icon="fa-book"
                            colorClass="bg-gradient-to-r from-emerald-400 to-teal-600"
                            to="/category/anheyu"
                        />
                    </div>
                </div>

                {/* Right Column */}
                <div className="h-full">
                    <FeatureCard />
                </div>
            </div>

            <TagBar />
        </div>
    );
};

export default HeroDashboard;
