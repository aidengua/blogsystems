import { useMusic } from '../context/MusicContext';

const MusicPlaylistCard = () => {
    const { playlist, playSong, currentSong, isPlaying } = useMusic();

    return (
        <div className="h-full bg-gray-900 dark:bg-black rounded-3xl p-6 text-white shadow-xl border border-gray-800 relative overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-4 relative z-10">
                <div>
                    <div className="text-gray-400 text-sm">音樂館</div>
                    <div className="text-2xl font-bold">源于熱愛</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <i className="fas fa-music text-purple-400"></i>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar relative z-10 space-y-2">
                {playlist.map((song, index) => (
                    <div
                        key={song.id}
                        onClick={() => playSong(song)}
                        className={`group flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all duration-300 ${currentSong?.id === song.id
                            ? 'bg-white/10 border border-purple-500/50'
                            : 'hover:bg-white/5 border border-transparent'
                            }`}
                    >
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0">
                            <img src={song.cover} alt={song.title} className="w-full h-full object-cover" />
                            {currentSong?.id === song.id && isPlaying && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                    <div className="w-1 h-3 bg-purple-400 animate-pulse mx-0.5"></div>
                                    <div className="w-1 h-2 bg-purple-400 animate-pulse mx-0.5" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-1 h-3 bg-purple-400 animate-pulse mx-0.5" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className={`text-sm font-bold truncate ${currentSong?.id === song.id ? 'text-purple-400' : 'text-gray-200 group-hover:text-white'}`}>
                                {song.title}
                            </h4>
                            <p className="text-xs text-gray-500 truncate">{song.artist}</p>
                        </div>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${currentSong?.id === song.id
                            ? 'bg-purple-500 text-white'
                            : 'bg-transparent text-gray-600 group-hover:bg-white/10 group-hover:text-gray-300'
                            }`}>
                            <i className={`fas ${currentSong?.id === song.id && isPlaying ? 'fa-pause' : 'fa-play'} text-xs ml-0.5`}></i>
                        </div>
                    </div>
                ))}
            </div>

            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        </div>
    );
};

export default MusicPlaylistCard;
