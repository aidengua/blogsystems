import { useEffect, useState } from 'react';
import Typewriter from 'typewriter-effect';
import WebGLBackground from './WebGLBackground';

const TopImage = () => {
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setOffset(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToContent = () => {
        window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth'
        });
    };

    return (
        <div className="relative h-screen w-full overflow-hidden">
            {/* WebGL Background */}
            <div className="absolute inset-0">
                <WebGLBackground height="100vh" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40"></div>
            </div>

            {/* Content - Removed for Anzhiyu Dashboard Style */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-4 text-center pointer-events-none">
                {/* Text removed to allow HeroDashboard to take focus */}
            </div>

            {/* Scroll Down Arrow */}
            <div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 cursor-pointer animate-bounce"
                onClick={scrollToContent}
            >
                <i className="fas fa-chevron-down text-3xl text-white opacity-80 hover:opacity-100 transition-opacity"></i>
            </div>
        </div>
    );
};

export default TopImage;
