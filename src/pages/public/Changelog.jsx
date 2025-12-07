import { useState } from 'react';
import MainLayout from '../../layouts/MainLayout';
import { motion } from 'framer-motion';
import SpotlightCard from '../../components/SpotlightCard';

const Changelog = () => {
    // Mock data for changelog - in a real app this could come from Firebase
    const changelogs = [
        {
            version: "v1.6.2",
            date: "2025-12-07",
            title: "系統優化與視覺升級",
            content: (
                <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>後台管理：</strong> 新增更新日誌管理功能，支援新增、編輯與刪除日誌。</li>
                    <li><strong>視覺優化：</strong> 全站主題色統一為 `#709CEF`，並修復背景主題切換顯示問題。</li>
                    <li><strong>標籤頁面：</strong> 全新精簡版標題設計與版面優化，提升閱讀體驗。</li>
                    <li><strong>功能改進：</strong> 文章分類頁新增「清除篩選」按鈕，首頁標題顯示優化。</li>
                </ul>
            ),
            type: "improvement"
        },
        {
            version: "v1.6.1",
            date: "2025-12-07",
            title: "TOC 目錄優化與 AI 升級",
            content: (
                <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>目錄優化：</strong> 實作自適應高度、「智慧模糊」揭示邏輯，並隱藏滾動條以提供更乾淨的閱讀體驗。</li>
                    <li><strong>Gemini AI 2.0：</strong> 升級至 `flash-lite` 模型，並以現代化「深色膠囊」美學重新設計 AI 觸發按鈕。</li>
                    <li><strong>系統修飾：</strong> 重命名分類並修復 Markdown 渲染警告。</li>
                </ul>
            ),
            type: "improvement"
        },
        {
            version: "v1.6.0",
            date: "2025-12-07",
            title: "行動版與視覺進化",
            content: (
                <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>行動版選單重設計：</strong> 採用「動態島」風格的頂部展開選單，搭配流暢的彈性動畫。</li>
                    <li><strong>個人卡片 2.0：</strong> 以精緻的「呼吸與淡入」效果取代翻轉動畫，並新增簽名檔 GIF。</li>
                    <li><strong>Line 卡片修飾：</strong> 放大 Logo 並加入模糊浮水印效果（移除綠色背景），提升質感。</li>
                    <li><strong>行動版體驗：</strong> 實作可滾動的標籤列，並優化小螢幕的間距。</li>
                </ul>
            ),
            type: "major"
        },
        {
            version: "v1.5.1",
            date: "2025-12-06",
            title: "視覺與效能修飾",
            content: (
                <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>文章橫幅：</strong> 重新設計，加入玻璃擬態徽章、大字體排版與互動式元數據提示。</li>
                    <li><strong>頁尾重設計：</strong> 緊湊佈局，整合頭像、狀態指示器與快速連結。</li>
                    <li><strong>加載優化：</strong> 智慧快取機制，切換標籤頁時跳過加載畫面。</li>
                </ul>
            ),
            type: "improvement"
        },
        {
            version: "v1.5.0",
            date: "2025-12-04",
            title: "Mac 風格小工具與短文重設計",
            content: (
                <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Mac 風格小工具：</strong> 首頁新增時鐘、電池、天氣與相片小工具，採用液態玻璃美學。</li>
                    <li><strong>短文頁面重設計：</strong> 統一與裝備頁面的橫幅設計，並更新卡片樣式。</li>
                    <li><strong>訪客統計：</strong> 實作即時訪客追蹤，並在關於頁面加入 3D 翻轉卡片顯示統計。</li>
                    <li><strong>首頁佈局：</strong> 居中小工具並優化間距，視覺更平衡。</li>
                </ul>
            ),
            type: "feature"
        },
        {
            version: "v1.4.1",
            date: "2025-12-04",
            title: "UX 體驗精煉",
            content: (
                <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>導覽列更新：</strong> 將「短文」按鈕移至主導覽列以提升易用性。</li>
                    <li><strong>佈局修正：</strong> 解決儀表板短文通知卡片的佈局問題。</li>
                    <li><strong>視覺修飾：</strong> 增強所有互動卡片的聚光燈效果。</li>
                </ul>
            ),
            type: "improvement"
        },
        {
            version: "v1.4.0",
            date: "2025-12-04",
            title: "全站 UI 升級與評論系統",
            content: (
                <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>評論系統：</strong> 文章與短文皆支援完整評論功能（包含後台管理）。</li>
                    <li><strong>全站 UI 升級：</strong> 統一語意化色彩系統，並重構導覽列以維持一致的主題。</li>
                    <li><strong>側邊欄增強：</strong> 重新設計個人卡片（3D 傾斜）、Line 社交卡片（翻轉）並優化圖表。</li>
                    <li><strong>視覺精煉：</strong> 首頁文字更新為「音響設計之家」並修飾動畫細節。</li>
                </ul>
            ),
            type: "feature"
        },
        {
            version: "v1.3.5",
            date: "2025-12-03",
            title: "分類與主題修飾",
            content: (
                <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>分類系統：</strong> 首頁新增功能性分類篩選與動畫。</li>
                    <li><strong>全站主題：</strong> 全站藍色統一為 #709CEF。</li>
                    <li><strong>儀表板：</strong> 優化趨勢圖表並將通知列連接至最新短文。</li>
                    <li><strong>社交卡片：</strong> 側邊欄更新並整合 Line 官方帳號。</li>
                </ul>
            ),
            type: "feature"
        },
        {
            version: "v1.3.0",
            date: "2025-12-03",
            title: "短文與後台功能",
            content: (
                <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>短文頁面：</strong> 新增「短文心事」公開頁面，採用瀑布流佈局。</li>
                    <li><strong>後台短文管理：</strong> 新增分頁切換以檢視、編輯與刪除短文。</li>
                    <li><strong>後台快速發布：</strong> 儀表板頭部新增快速發布短文功能。</li>
                    <li><strong>部署：</strong> 成功部署至 Firebase Hosting。</li>
                    <li><strong>Hero 區塊：</strong> 優化垂直滾動動畫，加入隨機速度以增加層次感。</li>
                </ul>
            ),
            type: "feature"
        },
        {
            version: "v1.2.0",
            date: "2025-01-15",
            title: "液態玻璃設計更新",
            content: "實作全新「液態玻璃」設計引擎，為全站帶來高級玻璃擬態美學。側邊欄更新即時數據視覺化。",
            type: "major"
        },
        {
            version: "v1.1.5",
            date: "2025-01-10",
            title: "效能優化",
            content: "透過代碼拆分與圖片優化提升頁面載入速度 40%。修復行動裝置上的版面位移問題。",
            type: "improvement"
        },
        {
            version: "v1.1.0",
            date: "2025-01-01",
            title: "新年新功能",
            content: "新增採用 Bento Grid 佈局的「關於」頁面。首頁導入互動式「像素背景」。",
            type: "feature"
        },
        {
            version: "v1.0.0",
            date: "2024-12-25",
            title: "初版發布",
            content: "部落格系統正式上線。支援 Markdown、深色模式與響應式設計。",
            type: "release"
        }
    ];

    return (
        <MainLayout>
            <div className="min-h-screen pt-24 pb-12 px-4 container mx-auto max-w-4xl">
                <div className="text-center mb-16 animate-fade-in">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        更新日誌
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        記錄我們成長的每一步
                    </p>
                </div>

                <div className="relative">
                    {/* Vertical Line */}
                    <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-transparent opacity-30 transform -translate-x-1/2"></div>

                    <div className="space-y-12">
                        {changelogs.map((log, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className={`flex flex-col md:flex-row gap-8 items-start relative ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                            >
                                {/* Date Bubble (Center) */}
                                <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-500 rounded-full border-4 border-white dark:border-gray-900 z-10 mt-6 shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>

                                {/* Content Card */}
                                <div className="w-full md:w-[calc(50%-2rem)] pl-16 md:pl-0">
                                    <SpotlightCard
                                        className="p-6 hover:scale-[1.02] transition-transform duration-300 group relative overflow-hidden"
                                        spotlightColor="rgba(112, 156, 239, 0.15)"
                                    >
                                        {/* Decorative Gradient Blob */}
                                        <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500
                                            ${log.type === 'major' ? 'from-blue-500 to-purple-500' :
                                                log.type === 'feature' ? 'from-green-500 to-teal-500' :
                                                    log.type === 'improvement' ? 'from-orange-500 to-yellow-500' : 'from-gray-500 to-gray-300'}`}
                                        ></div>

                                        <div className="relative z-10">
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                                                    ${log.type === 'major' ? 'bg-blue-500/20 text-[#709CEF]' :
                                                        log.type === 'feature' ? 'bg-green-500/20 text-green-500' :
                                                            log.type === 'improvement' ? 'bg-orange-500/20 text-orange-500' : 'bg-gray-500/20 text-gray-400'}`}
                                                >
                                                    {log.version}
                                                </span>
                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                    {log.date}
                                                </span>
                                            </div>
                                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-400 transition-colors">
                                                {log.title}
                                            </h3>
                                            <div className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                                {log.content}
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
