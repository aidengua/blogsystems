import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useSettings } from '../context/SettingsContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import clsx from 'clsx';

const ContextMenu = () => {
    const [visible, setVisible] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const menuRef = useRef(null);
    const navigate = useNavigate();
    const { isDark, toggleTheme } = useTheme();
    const { customContextMenuEnabled } = useSettings();

    useEffect(() => {
        const handleContextMenu = (e) => {
            if (!customContextMenuEnabled) return;
            e.preventDefault();

            // Calculate position to keep menu within viewport
            let x = e.clientX;
            let y = e.clientY;

            const menuWidth = 160; // Approximate width (w-40 is 10rem = 160px)
            const menuHeight = 320; // Approximate height

            if (x + menuWidth > window.innerWidth) {
                x = window.innerWidth - menuWidth - 20;
            }

            if (y + menuHeight > window.innerHeight) {
                y = window.innerHeight - menuHeight - 20;
            }

            setPosition({ x, y });
            setVisible(true);
        };

        const handleClick = () => setVisible(false);
        const handleScroll = () => setVisible(false);

        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('click', handleClick);
        document.addEventListener('scroll', handleScroll);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('click', handleClick);
            document.removeEventListener('scroll', handleScroll);
        };
    }, [customContextMenuEnabled]);

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
        setVisible(false);
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        setVisible(false);
    };

    const MenuItem = ({ icon, label, onClick, className }) => (
        <button
            onClick={onClick}
            className={clsx(
                "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors group",
                "hover:bg-white/10",
                className
            )}
        >
            <i className={clsx(icon, "w-5 text-center text-gray-400 group-hover:text-white transition-colors")}></i>
            <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">{label}</span>
        </button>
    );

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    ref={menuRef}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.1 }}
                    style={{ top: position.y, left: position.x }}
                    className="fixed z-50 w-40 bg-[#1a1a1a]/80 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden py-1"
                >
                    {/* Top Navigation Bar */}
                    <div className="flex items-center justify-between px-2 py-2 border-b border-white/10 mb-1">
                        <button onClick={() => window.history.back()} className="p-1.5 hover:bg-white/10 rounded-md text-gray-400 hover:text-white transition-colors">
                            <i className="fas fa-arrow-left text-xs"></i>
                        </button>
                        <button onClick={() => window.history.forward()} className="p-1.5 hover:bg-white/10 rounded-md text-gray-400 hover:text-white transition-colors">
                            <i className="fas fa-arrow-right text-xs"></i>
                        </button>
                        <button onClick={() => window.location.reload()} className="p-1.5 hover:bg-white/10 rounded-md text-gray-400 hover:text-white transition-colors">
                            <i className="fas fa-redo text-xs"></i>
                        </button>
                        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="p-1.5 hover:bg-white/10 rounded-md text-gray-400 hover:text-white transition-colors">
                            <i className="fas fa-arrow-up text-xs"></i>
                        </button>
                    </div>

                    {/* Menu Items */}
                    <MenuItem
                        icon="fas fa-random"
                        label="隨便逛逛"
                        onClick={handleRandomPost}
                    />

                    <MenuItem
                        icon="fas fa-th-large"
                        label="博客分類"
                        onClick={() => { navigate('/categories'); setVisible(false); }}
                    />

                    <MenuItem
                        icon="fas fa-tags"
                        label="文章標籤"
                        onClick={() => { navigate('/tags'); setVisible(false); }}
                    />

                    <div className="my-1 border-t border-white/10"></div>

                    <MenuItem
                        icon="fas fa-copy"
                        label="複製地址"
                        onClick={handleCopyLink}
                    />

                    <MenuItem
                        icon={isDark ? "fas fa-sun" : "fas fa-moon"}
                        label={isDark ? "淺色模式" : "深色模式"}
                        onClick={() => { toggleTheme(); setVisible(false); }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ContextMenu;
