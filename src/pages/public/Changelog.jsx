import { useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
import { motion } from 'framer-motion';
import SpotlightCard from '../../components/SpotlightCard';

const Changelog = () => {
    // Mock data for changelog - in a real app this could come from Firebase
    const changelogs = [
        {
            version: "v1.6.1",
            date: "2025-12-07",
            title: "TOC Polish & AI Upgrade",
            content: (
                <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>TOC Refinement:</strong> Implemented adaptive height, "Smart Blur" reveal logic, and hidden scrollbars for a cleaner reading experience.</li>
                    <li><strong>Gemini AI 2.0:</strong> Upgraded to `flash-lite` model and redesigned the AI trigger button with a modern "Dark Pill" aesthetic.</li>
                    <li><strong>System Polish:</strong> Renamed categories and fixed markdown rendering warnings.</li>
                </ul>
            ),
            type: "improvement"
        },
        {
            version: "v1.6.0",
            date: "2025-12-07",
            title: "Mobile & Visual Evolution",
            content: (
                <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Mobile Menu Redesign:</strong> "Dynamic Island" style top-down menu with smooth spring animations.</li>
                    <li><strong>Profile Card 2.0:</strong> Replaced flip animation with a refined "Breathe & Fade" effect and added signature GIF.</li>
                    <li><strong>Line Card Polish:</strong> Enhanced visuals with enlarged logo and blurred watermark (removed green background).</li>
                    <li><strong>Mobile UX:</strong> Implemented scrollable tag bar and optimized spacing for small screens.</li>
                </ul>
            ),
            type: "major"
        },
        {
            version: "v1.5.1",
            date: "2025-12-06",
            title: "Visual & Performance Polish",
            content: (
                <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Article Banner:</strong> Redesigned with glassmorphic badges, large typography, and interactive metadata tooltips.</li>
                    <li><strong>Footer Redesign:</strong> Compact layout with avatar, status indicators, and quick links.</li>
                    <li><strong>Loading Optimization:</strong> Smart caching to skip loading screens when switching between Tag pages.</li>
                </ul>
            ),
            type: "improvement"
        },
        {
            version: "v1.5.0",
            date: "2025-12-04",
            title: "Mac-style Widgets & Essay Redesign",
            content: (
                <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Mac-style Widgets:</strong> Added Clock, Battery, Weather, and Photo widgets with liquid glass aesthetics to the Homepage.</li>
                    <li><strong>Essay Page Redesign:</strong> Unified banner design with Equipment page and refreshed card styling.</li>
                    <li><strong>Visitor Statistics:</strong> Implemented real-time visitor tracking and a 3D flip card on the About page.</li>
                    <li><strong>Homepage Layout:</strong> Centered widgets and optimized spacing for a balanced look.</li>
                </ul>
            ),
            type: "feature"
        },
        {
            version: "v1.4.1",
            date: "2025-12-04",
            title: "UX Refinements",
            content: (
                <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Navbar Update:</strong> Moved "Short Article" (Essay) button to the main navigation bar for better accessibility.</li>
                    <li><strong>Layout Fixes:</strong> Resolved layout issues in the Essay notification card on the dashboard.</li>
                    <li><strong>Visual Polish:</strong> Enhanced spotlight effects across all interactive cards.</li>
                </ul>
            ),
            type: "improvement"
        },
        {
            version: "v1.4.0",
            date: "2025-12-04",
            title: "Global UI Upgrade & Comments",
            content: (
                <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Comment System:</strong> Full comment functionality for Posts and Essays with Admin management.</li>
                    <li><strong>Global UI Upgrade:</strong> Unified semantic color system and refactored Navbar for consistent theming.</li>
                    <li><strong>Sidebar Enhancements:</strong> Redesigned Profile Card (3D tilt), Line Social Card (Flip), and optimized charts.</li>
                    <li><strong>Visual Refinements:</strong> Updated homepage text to "音響設計之家" and refined animations.</li>
                </ul>
            ),
            type: "feature"
        },
        {
            version: "v1.3.5",
            date: "2025-12-03",
            title: "Category & Theme Refinement",
            content: (
                <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Category System:</strong> Added functional category filtering with animations on Home page.</li>
                    <li><strong>Global Theme:</strong> Unified site-wide blue color to #709CEF.</li>
                    <li><strong>Dashboard:</strong> Refined trend chart (sequence-based) and connected notification bar to latest essay.</li>
                    <li><strong>Social Card:</strong> Updated Sidebar to feature Line official account.</li>
                </ul>
            ),
            type: "feature"
        },
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
                                    <SpotlightCard
                                        className="p-6 hover:scale-[1.02] transition-transform duration-300 group relative overflow-hidden"
                                        spotlightColor="rgba(112, 156, 239, 0.15)"
                                    >
                                        {/* Decorative Gradient Blob */}
                                        <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500
                                            ${log.type === 'major' ? 'from-blue-500 to-purple-500' :
                                                log.type === 'feature' ? 'from-green-500 to-teal-500' :
                                                    log.type === 'improvement' ? 'from-orange-500 to-yellow-500' : 'from-gray-500 to-gray-300'}`}
                                        ></div>

                                        <div className="relative z-10">
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                                                    ${log.type === 'major' ? 'bg-blue-500/20 text-[#709CEF]' :
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
                                            <div className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                                {log.content}
                                            </div>
                                        </div>
                                    </SpotlightCard>
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
