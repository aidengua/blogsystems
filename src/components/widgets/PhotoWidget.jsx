import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const photos = [
    "https://cloudflare-imgbed-5re.pages.dev/file/1758853806050_1000007552.jpg",
    "https://cloudflare-imgbed-5re.pages.dev/file/1758855518652_1000007550.jpg",
    "https://cloudflare-imgbed-5re.pages.dev/file/1764855790445_1000007563.jpg",
    "https://cloudflare-imgbed-5re.pages.dev/file/1764855797267_1000024703.jpg",
    "https://cloudflare-imgbed-5re.pages.dev/file/1764855786326_1000007568.jpg",
    "https://cloudflare-imgbed-5re.pages.dev/file/1764855786467_1000007547.jpg",
    "https://cloudflare-imgbed-5re.pages.dev/file/1764855790425_1000007558.jpg",
    "https://cloudflare-imgbed-5re.pages.dev/file/1764855781459_1000007555.jpg",
    "https://cloudflare-imgbed-5re.pages.dev/file/1764855786258_1000007537.jpg"
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
                    onClick={onMoreClick}
                    className="px-3 py-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-xs text-white transition-colors flex items-center gap-1.5 cursor-pointer border border-white/10"
                >
                    <i className="fas fa-arrow-right -rotate-45"></i> 更多推薦
                </button>
            </div>
        </div>
    );
};

export default PhotoWidget;
