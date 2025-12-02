import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 dark:bg-black text-gray-300 dark:text-gray-400 mt-20 border-t border-gray-800 dark:border-gray-900">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                                <span className="text-white font-bold text-xl">B</span>
                            </div>
                            <span className="text-xl font-display font-bold text-white">My Blog</span>
                        </div>
                        <p className="text-gray-400 dark:text-gray-500 text-sm">
                            分享想法、故事與靈感的地方。
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">快速連結</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-gray-400 dark:text-gray-500 hover:text-white transition-colors">
                                    首頁
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Social & Contact */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">聯絡方式</h3>
                        <div className="flex space-x-4">
                            <a href="#" className="w-10 h-10 bg-gray-800 dark:bg-gray-900 hover:bg-blue-600 dark:hover:bg-blue-500 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/30">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </a>
                            <a href="#" className="w-10 h-10 bg-gray-800 dark:bg-gray-900 hover:bg-blue-600 dark:hover:bg-blue-500 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/30">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 dark:border-gray-900 mt-8 pt-8 text-center text-gray-500 dark:text-gray-600 text-sm">
                    <p>&copy; {currentYear} My Blog. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
