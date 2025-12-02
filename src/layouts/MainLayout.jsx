import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import PixelBackground from '../components/PixelBackground';
import { motion, AnimatePresence } from 'framer-motion';

const MainLayout = ({ children, showSidebar = true }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);


    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden">
            {/* Background Decoration */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <PixelBackground />
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
                <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

                <main className="flex-grow w-full">
                    {children}
                </main>

                <Footer />



                {/* Mobile Sidebar Overlay */}
                <AnimatePresence>
                    {isSidebarOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsSidebarOpen(false)}
                                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                            />
                            <motion.div
                                initial={{ x: '100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '100%' }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                className="fixed right-0 top-0 h-full w-64 bg-white dark:bg-gray-900 shadow-2xl z-50 lg:hidden"
                            >
                                <Sidebar mobile={true} close={() => setIsSidebarOpen(false)} />
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default MainLayout;
