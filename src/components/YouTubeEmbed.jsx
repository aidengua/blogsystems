import React from 'react';

const YouTubeEmbed = ({ videoId }) => {
    if (!videoId) return null;

    return (
        <div className="w-full my-5 rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800 bg-black">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                ></iframe>
            </div>
        </div>
    );
};

export default YouTubeEmbed;
