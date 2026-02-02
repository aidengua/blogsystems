import { motion, AnimatePresence } from 'framer-motion';
import LogoLoader from '../LogoLoader';

const PhotoModal = ({ isOpen, onClose, data, onDataChange, onSave, isPublishing, isEditing }) => {
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
                        className="bg-[#1e1e1e] border border-white/10 rounded-2xl p-6 w-full max-w-2xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        {/* Background Gradient */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16"></div>

                        <div className="flex justify-between items-center mb-6 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-400">
                                    <i className="fas fa-camera text-sm"></i>
                                </div>
                                <h2 className="text-xl font-bold text-white">
                                    {isEditing ? '編輯照片' : '上傳照片'}
                                </h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        <div className="flex flex-col gap-5 relative z-10 overflow-y-auto pr-2">
                            {/* Two Column Layout */}
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Left: Preview */}
                                <div className="w-full md:w-1/3 flex-shrink-0">
                                    <div className="h-48 md:h-auto md:aspect-square rounded-xl overflow-hidden bg-black/30 border border-white/10 flex items-center justify-center group relative w-full">
                                        {data.src ? (
                                            <img src={data.src} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="text-center text-gray-600">
                                                <i className="fas fa-image text-3xl mb-2"></i>
                                                <p className="text-xs">圖片預覽</p>
                                            </div>
                                        )}
                                        {data.src && (
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity pointer-events-none">
                                                <span className="text-white text-xs font-medium bg-black/50 px-2 py-1 rounded">URL 圖片</span>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-gray-500 mt-2 text-center">
                                        目前僅支持外部鏈接圖片
                                    </p>
                                </div>

                                {/* Right: Form */}
                                <div className="w-full md:w-2/3 space-y-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">圖片連結 (URL)</label>
                                        <input
                                            type="text"
                                            value={data.src}
                                            onChange={(e) => onDataChange({ ...data, src: e.target.value })}
                                            placeholder="https://..."
                                            className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500/50 text-sm transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">標題</label>
                                        <input
                                            type="text"
                                            value={data.title}
                                            onChange={(e) => onDataChange({ ...data, title: e.target.value })}
                                            placeholder="為照片取個名字..."
                                            className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500/50 text-sm transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">描述 (選填)</label>
                                        <textarea
                                            value={data.description}
                                            onChange={(e) => onDataChange({ ...data, description: e.target.value })}
                                            placeholder="這張照片的故事..."
                                            rows={2}
                                            className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500/50 text-sm transition-all resize-none"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">標籤 (逗號分隔)</label>
                                            <input
                                                type="text"
                                                value={data.tags}
                                                onChange={(e) => onDataChange({ ...data, tags: e.target.value })}
                                                placeholder="風景, 旅行..."
                                                className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500/50 text-sm transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-400 mb-1.5 ml-1">日期 (選填)</label>
                                            <input
                                                type="date"
                                                value={data.date}
                                                onChange={(e) => onDataChange({ ...data, date: e.target.value })}
                                                className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500/50 text-sm transition-all [color-scheme:dark]"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors hover:bg-white/5 rounded-lg text-sm font-medium"
                                >
                                    取消
                                </button>
                                <button
                                    onClick={onSave}
                                    disabled={isPublishing || !data.src.trim() || !data.title.trim()}
                                    className="px-6 py-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-pink-500/20 text-sm font-bold"
                                >
                                    {isPublishing ? (
                                        <>
                                            <LogoLoader size="w-4 h-4" animate={true} className="mr-2" />
                                            {isEditing ? '更新中...' : '發布中...'}
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-check"></i>
                                            {isEditing ? '確認更新' : '確認上傳'}
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

export default PhotoModal;
