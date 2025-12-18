import { useState, useEffect } from 'react';
import MainLayout from '../../layouts/MainLayout';
import LazyImage from '../../components/LazyImage';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';

const Album = () => {
    const [photos, setPhotos] = useState([]);

    useEffect(() => {
        const q = query(collection(db, 'albums'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const photoData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setPhotos(photoData);
        });

        return () => unsubscribe();
    }, []);

    const [selectedPhoto, setSelectedPhoto] = useState(null);

    return (
        <MainLayout>
            <div className="min-h-screen pt-24 pb-12 px-4 container mx-auto max-w-7xl">
                {/* Header Area */}
                {/* Hero Section (Unified Design) */}
                <div className="relative h-[240px] md:h-[320px] w-full rounded-[40px] overflow-hidden mb-12 group shadow-2xl">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="w-full h-full transition-transform duration-1000 ease-out group-hover:scale-105">
                            <LazyImage
                                src="https://cloudflare-imgbed-5re.pages.dev/file/1765856616740_gallary.gif"
                                alt="Album Hero"
                                className="w-full h-full object-cover blur-[2px]"
                                wrapperClassName="w-full h-full"
                            />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent pointer-events-none"></div>
                    </div>

                    <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-16">
                        <div className="max-w-2xl animate-slide-right">
                            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                                生活相簿
                            </h1>
                            <p className="text-lg md:text-xl text-gray-300 font-light flex items-center gap-2">
                                用鏡頭捕捉瞬間，讓回憶成為永恆。
                            </p>
                        </div>
                    </div>
                </div>

                {/* Masonry Grid */}
                {/* Tailwind columns-count for masonry layout */}
                <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4 mx-auto px-2">
                    {photos.map((photo, index) => (
                        <motion.div
                            key={photo.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "100px" }}
                            transition={{ delay: index * 0.05, duration: 0.5 }}
                            className="break-inside-avoid relative group cursor-zoom-in mb-4 rounded-2xl overflow-hidden"
                            onClick={() => setSelectedPhoto(photo)}
                        >
                            <div className="relative w-full overflow-hidden rounded-2xl bg-gray-200 dark:bg-gray-800">
                                {/* Using our new Progressive LazyImage */}
                                <LazyImage
                                    src={photo.src}
                                    placeholderSrc={`https://picsum.photos/seed/${photo.id + 55}/20/30?blur=5`} // Tiny blur version simulation
                                    alt={photo.title}
                                    className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700 ease-out"
                                    wrapperClassName="w-full h-full"
                                />

                                {/* Hover Overlay - subtle darkening on hover */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none z-10" />

                                {/* Bottom Info - Always Visible */}
                                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-20">
                                    <p className="text-white text-sm font-bold truncate">{photo.title}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-white/80 text-xs">
                                            {photo.createdAt?.seconds ? new Date(photo.createdAt.seconds * 1000).toLocaleDateString() : photo.date}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Pinterest Style Lightbox */}
                {createPortal(
                    <AnimatePresence>
                        {selectedPhoto && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setSelectedPhoto(null)}
                                className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-8 cursor-zoom-out overflow-y-auto"
                            >
                                <motion.div
                                    initial={{ y: 50, opacity: 0, scale: 0.95 }}
                                    animate={{ y: 0, opacity: 1, scale: 1 }}
                                    exit={{ y: 50, opacity: 0, scale: 0.95 }}
                                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                    className="relative w-auto h-auto max-w-[95vw] max-h-[95vh] rounded-[20px] overflow-hidden shadow-2xl cursor-default mx-4 group inline-block"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    {/* Image Container - Using inline-block to shrink wrap the image */}
                                    <div className="relative inline-block align-middle">
                                        <img
                                            src={selectedPhoto.src}
                                            alt={selectedPhoto.title}
                                            className="w-auto h-auto max-h-[90vh] max-w-[90vw] object-contain block bg-black"
                                        />

                                        {/* Top Actions: Close Button on Hover */}
                                        <div className="absolute top-0 right-0 p-4 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedPhoto(null);
                                                }}
                                                className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md text-white border border-white/10 flex items-center justify-center transition-all transform hover:scale-110 active:scale-95"
                                            >
                                                <i className="fas fa-times text-lg"></i>
                                            </button>
                                        </div>

                                        {/* Bottom Overlay Info */}
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent pt-32 pb-6 px-6 md:px-10 z-20 text-left pointer-events-none">
                                            <div className="pointer-events-auto">
                                                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-md">
                                                    {selectedPhoto.title}
                                                </h2>

                                                {selectedPhoto.description && (
                                                    <p className="text-sm md:text-base text-gray-200 mb-4 max-w-2xl leading-relaxed drop-shadow-sm line-clamp-3 md:line-clamp-none">
                                                        {selectedPhoto.description}
                                                    </p>
                                                )}

                                                <div className="flex items-center gap-4 text-sm font-medium flex-wrap">
                                                    <div className="flex items-center gap-2 text-gray-300">
                                                        <i className="far fa-clock"></i>
                                                        <span>
                                                            {selectedPhoto.createdAt?.seconds
                                                                ? new Date(selectedPhoto.createdAt.seconds * 1000).toLocaleDateString()
                                                                : '2025-05-04'}
                                                        </span>
                                                    </div>

                                                    {/* Author / Tag placeholder */}
                                                    {(selectedPhoto.tags && selectedPhoto.tags.length > 0) ? (
                                                        <div className="flex gap-2">
                                                            {selectedPhoto.tags.map((tag, idx) => (
                                                                <span key={idx} className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/10 text-xs">
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/10 text-xs">
                                                            生活點滴
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>,
                    document.body
                )}
            </div>
        </MainLayout>
    );
};

export default Album;
