import { motion } from 'framer-motion';
import MainLayout from '../../layouts/MainLayout';

const Equipment = () => {
    const productivityGear = [
        {
            id: 1,
            name: "MacBook Pro 2021 16 英寸",
            specs: "M1 Max 64G / 1TB",
            desc: "屏幕顯示效果好、色彩準確、對比度強、性能強勁、續航優秀。可以用來開發和設計。",
            image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", // Placeholder
            link: "#"
        },
        {
            id: 2,
            name: "iPad 2020",
            specs: "深空灰 / 128G",
            desc: "事事玩得轉，買前生產力，買後愛奇藝。",
            image: "https://images.unsplash.com/photo-1544816155-12df9643f363?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", // Placeholder
            link: "#"
        },
        {
            id: 3,
            name: "iPhone 15 Pro Max",
            specs: "白色 / 512G",
            desc: "鈦金屬，堅固輕盈。Pro 得真材實料，人生第一台這麼貴的手機。心疼的一批。不過確實好用，續航，大屏都很爽，缺點就是信號信號...",
            image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", // Placeholder
            link: "#"
        },
        {
            id: 4,
            name: "iPhone 12 mini",
            specs: "綠色 / 128G",
            desc: "超瓷晶面板，玻璃背板搭配鋁金屬邊框，曲線優美的圓角設計，mini大小正好一只手就抓住，深得我心，唯一缺點大概就是續航不夠。",
            image: "https://images.unsplash.com/photo-1603313011101-320f26a4f6f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", // Placeholder
            link: "#"
        },
        {
            id: 5,
            name: "AirPods (第三代)",
            specs: "聽個響",
            desc: "第三代對比第二代提升很大，對我一樣不喜歡入耳式耳機的可以入。空間音頻等功能確實新穎，第一次使用有被驚艷到。",
            image: "https://images.unsplash.com/photo-1629367494173-c78a56567877?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", // Placeholder
            link: "#"
        }
    ];

    const travelGear = [
        {
            id: 6,
            name: "Apple Watch Series 8",
            specs: "黑色",
            desc: "始終為我的健康做檢測，深夜彈出站立提醒，不過確實有效的提高了我的運動頻率，配合apple全家桶還是非常棒的產品，缺點依然...",
            image: "https://images.unsplash.com/photo-1664730022301-249717e410d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", // Placeholder
            link: "#"
        },
        {
            id: 7,
            name: "NATIONAL GEOGRAPHIC双肩包",
            specs: "黑色",
            desc: "國家地理黑色大包，正好裝下16寸 Macbook Pro，並且背起來很舒適。底部自帶防雨罩也很好用，各種奇怪的小口袋深得我心。",
            image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", // Placeholder
            link: "#"
        },
        {
            id: 8,
            name: "NATIONAL GEOGRAPHIC学生书包",
            specs: "紅白双色",
            desc: "國家地理黑色大包，冰冰🧊同款，顏值在線且實用。",
            image: "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80", // Placeholder
            link: "#"
        }
    ];

    const GearCard = ({ item }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] flex flex-col"
        >
            <div className="aspect-[4/3] overflow-hidden bg-gray-800 relative">
                <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60"></div>
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{item.name}</h3>
                <p className="text-xs text-gray-500 mb-4 font-mono uppercase tracking-wider">{item.specs}</p>
                <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow line-clamp-3">
                    {item.desc}
                </p>

                <div className="flex items-center justify-between mt-auto">
                    <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs rounded-lg transition-colors flex items-center gap-2">
                        <i className="fas fa-info-circle"></i> 詳情
                    </button>
                    <button className="w-8 h-8 rounded-full bg-gray-800 hover:bg-blue-600 hover:text-white text-gray-400 flex items-center justify-center transition-all">
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
                            <div className="text-yellow-500 font-bold mb-4 tracking-wider text-sm flex items-center gap-2">
                                <span className="w-8 h-[2px] bg-yellow-500"></span>
                                好物
                            </div>
                            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                                實物裝備推薦
                            </h1>
                            <p className="text-lg md:text-xl text-gray-300 font-light flex items-center gap-2">
                                跟 <span className="font-bold text-white"> 欸等 </span> 一起享受科技帶來的樂趣
                            </p>
                        </div>
                    </div>
                </div>

                {/* Productivity Section */}
                <div className="mb-16">
                    <div className="flex items-center gap-4 mb-8">
                        <h2 className="text-3xl font-bold text-white">生產力</h2>
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
                        <h2 className="text-3xl font-bold text-white">出行</h2>
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
