import { motion, AnimatePresence } from 'framer-motion';
import { useMusic } from '../context/MusicContext';
import { useState, useRef } from 'react';

const MusicPlayerCapsule = () => {
    const { currentSong, isPlaying, togglePlay, currentTime, duration, seek, parsedLyrics, currentLyricIndex, nextSong, prevSong, playlist, playSong } = useMusic();
    const [isHovered, setIsHovered] = useState(false);
    const progressBarRef = useRef(null);

    const effectiveSong = currentSong || (playlist.length > 0 ? playlist[0] : null);
    if (!effectiveSong) return null;

    const handleSeek = (e) => {
        e.stopPropagation();
        if (!progressBarRef.current) return;
        const rect = progressBarRef.current.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        seek(percent * duration);
    };

    const activeLyric = currentLyricIndex !== -1 && parsedLyrics[currentLyricIndex] ? parsedLyrics[currentLyricIndex].text : "";

    return (
        <motion.div
            layout
            initial={false}
            animate={{
                width: isPlaying ? 280 : 160,
                backgroundColor: isPlaying ? "rgba(0,0,0,0)" : "rgba(10,10,10,0.9)", // Transparent when active (uses bg image), dark when idle
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed bottom-6 left-6 z-[100] h-[36px] rounded-full overflow-hidden shadow-2xl border border-white/10 group cursor-pointer`}
            style={{ willChange: "width, transform" }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            onClick={() => !isPlaying && (currentSong ? togglePlay() : playSong(effectiveSong))}
        >
            {/* BACKGROUND LAYER */}
            <AnimatePresence>
                {isPlaying && (
                    <motion.div
                        key="bg-active"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 z-0"
                    >
                        <img src={currentSong.cover} className="w-full h-full object-cover blur-xl scale-150 opacity-80" />
                        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* CONTENT LAYER */}
            <div className="absolute inset-0 z-10 flex items-center pl-1 pr-2">

                {/* 1. SHARED ALBUM ART (Morphs position/style) */}
                <motion.div
                    layout
                    className="relative shrink-0 w-[28px] h-[28px] rounded-full overflow-hidden border border-white/10 bg-black z-20"
                >
                    <motion.img
                        src={effectiveSong.cover}
                        className="w-full h-full object-cover"
                        animate={{ rotate: isPlaying ? 360 : 0 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    />
                    {/* Idle Hover Overlay (Play Icon) */}
                    {!isPlaying && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <i className="fas fa-play text-white text-[10px]"></i>
                        </div>
                    )}
                </motion.div>

                {/* 2. DYNAMIC CONTENT AREA */}
                <div className="flex-1 min-w-0 h-full relative ml-2 flex items-center overflow-hidden">
                    <AnimatePresence mode="popLayout" initial={false}>
                        {isPlaying ? (
                            /* ACTIVE STATE CONTENT */
                            <motion.div
                                key="active-content"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex items-center w-full h-full"
                            >
                                <span className="text-white font-bold text-xs truncate max-w-[60px] mr-2 shadow-black drop-shadow-md">
                                    {currentSong.title}
                                </span>
                                <div className="flex-1 min-w-0 relative h-full flex items-center top-[-1px]">
                                    <AnimatePresence mode="popLayout">
                                        <motion.p
                                            key={activeLyric || "artist"}
                                            initial={{ y: 10, opacity: 0, filter: 'blur(4px)' }}
                                            animate={{ y: 0, opacity: 0.8, filter: 'blur(0px)' }}
                                            exit={{ y: -10, opacity: 0, filter: 'blur(4px)' }}
                                            className="text-[10px] text-white/90 truncate w-full font-medium"
                                        >
                                            {activeLyric || currentSong.artist}
                                        </motion.p>
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        ) : (
                            /* IDLE STATE CONTENT */
                            <motion.div
                                key="idle-content"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="flex flex-col justify-center w-full"
                            >
                                <span className="text-white text-[10px] font-bold truncate leading-tight">
                                    {effectiveSong.title}
                                </span>
                                <span className="text-white/50 text-[9px] truncate leading-tight">
                                    {effectiveSong.artist}
                                </span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* 3. CONTROLS (Only visible when Playing + Hovered) */}
                <AnimatePresence>
                    {isPlaying && isHovered && (
                        <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 20, opacity: 0 }}
                            className="absolute right-0 top-0 bottom-0 bg-gradient-to-l from-black/60 to-transparent pl-6 pr-2 flex items-center gap-2 z-30"
                        >
                            <button onClick={(e) => { e.stopPropagation(); prevSong(); }} className="text-white/80 hover:text-white hover:scale-110 transition-all"><i className="fas fa-step-backward text-[10px]"></i></button>
                            <button onClick={(e) => { e.stopPropagation(); togglePlay(); }} className="text-white hover:scale-110 transition-all"><i className="fas fa-pause text-xs"></i></button>
                            <button onClick={(e) => { e.stopPropagation(); nextSong(); }} className="text-white/80 hover:text-white hover:scale-110 transition-all"><i className="fas fa-step-forward text-[10px]"></i></button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* 4. PROGRESS BAR (Only Active) */}
            {isPlaying && (
                <div
                    ref={progressBarRef}
                    onClick={handleSeek}
                    className="absolute bottom-0 left-[40px] right-4 h-[2px] bg-white/10 cursor-pointer z-40 group/progress"
                >
                    <motion.div
                        layoutId="progress"
                        className="h-full bg-white relative shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                        style={{ width: `${(currentTime / duration) * 100}%` }}
                    />
                    <div className="absolute inset-0 -top-2 hover:bg-white/5" /> {/* Hit area */}
                </div>
            )}
        </motion.div>
    );
};

export default MusicPlayerCapsule;
