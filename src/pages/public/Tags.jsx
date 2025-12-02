import { useState, useEffect } from 'react';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { db } from '../../firebase';
import MainLayout from '../../layouts/MainLayout';

const Tags = () => {
    const [tags, setTags] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                const q = query(collection(db, 'posts'), where('status', '==', 'published'));
                const querySnapshot = await getDocs(q);

                const tagCounts = {};
                querySnapshot.docs.forEach(doc => {
                    const postTags = doc.data().tags || [];
                    postTags.forEach(tag => {
                        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                    });
                });

                setTags(tagCounts);
            } catch (error) {
                console.error("Error fetching tags:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTags();
    }, []);

    // Function to generate random color for tags
    const getRandomColor = () => {
        const colors = [
            'text-blue-500 hover:text-blue-600',
            'text-green-500 hover:text-green-600',
            'text-purple-500 hover:text-purple-600',
            'text-pink-500 hover:text-pink-600',
            'text-yellow-500 hover:text-yellow-600',
            'text-indigo-500 hover:text-indigo-600',
            'text-red-500 hover:text-red-600',
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    return (
        <MainLayout>
            <div className="relative h-[300px] w-full overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1507842217121-9e962835d771?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")' }}
                >
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
                </div>
                <div className="relative z-10 h-full flex items-center justify-center text-white">
                    <h1 className="text-4xl md:text-5xl font-display font-bold tracking-wider text-shadow-lg animate-fade-in">
                        標籤
                    </h1>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="card-glass p-8 md:p-12 animate-slide-up text-center">
                    {loading ? (
                        <div className="flex justify-center py-10">
                            <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                                標籤雲 ({Object.keys(tags).length})
                            </h2>
                            <div className="flex flex-wrap justify-center gap-6">
                                {Object.entries(tags).map(([tag, count]) => {
                                    const fontSize = Math.min(1.5 + count * 0.2, 3) + 'rem'; // Dynamic font size
                                    return (
                                        <Link
                                            key={tag}
                                            to={`/tags/${tag}`} // Note: Tag detail page not implemented yet, could just filter home or add later
                                            className={`transition-all duration-300 transform hover:scale-110 ${getRandomColor()}`}
                                            style={{ fontSize }}
                                        >
                                            {tag}
                                        </Link>
                                    );
                                })}
                                {Object.keys(tags).length === 0 && (
                                    <p className="text-gray-500">尚無標籤</p>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

export default Tags;
