import { Link } from 'react-router-dom';
import LazyImage from '../LazyImage';

const PostTable = ({ posts, onDelete }) => {
    return (
        <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10 text-gray-500 text-xs uppercase tracking-wider bg-white/5">
                            <th className="px-6 py-4 font-semibold rounded-tl-xl">文章標題</th>
                            <th className="px-6 py-4 font-semibold">狀態</th>
                            <th className="px-6 py-4 font-semibold">數據</th>
                            <th className="px-6 py-4 font-semibold">發布日期</th>
                            <th className="px-6 py-4 font-semibold text-right rounded-tr-xl">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {posts.map((post) => (
                            <tr key={post.id} className="transition-colors group border-b border-white/5">
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 rounded-lg overflow-hidden mr-4 bg-gray-800 flex-shrink-0 border border-white/10 relative transition-colors shadow-sm">
                                            <LazyImage
                                                src={post.coverImage || 'placeholder'}
                                                alt={post.title}
                                                className="w-full h-full object-cover"
                                                wrapperClassName="w-full h-full"
                                                placeholder={
                                                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                                                        <i className="fas fa-image"></i>
                                                    </div>
                                                }
                                            />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-200 transition-colors line-clamp-1 text-sm">{post.title}</p>
                                            <p className="text-xs text-gray-500 truncate max-w-[150px] font-mono mt-0.5 opacity-70">/{post.slug}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                                    ${post.status === 'published'
                                            ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                            : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                        }`}>
                                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${post.status === 'published' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                                        {post.status === 'published' ? '已發布' : '草稿'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center text-gray-400 font-medium text-sm gap-4">
                                        <div className="flex items-center gap-1.5 text-gray-300" title="瀏覽數">
                                            <i className="far fa-eye text-[#709CEF]"></i>
                                            {post.views || 0}
                                        </div>
                                        {/* Add other stats here if available like comments */}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                                    {post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString('zh-TW') : 'N/A'}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-100 transition-opacity">
                                        <Link
                                            to={`/admin/posts/${post.id}`}
                                            className="p-2 text-gray-400 hover:text-[#709CEF] hover:bg-blue-500/10 rounded-lg transition-all"
                                            title="編輯"
                                        >
                                            <i className="fas fa-edit"></i>
                                        </Link>
                                        <button
                                            onClick={() => onDelete(post.id)}
                                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                            title="刪除"
                                        >
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {posts.length === 0 && (
                            <tr>
                                <td colSpan="5" className="px-6 py-24 text-center text-gray-500">
                                    <div className="flex flex-col items-center">
                                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 ring-1 ring-white/10">
                                            <i className="fas fa-inbox text-2xl text-gray-600"></i>
                                        </div>
                                        <p className="text-lg font-medium text-gray-400">尚無文章</p>
                                        <p className="text-sm mt-1 text-gray-600">點擊上方按鈕新增您的第一篇文章</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {posts.map((post) => (
                    <div key={post.id} className="bg-white/5 border border-white/10 rounded-xl p-3 flex gap-3 relative overflow-hidden">
                        {/* Image */}
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0 border border-white/10 relative">
                            <LazyImage
                                src={post.coverImage || 'placeholder'}
                                alt={post.title}
                                className="w-full h-full object-cover"
                                wrapperClassName="w-full h-full"
                                placeholder={
                                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                                        <i className="fas fa-image"></i>
                                    </div>
                                }
                            />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                            <div>
                                <h3 className="font-bold text-gray-200 line-clamp-1 text-sm mb-0.5 pr-8">{post.title}</h3>
                                <div className="flex items-center gap-2 mb-1.5">
                                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium border leading-none
                                        ${post.status === 'published'
                                            ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                            : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                        }`}>
                                        <span className={`w-1 h-1 rounded-full mr-1 ${post.status === 'published' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                                        {post.status === 'published' ? '已發布' : '草稿'}
                                    </span>
                                    <p className="text-[10px] text-gray-500 truncate font-mono opacity-70">/{post.slug}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-[10px] text-gray-400 font-mono">
                                <div className="flex items-center gap-1.5">
                                    <i className="far fa-eye text-[#709CEF]"></i>
                                    {post.views || 0}
                                </div>
                                <div className="opacity-60">
                                    {post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString('zh-TW') : 'N/A'}
                                </div>
                            </div>
                        </div>

                        {/* Actions (Absolute positioned or flex-end) */}
                        <div className="absolute right-3 bottom-3 flex gap-1">
                            <Link
                                to={`/admin/posts/${post.id}`}
                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#709CEF] bg-white/5 hover:bg-blue-500/10 rounded-lg transition-all"
                            >
                                <i className="fas fa-edit text-xs"></i>
                            </Link>
                            <button
                                onClick={() => onDelete(post.id)}
                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-400 bg-white/5 hover:bg-red-500/10 rounded-lg transition-all"
                            >
                                <i className="fas fa-trash-alt text-xs"></i>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {posts.length === 0 && (
                <div className="px-6 py-24 text-center text-gray-500 bg-white/5 rounded-xl border border-white/10 md:hidden">
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 ring-1 ring-white/10">
                            <i className="fas fa-inbox text-2xl text-gray-600"></i>
                        </div>
                        <p className="text-lg font-medium text-gray-400">尚無文章</p>
                        <p className="text-sm mt-1 text-gray-600">點擊上方按鈕新增您的第一篇文章</p>
                    </div>
                </div>
            )}
        </>
    );
};

export default PostTable;
