import LazyImage from '../LazyImage';

const AlbumTable = ({ albums, onEdit, onDelete }) => {
    return (
        <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10 text-gray-500 text-xs uppercase tracking-wider bg-white/5">
                            <th className="px-6 py-4 font-semibold rounded-tl-xl">照片</th>
                            <th className="px-6 py-4 font-semibold">標題</th>
                            <th className="px-6 py-4 font-semibold">上傳日期</th>
                            <th className="px-6 py-4 font-semibold text-right rounded-tr-xl">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {albums.map((photo) => (
                            <tr key={photo.id} className="transition-colors group border-b border-white/5">
                                <td className="px-6 py-4">
                                    <div className="w-16 h-16 rounded-lg overflow-hidden border border-white/10 shadow-sm transition-colors">
                                        <LazyImage
                                            src={photo.src}
                                            alt={photo.title}
                                            className="w-full h-full object-cover"
                                            wrapperClassName="w-full h-full"
                                            placeholder={
                                                <div className="w-full h-full bg-gray-800 animate-pulse"></div>
                                            }
                                        />
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="font-bold text-gray-200 transition-colors">{photo.title}</p>
                                    <p className="text-xs text-gray-500 mt-1 line-clamp-1 max-w-[200px]">{photo.description}</p>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                                    {photo.createdAt?.toDate ? photo.createdAt.toDate().toLocaleDateString('zh-TW') : 'N/A'}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-100 transition-opacity">
                                        <button
                                            onClick={() => onEdit(photo)}
                                            className="p-2 text-gray-400 hover:text-pink-400 hover:bg-pink-500/10 rounded-lg transition-all"
                                            title="編輯"
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button
                                            onClick={() => onDelete(photo.id)}
                                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                            title="刪除"
                                        >
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {albums.length === 0 && (
                            <tr>
                                <td colSpan="4" className="px-6 py-24 text-center text-gray-500">
                                    <div className="flex flex-col items-center">
                                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 ring-1 ring-white/10">
                                            <i className="fas fa-images text-2xl text-gray-600"></i>
                                        </div>
                                        <p className="text-lg font-medium text-gray-400">尚無照片</p>
                                        <p className="text-sm mt-1 text-gray-600">點擊上方按鈕上傳您的第一張照片</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {albums.map((photo) => (
                    <div key={photo.id} className="bg-white/5 border border-white/10 rounded-xl p-3 flex gap-3 relative overflow-hidden">
                        {/* Image */}
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0 border border-white/10 relative">
                            <LazyImage
                                src={photo.src}
                                alt={photo.title}
                                className="w-full h-full object-cover"
                                wrapperClassName="w-full h-full"
                                placeholder={
                                    <div className="w-full h-full bg-gray-800 animate-pulse"></div>
                                }
                            />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                            <div>
                                <h3 className="font-bold text-gray-200 line-clamp-1 text-sm mb-0.5 pr-8">{photo.title}</h3>
                                <p className="text-[10px] text-gray-400 line-clamp-2 leading-tight opacity-80 mb-1">{photo.description}</p>
                            </div>

                            <div className="text-[10px] text-gray-500 font-mono opacity-60">
                                {photo.createdAt?.toDate ? photo.createdAt.toDate().toLocaleDateString('zh-TW') : 'N/A'}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="absolute right-3 bottom-3 flex gap-1">
                            <button
                                onClick={() => onEdit(photo)}
                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-pink-400 bg-white/5 hover:bg-pink-500/10 rounded-lg transition-all"
                            >
                                <i className="fas fa-edit text-xs"></i>
                            </button>
                            <button
                                onClick={() => onDelete(photo.id)}
                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-400 bg-white/5 hover:bg-red-500/10 rounded-lg transition-all"
                            >
                                <i className="fas fa-trash-alt text-xs"></i>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {albums.length === 0 && (
                <div className="px-6 py-24 text-center text-gray-500 bg-white/5 rounded-xl border border-white/10 md:hidden">
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 ring-1 ring-white/10">
                            <i className="fas fa-images text-2xl text-gray-600"></i>
                        </div>
                        <p className="text-lg font-medium text-gray-400">尚無照片</p>
                        <p className="text-sm mt-1 text-gray-600">點擊上方按鈕上傳您的第一張照片</p>
                    </div>
                </div>
            )}
        </>
    );
};

export default AlbumTable;
