import { motion } from 'framer-motion';
import MainLayout from '../../layouts/MainLayout';

const Equipment = () => {
    const productivityGear = [
        {
            id: 1,
            name: "Asus TUF Gaming A15",
            specs: "AMD Ryzen 7 7735HS / NVIDIA GeForce RTX 4060",
            desc: "性能強勁，散熱優秀，可以開發和設計。",
            image: "https://cloudflare-imgbed-5re.pages.dev/file/1765445402696_image.png", // Placeholder
            link: "#"
        },
        {
            id: 2,
            name: "Macbook Pro M1",
            specs: "M1 / 8GB",
            desc: "以現在來說這台陪伴我四年的電腦更新上了LiquidGlass之後時常卡段，但也足夠辦公。",
            image: "https://cloudflare-imgbed-5re.pages.dev/file/1765445600024_image.png", // Placeholder
            link: "#"
        },
        {
            id: 3,
            name: "OPPO Find X8",
            specs: "浮光白 / 16GB / 256GB",
            desc: "天馬螢幕顯示效果優秀，聯發科天機9400 Soc效能非常好。",
            image: "https://cloudflare-imgbed-5re.pages.dev/file/1765445430186_image.png", // Placeholder
            link: "#"
        },
        {
            id: 4,
            name: "Canon EOS 70D",
            specs: "18-135鏡頭",
            desc: "放在2025的今天都是相當能打的外拍相機",
            image: "https://cloudflare-imgbed-5re.pages.dev/file/1765445750417_image.png", // Placeholder
            link: "#"
        },
        {
            id: 5,
            name: "弱水時砂 寒武紀",
            specs: "48db降噪 / 100h續航 / LDAC",
            desc: "超長續航能力，音質表現優秀，對我來說是目前最有性價比的耳機",
            image: "https://cloudflare-imgbed-5re.pages.dev/file/1765445827628_image.png", // Placeholder
            link: "#"
        },
        {
            id: 6,
            name: "弱水時砂 琉璃Ultra",
            specs: "55db降噪 / 45h續航 / 寬頻抗風噪",
            desc: "超長續航能力，音質表現優秀，對我來說是目前最有性價比的耳機",
            image: "https://cloudflare-imgbed-5re.pages.dev/file/1765445951094_image.png", // Placeholder
            link: "#"
        }
    ];

    const travelGear = [
        {
            id: 6,
            name: "Galaxy Fit3",
            specs: "白色款",
            desc: "非常好的續航力與完整睡眠、運動、血氧監測，配合軟體確實很不錯",
            image: "https://cloudflare-imgbed-5re.pages.dev/file/1765446094442_image.png", // Placeholder
            link: "#"
        }
    ];

    const GearCard = ({ item }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] flex flex-col"
        >
            <div className="aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800 relative">
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60"></div>
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-blue-400 transition-colors">{item.name}</h3>
                <p className="text-xs text-gray-500 mb-4 font-mono uppercase tracking-wider">{item.specs}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                    {item.desc}
                </p>

                <div className="flex items-center justify-between mt-auto">
                    <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-lg transition-colors flex items-center gap-2">
                        <i className="fas fa-info-circle"></i> 詳情
                    </button>
                    <button className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-[#709CEF] hover:text-white text-gray-400 flex items-center justify-center transition-all">
                        <i className="fas fa-comment-alt text-xs"></i>
                    </button>
                </div>
            </div>
        </motion.div>
    );

    return (
        <MainLayout>
            <div className="container mx-auto px-4 pt-24 pb-12 max-w-7xl">
                {/* Hero Section (Card Style) */}
                <div className="relative h-[240px] md:h-[320px] w-full rounded-[40px] overflow-hidden mb-12 group shadow-2xl">
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")' }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent"></div>
                    </div>

                    <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-16">
                        <div className="max-w-2xl animate-slide-right">

                            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                                實物裝備推薦
                            </h1>
                            <p className="text-lg md:text-xl text-gray-300 font-light flex items-center gap-2">
                                跟 <span className="font-bold text-white"> Aiden </span> 一起享受科技帶來的樂趣
                            </p>
                        </div>
                    </div>
                </div>

                {/* Productivity Section */}
                <div className="mb-16">
                    <div className="flex items-center gap-4 mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">生產力</h2>
                        <span className="text-gray-500 text-sm">提升自己生產效率的硬件設備</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {productivityGear.map(item => (
                            <GearCard key={item.id} item={item} />
                        ))}
                    </div>
                </div>

                {/* Travel Section */}
                <div>
                    <div className="flex items-center gap-4 mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">出行</h2>
                        <span className="text-gray-500 text-sm">用來出行的實物及設備</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {travelGear.map(item => (
                            <GearCard key={item.id} item={item} />
                        ))}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Equipment;
