import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import SearchModal from './SearchModal';

const ScrollIndicator = ({ progress }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.button
            key="percentage"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-[#60a5fa] text-gray-300 hover:text-white flex items-center justify-center transition-all duration-300"
        >
            {isHovered ? (
                <i className="fas fa-arrow-up text-xs"></i>
            ) : (
                <span className="text-[10px] font-medium">
                    {Math.round(progress)}
                </span>
            )}
        </motion.button>
    );
};

const Navbar = ({ toggleSidebar }) => {
    const [scrolled, setScrolled] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const { isDark, toggleTheme } = useTheme();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            let progress = 0;
            if (totalHeight > 0) {
                progress = Math.min(100, Math.max(0, (currentScrollY / totalHeight) * 100));
            }

            setScrollProgress(progress);
            setScrolled(currentScrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Search State
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    // Handle Ctrl+K to open search
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsSearchOpen(true);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Random Post Logic
    const navigate = useNavigate();
    const handleRandomPost = async () => {
        try {
            const q = query(collection(db, 'posts'), where('status', '==', 'published'));
            const querySnapshot = await getDocs(q);
            const posts = querySnapshot.docs.map(doc => doc.data());

            if (posts.length > 0) {
                const randomPost = posts[Math.floor(Math.random() * posts.length)];
                navigate(`/posts/${randomPost.slug}`);
            }
        } catch (error) {
            console.error("Error fetching random post:", error);
        }
    };

    const navClass = clsx(
        'fixed top-0 w-full z-50 transition-all duration-300 ease-in-out px-4 lg:px-8 py-3',
        'bg-black/80 backdrop-blur-md text-gray-300 border-b border-white/10'
    );

    // Helper for active link
    const isActive = (path) => location.pathname === path;

    // Link Item Component
    const NavItem = ({ to, icon, label }) => (
        <Link
            to={to}
            className={clsx(
                'relative px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-2 group',
                {
                    'text-blue-400': isActive(to),
                    'text-gray-400 hover:bg-[#60a5fa] hover:text-white hover:shadow-lg hover:shadow-blue-500/20': !isActive(to),
                }
            )}
        >
            <i className={clsx(icon, 'text-sm transition-transform group-hover:scale-110')}></i>
            <span className="font-medium text-sm">{label}</span>
        </Link>
    );

    return (
        <>
            <nav className={navClass}>
                <div className="max-w-7xl mx-auto flex justify-between items-center h-10">
                    {/* Left: Logo / Name */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleSidebar}
                            className="lg:hidden text-lg hover:scale-110 transition-transform p-2"
                        >
                            <i className="fas fa-bars"></i>
                        </button>
                        <Link to="/" className="text-xl font-bold tracking-wider hover:opacity-80 transition-opacity font-display flex items-center gap-2 text-white">
                            <span className="hidden sm:inline">DreamersAudio博客</span>
                            <span className="sm:hidden">Blog</span>
                        </Link>
                    </div>

                    {/* Center: Navigation Links (Desktop) */}
                    <div className="hidden lg:flex items-center gap-2 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <NavItem to="/" icon="fas fa-home" label="首頁" />

                        {/* Library Dropdown */}
                        <div className="relative group">
                            <button className={clsx(
                                'relative px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-2 text-gray-400 hover:bg-[#60a5fa] hover:text-white hover:shadow-lg hover:shadow-blue-500/20'
                            )}>
                                <i className="fas fa-book text-sm"></i>
                                <span className="font-medium text-sm">文庫</span>
                                <i className="fas fa-chevron-down text-xs opacity-70 group-hover:rotate-180 transition-transform"></i>
                            </button>

                            {/* Horizontal Dropdown Menu */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                                <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-2 flex items-center gap-2 shadow-2xl whitespace-nowrap">
                                    <Link to="/archives" className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-400 hover:bg-[#60a5fa] hover:text-white transition-all duration-300">
                                        <i className="fas fa-archive"></i>
                                        <span className="text-sm font-medium">全部文章</span>
                                    </Link>
                                    <Link to="/categories" className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-400 hover:bg-[#60a5fa] hover:text-white transition-all duration-300">
                                        <i className="fas fa-th-large"></i>
                                        <span className="text-sm font-medium">分類列表</span>
                                    </Link>
                                    <Link to="/tags" className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-400 hover:bg-[#60a5fa] hover:text-white transition-all duration-300">
                                        <i className="fas fa-tags"></i>
                                        <span className="text-sm font-medium">標籤列表</span>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <NavItem to="/changelog" icon="fas fa-history" label="更新日誌" />

                        {/* My Dropdown */}
                        <div className="relative group">
                            <button className={clsx(
                                'relative px-6 py-1.5 rounded-full transition-all duration-300 flex items-center gap-2 text-gray-400 hover:bg-[#60a5fa] hover:text-white hover:shadow-lg hover:shadow-blue-500/20'
                            )}>
                                <i className="fas fa-user text-sm"></i>
                                <span className="font-medium text-sm">作者空間</span>
                            </button>

                            {/* Horizontal Dropdown Menu */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                                <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-2 flex items-center gap-2 shadow-2xl whitespace-nowrap">
                                    <button onClick={handleRandomPost} className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-400 hover:bg-[#60a5fa] hover:text-white transition-all duration-300">
                                        <i className="fas fa-shoe-prints"></i>
                                        <span className="text-sm font-medium">隨便逛逛</span>
                                    </button>
                                    <Link to="/about" className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-400 hover:bg-[#60a5fa] hover:text-white transition-all duration-300">
                                        <i className="fas fa-paper-plane"></i>
                                        <span className="text-sm font-medium">關於本站</span>
                                    </Link>
                                    <Link to="/equipment" className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-400 hover:bg-[#60a5fa] hover:text-white transition-all duration-300">
                                        <i className="fas fa-shapes"></i>
                                        <span className="text-sm font-medium">我的裝備</span>
                                    </Link>
                                    <Link to="/essay" className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-400 hover:bg-[#60a5fa] hover:text-white transition-all duration-300">
                                        <i className="fas fa-pen-fancy"></i>
                                        <span className="text-sm font-medium">短文</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-3">
                        {/* Search Button */}
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className={clsx(
                                "p-2 rounded-full transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                            )}
                        >
                            <i className="fas fa-search text-sm"></i>
                        </button>

                        {/* Dark Mode Toggle */}
                        <button
                            onClick={toggleTheme}
                            className={clsx(
                                "p-2 rounded-full transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:rotate-12"
                            )}
                        >
                            <i className={clsx("fas", isDark ? "fa-sun" : "fa-moon", "text-sm")}></i>
                        </button>

                        {/* Scroll Indicator / Back to Top */}
                        <AnimatePresence mode="wait">
                            {Math.round(scrollProgress) > 1 && (
                                <motion.div
                                    initial={{ width: 0, opacity: 0, marginLeft: 0 }}
                                    animate={{ width: "auto", opacity: 1, marginLeft: 12 }}
                                    exit={{ width: 0, opacity: 0, marginLeft: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="overflow-hidden flex items-center justify-end"
                                >
                                    {Math.round(scrollProgress) >= 99 ? (
                                        <motion.button
                                            key="backToTop"
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            exit={{ y: 20, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                            className="px-4 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-medium flex items-center gap-2 whitespace-nowrap"
                                        >
                                            <i className="fas fa-arrow-up"></i>
                                            <span>返回頂部</span>
                                        </motion.button>
                                    ) : (
                                        <ScrollIndicator progress={scrollProgress} />
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div >
            </nav >

            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
};

export default Navbar;
