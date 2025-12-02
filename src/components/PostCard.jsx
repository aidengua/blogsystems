import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { motion } from 'framer-motion';
import 'react-lazy-load-image-component/src/effects/blur.css';
import SpotlightCard from './SpotlightCard';

const PostCard = ({ post, index }) => {
    const isEven = index % 2 === 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            <SpotlightCard className="h-auto md:h-[280px] group">
                <div className={`flex flex-col md:flex-row h-full ${!isEven ? 'md:flex-row-reverse' : ''}`}>
                    {/* Image Section */}
                    <div className="w-full md:w-[45%] h-48 md:h-full overflow-hidden relative">
                        <Link to={`/posts/${post.slug}`} className="block w-full h-full">
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                transition={{ duration: 0.5 }}
                                className="w-full h-full bg-gray-200 dark:bg-gray-800"
                            >
                                <LazyLoadImage
                                    alt={post.title}
                                    src={post.coverImage || 'https://camo.githubusercontent.com/520c5cfb0b63284eeb8c1d869660ffd7ab93b6a1310ffc6da27442f14d37a437/68747470733a2f2f6e706d2e656c656d6563646e2e636f6d2f616e7a686979752d6173736574732f696d6167652f636f6d6d6f6e2f6769746875622d696e666f2f4b6e6f636b2d436f64652e676966'}
                                    effect="blur"
                                    className="w-full h-full object-cover"
                                    wrapperClassName="w-full h-full"
                                    placeholder={
                                        <div className="w-full h-full bg-gray-200 dark:bg-gray-800 animate-pulse flex items-center justify-center">
                                            <i className="fas fa-image text-gray-400 text-2xl"></i>
                                        </div>
                                    }
                                />
                            </motion.div>
                        </Link>
                    </div>

                    {/* Content Section */}
                    <div className="w-full md:w-[55%] p-6 md:p-8 flex flex-col justify-center bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
                            <i className="far fa-calendar-alt"></i>
                            <time>{post.createdAt?.toDate().toLocaleDateString()}</time>
                            {post.tags && post.tags.length > 0 && (
                                <>
                                    <span className="mx-1">|</span>
                                    <i className="fas fa-tag"></i>
                                    <span>{post.tags[0]}</span>
                                </>
                            )}
                        </div>

                        <Link to={`/posts/${post.slug}`}>
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3 hover:text-primary transition-colors line-clamp-2">
                                {post.title}
                            </h2>
                        </Link>

                        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 text-sm leading-relaxed">
                            {post.summary || post.content?.substring(0, 150) + '...'}
                        </p>

                        <div className="mt-auto">
                            <Link
                                to={`/posts/${post.slug}`}
                                className="inline-flex items-center text-primary hover:text-blue-600 font-medium transition-colors group/link"
                            >
                                <motion.span
                                    whileHover={{ x: 5 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                    className="flex items-center"
                                >
                                    閱讀全文 <i className="fas fa-chevron-right text-xs ml-1"></i>
                                </motion.span>
                            </Link>
                        </div>
                    </div>
                </div>
            </SpotlightCard>
        </motion.div>
    );
};

export default PostCard;
