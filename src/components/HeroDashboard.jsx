import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import Typewriter from 'typewriter-effect';
import HomeTagBar from './HomeTagBar';
import LazyImage from './LazyImage';
import mainImage from '../assets/main.png';
import img1 from '../assets/data/1.png';
import img2 from '../assets/data/2.png';
import img3 from '../assets/data/3.png';
import img4 from '../assets/data/4.png';
import img5 from '../assets/data/5.png';
import img6 from '../assets/data/6.png';
import img7 from '../assets/data/7.png';
import img8 from '../assets/data/8.png';
import img9 from '../assets/data/9.png';

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
            <SpotlightCard className="px-4 py-2 shadow-sm hover:shadow-md transition-shadow" spotlightColor="rgba(112, 156, 239, 0.15)">
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

const TiltCard = ({ children, className }) => {
    const cardRef = useRef(null);
    const [rotate, setRotate] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -20;
        const rotateY = ((x - centerX) / centerX) * 20;

        setRotate({ x: rotateX, y: rotateY });
    };

    const handleMouseLeave = () => {
        setRotate({ x: 0, y: 0 });
    };

    return (
        <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ perspective: '1000px' }}
            className={clsx("relative shrink-0 mb-4", className)}
        >
            <motion.div
                animate={{
                    rotateX: rotate.x,
                    rotateY: rotate.y,
                    scale: rotate.x !== 0 ? 1.1 : 1
                }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                style={{ transformStyle: 'preserve-3d' }}
                className="w-full h-full"
            >
                {children}
            </motion.div>
        </motion.div>
    );
};

const MarqueeColumn = ({ images, duration }) => {
    return (
        <div className="relative w-1/3 h-full overflow-hidden">
            <motion.div
                className="flex flex-col will-change-transform"
                animate={{ y: ["0%", "-50%"] }}
                transition={{
                    duration: duration,
                    repeat: Infinity,
                    ease: "linear",
                    repeatType: "loop"
                }}
            >
                {[...images, ...images].map((img, index) => (
                    <TiltCard key={index} className="aspect-square rounded-xl overflow-hidden shadow-lg border-2 border-white/20 hover:border-white/60 transition-colors">
                        <img
                            src={img}
                            alt={`Gallery Image ${index}`}
                            className="w-full h-full object-cover pointer-events-none"
                            loading="lazy"
                            decoding="async"
                        />
                    </TiltCard>
                ))}
            </motion.div>
        </div>
    );
};

const IntroCard = () => {
    const images = [img1, img2, img3, img4, img5, img6, img7, img8, img9];

    return (
        <SpotlightCard className="relative h-64 md:h-80 overflow-hidden group cursor-pointer hover:shadow-2xl transition-all duration-500 bg-[#1a1a1a]" spotlightColor="rgba(112, 156, 239, 0.15)">
            <div className="absolute inset-0 flex flex-col md:flex-row">
                {/* Left Content */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center z-10 relative">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight font-display">
                        夢想家工作室
                    </h2>
                    <p className="text-xl md:text-2xl text-gray-400 font-medium mb-6">
                        堅持卓越，成就非凡
                    </p>
                    <div className="text-gray-500 font-mono text-sm">
                        dreamersaudio.shop
                    </div>
                </div>

                {/* Right Image Grid (Vertical & Animated) */}
                <div className="w-full md:w-1/2 relative overflow-hidden h-full">
                    <div className="absolute inset-0 flex gap-4 p-4 opacity-80 hover:opacity-100 transition-opacity duration-500">
                        <MarqueeColumn images={images} duration={25} />
                        <MarqueeColumn images={[...images.slice(3), ...images.slice(0, 3)]} duration={20} />
                        <MarqueeColumn images={[...images.slice(6), ...images.slice(0, 6)]} duration={15} />
                    </div>
                </div>
            </div>
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
        </SpotlightCard>
    );
};

const CategoryCard = ({ title, icon, colorClass, to }) => (
    <Link to={to} className={clsx(
        "relative h-20 flex-1 hover:flex-[1.5] min-w-0 block transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] group cursor-pointer"
    )}>
        <SpotlightCard className={clsx("h-full w-full overflow-hidden hover:shadow-xl transition-all duration-500", colorClass)} spotlightColor="rgba(255, 255, 255, 0.2)">
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
        </SpotlightCard>
    </Link>
);

const FeatureCard = ({ posts, showRecommend, setShowRecommend }) => (
    <SpotlightCard className="relative h-full overflow-hidden group hover:shadow-2xl transition-all duration-500 bg-gray-900" spotlightColor="rgba(112, 156, 239, 0.15)">
        <AnimatePresence mode="wait">
            {!showRecommend ? (
                <motion.div
                    key="default"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0"
                >
                    <div className="absolute inset-0 z-0">
                        <LazyImage
                            src={mainImage}
                            alt="Feature Background"
                            className="w-full h-full object-cover opacity-60 transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1.0)]"
                            wrapperClassName="w-full h-full"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 to-black/80"></div>
                    </div>

                    {/* Animated Particles/Stars (Simplified) */}
                    <div className="absolute inset-0 opacity-50 pointer-events-none">
                        <div className="absolute top-10 left-10 w-2 h-2 bg-white rounded-full animate-ping"></div>
                        <div className="absolute bottom-20 right-20 w-1 h-1 bg-white rounded-full animate-pulse"></div>
                    </div>

                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-10 text-white">
                        <div className="mt-auto w-full flex justify-between items-end">
                            <div className="text-left">
                                <div className="text-xs opacity-60">新品主題</div>
                                <div className="text-2xl font-bold">音響設計之家</div>
                            </div>
                            <button
                                onClick={() => setShowRecommend(true)}
                                className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-sm transition-colors flex items-center gap-2 cursor-pointer"
                            >
                                <i className="fas fa-arrow-right -rotate-45"></i> 更多推薦
                            </button>
                        </div>
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    key="recommend"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="absolute inset-0 bg-gray-900 p-4 flex flex-col"
                >
                    <div className="flex justify-between items-center mb-2 text-white">
                        <span className="font-bold text-sm">推薦文章</span>
                        <button
                            onClick={() => setShowRecommend(false)}
                            className="text-white/60 hover:text-white transition-colors"
                        >
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 overflow-y-auto scrollbar-hide flex-grow">
                        {posts.slice(0, 6).map((post) => (
                            <Link key={post.id} to={`/posts/${post.slug}`} className="relative h-24 rounded-lg overflow-hidden group/item">
                                <div className="w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] group-hover/item:scale-110 will-change-transform">
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
                    <div className="flex flex-col md:flex-row gap-4 w-full">
                        <CategoryCard
                            title="作品紀錄"
                            icon="fa-clipboard-list"
                            colorClass="bg-[#72B5AD]"
                            to="/?category=作品紀錄"
                        />
                        <CategoryCard
                            title="比賽紀錄"
                            icon="fa-fire"
                            colorClass="bg-[#C982A1]"
                            to="/?category=比賽紀錄"
                        />
                        <CategoryCard
                            title="製作教程"
                            icon="fa-layer-group"
                            colorClass="bg-[#83A17E]"
                            to="/?category=製作教程"
                        />
                        <CategoryCard
                            title="課堂筆記"
                            icon="fa-book"
                            colorClass="bg-[#C3B579]"
                            to="/?category=課堂筆記"
                        />
                    </div>
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
