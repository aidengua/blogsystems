import React, { useState } from 'react';

const ProfileCard = () => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="w-full h-[360px] mb-6 group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Static Background Container */}
            <div className="relative w-full h-full bg-[#1e1e1e] rounded-3xl shadow-xl border border-gray-800 overflow-hidden">

                {/* Content Wrapper */}
                <div className="relative w-full h-full">

                    {/* Front Face Content (Fade Out on Hover) */}
                    <div
                        className={`absolute inset-0 p-6 flex flex-col justify-between z-20 transition-all duration-500 ease-in-out ${isHovered ? 'opacity-0 pointer-events-none scale-95' : 'opacity-100 pointer-events-auto scale-100'
                            }`}
                    >
                        {/* Status Pill */}
                        <div className="flex justify-center">
                            <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300 font-medium backdrop-blur-md">
                                晚上就是拿來敲代碼的
                            </div>
                        </div>

                        {/* Avatar */}
                        <div className="flex justify-center">
                            <div className="relative w-28 h-28">
                                <div className="w-full h-full rounded-2xl overflow-hidden border-4 border-[#2a2a2a] shadow-2xl">
                                    <img
                                        src="https://cloudflare-imgbed-5re.pages.dev/file/1759506193400_1000004107.jpg"
                                        alt="Avatar"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Info & Action */}
                        <div className="flex items-end justify-between">
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-1">呂宥德</h3>
                                <p className="text-sm text-gray-400">夢想家音響工作室</p>
                            </div>
                            <a
                                href="https://github.com/yourusername"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all hover:scale-110"
                            >
                                <i className="fab fa-github text-xl text-white"></i>
                            </a>
                        </div>
                    </div>

                    {/* Back Face Content (Fade In on Hover) */}
                    <div
                        className={`absolute inset-0 p-6 flex flex-col z-10 transition-all duration-500 ease-in-out ${isHovered ? 'opacity-100 pointer-events-auto scale-100' : 'opacity-0 pointer-events-none scale-105'
                            }`}
                    >
                        {/* Top Pill / Search Bar Style */}
                        <div className="flex justify-center mb-6">
                            <div className="px-4 py-1.5 rounded-full bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 text-xs font-bold flex items-center gap-2">
                                <i className="fas fa-search"></i>
                                <span>分享與熱心幫助</span>
                            </div>
                        </div>

                        {/* Description Text */}
                        <div className="flex-grow space-y-4">
                            <p className="text-sm text-gray-300 leading-relaxed font-medium">
                                這有關於<span className="text-white font-bold">產品</span>、<span className="text-white font-bold">設計</span>、<span className="text-white font-bold">開發</span>相關的問題和看法，還有<span className="text-white font-bold">文章翻譯</span>和<span className="text-white font-bold">分享</span>。
                            </p>
                            <p className="text-sm text-gray-300 leading-relaxed font-medium">
                                相信你可以在這裡找到對你有用的<span className="text-white font-bold">知識</span>和<span className="text-white font-bold">教程</span>。
                            </p>
                        </div>

                        {/* Footer / Signature */}
                        <div className="flex items-center justify-between mt-4">
                            <div className="w-auto h-12 flex items-center">
                                <img
                                    src="https://cloudflare-imgbed-5re.pages.dev/file/1765098308498_web.gif"
                                    alt="Decoration"
                                    className="h-full object-contain"
                                />
                            </div>
                            <div className="flex gap-2">
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center transition-colors hover:bg-white/20 cursor-pointer">
                                    <i className="fab fa-github text-white text-sm"></i>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center transition-colors hover:bg-white/20 cursor-pointer">
                                    <i className="fas fa-envelope text-white text-sm"></i>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ProfileCard;
