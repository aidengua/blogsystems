import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase';
import clsx from 'clsx';
import SearchModal from './SearchModal';

const Navbar = ({ toggleSidebar }) => {
    const [scrolled, setScrolled] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const { isDark, toggleTheme } = useTheme();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (currentScrollY / totalHeight) * 100;

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
        {
            'bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl shadow-lg': scrolled,
            'bg-transparent': !scrolled,
            'text-gray-800 dark:text-gray-100': scrolled,
            'text-gray-800 dark:text-white': !scrolled && location.pathname !== '/', // Default text color
            'text-white': !scrolled && location.pathname === '/', // White text on home banner
        }
    );

    // Helper for active link
    const isActive = (path) => location.pathname === path;

    // Link Item Component
    const NavItem = ({ to, icon, label }) => (
        <Link
            to={to}
            className={clsx(
                'relative px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-2 group overflow-hidden',
                {
                    'text-blue-500 bg-blue-50 dark:bg-blue-900/20': isActive(to) && scrolled,
                    'text-white bg-white/20': isActive(to) && !scrolled && location.pathname === '/',
                    'hover:bg-gray-100 dark:hover:bg-gray-800': scrolled && !isActive(to),
                    'hover:bg-white/10': !scrolled && !isActive(to) && location.pathname === '/',
                }
            )}
        >
            <i className={clsx(icon, 'text-sm transition-transform group-hover:scale-110')}></i>
            <span className="font-medium text-sm">{label}</span>
            {/* Hover Effect Pill */}
            {!isActive(to) && (
                <span className="absolute inset-0 rounded-full bg-current opacity-0 group-hover:opacity-5 transition-opacity"></span>
            )}
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
                        <Link to="/" className="text-xl font-bold tracking-wider hover:opacity-80 transition-opacity font-display flex items-center gap-2">
                            <span className="hidden sm:inline">Anzhiyu</span>
                            <span className="sm:hidden">Blog</span>
                        </Link>
                    </div>

                    {/* Center: Navigation Links (Desktop) */}
                    <div className="hidden lg:flex items-center gap-2 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <NavItem to="/" icon="fas fa-home" label="首頁" />

                        {/* Library Dropdown */}
                        <div className="relative group">
                            <button className={clsx(
                                'relative px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-2 group-hover:bg-yellow-500 group-hover:text-black',
                                {
                                    'text-gray-800 dark:text-gray-100': scrolled,
                                    'text-white': !scrolled && location.pathname === '/',
                                    'text-gray-800 dark:text-white': !scrolled && location.pathname !== '/',
                                }
                            )}>
                                <i className="fas fa-book text-sm"></i>
                                <span className="font-medium text-sm">文庫</span>
                                <i className="fas fa-chevron-down text-xs opacity-70 group-hover:rotate-180 transition-transform"></i>
                            </button>

                            {/* Horizontal Dropdown Menu */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                                <div className="bg-gray-900 border border-yellow-500 rounded-full px-6 py-3 flex items-center gap-6 shadow-xl whitespace-nowrap">
                                    <Link to="/archives" className="flex items-center gap-2 text-white hover:text-yellow-500 transition-colors">
                                        <i className="fas fa-archive"></i>
                                        <span className="text-sm font-medium">全部文章</span>
                                    </Link>
                                    <Link to="/archives" className="flex items-center gap-2 text-white hover:text-yellow-500 transition-colors">
                                        <i className="fas fa-th-large"></i>
                                        <span className="text-sm font-medium">分類列表</span>
                                    </Link>
                                    <Link to="/tags" className="flex items-center gap-2 text-white hover:text-yellow-500 transition-colors">
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
                                'relative px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-2 group-hover:bg-yellow-500 group-hover:text-black',
                                {
                                    'text-gray-800 dark:text-gray-100': scrolled,
                                    'text-white': !scrolled && location.pathname === '/',
                                    'text-gray-800 dark:text-white': !scrolled && location.pathname !== '/',
                                }
                            )}>
                                <i className="fas fa-user text-sm"></i>
                                <span className="font-medium text-sm">我的</span>
                                <i className="fas fa-chevron-down text-xs opacity-70 group-hover:rotate-180 transition-transform"></i>
                            </button>

                            {/* Horizontal Dropdown Menu */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                                <div className="bg-gray-900 border border-yellow-500 rounded-full px-6 py-3 flex items-center gap-6 shadow-xl whitespace-nowrap">
                                    <button onClick={handleRandomPost} className="flex items-center gap-2 text-white hover:text-yellow-500 transition-colors">
                                        <i className="fas fa-shoe-prints"></i>
                                        <span className="text-sm font-medium">隨便逛逛</span>
                                    </button>
                                    <Link to="/about" className="flex items-center gap-2 text-white hover:text-yellow-500 transition-colors">
                                        <i className="fas fa-paper-plane"></i>
                                        <span className="text-sm font-medium">關於本站</span>
                                    </Link>
                                    <Link to="/equipment" className="flex items-center gap-2 text-white hover:text-yellow-500 transition-colors">
                                        <i className="fas fa-shapes"></i>
                                        <span className="text-sm font-medium">我的裝備</span>
                                    </Link>
                                    <Link to="/essay" className="flex items-center gap-2 text-white hover:text-yellow-500 transition-colors">
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
                                "p-2 rounded-full transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                                { "hover:bg-white/10": !scrolled && location.pathname === '/' }
                            )}
                        >
                            <i className="fas fa-search text-sm"></i>
                        </button>

                        {/* Dark Mode Toggle */}
                        <button
                            onClick={toggleTheme}
                            className={clsx(
                                "p-2 rounded-full transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:rotate-12",
                                { "hover:bg-white/10": !scrolled && location.pathname === '/' }
                            )}
                        >
                            <i className={clsx("fas", isDark ? "fa-sun" : "fa-moon", "text-sm")}></i>
                        </button>

                        {/* Scroll Indicator / Back to Top */}
                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className={clsx(
                                "w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800 group",
                                {
                                    "opacity-0 pointer-events-none translate-y-4": scrollProgress <= 1,
                                    "opacity-100 translate-y-0": scrollProgress > 1,
                                    "hover:bg-white/10": !scrolled && location.pathname === '/' && scrollProgress > 1,
                                    "text-blue-500": scrollProgress > 98
                                }
                            )}
                        >
                            <span className={clsx(
                                "absolute transition-all duration-300 font-bold text-xs",
                                {
                                    "opacity-100 scale-100": scrollProgress <= 98,
                                    "opacity-0 scale-50": scrollProgress > 98
                                }
                            )}>
                                {Math.round(scrollProgress)}
                            </span>
                            <i className={clsx(
                                "fas fa-arrow-up text-sm transition-all duration-300 absolute",
                                {
                                    "opacity-0 scale-50 rotate-180": scrollProgress <= 98,
                                    "opacity-100 scale-100 rotate-0": scrollProgress > 98
                                }
                            )}></i>
                        </button>
                    </div>
                </div>
            </nav>

            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
};

export default Navbar;
