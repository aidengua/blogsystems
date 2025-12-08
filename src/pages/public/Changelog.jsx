import { useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
import { motion } from 'framer-motion';
import SpotlightCard from '../../components/SpotlightCard';

const Changelog = () => {
    const changelogs = [
        {
            version: "v1.8.0",
            date: "2025-12-08",
            title: "畫廊系統與編輯器升級",
            type: "major",
            changes: [
                { type: 'added', text: '畫廊系統：全新圖片網格功能，支援燈箱與 AI 自動排版，讓多圖展示更精美。' },
                { type: 'added', text: '編輯器優化：新增常駐 AI 按鈕並支援畫廊即時預覽。' },
                { type: 'fixed', text: '視覺修飾：優化 LazyImage 佈局與移除多餘背景框，提升視覺純淨度。' }
            ]
        },
        {
            version: "v1.7.0",
            date: "2025-12-08",
            title: "音樂廳與膠囊 2.0",
            type: "major",
            changes: [
                { type: 'added', text: '音樂廳升級：全新擬真黑膠唱機介面，搭配沉浸式玻璃擬態播放清單與空白鍵快捷控制。' },
                { type: 'added', text: '音樂膠囊 2.0：實作智慧待機模式，未播放時自動縮小為精緻黑膠圖示，懸停即可播放；具備無縫變形動畫。' }
            ]
        },
        {
            version: "v1.6.2",
            date: "2025-12-07",
            title: "系統優化與視覺升級",
            type: "improvement",
            changes: [
                { type: 'added', text: '後台管理：新增更新日誌管理功能，支援新增、編輯與刪除日誌。' },
                { type: 'changed', text: '視覺優化：全站主題色統一為 #709CEF，並修復背景主題切換顯示問題。' },
                { type: 'changed', text: '標籤頁面：全新精簡版標題設計與版面優化，提升閱讀體驗。' },
                { type: 'added', text: '功能改進：文章分類頁新增「清除篩選」按鈕，首頁標題顯示優化。' }
            ]
        },
        {
            version: "v1.6.1",
            date: "2025-12-07",
            title: "TOC 目錄優化與 AI 升級",
            type: "improvement",
            changes: [
                { type: 'changed', text: '目錄優化：實作自適應高度、「智慧模糊」揭示邏輯，並隱藏滾動條以提供更乾淨的閱讀體驗。' },
                { type: 'changed', text: 'Gemini AI 2.0：升級至 flash-lite 模型，並以現代化「深色膠囊」美學重新設計 AI 觸發按鈕。' },
                { type: 'fixed', text: '系統修飾：重命名分類並修復 Markdown 渲染警告。' }
            ]
        },
        {
            version: "v1.6.0",
            date: "2025-12-07",
            title: "行動版與視覺進化",
            type: "major",
            changes: [
                { type: 'added', text: '行動版選單重設計：採用「動態島」風格的頂部展開選單，搭配流暢的彈性動畫。' },
                { type: 'changed', text: '個人卡片 2.0：以精緻的「呼吸與淡入」效果取代翻轉動畫，並新增簽名檔 GIF。' },
                { type: 'changed', text: 'Line 卡片修飾：放大 Logo 並加入模糊浮水印效果（移除綠色背景），提升質感。' },
                { type: 'added', text: '行動版體驗：實作可滾動的標籤列，並優化小螢幕的間距。' }
            ]
        },
        {
            version: "v1.5.1",
            date: "2025-12-06",
            title: "視覺與效能修飾",
            type: "improvement",
            changes: [
                { type: 'changed', text: '文章橫幅：重新設計，加入玻璃擬態徽章、大字體排版與互動式元數據提示。' },
                { type: 'changed', text: '頁尾重設計：緊湊佈局，整合頭像、狀態指示器與快速連結。' },
                { type: 'added', text: '加載優化：智慧快取機制，切換標籤頁時跳過加載畫面。' }
            ]
        },
        {
            version: "v1.5.0",
            date: "2025-12-04",
            title: "Mac 風格小工具與短文重設計",
            type: "feature",
            changes: [
                { type: 'added', text: 'Mac 風格小工具：首頁新增時鐘、電池、天氣與相片小工具，採用液態玻璃美學。' },
                { type: 'changed', text: '短文頁面重設計：統一與裝備頁面的橫幅設計，並更新卡片樣式。' },
                { type: 'added', text: '訪客統計：實作即時訪客追蹤，並在關於頁面加入 3D 翻轉卡片顯示統計。' },
                { type: 'changed', text: '首頁佈局：居中小工具並優化間距，視覺更平衡。' }
            ]
        },
        {
            version: "v1.4.1",
            date: "2025-12-04",
            title: "UX 體驗精煉",
            type: "improvement",
            changes: [
                { type: 'changed', text: '導覽列更新：將「短文」按鈕移至主導覽列以提升易用性。' },
                { type: 'fixed', text: '佈局修正：解決儀表板短文通知卡片的佈局問題。' },
                { type: 'changed', text: '視覺修飾：增強所有互動卡片的聚光燈效果。' }
            ]
        },
        {
            version: "v1.4.0",
            date: "2025-12-04",
            title: "全站 UI 升級與評論系統",
            type: "feature",
            changes: [
                { type: 'added', text: '評論系統：文章與短文皆支援完整評論功能（包含後台管理）。' },
                { type: 'changed', text: '全站 UI 升級：統一語意化色彩系統，並重構導覽列以維持一致的主題。' },
                { type: 'changed', text: '側邊欄增強：重新設計個人卡片（3D 傾斜）、Line 社交卡片（翻轉）並優化圖表。' },
                { type: 'changed', text: '視覺精煉：首頁文字更新為「音響設計之家」並修飾動畫細節。' }
            ]
        },
        {
            version: "v1.3.5",
            date: "2025-12-03",
            title: "分類與主題修飾",
            type: "feature",
            changes: [
                { type: 'added', text: '分類系統：首頁新增功能性分類篩選與動畫。' },
                { type: 'changed', text: '全站主題：全站藍色統一為 #709CEF。' },
                { type: 'changed', text: '儀表板：優化趨勢圖表並將通知列連接至最新短文。' },
                { type: 'changed', text: '社交卡片：側邊欄更新並整合 Line 官方帳號。' }
            ]
        },
        {
            version: "v1.3.0",
            date: "2025-12-03",
            title: "短文與後台功能",
            type: "feature",
            changes: [
                { type: 'added', text: '短文頁面：新增「短文心事」公開頁面，採用瀑布流佈局。' },
                { type: 'added', text: '後台短文管理：新增分頁切換以檢視、編輯與刪除短文。' },
                { type: 'added', text: '後台快速發布：儀表板頭部新增快速發布短文功能。' },
                { type: 'added', text: '部署：成功部署至 Firebase Hosting。' },
                { type: 'changed', text: 'Hero 區塊：優化垂直滾動動畫，加入隨機速度以增加層次感。' }
            ]
        },
        {
            version: "v1.2.0",
            date: "2025-01-15",
            title: "液態玻璃設計更新",
            type: "major",
            changes: [
                { type: 'major', text: '實作全新「液態玻璃」設計引擎，為全站帶來高級玻璃擬態美學。' },
                { type: 'added', text: '側邊欄更新即時數據視覺化。' }
            ]
        },
        {
            version: "v1.1.5",
            date: "2025-01-10",
            title: "效能優化",
            type: "improvement",
            changes: [
                { type: 'changed', text: '透過代碼拆分與圖片優化提升頁面載入速度 40%。' },
                { type: 'fixed', text: '修復行動裝置上的版面位移問題。' }
            ]
        },
        {
            version: "v1.1.0",
            date: "2025-01-01",
            title: "新年新功能",
            type: "feature",
            changes: [
                { type: 'added', text: '新增採用 Bento Grid 佈局的「關於」頁面。' },
                { type: 'added', text: '首頁導入互動式「像素背景」。' }
            ]
        },
        {
            version: "v1.0.0",
            date: "2024-12-25",
            title: "初版發布",
            type: "release",
            changes: [
                { type: 'added', text: '部落格系統正式上線。' },
                { type: 'added', text: '支援 Markdown、深色模式與響應式設計。' }
            ]
        }
    ];

    const getIconForType = (type) => {
        switch (type) {
            case 'added': return 'fa-plus-circle';
            case 'fixed': return 'fa-wrench'; // Using wrench for fixes
            case 'changed': return 'fa-pencil-alt'; // Pencil for changes
            case 'removed': return 'fa-trash-alt';
            case 'major': return 'fa-star';
            default: return 'fa-circle';
        }
    };

    const getColorForType = (type) => {
        switch (type) {
            case 'added': return 'text-emerald-400';
            case 'fixed': return 'text-orange-400';
            case 'changed': return 'text-blue-400';
            case 'removed': return 'text-red-400';
            case 'major': return 'text-yellow-400';
            default: return 'text-gray-400';
        }
    };

    const getBgForType = (type) => {
        switch (type) {
            case 'added': return 'bg-emerald-500/10 border-emerald-500/20';
            case 'fixed': return 'bg-orange-500/10 border-orange-500/20';
            case 'changed': return 'bg-blue-500/10 border-blue-500/20';
            case 'removed': return 'bg-red-500/10 border-red-500/20';
            default: return 'bg-white/5 border-white/10';
        }
    };

    return (
        <MainLayout>
            <div className="min-h-screen pt-24 pb-12 px-4 container mx-auto max-w-6xl">
                <div className="text-center mb-16 animate-fade-in space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 h-16 leading-tight">
                        更新日誌
                    </h1>
                    <p className="text-gray-400 text-lg">
                        記錄我們產品成長的每一個腳印
                    </p>
                </div>

                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/50 via-purple-500/30 to-transparent transform -translate-x-1/2"></div>

                    <div className="space-y-16">
                        {changelogs.map((log, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30, scale: 0.9, filter: "blur(10px)" }}
                                whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.4, delay: index * 0.05, type: "spring", bounce: 0.3 }}
                                className={`flex flex-col md:flex-row gap-8 items-start relative ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                            >
                                {/* Date Bubble (Center) */}
                                <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#1a1a1a] rounded-full border-2 border-blue-500 z-10 mt-6 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>

                                {/* Content Card */}
                                <div className="w-full md:w-[calc(50%-2rem)] pl-16 md:pl-0">
                                    <SpotlightCard
                                        className="p-6 md:p-8 hover:scale-[1.01] transition-transform duration-300 group relative overflow-hidden ring-1 ring-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl"
                                        spotlightColor="rgba(112, 156, 239, 0.1)"
                                    >
                                        <div className="relative z-10">
                                            {/* Header */}
                                            <div className="flex flex-wrap items-center gap-4 mb-6 pb-4 border-b border-white/5">
                                                <span className={`px-4 py-1.5 rounded-full text-sm font-bold tracking-wider shadow-lg backdrop-blur-md
                                                    ${log.type === 'major' ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-500/30' :
                                                        log.type === 'feature' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                                            'bg-gray-500/10 text-gray-400 border border-gray-500/20'}`}
                                                >
                                                    {log.version}
                                                </span>
                                                <span className="text-sm font-mono text-gray-500">
                                                    {log.date}
                                                </span>
                                            </div>

                                            <h3 className="text-2xl font-bold text-white mb-6 group-hover:text-blue-400 transition-colors">
                                                {log.title}
                                            </h3>

                                            {/* Changes Grid */}
                                            <div className="space-y-3">
                                                {log.changes.map((change, i) => (
                                                    <div key={i} className="flex gap-4 items-start group/item">
                                                        <div className={`mt-1 w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${getBgForType(change.type)}`}>
                                                            <i className={`fas ${getIconForType(change.type)} text-[10px] ${getColorForType(change.type)}`}></i>
                                                        </div>
                                                        <div className="text-gray-300 text-sm leading-relaxed group-hover/item:text-white transition-colors pt-0.5">
                                                            {change.text}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </SpotlightCard>
                                </div>

                                {/* Empty space for the other side of the timeline */}
                                <div className="hidden md:block w-[calc(50%-2rem)]"></div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Changelog;
