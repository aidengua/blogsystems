const EssayTable = ({ essays, onEdit, onDelete }) => {
    return (
        <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10 text-gray-500 text-xs uppercase tracking-wider bg-white/5">
                            <th className="px-6 py-4 font-semibold w-1/2 rounded-tl-xl">內容預覽</th>
                            <th className="px-6 py-4 font-semibold">發布日期</th>
                            <th className="px-6 py-4 font-semibold text-right rounded-tr-xl">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {essays.map((essay) => (
                            <tr key={essay.id} className="transition-colors group border-b border-white/5">
                                <td className="px-6 py-4">
                                    <div className="relative pl-4 border-l-2 border-purple-500/30">
                                        <p className="text-gray-300 line-clamp-2 text-sm font-serif italic">{essay.content}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                                    {essay.createdAt?.toDate ? essay.createdAt.toDate().toLocaleDateString('zh-TW') : 'N/A'}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-100 transition-opacity">
                                        <button
                                            onClick={() => onEdit(essay)}
                                            className="p-2 text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-all"
                                            title="編輯"
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button
                                            onClick={() => onDelete(essay.id)}
                                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                            title="刪除"
                                        >
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {essays.length === 0 && (
                            <tr>
                                <td colSpan="3" className="px-6 py-24 text-center text-gray-500">
                                    <div className="flex flex-col items-center">
                                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 ring-1 ring-white/10">
                                            <i className="fas fa-pen-fancy text-2xl text-gray-600"></i>
                                        </div>
                                        <p className="text-lg font-medium text-gray-400">尚無短文</p>
                                        <p className="text-sm mt-1 text-gray-600">點擊上方按鈕新增您的第一則短文</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {essays.map((essay) => (
                    <div key={essay.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-4">
                        <div className="relative pl-3 border-l-2 border-purple-500/30">
                            <p className="text-gray-300 text-sm font-serif italic line-clamp-3">{essay.content}</p>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-white/5">
                            <span className="text-xs text-gray-500 font-mono">
                                {essay.createdAt?.toDate ? essay.createdAt.toDate().toLocaleDateString('zh-TW') : 'N/A'}
                            </span>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => onEdit(essay)}
                                    className="p-2 text-gray-400 hover:text-purple-400 bg-white/5 hover:bg-purple-500/10 rounded-lg transition-all"
                                >
                                    <i className="fas fa-edit"></i>
                                </button>
                                <button
                                    onClick={() => onDelete(essay.id)}
                                    className="p-2 text-gray-400 hover:text-red-400 bg-white/5 hover:bg-red-500/10 rounded-lg transition-all"
                                >
                                    <i className="fas fa-trash-alt"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {essays.length === 0 && (
                <div className="px-6 py-24 text-center text-gray-500 bg-white/5 rounded-xl border border-white/10 md:hidden">
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 ring-1 ring-white/10">
                            <i className="fas fa-pen-fancy text-2xl text-gray-600"></i>
                        </div>
                        <p className="text-lg font-medium text-gray-400">尚無短文</p>
                        <p className="text-sm mt-1 text-gray-600">點擊上方按鈕新增您的第一則短文</p>
                    </div>
                </div>
            )}
        </>
    );
};

export default EssayTable;
