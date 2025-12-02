import { useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
import { motion } from 'framer-motion';

const Changelog = () => {
    // Mock data for changelog - in a real app this could come from Firebase
    const changelogs = [
        {
            version: "v1.3.0",
            date: "2025-12-03",
            title: "Essay & Admin Features",
            content: (
                <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Essay Page:</strong> New public page for "Short Thoughts" with masonry grid.</li>
                    <li><strong>Admin Essay Management:</strong> Tab switcher to view, edit, and delete essays.</li>
                    <li><strong>Admin Quick Publish:</strong> Quickly publish essays from the dashboard header.</li>
                    <li><strong>Deployment:</strong> Successfully deployed to Firebase Hosting.</li>
                    <li><strong>Hero Section:</strong> Refined vertical scrolling animation with random speeds.</li>
                    <li><strong>Navigation:</strong> Added "Essay" link to the main menu.</li>
                </ul>
            ),
            type: "feature"
        },
        {
            version: "v1.2.0",
            date: "2025-01-15",
            title: "LiquidGlass Design Update",
            content: "Implemented the new global LiquidGlass design engine, bringing a premium glassmorphism aesthetic to the entire site. Updated the sidebar with real-time data visualization.",
            type: "major"
        },
        {
            version: "v1.1.5",
            date: "2025-01-10",
            title: "Performance Optimizations",
            content: "Improved page load speeds by 40% through code splitting and image optimization. Fixed layout shifts on mobile devices.",
            type: "improvement"
        },
        {
            version: "v1.1.0",
            date: "2025-01-01",
            title: "New Year, New Features",
            content: "Added the 'About' page with a Bento Grid layout. Introduced the interactive 'PixelBackground' for the homepage.",
            type: "feature"
        },
        {
            version: "v1.0.0",
            date: "2024-12-25",
            title: "Initial Launch",
            content: "Official release of the blog system. Features include Markdown support, dark mode, and responsive design.",
            type: "release"
        }
    ];

    return (
        <MainLayout>
            <div className="min-h-screen pt-24 pb-12 px-4 container mx-auto max-w-4xl">
                <div className="text-center mb-16 animate-fade-in">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        更新日誌
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        記錄我們成長的每一步
                    </p>
                </div>

                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-transparent opacity-30 transform -translate-x-1/2"></div>

                    <div className="space-y-12">
                        {changelogs.map((log, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className={`flex flex-col md:flex-row gap-8 items-start relative ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                            >
                                {/* Date Bubble (Center) */}
                                <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-500 rounded-full border-4 border-white dark:border-gray-900 z-10 mt-6 shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>

                                {/* Content Card */}
                                <div className="w-full md:w-[calc(50%-2rem)] pl-16 md:pl-0">
                                    <div className="liquid-glass p-6 hover:scale-[1.02] transition-transform duration-300 group relative overflow-hidden">
                                        {/* Decorative Gradient Blob */}
                                        <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500
                                            ${log.type === 'major' ? 'from-blue-500 to-purple-500' :
                                                log.type === 'feature' ? 'from-green-500 to-teal-500' :
                                                    log.type === 'improvement' ? 'from-orange-500 to-yellow-500' : 'from-gray-500 to-gray-300'}`}
                                        ></div>

                                        <div className="relative z-10">
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                                                    ${log.type === 'major' ? 'bg-blue-500/20 text-blue-500' :
                                                        log.type === 'feature' ? 'bg-green-500/20 text-green-500' :
                                                            log.type === 'improvement' ? 'bg-orange-500/20 text-orange-500' : 'bg-gray-500/20 text-gray-400'}`}
                                                >
                                                    {log.version}
                                                </span>
                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                    {log.date}
                                                </span>
                                            </div>
                                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-400 transition-colors">
                                                {log.title}
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                                {log.content}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Empty space for the other side of the timeline */}
                                <div className="hidden md:block w-[calc(50%-2rem)]"></div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Changelog;
