import React, { useState, useEffect } from 'react';

const LineCard = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        setIsAnimating(true);
        const timer = setTimeout(() => setIsAnimating(false), 500); // Faster duration for smaller card
        return () => clearTimeout(timer);
    }, [isHovered]);

    return (
        <div
            className="group perspective-[1000px] h-28 mb-6 cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <style>{`
                @keyframes blurPulseFast {
                    0% { filter: blur(0px); opacity: 1; }
                    50% { filter: blur(2px); opacity: 0.8; }
                    100% { filter: blur(0px); opacity: 1; }
                }
                .animate-blur-fast {
                    animation: blurPulseFast 0.5s cubic-bezier(0.23, 1, 0.32, 1);
                }
            `}</style>

            {/* Static Background Container */}
            <div className="relative w-full h-full bg-white dark:bg-[#1e1e1e] rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden transition-colors duration-300">

                {/* Flipping Content Wrapper */}
                <div
                    className="relative w-full h-full transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] transform-style-3d"
                    style={{ transform: isHovered ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
                >

                    {/* Front Face (Line Info) */}
                    <div className={`absolute inset-0 backface-hidden p-4 overflow-hidden z-10 ${isAnimating ? 'animate-blur-fast' : ''}`}>

                        <div className="relative z-10 flex items-center justify-between text-gray-900 dark:text-white h-full">
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">官方帳號 Line</span>
                                <span className="font-bold text-lg">加入好友獲取最新資訊</span>
                            </div>
                            <i className="fab fa-line text-[3.5rem] text-[#06C755] opacity-90 transition-transform duration-300 group-hover:scale-110"></i>
                        </div>
                        {/* Enlarged and Blurred Message Icon as Watermark */}
                        <i className="fas fa-comment-dots absolute -right-4 -bottom-4 text-gray-200 dark:text-white/5 text-[5rem] blur-[2px]"></i>
                    </div>

                    {/* Back Face (QR Code) */}
                    <div
                        className={`absolute inset-0 backface-hidden bg-gray-50 dark:bg-[#111] flex items-center justify-between px-6 z-10 ${isAnimating ? 'animate-blur-fast' : ''}`}
                        style={{ transform: 'rotateY(180deg)' }}
                    >
                        {/* Left Text */}
                        <div className="flex flex-col items-start z-10">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white tracking-wider mb-1">掃一掃</h3>
                            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                <span>不錯過精彩文章</span>
                                <i className="fas fa-caret-right text-gray-900 dark:text-white"></i>
                            </div>
                        </div>

                        {/* Right QR Code */}
                        <div className="relative z-10 bg-white p-1.5 rounded-lg border border-gray-200 dark:border-none">
                            <img
                                src="https://cloud.dragoncode.dev/f/qjjuX/%E5%89%AA%E8%B2%BC%E7%B0%BF%201768222234656.png"
                                alt="Line QR Code"
                                className="w-16 h-16 object-contain"
                            />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default LineCard;
