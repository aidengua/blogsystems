import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import MainLayout from '../../layouts/MainLayout';
import LazyImage from '../../components/LazyImage';

import CommentSection from '../../components/CommentSection';
import { motion, AnimatePresence } from 'framer-motion';

const Essay = () => {
    const [essays, setEssays] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeEssay, setActiveEssay] = useState(null);
    const commentSectionRef = useRef(null);

    useEffect(() => {
        const fetchEssays = async () => {
            try {
                const q = query(collection(db, 'essays'), orderBy('createdAt', 'desc'));
                const querySnapshot = await getDocs(q);
                const essaysData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    createdAt: doc.data().createdAt?.toDate()
                }));
                setEssays(essaysData);
            } catch (error) {
                console.error("Error fetching essays:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEssays();
    }, []);

    const handleOpenComments = (essay) => {
        setActiveEssay(essay);
        // Small timeout to allow render if needed, or just immediate scroll
        setTimeout(() => {
            commentSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: (index) => ({
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                delay: index * 0.1,
                type: "spring",
                stiffness: 100,
                damping: 15
            }
        })
    };

    return (
        <MainLayout>
            <div className="container mx-auto px-4 pt-24 pb-12 max-w-7xl">
                {/* Hero Section (Unified Design) */}
                <div className="relative h-[240px] md:h-[320px] w-full rounded-[40px] overflow-hidden mb-12 group shadow-2xl">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="w-full h-full transition-transform duration-1000 ease-out group-hover:scale-105">
                            <LazyImage
                                src="https://cloud.dragoncode.dev/f/Bg1c8/rain.gif"
                                alt="Essay Hero"
                                className="w-full h-full object-cover blur-[2px]"
                                wrapperClassName="w-full h-full"
                            />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent pointer-events-none"></div>
                    </div>

                    <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-16">
                        <div className="max-w-2xl animate-slide-right">

                            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                                日常生活
                            </h1>
                            <p className="text-lg md:text-xl text-gray-300 font-light flex items-center gap-2">
                                隨時隨地，分享生活；<span className="font-bold text-white">幹話留言版</span>。
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div>
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#709CEF]"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {essays.map((essay, index) => (
                                <motion.div
                                    key={essay.id}
                                    variants={cardVariants}
                                    initial="hidden"
                                    animate="visible"
                                    custom={index}
                                    className="group relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden hover:border-[#709CEF] hover:ring-1 hover:ring-[#709CEF] transition-all duration-300 flex flex-col"
                                >
                                    <div className="p-6 flex flex-col flex-grow">
                                        <div className="text-gray-900 dark:text-white text-lg font-bold mb-4 leading-relaxed flex-grow">
                                            {essay.content}
                                        </div>

                                        <div className="w-full border-b-2 border-dashed border-gray-200 dark:border-gray-800 mb-4"></div>

                                        <div className="mt-auto flex justify-between items-center">
                                            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-full px-3 py-1.5 text-gray-500 dark:text-gray-300 text-xs font-mono">
                                                <i className="fas fa-clock"></i>
                                                <span>
                                                    {essay.createdAt?.toLocaleDateString('zh-TW', {
                                                        year: 'numeric',
                                                        month: 'numeric',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => handleOpenComments(essay)}
                                                className={`text-lg transition-colors ${activeEssay?.id === essay.id ? 'text-[#709CEF]' : 'text-gray-400 hover:text-[#709CEF] dark:hover:text-white'}`}
                                            >
                                                <i className="fas fa-comment-alt"></i>
                                            </button>
                                        </div>


                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>


                {/* Shared Comment Section at Bottom */}
                <div ref={commentSectionRef} className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
                    <AnimatePresence mode="wait">
                        {activeEssay ? (
                            <motion.div
                                key={activeEssay.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="max-w-4xl mx-auto"
                            >
                                <div className="mb-8 p-6 bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                                        <i className="fas fa-quote-left text-[#709CEF]"></i>
                                        留言對象
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-300 italic">
                                        "{activeEssay.content?.length > 100 ? activeEssay.content.substring(0, 100) + '...' : activeEssay.content}"
                                    </p>
                                </div>

                                <CommentSection
                                    postId={activeEssay.id}
                                    postTitle={activeEssay.content ? (activeEssay.content.length > 20 ? activeEssay.content.substring(0, 20) + '...' : activeEssay.content) : 'Short Essay'}
                                />
                            </motion.div>
                        ) : (
                            <div className="text-center py-12 text-gray-500">
                                <i className="fas fa-comment-dots text-4xl mb-4 opacity-50"></i>
                                <p>點擊上方任一則隨筆的留言按鈕，即可在此處展開討論</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </MainLayout >
    );
};

export default Essay;