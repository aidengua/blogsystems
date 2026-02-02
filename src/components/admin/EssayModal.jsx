import { motion, AnimatePresence } from 'framer-motion';
import LogoLoader from '../LogoLoader';

const EssayModal = ({ isOpen, onClose, content, setContent, onSave, isPublishing, isEditing }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-[#1e1e1e] border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl relative overflow-hidden"
                    >
                        {/* Background Gradient */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>

                        <div className="flex justify-between items-center mb-6 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
                                    <i className="fas fa-pen-fancy text-sm"></i>
                                </div>
                                <h2 className="text-xl font-bold text-white">
                                    {isEditing ? '編輯短文' : '快速發布短文'}
                                </h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        <div className="flex flex-col gap-4 relative z-10">
                            <div className="relative">
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="寫下你的短文心事..."
                                    className="w-full h-48 bg-black/30 border border-white/10 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all resize-none shadow-inner"
                                    autoFocus
                                />
                                <div className="absolute bottom-3 right-3 text-xs text-gray-600 pointer-events-none">
                                    {content.length} 字
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-2 border-t border-white/5">
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors hover:bg-white/5 rounded-lg text-sm font-medium"
                                >
                                    取消
                                </button>
                                <button
                                    onClick={onSave}
                                    disabled={isPublishing || !content.trim()}
                                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-purple-500/20 text-sm font-bold"
                                >
                                    {isPublishing ? (
                                        <>
                                            <LogoLoader size="w-4 h-4" animate={true} className="mr-2" />
                                            {isEditing ? '更新中...' : '發布中...'}
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-paper-plane"></i>
                                            {isEditing ? '確認更新' : '立即發布'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default EssayModal;
