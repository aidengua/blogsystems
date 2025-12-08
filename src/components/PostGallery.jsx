import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import LazyImage from './LazyImage';

const PostGallery = ({ images = [] }) => {
    const [selectedImage, setSelectedImage] = useState(null);

    if (!images || images.length === 0) return null;

    // Determine grid columns based on image count
    const getGridClass = () => {
        if (images.length === 1) return 'grid-cols-1';
        if (images.length === 2) return 'grid-cols-1 md:grid-cols-2';
        if (images.length === 3) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2'; // 4+ images: 2 columns grid
    };

    return (
        <>
            <div className={`grid ${getGridClass()} gap-4 my-8`}>
                {images.map((img, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="relative group rounded-2xl overflow-hidden cursor-zoom-in border border-white/10 shadow-lg aspect-[4/3]"
                        onClick={() => setSelectedImage(img)}
                    >
                        {/* Zoom Wrapper */}
                        <div className="absolute inset-0 w-full h-full transition-transform duration-700 ease-out group-hover:scale-110">
                            <LazyImage
                                src={img.src}
                                alt={img.alt || `Gallery Image ${index + 1}`}
                                className="w-full h-full object-cover !m-0 !p-0 !max-w-none"
                                wrapperClassName="w-full h-full"
                            />
                        </div>

                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 z-10 pointer-events-none" />

                        {/* Caption Overlay */}
                        {img.alt && (
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0 z-20 pointer-events-none">
                                <p className="text-white text-xs font-medium truncate">{img.alt}</p>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Lightbox Modal - Portalled to body to escape transform contexts */}
            {createPortal(
                <AnimatePresence>
                    {selectedImage && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedImage(null)}
                            className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
                        >
                            <motion.img
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                src={selectedImage.src}
                                alt={selectedImage.alt}
                                className="max-w-full max-h-[90vh] rounded-xl shadow-2xl border border-white/10"
                                onClick={(e) => e.stopPropagation()}
                            />
                            {selectedImage.alt && (
                                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur border border-white/20 px-4 py-2 rounded-full text-white text-sm pointer-events-none">
                                    {selectedImage.alt}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
};

export default PostGallery;
