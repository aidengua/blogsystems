import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MobileMenu from '../components/MobileMenu';

const MainLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();
    const isAdmin = location.pathname.startsWith('/admin');

    return (
        <div className="min-h-screen flex flex-col relative">
            {/* Background Decoration */}
            <div className="fixed inset-0 pointer-events-none z-0">

            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
                {!isAdmin && <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />}

                <main className="flex-grow w-full">
                    {children}
                </main>

                <Footer />

                {/* Mobile Menu Overlay */}
                <MobileMenu isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            </div>
        </div>
    );
};

export default MainLayout;
