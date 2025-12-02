import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const About = () => {
    return (
        <>
            <Navbar />
            <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl dark:shadow-gray-950/50 overflow-hidden border border-gray-100 dark:border-gray-800">
                            {/* Cover Banner */}
                            <div className="h-64 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
                                <div className="absolute inset-0 bg-black/20"></div>
                            </div>

                            <div className="px-8 pb-12 relative">
                                {/* Profile Image */}
                                <div className="-mt-24 mb-8 flex justify-center md:justify-start">
                                    <div className="w-48 h-48 rounded-full border-4 border-white dark:border-gray-900 shadow-xl overflow-hidden bg-white dark:bg-gray-800">
                                        <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500">
                                            <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                                    {/* Main Content */}
                                    <div className="md:col-span-2 space-y-8">
                                        <div>
                                            <h1 className="text-4xl font-display font-bold text-gray-900 dark:text-white mb-2">關於作者</h1>
                                            <p className="text-xl text-blue-600 dark:text-blue-400 font-medium">全端工程師 & 技術寫作者</p>
                                        </div>

                                        <div className="prose prose-lg dark:prose-invert text-gray-600 dark:text-gray-300">
                                            <p>
                                                嗨！我是這個部落格的作者。熱愛技術、寫作與分享。這裡是我記錄學習歷程、分享技術心得以及生活點滴的小天地。
                                            </p>
                                            <p>
                                                我專注於現代網頁開發技術，特別是 React, Node.js 以及雲端架構。我相信透過分享知識，不僅能幫助他人，也能讓自己更深入理解技術的本質。
                                            </p>
                                            <h3>我的技能</h3>
                                            <div className="flex flex-wrap gap-2 not-prose">
                                                {['React', 'Vue', 'Node.js', 'Firebase', 'Tailwind CSS', 'TypeScript', 'Python'].map((skill) => (
                                                    <span key={skill} className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sidebar Info */}
                                    <div className="space-y-8">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">聯絡方式</h3>
                                            <ul className="space-y-3">
                                                <li>
                                                    <a href="#" className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                                        <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                                        </svg>
                                                        Facebook
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#" className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                                        <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                                        </svg>
                                                        Twitter
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#" className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                                        <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                                        </svg>
                                                        GitHub
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default About;
