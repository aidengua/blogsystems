const Footer = () => {
    return (
        <footer className="bg-gray-100 dark:bg-[#1e1e1e] border-t border-gray-200 dark:border-white/5 py-6 mt-12">
            <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
                {/* Left Side */}
                <div className="flex flex-col items-start gap-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <span>©2019 - {new Date().getFullYear()} By</span>
                        <img
                            src="https://cloud.dragoncode.dev/f/BgjC8/avatar.jpg"
                            alt="Avatar"
                            className="w-5 h-5 rounded-full animate-[spin_4s_linear_infinite]"
                        />
                        <span className="font-bold text-gray-900 dark:text-white hover:text-[#709CEF] transition-colors cursor-pointer">呂宥德</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                        <div className="flex items-center gap-1 hover:text-gray-800 dark:hover:text-gray-300 transition-colors cursor-pointer">
                            <i className="fas fa-shield-alt"></i>
                            <span>資訊安全由Firebase提供</span>
                        </div>
                        <span className="hover:text-gray-800 dark:hover:text-gray-300 transition-colors cursor-pointer">架構透過NextJs導入</span>
                        <div className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                            <span>所有業務正常</span>
                        </div>
                    </div>
                </div>

                {/* Right Side */}
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="flex items-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-400">
                        <a href="#" className="hover:text-[#709CEF] transition-colors">留言</a>
                        <a href="#" className="hover:text-[#709CEF] transition-colors">訂閱</a>
                        <a href="#" className="hover:text-[#709CEF] transition-colors">打賞</a>
                        <a href="#" className="hover:text-[#709CEF] transition-colors">主題</a>
                        <a href="#" className="hover:text-[#709CEF] transition-colors">舉報與反饋</a>
                    </div>
                    <div className="flex items-center gap-2 text-lg text-gray-400">
                        <i className="fab fa-creative-commons hover:text-gray-800 dark:hover:text-white transition-colors cursor-pointer"></i>
                        <i className="fab fa-creative-commons-by hover:text-gray-800 dark:hover:text-white transition-colors cursor-pointer"></i>
                        <i className="fab fa-creative-commons-nc hover:text-gray-800 dark:hover:text-white transition-colors cursor-pointer"></i>
                        <i className="fab fa-creative-commons-nd hover:text-gray-800 dark:hover:text-white transition-colors cursor-pointer"></i>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
