const changelogs = [
    {
        version: 'v1.13.0',
        date: '2025-12-17',
        title: 'GLSL 動態背景實驗室',
        type: 'feature',
        changes: [
            {
                type: 'added',
                text: '實驗室功能：控制中心新增「GLSL 動態背景」實驗室，提供四種獨特的 Shader 渲染效果，帶來沉浸式視覺體驗。'
            },
            {
                type: 'added',
                text: '多樣化模式：包含經典紫流 (Purple Flow)、綠色雜訊 (Green Noise)、紅色通道 (Red Tunnel) 與暗黑流體 (Dark Fluid) 四種風格。'
            },
            {
                type: 'changed',
                text: '介面優化：控制中心採用緊湊的內嵌式按鈕設計，支援即時預覽與切換背景效果。'
            },
            {
                type: 'fixed',
                text: '渲染修復：解決 ShaderMaterial 在特定裝置上因缺失擴充指令導致的編譯錯誤。'
            }
        ]
    },
    {
        version: 'v1.12.0',
        date: '2025-12-16',
        title: '介面體驗升級與滑動阻尼',
        type: 'major',
        changes: [
            {
                type: 'added',
                text: '滑動體驗：引入 Lenis 實現全站平滑滾動 (Smooth Scroll) 阻尼效果，提升瀏覽質感。'
            },
            {
                type: 'changed',
                text: '控制中心改版：介面全面中文化，並在底部新增「偏好設定」列，支援快速切換深色模式與開啟/關閉滑動阻尼。'
            },
            {
                type: 'changed',
                text: '搜尋介面優化：搜尋視窗 (Search Modal) 完整適應亮色與深色主題，優化輸入框與結果列表的視覺層次。'
            },
            {
                type: 'fixed',
                text: '細節修正：修復控制中心與搜尋介面在特定操作下的顯示邏輯與樣式問題。'
            }
        ]
    },
    {
        version: 'v1.11.0',
        date: '2025-12-16',
        title: '全站主題適應性修復',
        type: 'major',
        changes: [
            {
                type: 'fixed',
                text: '頁面修復：全面修正首頁、關於頁、短文頁、文章詳情頁、標籤與分類頁在淺色模式下的顯示問題。'
            },
            {
                type: 'changed',
                text: '組件優化：更新導覽列 (Navbar)、頁尾 (Footer)、側邊欄 (Sidebar) 與 Line 卡片，確保在亮色主題下的可讀性與視覺層次。'
            },
            {
                type: 'changed',
                text: '關於頁面：Bento Grid 所有卡片 (個人簡介、統計、地圖、技能盾牌等) 皆已適應雙主題，並優化漸層與陰影。'
            },
            {
                type: 'fixed',
                text: '視覺細節：修正 Skills Creative Engine、回到頂部按鈕與各類標籤在淺色模式下的色彩對比。'
            }
        ]
    },
    {
        version: 'v1.10.0',
        date: '2025-12-16',
        title: '相簿搜尋整合與體驗升級',
        type: 'major',
        changes: [
            {
                type: 'added',
                text: '站內搜尋升級：全域搜尋整合「生活相簿」，支援搜尋照片標籤、描述與標題，並顯示縮圖。'
            },
            {
                type: 'added',
                text: '後台管理優化：新增文章「自訂發布時間」功能與評論刪除二次確認機制。'
            },
            {
                type: 'changed',
                text: '生活相簿改版：移除搜尋列，採用沉浸式 Hero Banner 設計，並優化燈箱檢視體驗 (去除黑邊)。'
            },
            {
                type: 'fixed',
                text: '系統修復：解決圖片在特定路由切換下無法正確載入 (LazyLoad) 的問題。'
            }
        ]
    },
    {
        version: "v1.9.0",
        date: "2025-12-16",
        title: "關於頁面重構與代碼優化",
        type: "major",
        changes: [
            { type: 'added', text: '關於頁面重構：統計卡片新增光場特效 (Spotlight) 與互動修復，個人資訊與人格特質卡片視覺升級。' },
            { type: 'changed', text: '代碼架構優化：中心化導覽配置 (navigation.js) 並模組化核心元件，提升維護性。' },
            { type: 'fixed', text: '系統修復：解決音樂播放器在行動裝置上無法暫停的問題。' }
        ]
    },
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

export default changelogs;
