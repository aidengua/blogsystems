import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import MainLayout from '../../layouts/MainLayout';
import LazyImage from '../../components/LazyImage';
import mainImage from '../../assets/main.png'; // Using main image as placeholder for now

const Essay = () => {
    const [essays, setEssays] = useState([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <MainLayout>
            <div className="min-h-screen pb-20">
                {/* Hero Section */}
                <div className="relative h-[400px] w-full overflow-hidden mb-12">
                    <div className="absolute inset-0">
                        <LazyImage
                            src={mainImage}
                            alt="Essay Hero"
                            className="w-full h-full object-cover"
                            wrapperClassName="w-full h-full"
                        />
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
                    </div>

                    <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 max-w-7xl mx-auto">
                        <div className="text-white/80 text-sm mb-2 font-mono tracking-wider">短文心事</div>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                            呂育德的日常生活
                        </h1>
                        <p className="text-white/70 text-lg max-w-2xl mb-8 font-light">
                            隨時隨地，分享生活；幹話留言版。
                        </p>

                        <div className="absolute bottom-8 right-8 md:right-16">
                            <Link
                                to="/about"
                                className="px-6 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full text-white transition-all flex items-center gap-2 group"
                            >
                                <i className="fas fa-arrow-right -rotate-45 group-hover:rotate-0 transition-transform duration-300"></i>
                                認識我
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="max-w-7xl mx-auto px-4">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {essays.map((essay) => (
                                <div key={essay.id} className="bg-[#1a1b26] rounded-xl p-6 border border-white/5 hover:border-white/10 transition-colors group">
                                    <div className="text-gray-300 text-lg mb-8 font-medium leading-relaxed min-h-[80px]">
                                        {essay.content}
                                    </div>

                                    <div className="flex justify-between items-center pt-4 border-t border-white/5">
                                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                                            <i className="far fa-clock"></i>
                                            <span>
                                                {essay.createdAt?.toLocaleDateString('zh-TW', {
                                                    year: 'numeric',
                                                    month: 'numeric',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                        <button className="text-gray-500 hover:text-white transition-colors">
                                            <i className="fas fa-comment-alt"></i>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

export default Essay;
