import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { motion } from 'framer-motion';
import { auth } from '../../firebase';

const DashboardHeader = ({ onNewEssay, onNewPhoto }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/admin/login');
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6 bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm"
        >
            <div>
                <h1 className="text-3xl font-display font-bold text-white mb-2 tracking-tight">
                    管理儀表板
                </h1>
                <div className="flex items-center gap-2 text-sm">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <p className="text-gray-400">
                        歡迎回來，<span className="text-[#709CEF] font-medium">{auth.currentUser?.email}</span>
                    </p>
                </div>
            </div>
            <div className="flex flex-wrap gap-3 w-full md:w-auto">
                <button
                    onClick={onNewEssay}
                    className="flex-1 md:flex-none inline-flex justify-center items-center px-4 py-2.5 bg-purple-600/20 hover:bg-purple-600 text-purple-400 hover:text-white border border-purple-500/30 rounded-xl transition-all font-medium text-sm group backdrop-blur-md"
                >
                    <i className="fas fa-pen-fancy md:mr-2 group-hover:-rotate-12 transition-transform"></i>
                    <span className="hidden md:inline">新增短文</span>
                </button>
                <button
                    onClick={onNewPhoto}
                    className="flex-1 md:flex-none inline-flex justify-center items-center px-4 py-2.5 bg-pink-600/20 hover:bg-pink-600 text-pink-400 hover:text-white border border-pink-500/30 rounded-xl transition-all font-medium text-sm group backdrop-blur-md"
                >
                    <i className="fas fa-camera md:mr-2"></i>
                    <span className="hidden md:inline">新增照片</span>
                </button>
                <Link
                    to="/admin/posts/new"
                    className="flex-1 md:flex-none inline-flex justify-center items-center px-4 py-2.5 bg-[#709CEF]/20 hover:bg-[#709CEF] text-[#709CEF] hover:text-white border border-[#709CEF]/30 rounded-xl transition-all font-medium text-sm group backdrop-blur-md"
                >
                    <i className="fas fa-plus md:mr-2 group-hover:rotate-90 transition-transform"></i>
                    <span className="hidden md:inline">新增文章</span>
                </Link>
                <button
                    onClick={handleLogout}
                    className="flex-1 md:flex-none inline-flex justify-center items-center px-4 py-2.5 bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-all text-sm"
                >
                    <i className="fas fa-sign-out-alt md:mr-2"></i>
                    <span className="hidden md:inline">登出</span>
                </button>
            </div>
        </motion.div>
    );
};

export default DashboardHeader;
