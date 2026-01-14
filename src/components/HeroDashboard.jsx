import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import HomeTagBar from './HomeTagBar';
import LazyImage from './LazyImage';
import TiltCard from './TiltCard';
import MarqueeColumn from './MarqueeColumn';
import { categories } from '../config/navigation';

import img1 from '../assets/data/card1.jpg';
import img2 from '../assets/data/card2.jpg';
import img3 from '../assets/data/card3.jpg';
import img4 from '../assets/data/card4.jpg';
import img5 from '../assets/data/card5.jpg';
import img6 from '../assets/data/card6.jpg';
import img7 from '../assets/data/card7.jpg';
import img8 from '../assets/data/card8.jpg';
import img9 from '../assets/data/card9.jpg';
import starsIcon from '../assets/misc/stars.png';

// --- Sub-components ---

import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

import SpotlightCard from './SpotlightCard';

const NotificationBar = () => {
    const [latestEssay, setLatestEssay] = useState(null);

    useEffect(() => {
        const fetchLatestEssay = async () => {
            try {
                const q = query(
                    collection(db, 'essays'),
                    orderBy('createdAt', 'desc'),
                    limit(1)
                );
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    setLatestEssay(querySnapshot.docs[0].data().content);
                }
            } catch (error) {
                console.error("Error fetching latest essay:", error);
            }
        };

        fetchLatestEssay();
    }, []);

    return (
        <Link to="/essay" className="block w-full mb-4 group cursor-pointer">
            <SpotlightCard className="px-4 py-2 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-white/10" spotlightColor="rgba(112, 156, 239, 0.15)">
                <div className="flex items-center justify-center gap-3 w-full h-full">
                    <div className="shrink-0 animate-pulse text-[#709CEF]">
                        <i className="fas fa-bullhorn"></i>
                    </div>
                    <div className="flex-grow overflow-hidden relative h-6 flex items-center justify-center">
                        <div className="whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 group-hover:text-[#709CEF] transition-colors text-center w-full">
                            {latestEssay || "載入最新動態中..."}
                        </div>
                    </div>
                    <i className="fas fa-arrow-right text-gray-400 group-hover:translate-x-1 transition-transform group-hover:text-[#709CEF]"></i>
                </div>
            </SpotlightCard>
        </Link>
    );
};

const IntroCard = () => {
    const images = [img1, img2, img3, img4, img5, img6, img7, img8, img9];

    return (
        <SpotlightCard className="relative h-full min-h-[400px] overflow-hidden group cursor-pointer hover:shadow-2xl transition-shadow duration-500 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10" spotlightColor="rgba(112, 156, 239, 0.15)">
            <div className="relative md:absolute inset-0 flex flex-col md:flex-row h-full">
                {/* Left Content */}
                <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col z-20 relative h-full">
                    <div className="flex-grow flex flex-col justify-center mb-4 pb-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 w-fit mb-3">
                            <img src={starsIcon} alt="stars" className="w-4 h-4 object-contain" />
                            <span className="text-xs text-gray-600 dark:text-gray-300 font-medium">內容方向</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight font-display whitespace-nowrap leading-tight">
                            夢想家工作室<br />藝術與科技生活
                        </h2>
                        <p className="text-gray-500 font-mono text-xs">
                            dreamersaudio.shop
                        </p>
                    </div>

                    {/* Category Buttons - Capsule Style */}
                    <div className="grid grid-cols-2 gap-2 mt-auto w-full max-w-[200px]">
                        {categories.map((cat) => (
                            <Link
                                key={cat.title}
                                to={cat.to}
                                className={clsx(
                                    "relative h-12 rounded-full flex items-center justify-center gap-2 group/cat cursor-pointer overflow-visible",
                                    cat.colorClass
                                )}
                            >
                                {/* Tooltip */}
                                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 translate-y-2 scale-90 origin-bottom group-hover/cat:opacity-100 group-hover/cat:translate-y-0 group-hover/cat:scale-100 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] z-30 w-max">
                                    <div className="bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-white/10 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-xl">
                                        <span className="text-[10px] text-gray-600 dark:text-gray-300 text-nowrap">{cat.desc}</span>
                                    </div>
                                    {/* Arrow tip */}
                                    <div className="w-2 h-2 bg-white dark:bg-[#1e1e1e] border-r border-b border-gray-200 dark:border-white/10 absolute -bottom-1 left-1/2 -translate-x-1/2 rotate-45"></div>
                                </div>

                                {/* Icon */}
                                <i className={clsx(
                                    "fas text-xl text-white drop-shadow-md",
                                    cat.icon
                                )}></i>

                                {/* Text Label */}
                                <span className="text-sm font-bold text-white tracking-wide">{cat.title}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Right Image Grid (Vertical & Animated) */}
                <div className="w-full md:w-1/2 relative z-20 overflow-hidden h-48 md:h-full">
                    <div className="absolute inset-0 flex justify-center gap-3 p-3 opacity-80 hover:opacity-100 transition-opacity duration-500">
                        <MarqueeColumn images={images} duration={35} />
                        <MarqueeColumn images={[...images.slice(4), ...images.slice(0, 4)]} duration={30} />
                    </div>
                    {/* Top Fade Overlay */}
                    <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white dark:from-[#1a1a1a] to-transparent z-10 pointer-events-none md:hidden"></div>
                    {/* Bottom Fade Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white dark:from-[#1a1a1a] to-transparent z-10 pointer-events-none md:hidden"></div>
                </div>
            </div>
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
        </SpotlightCard>
    );
};


const photos = [
    "https://cloud.dragoncode.dev/f/DRof3/image_1.jpg",
    "https://cloud.dragoncode.dev/f/GZNHA/image_8.jpg",
    "https://cloud.dragoncode.dev/f/JZnIK/image_3.jpg",
    "https://cloud.dragoncode.dev/f/ElVsp/image.jpg",
    "https://cloud.dragoncode.dev/f/KONF4/image_2.jpg",
    "https://cloud.dragoncode.dev/f/LgkUQ/image_4.jpg",
    "https://cloud.dragoncode.dev/f/MjzSz/image_5.jpg",
    "https://cloud.dragoncode.dev/f/Nxwuj/image_7.jpg",
    "https://cloud.dragoncode.dev/f/O7KHv/image_6.jpg"
];

const FeatureCard = ({ posts, showRecommend, setShowRecommend }) => {
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
        <SpotlightCard className="relative h-full overflow-hidden group hover:shadow-2xl transition-all duration-500 bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10" spotlightColor="rgba(112, 156, 239, 0.15)">
            <AnimatePresence mode="wait">
                {!showRecommend ? (
                    <motion.div
                        key="default"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="relative h-full flex flex-col"
                    >
                        <div className="absolute inset-0 z-0">
                            <AnimatePresence mode="wait">
                                {!isLoading && (
                                    <motion.img
                                        key={currentIndex}
                                        src={photos[currentIndex]}
                                        alt="Feature Background"
                                        initial={{ opacity: 0, scale: 1.1 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.8 }}
                                        className="w-full h-full object-cover"
                                    />
                                )}
                            </AnimatePresence>
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 dark:from-black/80 via-transparent to-transparent"></div>
                        </div>

                        {/* Content Elements */}
                        <div className="absolute inset-x-0 bottom-0 p-6 z-20 flex items-end justify-between">
                            <div className="text-sm font-bold text-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full bg-black/30 border border-white/10 inline-flex items-center gap-2">
                                <i className="fas fa-star text-yellow-400 text-xs"></i> 金選照片
                            </div>

                            <button
                                onClick={() => setShowRecommend(true)}
                                className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-sm text-white transition-colors flex items-center gap-2 cursor-pointer border border-white/10"
                            >
                                <i className="fas fa-arrow-right -rotate-45"></i> 更多推薦
                            </button>
                        </div>

                        {/* Loading Indicator */}
                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                                <div className="w-8 h-8 border-2 border-[#709CEF]/30 border-t-[#709CEF] rounded-full animate-spin"></div>
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        key="recommend"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute inset-0 bg-white dark:bg-gray-900 p-4 flex flex-col"
                    >
                        <div className="flex justify-between items-center mb-2 text-gray-900 dark:text-white">
                            <span className="font-bold text-sm">推薦文章</span>
                            <button
                                onClick={() => setShowRecommend(false)}
                                className="text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white transition-colors"
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-2 overflow-y-auto scrollbar-hide flex-grow">
                            {posts.slice(0, 6).map((post) => (
                                <Link key={post.id} to={`/posts/${post.slug}`} className="relative h-24 rounded-lg overflow-hidden group/item">
                                    <div className="w-full h-full transition-transform duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] group-hover/item:scale-110 will-change-transform">
                                        <LazyImage
                                            src={post.coverImage}
                                            alt={post.title}
                                            className="w-full h-full object-cover"
                                            wrapperClassName="w-full h-full"
                                        />
                                    </div>
                                    <div className="absolute inset-0 bg-black/40 group-hover/item:bg-black/20 transition-colors duration-500"></div>
                                    <div className="absolute bottom-0 left-0 right-0 p-2">
                                        <div className="text-xs text-white font-medium line-clamp-2 leading-tight">
                                            {post.title}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </SpotlightCard>
    );
};



// --- Main Component ---

const HeroDashboard = ({ posts = [] }) => {
    const [showRecommend, setShowRecommend] = useState(false);

    return (
        <div className="w-full max-w-7xl mx-auto px-4 pt-24 pb-0 animate-fade-in-up">
            <NotificationBar />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Left Column */}
                <div className="col-span-1 lg:col-span-7 flex flex-col gap-4">
                    <IntroCard />
                </div>


                {/* Right Column */}
                <div className="col-span-1 lg:col-span-5 h-full">
                    <FeatureCard
                        posts={posts}
                        showRecommend={showRecommend}
                        setShowRecommend={setShowRecommend}
                    />
                </div>
            </div>

            <HomeTagBar />
        </div>
    );
};

export default HeroDashboard;
