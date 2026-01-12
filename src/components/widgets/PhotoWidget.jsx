import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const photos = [
    "https://cloud.dragoncode.dev/f/mZLhW/%E5%89%AA%E8%B2%BC%E7%B0%BF%201768221991035.png",
    "https://cloud.dragoncode.dev/f/n5num/%E5%89%AA%E8%B2%BC%E7%B0%BF%201768222033885.png",
    "hhttps://cloud.dragoncode.dev/f/oYRsv/%E5%89%AA%E8%B2%BC%E7%B0%BF%201768222043942.png",
    "https://cloud.dragoncode.dev/f/pgYtA/%E5%89%AA%E8%B2%BC%E7%B0%BF%201768222054494.png",
    "https://cloud.dragoncode.dev/f/wj0Hy/%E5%89%AA%E8%B2%BC%E7%B0%BF%201768222117056.png",
    "https://cloud.dragoncode.dev/f/xG2Hx/%E5%89%AA%E8%B2%BC%E7%B0%BF%201768222142282.png",
    "https://cloud.dragoncode.dev/f/y8XSL/%E5%89%AA%E8%B2%BC%E7%B0%BF%201768222162293.png",
    "https://cloud.dragoncode.dev/f/zmnT4/%E5%89%AA%E8%B2%BC%E7%B0%BF%201768222176865.png",
    "https://cloud.dragoncode.dev/f/AnQUE/%E5%89%AA%E8%B2%BC%E7%B0%BF%201768222181659.png"
];

const PhotoWidget = ({ onMoreClick }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    // Initial load
    useEffect(() => {
        const img = new Image();
        img.src = photos[0];
        img.onload = () => setIsLoading(false);
    }, []);

    // Auto rotation with preloading
    useEffect(() => {
        if (isLoading) return;

        const timer = setInterval(() => {
            const nextIndex = (currentIndex + 1) % photos.length;
            const img = new Image();
            img.src = photos[nextIndex];
            img.onload = () => {
                setCurrentIndex(nextIndex);
            };
        }, 5000);

        return () => clearInterval(timer);
    }, [currentIndex, isLoading]);

    const btnRef = useRef(null);

    const handleMouseMove = (e) => {
        if (!btnRef.current) return;
        const rect = btnRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        btnRef.current.style.setProperty('--x', `${x}px`);
        btnRef.current.style.setProperty('--y', `${y}px`);
    };

    return (
        <div className="relative h-48 md:h-56 w-full bg-black/20 backdrop-blur-xl border border-white/10 rounded-[1.5rem] shadow-xl overflow-hidden group">
            {/* Loading State */}
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center z-20 bg-gray-900/50 backdrop-blur-sm">
                    <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                </div>
            )}

            <AnimatePresence mode="wait">
                {!isLoading && (
                    <motion.img
                        key={currentIndex}
                        src={photos[currentIndex]}
                        alt="Golden Selection"
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                )}
            </AnimatePresence>

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>

            <div className="absolute bottom-3 left-4 z-10">
                <div className="text-xs font-bold text-white/90 backdrop-blur-sm px-2 py-1 rounded-full bg-black/20 border border-white/10 inline-flex items-center gap-1">
                    <i className="fas fa-star text-yellow-400 text-[0.6rem]"></i> 金選照片
                </div>
            </div>

            {/* More Recommend Button */}
            <div className="absolute bottom-3 right-4 z-20">
                <button
                    ref={btnRef}
                    onMouseMove={handleMouseMove}
                    onMouseEnter={handleMouseMove}
                    onClick={onMoreClick}
                    className="group/btn relative px-3 py-1.5 rounded-full overflow-hidden border border-white/20 cursor-pointer shadow-lg active:scale-95 transition-all duration-200"
                >
                    {/* Base Background */}
                    <div className="absolute inset-0 bg-neutral-900/80 backdrop-blur-md"></div>

                    {/* Strong Light Field Effect */}
                    <div
                        className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200"
                        style={{
                            background: 'radial-gradient(circle 40px at var(--x, 50%) var(--y, 50%), rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 100%)',
                            mixBlendMode: 'overlay'
                        }}
                    ></div>

                    {/* Secondary Soft Glow */}
                    <div
                        className="absolute inset-0 opacity-0 group-hover/btn:opacity-40 transition-opacity duration-300"
                        style={{
                            background: 'radial-gradient(circle 80px at var(--x, 50%) var(--y, 50%), rgba(255, 255, 255, 0.3) 0%, transparent 100%)',
                        }}
                    ></div>

                    {/* Content */}
                    <div className="relative z-10 flex items-center gap-1.5 text-xs text-white font-medium tracking-wide">
                        <i className="fas fa-arrow-right -rotate-45 group-hover/btn:rotate-0 transition-transform duration-300 text-white"></i> 更多推薦
                    </div>
                </button>
            </div>
        </div>
    );
};

export default PhotoWidget;
