import { createContext, useContext, useState, useRef, useEffect } from 'react';

const MusicContext = createContext();

export const useMusic = () => {
    const context = useContext(MusicContext);
    if (!context) {
        throw new Error('useMusic must be used within a MusicProvider');
    }
    return context;
};

export const MusicProvider = ({ children }) => {
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.7);
    const [isExpanded, setIsExpanded] = useState(false);
    const audioRef = useRef(new Audio());

    // Playlist Data
    const [playlist, setPlaylist] = useState([]);

    useEffect(() => {
        // Fetch playlist from public/music/list.json
        fetch('/music/list.json')
            .then(res => res.json())
            .then(data => {
                // Map external format to internal format if needed, or just use as is
                // External: name, artist, url, cover, lrc
                // Internal expected: id (generate one), title (name), artist, audioUrl (url), cover, lrcUrl (lrc)
                const mappedSongs = data.map((item, index) => ({
                    id: String(index + 1),
                    title: item.name,
                    artist: item.artist,
                    cover: item.cover,
                    audioUrl: item.url,
                    lrcUrl: item.lrc, // Path to .lrc file
                    lyrics: '' // Will be fetched when playing
                }));
                setPlaylist(mappedSongs);
            })
            .catch(err => console.error("Failed to load music list:", err));
    }, []);

    // State for Dynamic Lyrics
    const [parsedLyrics, setParsedLyrics] = useState([]);
    const [currentLyricIndex, setCurrentLyricIndex] = useState(-1);

    // Parse LRC function
    const parseLRC = (lrcString) => {
        const lines = lrcString.split('\n');
        const result = [];
        const timeExp = /\[(\d{2}):(\d{2})(\.\d{2,3})?\]/;

        lines.forEach(line => {
            const match = timeExp.exec(line);
            if (match) {
                const minutes = parseInt(match[1], 10);
                const seconds = parseInt(match[2], 10);
                const milliseconds = match[3] ? parseFloat(match[3]) * 1000 : 0;
                const time = minutes * 60 + seconds + (milliseconds / 1000);
                const text = line.replace(timeExp, '').trim();

                if (text) { // Only add non-empty lines
                    result.push({ time, text });
                }
            }
        });
        return result.sort((a, b) => a.time - b.time); // Ensure sorted by time
    };

    // Update parsedLyrics when raw text changes
    useEffect(() => {
        if (currentSong?.lyrics) {
            const parsed = parseLRC(currentSong.lyrics);
            setParsedLyrics(parsed);
            setCurrentLyricIndex(-1); // Reset index on new song
        } else {
            setParsedLyrics([]);
            setCurrentLyricIndex(-1);
        }
    }, [currentSong?.lyrics]);

    useEffect(() => {
        const audio = audioRef.current;

        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime);

            // Sync Lyrics
            if (parsedLyrics.length > 0) {
                const currentTime = audio.currentTime;
                // Find the last lyric line that has started
                // We typically look for the index where startTime <= currentTime < nextStartTime
                let activeIndex = -1;
                for (let i = 0; i < parsedLyrics.length; i++) {
                    if (currentTime >= parsedLyrics[i].time) {
                        activeIndex = i;
                    } else {
                        break; // Stop once we exceed current time
                    }
                }
                setCurrentLyricIndex(activeIndex);
            }
        };

        const handleDurationChange = () => setDuration(audio.duration);
        const handleEnded = () => {
            setIsPlaying(false);
            // Auto play next logic
            const currentIndex = playlist.findIndex(s => s.id === currentSong?.id);
            if (currentIndex !== -1 && currentIndex < playlist.length - 1) {
                playSong(playlist[currentIndex + 1]);
            }
        };

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('durationchange', handleDurationChange);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('durationchange', handleDurationChange);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [currentSong, playlist, parsedLyrics]); // Added parsedLyrics dependency to sync correctly

    // Fetch Lyrics when currentSong changes
    useEffect(() => {
        if (currentSong?.lrcUrl) {
            fetch(currentSong.lrcUrl)
                .then(res => res.text())
                .then(text => {
                    setCurrentSong(prev => ({ ...prev, lyrics: text }));
                })
                .catch(err => console.error("Failed to load lyrics:", err));
        } else {
            // Clear lyrics if no URL (e.g., local mock with empty Lrc)
            if (currentSong) {
                setCurrentSong(prev => ({ ...prev, lyrics: '' }));
            }
        }
    }, [currentSong?.id, currentSong?.lrcUrl]);

    useEffect(() => {
        if (currentSong) {
            // Only update Src if changed to allow preloading logic elsewhere if needed
            if (audioRef.current.src !== new URL(currentSong.audioUrl, window.location.href).href) {
                audioRef.current.src = currentSong.audioUrl;
                if (isPlaying) {
                    audioRef.current.play().catch(e => {
                        if (e.name !== 'NotAllowedError') {
                            console.error("Playback failed", e);
                        }
                        setIsPlaying(false);
                    });
                }
            }
        }
    }, [currentSong?.audioUrl]);

    useEffect(() => {
        if (isPlaying) {
            audioRef.current.play().catch(e => {
                if (e.name !== 'NotAllowedError') {
                    console.error("Playback failed", e);
                }
                setIsPlaying(false);
            });
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    useEffect(() => {
        audioRef.current.volume = volume;
    }, [volume]);

    const playSong = (song) => {
        if (currentSong?.id === song.id) {
            togglePlay();
        } else {
            // Reset state for new song
            setCurrentSong({ ...song, lyrics: '' });
            setParsedLyrics([]); // Clear old lyrics immediately
            setCurrentLyricIndex(-1);
            setIsPlaying(true);
        }
    };

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    const seek = (time) => {
        audioRef.current.currentTime = time;
        setCurrentTime(time);

        // Update index immediately on seek
        if (parsedLyrics.length > 0) {
            let activeIndex = -1;
            for (let i = 0; i < parsedLyrics.length; i++) {
                if (time >= parsedLyrics[i].time) {
                    activeIndex = i;
                } else {
                    break;
                }
            }
            setCurrentLyricIndex(activeIndex);
        }
    };

    const nextSong = () => {
        const currentIndex = playlist.findIndex(s => s.id === currentSong?.id);
        if (currentIndex !== -1 && currentIndex < playlist.length - 1) {
            playSong(playlist[currentIndex + 1]);
        } else if (playlist.length > 0) {
            // Loop to first
            playSong(playlist[0]);
        }
    };

    const prevSong = () => {
        const currentIndex = playlist.findIndex(s => s.id === currentSong?.id);
        if (currentIndex > 0) {
            playSong(playlist[currentIndex - 1]);
        } else if (playlist.length > 0) {
            // Loop to last
            playSong(playlist[playlist.length - 1]);
        }
    };

    const value = {
        currentSong,
        isPlaying,
        currentTime,
        duration,
        volume,
        playlist,
        isExpanded,
        parsedLyrics,        // Export parsed lyrics
        currentLyricIndex,   // Export current index
        setIsExpanded,
        playSong,
        togglePlay,
        seek,
        setVolume,
        nextSong,   // Export nextSong
        prevSong    // Export prevSong
    };

    return (
        <MusicContext.Provider value={value}>
            {children}
        </MusicContext.Provider>
    );
};
