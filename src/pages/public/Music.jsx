import { motion, AnimatePresence } from 'framer-motion';
import { useMusic } from '../../context/MusicContext';
import { useState, useRef, useEffect } from 'react';
import Navbar from '../../components/Navbar'; // Import Navbar

const Music = () => {
    const {
        currentSong,
        isPlaying,
        togglePlay,
        nextSong,
        prevSong,
        currentTime,
        duration,
        seek,
        playlist,
        playSong,
        parsedLyrics,
        currentLyricIndex,
        volume,
        setVolume
    } = useMusic();

    const lyricsContainerRef = useRef(null);
    const [autoScroll, setAutoScroll] = useState(true);
    const [showPlaylist, setShowPlaylist] = useState(false); // Toggle for playlist
    const [showVolume, setShowVolume] = useState(false); // Toggle volume slider

    // Spacebar to Toggle Play
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.code === 'Space') {
                e.preventDefault(); // Prevent scrolling
                togglePlay();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [togglePlay]); // Dependency on togglePlay to ensure latest reference

    useEffect(() => {
        if (autoScroll && lyricsContainerRef.current && currentLyricIndex !== -1) {
            const activeEl = lyricsContainerRef.current.children[currentLyricIndex];
            if (activeEl) {
                activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [currentLyricIndex, autoScroll]);

    // Auto-init
    useEffect(() => {
        if (!currentSong && playlist.length > 0) {
            playSong(playlist[0]);
        }
    }, [currentSong, playlist, playSong]);

    const formatTime = (time) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    if (!currentSong) return <div className="min-h-screen bg-gray-50 dark:bg-[#0e0e0e]" />;

    return (
        <div className="relative min-h-screen w-full bg-gray-50 dark:bg-[#0e0e0e] text-gray-900 dark:text-white font-sans overflow-hidden flex flex-col">

            {/* 1. Global Navbar */}
            <div className="relative z-50">
                <Navbar />
            </div>

            {/* Background - Blurred Cover Art */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <motion.div
                    key={currentSong.cover}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0"
                >
                    <img src={currentSong.cover} className="w-full h-full object-cover blur-[100px] scale-125 saturate-200 opacity-60" />
                </motion.div>
                <div className="absolute inset-0 bg-white/80 dark:bg-black/30"></div>
            </div>

            {/* Main Content Area - Compacted for Single Screen View */}
            <div className="flex-1 relative z-10 flex flex-col items-center justify-center w-full max-w-[1600px] mx-auto px-8 lg:px-20 pt-20 lg:pt-24 pb-4">

                <div className="flex flex-col lg:flex-row items-center w-full gap-12 lg:gap-24">

                    {/* LEFT: Vinyl Player Card */}
                    <div className="flex flex-col items-center gap-6 shrink-0 relative group">

                        {/* The Vinyl Card Container - Reduced Size */}
                        <div className="relative w-[280px] h-[280px] lg:w-[380px] lg:h-[380px] bg-white/40 dark:bg-white/10 backdrop-blur-xl rounded-[40px] shadow-2xl flex items-center justify-center border border-gray-200 dark:border-white/10 overflow-hidden">

                            {/* Tone Arm (Stylized SVG/CSS) */}
                            <motion.div
                                className="absolute top-[-20px] right-8 w-6 h-40 origin-top z-20 pointer-events-none"
                                animate={{ rotate: isPlaying ? 25 : 0 }}
                                transition={{ type: 'spring', stiffness: 50, damping: 10 }}
                            >
                                {/* Arm Body */}
                                <div className="w-1.5 h-full bg-stone-300 mx-auto rounded-full shadow-lg relative">
                                    {/* Pivot */}
                                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-stone-200 border-4 border-stone-400 shadow-md"></div>
                                    {/* Head shell */}
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-8 bg-stone-300 rounded-md"></div>
                                </div>
                            </motion.div>

                            {/* The Record (Rotates) */}
                            <motion.div
                                animate={{ rotate: isPlaying ? 360 : 0 }}
                                transition={{ repeat: Infinity, duration: 10, ease: "linear", repeatType: isPlaying ? "loop" : "reverse" }} // Only loop if playing
                                style={{ animationPlayState: isPlaying ? 'running' : 'paused' }} // Force pause via CSS if needed, but framer handles values better
                                className="w-[85%] h-[85%] rounded-full bg-[#111] shadow-2xl relative flex items-center justify-center overflow-hidden border-[6px] border-[#1a1a1a]"
                            >
                                {/* Vinyl Groves Effect (CSS Radial) */}
                                <div className="absolute inset-0 rounded-full opacity-20"
                                    style={{ background: 'repeating-radial-gradient(#333 0, #333 2px, transparent 3px, transparent 4px)' }}>
                                </div>
                                {/* Album Cover (Label) */}
                                <div className="w-[55%] h-[55%] rounded-full overflow-hidden border-4 border-[#222] shadow-inner relative z-10">
                                    <img src={currentSong.cover} className="w-full h-full object-cover" />
                                </div>
                                {/* Highlights */}
                                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/5 to-transparent pointer-events-none"></div>
                            </motion.div>
                        </div>

                        {/* Song Info (Below Vinyl) */}
                        <div className="text-center space-y-2">
                            <motion.h1
                                layoutId="title"
                                className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white tracking-wide drop-shadow-lg"
                            >
                                {currentSong.title}
                            </motion.h1>
                            <motion.p
                                layoutId="artist"
                                className="text-base lg:text-lg text-gray-600 dark:text-white/70 font-medium tracking-widest drop-shadow-md"
                            >
                                {currentSong.artist}
                            </motion.p>
                        </div>

                    </div>


                    {/* RIGHT: Lyrics (Focused, Centered) */}
                    <div className="flex-1 w-full h-[40vh] lg:h-[50vh] flex flex-col items-center justify-center relative">
                        <div
                            ref={lyricsContainerRef}
                            onMouseEnter={() => setAutoScroll(false)}
                            onMouseLeave={() => setAutoScroll(true)}
                            className="w-full h-full overflow-y-auto scrollbar-hide py-[20vh] space-y-8 lg:space-y-10 text-center mask-image-y"
                        >
                            {parsedLyrics.length > 0 ? parsedLyrics.map((line, i) => (
                                <motion.div
                                    key={i}
                                    initial={false}
                                    animate={{
                                        opacity: currentLyricIndex === i ? 1 : 0.3,
                                        blur: currentLyricIndex === i ? 0 : 2,
                                        scale: currentLyricIndex === i ? 1.05 : 0.95,
                                    }}
                                    transition={{ duration: 0.5 }}
                                    className={`
                                         text-xl lg:text-3xl font-bold tracking-wider cursor-pointer transition-all drop-shadow-md
                                         ${currentLyricIndex === i ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-200'}
                                     `}
                                    onClick={() => seek(line.time)}
                                >
                                    {line.text}
                                </motion.div>
                            )) : (
                                <div className="opacity-30 tracking-widest text-xl">PURE MUSIC</div>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            {/* Bottom Control Bar */}
            <div className="relative z-50 w-full px-8 lg:px-20 pb-12 pt-4">
                <div className="max-w-[1600px] mx-auto flex flex-col gap-4">

                    {/* Progress Bar (Full Width, Thin) */}
                    <div
                        className="w-full h-1 bg-gray-300 dark:bg-white/20 rounded-full cursor-pointer group relative hover:h-1.5 transition-all"
                        onClick={(e) => seek(((e.clientX - e.currentTarget.getBoundingClientRect().left) / e.currentTarget.getBoundingClientRect().width) * duration)}
                    >
                        <div
                            className="h-full bg-blue-500 dark:bg-white rounded-full relative group-hover:bg-blue-600 dark:group-hover:bg-green-400 transition-colors"
                            style={{ width: `${(currentTime / duration) * 100}%` }}
                        >
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                    </div>

                    {/* Controls Row */}
                    <div className="flex items-center justify-between text-xs font-mono text-gray-600 dark:text-white/70 tracking-widest">
                        <span>{formatTime(currentTime)}</span>

                        <div className="flex items-center gap-10">
                            <button onClick={prevSong} className="hover:text-gray-900 dark:hover:text-white transition-colors hover:scale-110 active:scale-95"><i className="fas fa-backward text-xl"></i></button>
                            <button
                                onClick={togglePlay}
                                className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-900 dark:bg-white text-white dark:text-black hover:scale-105 transition-transform shadow-lg hover:shadow-gray-400 dark:hover:shadow-white/20"
                            >
                                <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} text-lg ml-0.5`}></i>
                            </button>
                            <button onClick={nextSong} className="hover:text-white transition-colors hover:scale-110 active:scale-95"><i className="fas fa-forward text-xl"></i></button>
                        </div>

                        <div className="flex items-center gap-6">
                            <span>{formatTime(duration)}</span>

                            {/* Volume Control */}
                            <div
                                className="relative flex items-center"
                                onMouseEnter={() => setShowVolume(true)}
                                onMouseLeave={() => setShowVolume(false)}
                            >
                                <button className="hover:text-white transition-colors p-2">
                                    <i className={`fas ${volume === 0 ? 'fa-volume-mute' : volume < 0.5 ? 'fa-volume-down' : 'fa-volume-up'} text-lg`}></i>
                                </button>

                                <AnimatePresence>
                                    {showVolume && (
                                        <motion.div
                                            initial={{ opacity: 0, width: 0 }}
                                            animate={{ opacity: 1, width: 80 }}
                                            exit={{ opacity: 0, width: 0 }}
                                            className="overflow-hidden flex items-center pl-2"
                                        >
                                            <input
                                                type="range"
                                                min="0"
                                                max="1"
                                                step="0.01"
                                                value={volume}
                                                onChange={(e) => setVolume(parseFloat(e.target.value))}
                                                className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Playlist Toggle */}
                            <button onClick={() => setShowPlaylist(!showPlaylist)} className={`hover:text-white transition-colors ${showPlaylist ? 'text-white' : ''} p-2`}>
                                <i className="fas fa-list text-lg"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Playlist Overlay (Right Side - Redesigned) */}
            <AnimatePresence>
                {showPlaylist && (
                    <motion.div
                        initial={{ x: '100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="absolute top-0 right-0 h-full w-full max-w-[480px] bg-[#121212]/95 backdrop-blur-3xl z-[60] shadow-2xl flex flex-col border-l border-white/5"
                    >
                        {/* Header */}
                        <div className="p-8 border-b border-white/5 flex items-start justify-between bg-white/5">
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-1">Current Playing</h3>
                                <p className="text-sm text-white/40 font-mono tracking-wider">{playlist.length} Songs</p>
                            </div>
                            <button
                                onClick={() => setShowPlaylist(false)}
                                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white/50 hover:text-white"
                            >
                                <i className="fas fa-times text-lg"></i>
                            </button>
                        </div>

                        {/* Song List */}
                        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent p-4 space-y-2">
                            {playlist.map((song, i) => {
                                const isActive = currentSong.id === song.id;
                                return (
                                    <motion.div
                                        key={song.id}
                                        onClick={() => playSong(song)}
                                        initial={false}
                                        className={`
                                            group relative p-4 rounded-3xl flex items-center gap-6 cursor-pointer border border-transparent transition-all duration-300
                                            ${isActive
                                                ? 'bg-white/10 border-white/5 shadow-2xl shadow-black/50'
                                                : 'hover:bg-white/5 text-gray-400 opacity-60 hover:opacity-100'}
                                        `}
                                    >
                                        {/* Index / Playing State */}
                                        <div className="w-8 flex justify-center shrink-0">
                                            {isActive ? (
                                                <div className="flex gap-1 items-end h-4">
                                                    <motion.div animate={{ height: [4, 16, 4] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1 bg-yellow-400 rounded-full" />
                                                    <motion.div animate={{ height: [8, 12, 8] }} transition={{ repeat: Infinity, duration: 1.1 }} className="w-1 bg-yellow-400 rounded-full" />
                                                    <motion.div animate={{ height: [4, 10, 4] }} transition={{ repeat: Infinity, duration: 0.9 }} className="w-1 bg-yellow-400 rounded-full" />
                                                </div>
                                            ) : (
                                                <span className="text-sm font-mono font-bold opacity-30 group-hover:text-white group-hover:opacity-100 transition-all">
                                                    {(i + 1).toString().padStart(2, '0')}
                                                </span>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0 flex flex-col gap-1">
                                            <div className={`text-base font-bold truncate ${isActive ? 'text-white' : 'text-inherit'}`}>
                                                {song.title}
                                            </div>
                                            <div className="text-xs font-medium opacity-50 truncate">
                                                {song.artist}
                                            </div>
                                        </div>

                                        {/* Cover Art (Right Side) */}
                                        <div className="w-12 h-12 rounded-lg overflow-hidden shadow-lg shrink-0 border border-white/5 bg-black/20">
                                            <img src={song.cover} className="w-full h-full object-cover" loading="lazy" />
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                .mask-image-y { mask-image: linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%); }
                .scrollbar-hide::-webkit-scrollbar { display: none; }
             `}</style>
        </div>
    );
};

export default Music;
