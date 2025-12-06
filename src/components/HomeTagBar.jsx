import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase';

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
            // Check if the element is actually displayed (not hidden by md:hidden)
            if (window.getComputedStyle(containerRef.current).display === 'none') return;

            const containerWidth = containerRef.current.offsetWidth;
            // Approximate widths based on current styling and typical content
            const homeButtonWidth = 100; // Approx width of Home button + gap
            const moreButtonWidth = 80; // Approx width of More button
            const tagWidth = 120; // Approx average width of a tag button + gap

            const availableWidth = containerWidth - homeButtonWidth - (tags.length > 0 ? moreButtonWidth : 0); // Only reserve space for 'More' if there are tags
            const maxVisible = Math.floor(availableWidth / tagWidth);

            if (tags.length > maxVisible) {
                setVisibleTags(tags.slice(0, maxVisible));
                setShowMore(true);
            } else {
                setVisibleTags(tags);
                setShowMore(false);
            }
        };

        calculateVisibleTags();
        window.addEventListener('resize', calculateVisibleTags);
        return () => window.removeEventListener('resize', calculateVisibleTags);
    }, [tags]);

    return (
        <div className="w-full mt-4 mb-8">
            {/* Mobile Layout: Horizontal Scroll */}
            <div className="md:hidden flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar mask-linear-fade" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <Link
                    to="/"
                    className="flex-shrink-0 h-9 px-4 bg-[#709CEF] hover:bg-[#709CEF] hover:brightness-110 text-white font-bold rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-[#709CEF]/20 text-sm"
                >
                    <i className="fas fa-home"></i>
                    <span>首頁</span>
                </Link>
                {tags.map(tag => (
                    <Link
                        key={tag}
                        to={`/tags/${tag}`}
                        className="flex-shrink-0 h-9 px-3 flex items-center bg-[#1e1e1e] hover:bg-[#709CEF] border border-gray-800 hover:border-[#709CEF] text-gray-300 hover:text-white rounded-lg transition-all duration-300 whitespace-nowrap text-sm group"
                    >
                        <span className="opacity-50 mr-1 group-hover:text-white/70">#</span>
                        {tag}
                    </Link>
                ))}
                <div className="w-2 flex-shrink-0"></div>
            </div>

            {/* Desktop Layout: Calculated Width */}
            <div ref={containerRef} className="hidden md:flex items-center gap-4 overflow-hidden">
                <Link
                    to="/"
                    className="flex-shrink-0 px-6 py-2 bg-[#709CEF] hover:bg-[#709CEF] hover:brightness-110 text-white font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-[#709CEF]/20"
                >
                    <i className="fas fa-home"></i>
                    <span>首頁</span>
                </Link>

                {visibleTags.map(tag => (
                    <Link
                        key={tag}
                        to={`/tags/${tag}`}
                        className="flex-shrink-0 px-5 py-2 bg-[#1e1e1e] hover:bg-[#709CEF] border border-gray-800 hover:border-[#709CEF] text-gray-300 hover:text-white rounded-xl transition-all duration-300 whitespace-nowrap"
                    >
                        <span className="opacity-50 mr-1">#</span>
                        {tag}
                    </Link>
                ))}

                {showMore && (
                    <Link
                        to="/tags"
                        className="flex-shrink-0 px-5 py-2 bg-[#1e1e1e] hover:bg-gray-800 border border-gray-800 text-gray-400 hover:text-white rounded-xl transition-colors flex items-center gap-2 whitespace-nowrap"
                    >
                        <i className="fas fa-angle-double-right"></i>
                        <span>更多</span>
                    </Link>
                )}
            </div>
        </div>
    );
};

export default HomeTagBar;
