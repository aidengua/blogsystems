import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import MainLayout from '../../layouts/MainLayout';
import LazyImage from '../../components/LazyImage';
import mainImage from '../../assets/main.png';
import CommentSection from '../../components/CommentSection';
import { motion, AnimatePresence } from 'framer-motion';

const Essay = () => {
    const [essays, setEssays] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedEssayId, setExpandedEssayId] = useState(null);

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

    const toggleComments = (id) => {
        setExpandedEssayId(prevId => prevId === id ? null : id);
    };

    return (
        <MainLayout>
            <div className="container mx-auto px-4 pt-24 pb-12 max-w-7xl">
                {/* Hero Section (Unified Design) */}
                <div className="relative h-[240px] md:h-[320px] w-full rounded-[40px] overflow-hidden mb-12 group shadow-2xl">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="w-full h-full transition-transform duration-1000 ease-out group-hover:scale-105">
                            <LazyImage
                                src="https://cloudflare-imgbed-5re.pages.dev/file/1764850720558_gif.gif"
                                alt="Essay Hero"
                                className="w-full h-full object-cover blur-[2px]"
                                wrapperClassName="w-full h-full"
                            />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent pointer-events-none"></div>
                    </div>

                    <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-16">
                        <div className="max-w-2xl animate-slide-right">
                            <div className="text-yellow-500 font-bold mb-4 tracking-wider text-sm flex items-center gap-2">
                                <span className="w-8 h-[2px] bg-yellow-500"></span>
                                短文心事
                            </div>
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
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {essays.map((essay) => (
                                <motion.div
                                    key={essay.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="group relative bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] flex flex-col"
                                >
                                    <div className="p-6 flex flex-col flex-grow">
                                        <div className="text-white text-lg font-bold mb-4 leading-relaxed flex-grow">
                                            {essay.content}
                                        </div>

                                        <div className="w-full border-b-2 border-dashed border-gray-800 mb-4"></div>

                                        <div className="mt-auto flex justify-between items-center">
                                            <div className="flex items-center gap-2 bg-gray-800 rounded-full px-3 py-1.5 text-gray-300 text-xs font-mono">
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
                                                onClick={() => toggleComments(essay.id)}
                                                className={`text-lg transition-colors ${expandedEssayId === essay.id ? 'text-blue-400' : 'text-gray-400 hover:text-white'}`}
                                            >
                                                <i className="fas fa-comment-alt"></i>
                                            </button>
                                        </div>

                                        {/* Expandable Comment Section */}
                                        <AnimatePresence>
                                            {expandedEssayId === essay.id && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="pt-6 mt-4 border-t border-gray-800">
                                                        <CommentSection
                                                            postId={essay.id}
                                                            postTitle={essay.content ? (essay.content.length > 20 ? essay.content.substring(0, 20) + '...' : essay.content) : 'Short Essay'}
                                                        />
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

export default Essay;
