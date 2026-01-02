import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import SearchModal from './SearchModal';
import ControlCenterModal from './ControlCenterModal';
import { libraryLinks, creationLinks, authorLinks } from '../config/navigation';

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
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/20 hover:bg-[#60a5fa] text-gray-600 dark:text-gray-300 hover:text-white flex items-center justify-center transition-all duration-300 !shrink-0 !grow-0 !w-8 !max-w-[2rem]"
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
    const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);

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
        'fixed top-0 w-full z-50 transition-all duration-500 ease-in-out px-4 lg:px-8 py-3 border-b',
        {
            'bg-transparent border-transparent': scrolled,
            'bg-white/80 dark:bg-black/80 border-gray-200 dark:border-white/10': !scrolled
        }
    );

    const capsuleClass = clsx(
        'transition-all duration-500 ease-in-out flex items-center border',
        {
            'bg-white/80 dark:bg-black/80 rounded-full shadow-lg border-gray-200 dark:border-white/20 px-4 py-1': scrolled,
            'bg-transparent border-transparent': !scrolled
        }
    );

    // Helper for active link
    const isActive = (path) => location.pathname === path;

    // Link Item Component
    const NavItem = ({ to, label }) => (
        <Link
            to={to}
            className={clsx(
                'relative px-4 py-2 rounded-full transition-all duration-300 flex items-center justify-center gap-2 group',
                {
                    'text-gray-900 dark:text-white': isActive(to),
                    'text-gray-900 dark:text-white hover:bg-[#60a5fa] hover:text-white hover:shadow-lg hover:shadow-blue-500/20': !isActive(to),
                }
            )}
        >
            <span className="font-bold text-sm">{label}</span>
        </Link>
    );

    // Fluid Dropdown Component
    const FluidDropdown = ({ items }) => {
        const [hoveredIndex, setHoveredIndex] = useState(null);

        return (
            <div
                className="bg-white/90 dark:bg-black/80 border border-gray-200 dark:border-white/20 rounded-full p-2 flex items-center gap-2 shadow-2xl whitespace-nowrap"
                onMouseLeave={() => setHoveredIndex(null)}
            >
                {items.map((item, index) => {
                    const isHovered = hoveredIndex === index;
                    const isAnyHovered = hoveredIndex !== null;

                    return (
                        <motion.div
                            key={index}
                            layout
                            onHoverStart={() => setHoveredIndex(index)}
                            animate={{
                                scale: isHovered ? 1.1 : (isAnyHovered ? 0.95 : 1),
                                opacity: isAnyHovered && !isHovered ? 0.8 : 1
                            }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            className="relative"
                        >
                            {item.onClick ? (
                                <button
                                    onClick={item.onClick}
                                    className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-900 dark:text-white hover:text-white transition-colors"
                                >
                                    <span className="text-sm font-bold">{item.label}</span>
                                </button>
                            ) : (
                                <Link
                                    to={item.to}
                                    className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-900 dark:text-white hover:text-white transition-colors"
                                >
                                    <span className="text-sm font-bold">{item.label}</span>
                                </Link>
                            )}
                            {/* Active Background Pill */}
                            {isHovered && (
                                <motion.div
                                    layoutId="dropdown-pill"
                                    className="absolute inset-0 bg-[#60a5fa] rounded-full -z-10"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                />
                            )}
                        </motion.div>
                    );
                })}
            </div>
        );
    };

    return (
        <>
            <nav className={navClass}>
                <div className="max-w-7xl mx-auto flex justify-between items-center h-10 relative">
                    {/* Left: Logo / Name */}
                    <div className={clsx(capsuleClass, "gap-2 !p-1")}>
                        <button
                            onClick={toggleSidebar}
                            className="lg:hidden w-8 h-8 flex items-center justify-center text-gray-900 dark:text-white hover:scale-110 transition-transform"
                        >
                            <i className="fas fa-bars text-sm"></i>
                        </button>
                        <Link to="/" className="hidden sm:flex h-8 text-xl font-bold tracking-wider hover:opacity-80 transition-opacity font-display items-center gap-2 text-gray-900 dark:text-white px-2 leading-none">
                            <span>DreamersAudio博客</span>
                        </Link>
                    </div>

                    {/* Center: Navigation Links (Desktop) */}
                    <div className={clsx(
                        "hidden lg:flex items-center justify-center gap-2 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ease-in-out border",
                        {
                            'bg-white/80 dark:bg-black/80 rounded-full shadow-lg border-gray-200 dark:border-white/20 px-2 py-1': scrolled,
                            'bg-transparent border-transparent': !scrolled
                        }
                    )}>
                        <NavItem to="/" label="首頁" />

                        {/* Library Dropdown */}
                        <div className="relative group flex items-center">
                            <button className={clsx(
                                'relative px-4 py-2 rounded-full transition-all duration-300 flex items-center justify-center gap-2 text-gray-900 dark:text-white hover:bg-[#60a5fa] hover:text-white hover:shadow-lg hover:shadow-blue-500/20'
                            )}>
                                <span className="font-bold text-sm">文庫</span>
                                <i className="fas fa-chevron-down text-[10px] opacity-70 group-hover:rotate-180 transition-transform"></i>
                            </button>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                                <FluidDropdown items={libraryLinks} />
                            </div>
                        </div>

                        {/* Creation Dropdown (Grouped Changelog & Essay) */}
                        <div className="relative group flex items-center">
                            <button className={clsx(
                                'relative px-4 py-2 rounded-full transition-all duration-300 flex items-center justify-center gap-2 text-gray-900 dark:text-white hover:bg-[#60a5fa] hover:text-white hover:shadow-lg hover:shadow-blue-500/20'
                            )}>
                                <span className="font-bold text-sm">創作</span>
                                <i className="fas fa-chevron-down text-[10px] opacity-70 group-hover:rotate-180 transition-transform"></i>
                            </button>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                                <FluidDropdown items={creationLinks} />
                            </div>
                        </div>

                        {/* Author Dropdown */}
                        <div className="relative group flex items-center">
                            <button className={clsx(
                                'relative px-4 py-2 rounded-full transition-all duration-300 flex items-center justify-center gap-2 text-gray-900 dark:text-white hover:bg-[#60a5fa] hover:text-white hover:shadow-lg hover:shadow-blue-500/20'
                            )}>
                                <span className="font-bold text-sm">作者</span>
                                <i className="fas fa-chevron-down text-[10px] opacity-70 group-hover:rotate-180 transition-transform"></i>
                            </button>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2">
                                <FluidDropdown items={[
                                    { onClick: handleRandomPost, label: "隨便逛逛" },
                                    ...authorLinks
                                ]} />
                            </div>
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div
                        className={clsx(capsuleClass, "gap-3 !p-1 !gap-1 !transition-none")}
                    >
                        {/* Control Center Button */}
                        <button
                            onClick={() => setIsControlCenterOpen(true)}
                            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/20 hover:bg-[#60a5fa] text-gray-600 dark:text-gray-300 hover:text-white flex items-center justify-center transition-colors duration-300"
                        >
                            <i className="fas fa-th-large text-sm"></i>
                        </button>

                        {/* Search Button */}
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/20 hover:bg-[#60a5fa] text-gray-600 dark:text-gray-300 hover:text-white flex items-center justify-center transition-colors duration-300"
                        >
                            <i className="fas fa-search text-sm"></i>
                        </button>

                        {/* Dark Mode Toggle */}
                        <button
                            onClick={(e) => toggleTheme(e)}
                            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/20 hover:bg-[#60a5fa] text-gray-600 dark:text-gray-300 hover:text-white flex items-center justify-center transition-colors duration-300"
                        >
                            <i className={clsx("fas", isDark ? "fa-sun" : "fa-moon", "text-sm")}></i>
                        </button>

                        {/* Scroll Indicator / Back to Top */}
                        <AnimatePresence mode="wait">
                            {Math.round(scrollProgress) > 1 && (
                                <motion.div
                                    initial={{ width: 0, opacity: 0 }}
                                    animate={{ width: "auto", opacity: 1 }}
                                    exit={{ width: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="overflow-hidden flex items-center justify-end"
                                >
                                    <AnimatePresence mode="wait" initial={false}>
                                        {Math.round(scrollProgress) >= 99 ? (
                                            <motion.button
                                                key="backToTop"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                                className="h-8 px-4 rounded-full bg-gray-100 dark:bg-white/20 hover:bg-[#60a5fa] text-gray-600 dark:text-gray-300 hover:text-white text-xs font-medium flex items-center gap-2 whitespace-nowrap transition-colors duration-300"
                                            >
                                                <i className="fas fa-arrow-up"></i>
                                                <span>返回頂部</span>
                                            </motion.button>
                                        ) : (
                                            <ScrollIndicator key="indicator" progress={scrollProgress} />
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div >
            </nav >

            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
            <ControlCenterModal isOpen={isControlCenterOpen} onClose={() => setIsControlCenterOpen(false)} />
        </>
    );
};

export default Navbar;
