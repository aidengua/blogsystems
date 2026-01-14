import { useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
import { motion, AnimatePresence } from 'framer-motion';
import LazyImage from '../../components/LazyImage';
import changelogs from '../../data/changelogs';
import clsx from 'clsx';

const Changelog = () => {
    // Default expand the first version
    const [expandedVersion, setExpandedVersion] = useState(changelogs[0]?.version);

    const toggleExpand = (version) => {
        setExpandedVersion(expandedVersion === version ? null : version);
    };

    const getIconForType = (type) => {
        switch (type) {
            case 'added': return 'fa-plus-circle';
            case 'fixed': return 'fa-wrench';
            case 'changed': return 'fa-pencil-alt';
            case 'removed': return 'fa-trash-alt';
            case 'major': return 'fa-star';
            default: return 'fa-circle';
        }
    };

    const getColorForType = (type) => {
        switch (type) {
            case 'added': return 'text-emerald-600 dark:text-emerald-400';
            case 'fixed': return 'text-orange-600 dark:text-orange-400';
            case 'changed': return 'text-blue-600 dark:text-blue-400';
            case 'removed': return 'text-red-600 dark:text-red-400';
            case 'major': return 'text-yellow-600 dark:text-yellow-400';
            default: return 'text-gray-500 dark:text-gray-400';
        }
    };

    const getBgForType = (type) => {
        switch (type) {
            case 'added': return 'bg-emerald-500/10';
            case 'fixed': return 'bg-orange-500/10';
            case 'changed': return 'bg-blue-500/10';
            case 'removed': return 'bg-red-500/10';
            default: return 'bg-gray-100 dark:bg-white/5';
        }
    };

    return (
        <MainLayout>
            <div className="min-h-screen pt-24 pb-12 px-4 container mx-auto max-w-7xl">
                {/* Hero Section */}
                <div className="relative h-[240px] md:h-[320px] w-full rounded-[40px] overflow-hidden mb-16 group shadow-2xl">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="w-full h-full transition-transform duration-1000 ease-out group-hover:scale-105">
                            <LazyImage
                                src="https://cloud.dragoncode.dev/f/DRJi3/street.gif"
                                alt="Changelog Hero"
                                className="w-full h-full object-cover blur-[2px]"
                                wrapperClassName="w-full h-full"
                            />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent pointer-events-none"></div>
                    </div>

                    <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-16">
                        <div className="max-w-2xl animate-slide-right">
                            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                                更新日誌
                            </h1>
                            <p className="text-lg md:text-xl text-gray-300 font-light flex items-center gap-2">
                                記錄我們產品成長的每一個腳印
                            </p>
                        </div>
                    </div>
                </div>

                {/* Changelog List */}
                <div className="space-y-4">
                    {changelogs.map((log, index) => {
                        const isExpanded = expandedVersion === log.version;

                        return (
                            <motion.div
                                key={log.version}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={clsx(
                                    "rounded-2xl border transition-all duration-300 overflow-hidden",
                                    isExpanded
                                        ? "bg-white dark:bg-[#1d1e22] border-blue-500/50 shadow-[0_0_20px_rgba(112,156,239,0.15)]"
                                        : "bg-white dark:bg-[#1d1e22]/60 border-gray-200 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/10 hover:bg-white dark:hover:bg-[#1d1e22]"
                                )}
                            >
                                {/* Header / Trigger */}
                                <div
                                    onClick={() => toggleExpand(log.version)}
                                    className="p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={clsx(
                                            "w-12 h-12 rounded-xl flex items-center justify-center text-lg shadow-inner transition-colors duration-300",
                                            isExpanded ? "bg-[#709CEF] text-white" : "bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white group-hover:bg-gray-200 dark:group-hover:bg-white/10"
                                        )}>
                                            <i className={clsx("fas", log.type === 'major' ? 'fa-rocket' : 'fa-code-branch')}></i>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className={clsx(
                                                    "text-xl font-bold transition-colors",
                                                    isExpanded ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white"
                                                )}>
                                                    {log.version}
                                                </h3>
                                                <span className="text-sm font-mono text-gray-500 bg-gray-100 dark:bg-black/20 px-2 py-0.5 rounded">
                                                    {log.date}
                                                </span>
                                            </div>
                                            <h4 className="text-gray-500 dark:text-gray-400 group-hover:text-[#709CEF] transition-colors font-medium">
                                                {log.title}
                                            </h4>
                                        </div>
                                    </div>

                                    <div className={clsx(
                                        "w-8 h-8 flex items-center justify-center rounded-full transition-transform duration-300 border border-transparent",
                                        isExpanded ? "rotate-180 bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white" : "text-gray-400 dark:text-gray-500 group-hover:border-gray-200 dark:group-hover:border-white/10"
                                    )}>
                                        <i className="fas fa-chevron-down"></i>
                                    </div>
                                </div>

                                {/* Expanded Content */}
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                        >
                                            <div className="px-6 pb-6 pt-0 border-t border-gray-100 dark:border-white/5">
                                                <div className="pt-6 grid gap-3">
                                                    {log.changes.map((change, i) => (
                                                        <motion.div
                                                            key={i}
                                                            initial={{ x: -10, opacity: 0 }}
                                                            animate={{ x: 0, opacity: 1 }}
                                                            transition={{ delay: i * 0.05 }}
                                                            className="flex gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group/item"
                                                        >
                                                            <div className={clsx(
                                                                "mt-1 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                                                                getBgForType(change.type)
                                                            )}>
                                                                <i className={clsx(
                                                                    "fas",
                                                                    getIconForType(change.type),
                                                                    getColorForType(change.type)
                                                                )}></i>
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm md:text-base group-hover/item:text-gray-900 dark:group-hover/item:text-white transition-colors">
                                                                    {change.text}
                                                                </p>
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </MainLayout>
    );
};

export default Changelog;
