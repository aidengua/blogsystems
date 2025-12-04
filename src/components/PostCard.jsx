import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import LazyImage from './LazyImage';
import SpotlightCard from './SpotlightCard';

const PostCard = ({ post }) => {
    return (
        <Link to={`/posts/${post.slug}`} className="block h-full group">
            <SpotlightCard
                className="h-full bg-[#1e1e1e] rounded-2xl border border-gray-800 hover:border-[#709CEF] transition-colors duration-500 hover:shadow-[0_0_20px_rgba(112,156,239,0.15)]"
                spotlightColor="rgba(112, 156, 239, 0.2)"
            >
                <div className="flex flex-col h-full">
                    {/* Image Section */}
                    <div className="w-full aspect-video overflow-hidden relative rounded-t-2xl">
                        <LazyImage
                            alt={post.title}
                            src={post.coverImage || 'https://camo.githubusercontent.com/520c5cfb0b63284eeb8c1d869660ffd7ab93b6a1310ffc6da27442f14d37a437/68747470733a2f2f6e706d2e656c656d6563646e2e636f6d2f616e7a686979752d6173736574732f696d6167652f636f6d6d6f6e2f6769746875622d696e666f2f4b6e6f636b2d436f64652e676966'}
                            className="w-full h-full object-cover"
                            wrapperClassName="w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1.0)] group-hover:scale-110 will-change-transform"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500"></div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 flex flex-col flex-grow relative">
                        {/* Top Meta: Category/Status */}
                        <div className="mb-4 flex items-center justify-between">
                            {post.category ? (
                                <span className="text-xs font-bold text-[#709CEF] tracking-wider uppercase">
                                    {post.category}
                                </span>
                            ) : (
                                <span className="text-xs font-bold text-gray-500 tracking-wider uppercase">
                                    未分類
                                </span>
                            )}
                            <span className="px-2 py-0.5 rounded text-[10px] bg-white/10 text-gray-300 border border-white/10">
                                未讀
                            </span>
                        </div>

                        {/* Title */}
                        <h2 className="text-xl font-bold text-white mb-4 line-clamp-2 leading-snug group-hover:text-[#709CEF] transition-colors duration-300">
                            {post.title}
                        </h2>

                        {/* Bottom Meta */}
                        <div className="mt-auto flex items-center justify-between text-xs text-gray-400">
                            {/* Tags (Glassmorphic Chips) */}
                            <div className="flex items-center gap-2">
                                {post.tags && post.tags.slice(0, 2).map(tag => (
                                    <div
                                        key={tag}
                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm group/tag hover:border-[#709CEF]/50 hover:bg-[#709CEF]/10 hover:shadow-[0_0_10px_rgba(112,156,239,0.2)] transition-all duration-300"
                                    >
                                        <i className="fas fa-tag text-[10px] text-gray-500 group-hover/tag:text-[#709CEF] transition-colors"></i>
                                        <span className="text-gray-300 group-hover/tag:text-white transition-colors">{tag}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Date */}
                            <time className="font-mono opacity-60">
                                {post.createdAt?.toDate().toLocaleDateString('zh-TW')}
                            </time>
                        </div>
                    </div>
                </div>
            </SpotlightCard>
        </Link>
    );
};

export default PostCard;
