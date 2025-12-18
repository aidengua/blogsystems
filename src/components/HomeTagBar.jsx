import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase';
import SpotlightCard from './SpotlightCard';

const HomeTagBar = () => {
    const [tags, setTags] = useState([]);
    const [visibleTags, setVisibleTags] = useState([]);
    const [showMore, setShowMore] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const q = query(collection(db, 'posts'), where('status', '==', 'published'));
                const querySnapshot = await getDocs(q);
                const tagCounts = {};
                querySnapshot.docs.forEach(doc => {
                    const postTags = doc.data().tags || [];
                    postTags.forEach(tag => {
                        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                    });
                });
                // Sort tags by count descending
                const sortedTags = Object.entries(tagCounts)
                    .sort(([, a], [, b]) => b - a)
                    .map(([tag]) => tag);
                setTags(sortedTags);
            } catch (error) {
                console.error("Error fetching tags:", error);
            }
        };

        fetchTags();
    }, []);

    // Desktop: Calculate visible tags
    useEffect(() => {
        const calculateVisibleTags = () => {
            if (!containerRef.current || tags.length === 0) return;

            // Only run calculation if we are in desktop mode (container is visible)
            if (window.innerWidth < 768) return;

            const containerWidth = containerRef.current.offsetWidth;
            const homeButtonWidth = 90; // Reduced from 110
            const moreButtonWidth = 80; // Reduced from 90
            const gap = 8;              // Reduced from 16 (gap-2 is 0.5rem = 8px)

            // Helper to estimate tag width
            const getTagWidth = (tag) => {
                // px-3 (0.75rem * 2 = 1.5rem = 24px) 
                // border (2px)
                // icon space + margin (~14px)
                // character width (avg 14px)
                const basePaddingAndIcon = 42;
                const charWidth = 14;
                return basePaddingAndIcon + (tag.length * charWidth) + gap;
            };

            // 1. Calculate total width required for ALL tags
            let totalRequiredWidth = homeButtonWidth;
            for (let tag of tags) {
                totalRequiredWidth += getTagWidth(tag);
            }

            // 2. Check if everything fits without "More" button
            // We subtract a small buffer to prevent edge-case wrapping
            if (totalRequiredWidth <= containerWidth) {
                setVisibleTags(tags);
                setShowMore(false);
                return;
            }

            // 3. If overflow, fit as many as possible while reserving space for "More" button
            const availableForTags = containerWidth - homeButtonWidth - moreButtonWidth;
            let currentUsedWidth = 0;
            const resultTags = [];

            for (let tag of tags) {
                const thisTagWidth = getTagWidth(tag);
                if (currentUsedWidth + thisTagWidth <= availableForTags) {
                    currentUsedWidth += thisTagWidth;
                    resultTags.push(tag);
                } else {
                    break; // Stop adding once we run out of space
                }
            }

            setVisibleTags(resultTags);
            setShowMore(true);
        };

        calculateVisibleTags();
        window.addEventListener('resize', calculateVisibleTags);
        return () => window.removeEventListener('resize', calculateVisibleTags);
    }, [tags]);

    return (
        <div className="w-full mt-4 mb-6">
            {/* Mobile Layout: Horizontal Scroll */}
            <div className="md:hidden flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar mask-linear-fade" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <Link
                    to="/"
                    className="flex-shrink-0 h-8 px-3 bg-[#709CEF] hover:bg-[#709CEF] hover:brightness-110 text-white font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-lg shadow-[#709CEF]/20 text-xs"
                >
                    <i className="fas fa-home"></i>
                    <span>首頁</span>
                </Link>
                {tags.map(tag => (
                    <Link
                        key={tag}
                        to={`/tags/${tag}`}
                        className="flex-shrink-0 h-8 px-3 flex items-center bg-white dark:bg-[#1e1e1e] hover:bg-gray-50 dark:hover:bg-[#709CEF] border border-gray-200 dark:border-gray-800 hover:border-[#709CEF] text-gray-600 dark:text-gray-300 hover:text-[#709CEF] dark:hover:text-white rounded-lg transition-all duration-300 whitespace-nowrap text-xs group"
                    >
                        <span className="opacity-50 mr-1 group-hover:text-[#709CEF] dark:group-hover:text-white/70">#</span>
                        {tag}
                    </Link>
                ))}
                <div className="w-2 flex-shrink-0"></div>
            </div>

            {/* Desktop Layout: Wrapper in SpotlightCard */}
            <SpotlightCard
                className="hidden md:block w-full rounded-xl bg-white/80 dark:bg-[#0f0f11]/80 border border-gray-200 dark:border-white/10 backdrop-blur-md overflow-hidden"
                spotlightColor="rgba(112, 156, 239, 0.15)"
            >
                <div
                    ref={containerRef}
                    className="w-full h-12 flex items-center px-2 gap-2"
                >
                    <Link
                        to="/"
                        className="flex-shrink-0 h-8 px-4 bg-[#709CEF] hover:bg-[#709CEF] hover:brightness-110 text-white font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-lg shadow-[#709CEF]/20 text-sm"
                    >
                        <i className="fas fa-home text-xs"></i>
                        <span>首頁</span>
                    </Link>

                    {visibleTags.map(tag => (
                        <Link
                            key={tag}
                            to={`/tags/${tag}`}
                            className="flex-shrink-0 h-8 px-3 flex items-center bg-gray-100 dark:bg-[#18181b] hover:bg-gray-200 dark:hover:bg-[#27272a] border border-gray-200 dark:border-white/5 hover:border-[#709CEF]/50 text-gray-600 dark:text-gray-300 hover:text-[#709CEF] rounded-lg transition-all duration-300 whitespace-nowrap group text-sm"
                        >
                            <span className="opacity-50 mr-1 group-hover:text-[#709CEF] text-xs">#</span>
                            <span className="font-medium">{tag}</span>
                        </Link>
                    ))}

                    {showMore && (
                        <Link
                            to="/tags"
                            className="flex-shrink-0 h-8 px-3 bg-gray-100 dark:bg-[#18181b] hover:bg-gray-200 dark:hover:bg-[#27272a] border border-gray-200 dark:border-white/5 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ml-auto text-sm"
                        >
                            <i className="fas fa-angle-double-right text-xs"></i>
                            <span>更多</span>
                        </Link>
                    )}
                </div>
            </SpotlightCard>
        </div>
    );
};

export default HomeTagBar;
