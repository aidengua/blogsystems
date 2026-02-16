import { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { navigationGroups } from '../config/navigation';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase';
import MobileMenu from '../components/MobileMenu';
import CategoryModal from '../components/CategoryModal';

const MainLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [menuOrigin, setMenuOrigin] = useState({ x: 0, y: 0 });
    const location = useLocation();
    const isAdmin = location.pathname.startsWith('/admin');

    const handleToggleSidebar = (e) => {
        if (e && e.currentTarget) {
            const rect = e.currentTarget.getBoundingClientRect();
            setMenuOrigin({
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2
            });
        }
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleOpenCategoryModal = () => {
        setIsSidebarOpen(false); // Close mobile menu if open
        setIsCategoryModalOpen(true);
    };

    return (
        <div className="min-h-screen flex flex-col relative">
            {/* Background Decoration */}
            <div className="fixed inset-0 pointer-events-none z-0">

            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
                {!isAdmin && <Navbar toggleSidebar={handleToggleSidebar} onOpenCategoryModal={handleOpenCategoryModal} />}

                <main className="flex-grow w-full">
                    {children}
                </main>

                <Footer />

                {/* Mobile Menu Overlay */}
                <MobileMenu
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    origin={menuOrigin}
                    onOpenCategoryModal={handleOpenCategoryModal}
                />

                {/* Category Modal */}
                <CategoryModal
                    isOpen={isCategoryModalOpen}
                    onClose={() => setIsCategoryModalOpen(false)}
                />
            </div>
        </div>
    );
};

export default MainLayout;
