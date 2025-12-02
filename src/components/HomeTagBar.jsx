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

    useEffect(() => {
        const calculateVisibleTags = () => {
            if (!containerRef.current || tags.length === 0) return;

            const containerWidth = containerRef.current.offsetWidth;
            const homeButtonWidth = 100; // Approx width of Home button + gap
            const moreButtonWidth = 80; // Approx width of More button
            const tagWidth = 120; // Approx average width of a tag button + gap

            const availableWidth = containerWidth - homeButtonWidth - moreButtonWidth;
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
        <div className="w-full mt-4 mb-8" ref={containerRef}>
            <div className="flex items-center gap-4 overflow-hidden">
                {/* Home Button */}
                <Link
                    to="/"
                    className="flex-shrink-0 px-6 py-2 bg-yellow-500 hover:bg-yellow-400 text-white font-bold rounded-xl transition-colors flex items-center gap-2 shadow-lg shadow-yellow-500/20"
                >
                    <i className="fas fa-home"></i>
                    <span>首頁</span>
                </Link>

                {/* Tags */}
                {visibleTags.map(tag => (
                    <Link
                        key={tag}
                        to={`/tags/${tag}`}
                        className="flex-shrink-0 px-5 py-2 bg-[#1e1e1e] hover:bg-blue-600 border border-gray-800 hover:border-blue-500 text-gray-300 hover:text-white rounded-xl transition-all duration-300 whitespace-nowrap"
                    >
                        <span className="opacity-50 mr-1">#</span>
                        {tag}
                    </Link>
                ))}

                {/* More Button */}
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
