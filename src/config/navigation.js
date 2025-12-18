
export const libraryLinks = [
    { to: "/archives", label: "全部文章", icon: "fas fa-archive", color: "text-purple-400", bg: "bg-purple-500/20" },
    { to: "/categories", label: "分類列表", icon: "fas fa-folder", color: "text-green-400", bg: "bg-green-500/20" },
    { to: "/tags", label: "標籤列表", icon: "fas fa-tags", color: "text-orange-400", bg: "bg-orange-500/20" }
];

export const creationLinks = [
    { to: "/changelog", label: "更新日誌", icon: "fas fa-history", color: "text-yellow-400", bg: "bg-yellow-500/20" },
    { to: "/essay", label: "隨筆短文", icon: "fas fa-pen-fancy", color: "text-pink-400", bg: "bg-pink-500/20" },
    { to: "/album", label: "生活相簿", icon: "fas fa-images", color: "text-blue-400", bg: "bg-blue-500/20" }
];

export const authorLinks = [
    { to: "/music", label: "音樂館", icon: "fas fa-music", color: "text-red-400", bg: "bg-red-500/20" },
    { to: "/about", label: "關於本站", icon: "fas fa-user", color: "text-teal-400", bg: "bg-teal-500/20" },
    { to: "/equipment", label: "我的裝備", icon: "fas fa-tools", color: "text-indigo-400", bg: "bg-indigo-500/20" }
];

export const categories = [
    { title: "作品", icon: "fa-clipboard-list", colorClass: "bg-gradient-to-r from-[#72B5AD] to-[#5A9A92]", to: "/?category=作品紀錄", desc: "查看所有作品紀錄" },
    { title: "日常", icon: "fa-mug-hot", colorClass: "bg-gradient-to-r from-[#C982A1] to-[#B06A88]", to: "/?category=日常生活", desc: "查看所有日常生活" },
    { title: "時事", icon: "fa-newspaper", colorClass: "bg-gradient-to-r from-[#83A17E] to-[#6B8A66]", to: "/?category=時事新聞", desc: "查看所有時事新聞" },
    { title: "筆記", icon: "fa-book", colorClass: "bg-gradient-to-r from-[#C3B579] to-[#A89A5F]", to: "/?category=課堂筆記", desc: "查看所有課堂筆記" }
];

export const navigationGroups = [
    { title: "文庫", items: libraryLinks },
    { title: "創作", items: creationLinks },
    { title: "關於", items: authorLinks }
];
