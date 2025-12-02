import { useEffect, useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
import { motion } from 'framer-motion';

const About = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <MainLayout>
            <div className="min-h-screen pt-24 pb-12 px-4 container mx-auto max-w-7xl">
                {/* Header Section */}
                <div className="flex flex-col items-center mb-12 animate-fade-in">
                    <div className="relative mb-4">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
                            <img src="https://cloudflare-imgbed-5re.pages.dev/file/1736127040827_%E6%9C%AA%E5%91%BD%E5%90%8D%E8%A8%AD%E8%A8%88.png" alt="Avatar" className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-gray-900"></div>
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">關於本站</h1>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {['數碼科技愛好者', '分享與熱心幫助', '智能家居小能手', '設計開發一條龍'].map((tag, i) => (
                            <span key={i} className="px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-800 text-xs text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-700">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[minmax(180px,auto)] mb-4">

                    {/* 1. Intro Card (Large Blue) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="col-span-1 md:col-span-2 lg:col-span-2 row-span-1"
                    >
                        <div className="h-full bg-gradient-to-br from-blue-600 to-blue-500 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group flex flex-col justify-between">
                            <div className="relative z-10">
                                <div className="text-blue-100 mb-1">你好，很高興認識你 👋</div>
                                <h2 className="text-4xl font-bold mb-2">我叫 安知魚</h2>
                                <p className="text-blue-100">是一名 前端工程師、學生、獨立開發者、博主</p>
                            </div>
                            <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-1/4 translate-y-1/4">
                                <i className="fas fa-code text-9xl"></i>
                            </div>
                        </div>
                    </motion.div>

                    {/* 2. Pursuit Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="col-span-1 md:col-span-2 lg:col-span-2 row-span-1"
                    >
                        <div className="h-full bg-gray-900 dark:bg-black rounded-3xl p-8 text-white shadow-xl border border-gray-800 relative overflow-hidden flex flex-col justify-center">
                            <div className="relative z-10">
                                <div className="text-gray-400 text-sm mb-2">追求</div>
                                <div className="text-3xl font-bold leading-tight">
                                    源于<br />熱愛而去 感受<br /><span className="text-blue-500">學習</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* 3. Skills Card (Scrolling) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        className="col-span-1 md:col-span-2 lg:col-span-2"
                    >
                        <div className="h-full bg-gray-900 dark:bg-black rounded-3xl p-6 text-white shadow-xl border border-gray-800 overflow-hidden flex flex-col justify-center">
                            <div className="text-gray-400 text-sm mb-4">技能</div>
                            <h3 className="text-2xl font-bold mb-6">開啟創造力</h3>
                            <div className="flex gap-4 overflow-hidden">
                                <div className="flex gap-4 animate-scroll">
                                    {['fab fa-react', 'fab fa-vuejs', 'fab fa-node', 'fab fa-python', 'fab fa-html5', 'fab fa-css3', 'fab fa-js', 'fab fa-docker'].map((icon, i) => (
                                        <div key={i} className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center text-3xl hover:bg-blue-600 transition-colors shrink-0">
                                            <i className={icon}></i>
                                        </div>
                                    ))}
                                    {/* Duplicate for seamless loop */}
                                    {['fab fa-react', 'fab fa-vuejs', 'fab fa-node', 'fab fa-python', 'fab fa-html5', 'fab fa-css3', 'fab fa-js', 'fab fa-docker'].map((icon, i) => (
                                        <div key={`dup-${i}`} className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center text-3xl hover:bg-blue-600 transition-colors shrink-0">
                                            <i className={icon}></i>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* 4. Career/Education Timeline */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                        className="col-span-1 md:col-span-2 lg:col-span-2"
                    >
                        <div className="h-full bg-gray-900 dark:bg-black rounded-3xl p-8 text-white shadow-xl border border-gray-800 flex flex-col justify-center">
                            <div className="text-gray-400 text-sm mb-2">生涯</div>
                            <h3 className="text-2xl font-bold mb-8">無限進步 <span className="text-blue-500 text-sm font-normal ml-2">EDU,軟件工程專業</span></h3>

                            <div className="relative pt-8 pb-4">
                                <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-700 -translate-y-1/2"></div>
                                <div className="absolute top-1/2 left-0 right-0 h-1 bg-blue-500 -translate-y-1/2 w-3/4"></div> {/* Progress bar */}

                                <div className="relative flex justify-between text-sm text-gray-400">
                                    <span>2020</span>
                                    <span>現在</span>
                                </div>

                                <div className="absolute top-1/2 left-[20%] -translate-y-1/2 -mt-8 text-blue-400 font-bold">EDU</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* 5. Statistics Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                        className="col-span-1 md:col-span-1 lg:col-span-1"
                    >
                        <div className="h-full bg-gray-900 dark:bg-black rounded-3xl p-6 text-white shadow-xl border border-gray-800 flex flex-col justify-between">
                            <div>
                                <div className="text-gray-400 text-sm mb-4">數據</div>
                                <h3 className="text-2xl font-bold mb-6">訪問統計</h3>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <div className="text-xs text-gray-500">今日人數</div>
                                        <div className="text-2xl font-bold">57</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500">今日訪問</div>
                                        <div className="text-2xl font-bold">383</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500">昨日人數</div>
                                        <div className="text-2xl font-bold">0</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500">昨日訪問</div>
                                        <div className="text-2xl font-bold">0</div>
                                    </div>
                                </div>
                            </div>
                            <button className="w-full py-2 rounded-xl bg-gray-800 hover:bg-gray-700 transition-colors text-sm flex items-center justify-center gap-2">
                                <i className="fas fa-chart-bar"></i> 更多統計
                            </button>
                        </div>
                    </motion.div>

                    {/* 6. Location Map */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                        className="col-span-1 md:col-span-1 lg:col-span-3"
                    >
                        <div className="h-full bg-gray-900 dark:bg-black rounded-3xl overflow-hidden shadow-xl border border-gray-800 relative group min-h-[250px]">
                            <div className="absolute inset-0 bg-gray-800">
                                {/* Placeholder for Map */}
                                <div className="w-full h-full opacity-50 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/World_map_blank_without_borders.svg/2000px-World_map_blank_without_borders.svg.png')] bg-cover bg-center"></div>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-md p-4">
                                <div className="text-2xl font-bold text-white">長沙</div>
                                <div className="text-gray-300">我現在住在 <span className="text-white font-bold">中國，長沙市</span></div>
                            </div>
                        </div>
                    </motion.div>

                    {/* 7. Info Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
                        className="col-span-1 md:col-span-2 lg:col-span-2"
                    >
                        <div className="h-full bg-gray-900 dark:bg-black rounded-3xl p-8 text-white shadow-xl border border-gray-800 flex justify-between items-center">
                            <div>
                                <div className="text-gray-400 text-sm">生于</div>
                                <div className="text-4xl font-bold text-blue-400">2002</div>
                            </div>
                            <div>
                                <div className="text-gray-400 text-sm">湖南信息學院</div>
                                <div className="text-2xl font-bold text-orange-400">軟件工程</div>
                            </div>
                            <div>
                                <div className="text-gray-400 text-sm">現在職業</div>
                                <div className="text-2xl font-bold text-purple-400">軟件工程師 🧑‍💻</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* 8. Personality Card (Expanded to fill gap) */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
                        className="col-span-1 md:col-span-1 lg:col-span-2"
                    >
                        <div className="h-full bg-gray-900 dark:bg-black rounded-3xl p-6 text-white shadow-xl border border-gray-800 relative overflow-hidden flex flex-col justify-center">
                            <div className="relative z-10">
                                <div className="text-gray-400 text-sm">性格</div>
                                <div className="text-3xl font-bold mb-1">執政官</div>
                                <div className="text-2xl font-bold text-pink-300 mb-4">ESFJ-A</div>
                                <div className="text-xs text-gray-500">在 16personalities 了解更多</div>
                            </div>
                            <div className="absolute right-[-20px] bottom-[-20px] w-32 h-32 opacity-80">
                                <i className="fas fa-user-friends text-8xl text-green-500/50"></i>
                            </div>
                        </div>
                    </motion.div>

                </div>

                {/* New Section: Personal Intro & Stories */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* Personal Introduction Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}
                        className="col-span-1 md:col-span-2 bg-gray-900 dark:bg-black rounded-3xl p-8 text-white shadow-xl border border-gray-800"
                    >
                        <div className="text-gray-400 text-sm mb-4">簡單來認識我</div>
                        <div className="prose prose-invert max-w-none text-gray-300 mb-6 leading-relaxed">
                            <p>歡迎來到我的部落格呀 ٩(ˊᗜˋ*)و，這邊是我記錄生活和專案歷程的站，我目前在台北市無界塾實驗教育機構的高中藝術類群，我常常忘記做課堂筆記或比賽後記錄 ~ 但是現在這個站內紀錄了我最多的筆記內容，慢慢去累積每一次紀錄，回看過去的紀錄能夠拿出來重新交給別人！這才是真正的學習與筆記。每周我都會記錄自主時間過程和專案進展，如果哪一周連續沒有更新紀錄就是太忙忘記啦！但是我還是會在想起來時補上，有時候專注在創作上會忘記其他事情。別學我去熬夜做事平時睡覺 希望大家都能架設屬於自己的個人部落格。</p>
                        </div>

                        <div className="space-y-2 mb-6">
                            <div className="flex items-center gap-2">
                                <i className="fas fa-check-square text-blue-500"></i>
                                <span>成為音響設計帶著自己的作品參賽 🔊</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <i className="fas fa-check-square text-blue-500"></i>
                                <span>超級Skidder <code className="bg-gray-800 px-1 rounded">Ctrl</code> + <code className="bg-gray-800 px-1 rounded">C</code>、<code className="bg-gray-800 px-1 rounded">Ctrl</code> + <code className="bg-gray-800 px-1 rounded">V</code> 高級java工程師</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <i className="fas fa-times-circle text-red-500"></i>
                                <span>精熟Pr、Ps、Ai等軟體技巧</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <i className="fas fa-times-circle text-red-500"></i>
                                <span>精熟Hexo搭建和HTML, CSS, JavaScript</span>
                            </div>
                        </div>

                        <h4 className="text-xl font-bold text-gray-400 mb-4">TodoList</h4>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <i className="fas fa-check-square text-blue-500"></i>
                                <span>設計與不同文化結合的音響</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <i className="fas fa-check-square text-blue-500"></i>
                                <span>完成Hexo部落格搭建</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <i className="fas fa-check-square text-blue-500"></i>
                                <span>高中養成撰寫部落格和筆記好習慣</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <i className="far fa-square text-gray-500"></i>
                                <span>精通CloudFlare DNS服務</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <i className="far fa-square text-gray-500"></i>
                                <span>繪製自己的D類擴大器PCB</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <i className="far fa-square text-gray-500"></i>
                                <span>設計自己的品牌</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <i className="far fa-square text-gray-500"></i>
                                <span>量產自己的藍芽音響</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <i className="far fa-square text-gray-500"></i>
                                <span>交到女朋友</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Love Story Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}
                        className="col-span-1 bg-gray-900 dark:bg-black rounded-3xl p-8 text-white shadow-xl border border-gray-800 flex flex-col"
                    >
                        <div className="text-gray-400 text-sm mb-4">愛笑的人很幸運!</div>
                        <div className="prose prose-invert max-w-none text-gray-300 mb-6 leading-relaxed flex-grow">
                            <p>來自2025/01/06的我，不知道下一次回顧這篇短文會是什麼時候！之所以沒放在短文區，是因為這篇文章真的寫得有點長啦也更因為更重要只有真正關注這個部落格的人會看到。想記錄一下去年12/30那天遇見的人和這段特別的經歷。高中的我一向專注在音響創作上，幾乎沒有把心思放在其他人身上。不知不覺到了高二年底，卻意外認識了妳。一開始我們的聊天還有點尷尬，我還記得是妳主動加了我的Discord。起初我沒有多想，但隨著我們越聊越多，發現彼此的相似點也越來越多，心裡漸漸對妳產生了好感。認識一周後，我們居然像認識多年的老朋友，有聊不完的話題。最瘋狂的事，莫過於在認識五天後，因為台中和一場比賽有機會見面。</p>
                            <p>那是我第一次面對面和一個人說話時這麼尷尬，或許是因為喜歡妳，又或許是因為我一向不擅長面對面的交流，那一刻的我，彷彿不認識自己了。尷尬地聊完後，我便跟著一起來比賽的同學離開。沒想到妳在訊息中告訴我，妳並不介意我這樣的樣子。其實，在見面前我想了很多，擔心妳會因為見面後對我有什麼負面的感覺，或者...各種不切實際的猜想。大概是因為我平常不太和人交流吧，才會顯得那麼緊張和不自在哈哈哈。希望這次見面不會成為我的黑歷史！我會永遠記得，2024/12/30的自己，是多麼幸運地遇見了妳。</p>
                        </div>
                        <div className="text-yellow-400 font-bold text-lg mt-4">林楚恩我愛妳 &gt;u&lt;</div>
                    </motion.div>

                    {/* Career Path Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}
                        className="col-span-1 bg-gray-900 dark:bg-black rounded-3xl p-8 text-white shadow-xl border border-gray-800 flex flex-col"
                    >
                        <div className="text-gray-400 text-sm mb-4">我要走工業設計!</div>
                        <div className="prose prose-invert max-w-none text-gray-300 mb-6 leading-relaxed flex-grow">
                            <p>其實到了高中，我還不確定未來要讀什麼科系。我相信這也是許多無界塾的學生在完成國中升學後，會面臨的共同難題——三年後的自己究竟適合哪條道路？但也我堅信，只要在學校中找到自己的興趣，並願意為之努力，一定會有適合你的科系。像我一樣，到了高二之後，因為認識了一位音響設計老師，接觸到更多音響品牌以及設計相關的知識，才逐漸確定自己未來要走的方向是工業設計系。其實在此之前，我從沒想過這個科系的出路或前景，只是單純翻開簡章時，發現這正是我喜歡的領域。因此，我決定將大學四年的時間投入在這樣的學習環境中，實現我的產品設計夢想。不論是製作、創新、研發還是生產，我希望能讓音響設計成為我學業生涯中持續前進的動力。</p>
                        </div>
                        <div className="text-yellow-400 font-bold text-lg mt-4">迷茫時跟隨自己心靈深處的想法永遠是對的。</div>
                    </motion.div>

                </div>
            </div>

            <style>{`
                @keyframes scroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-scroll {
                    animation: scroll 20s linear infinite;
                }
            `}</style>
        </MainLayout>
    );
};

export default About;
