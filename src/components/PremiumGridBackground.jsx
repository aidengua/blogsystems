import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import clsx from 'clsx';

const PremiumGridBackground = () => {
    const { isDark } = useTheme();

    // Colors based on theme - subtle static grid
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)';

    return (
        <div
            className={clsx(
                "fixed inset-0 w-full h-full -z-50 transition-colors duration-500 overflow-hidden pointer-events-none",
                isDark ? "bg-[#02040a]" : "bg-[#f8f9fa]"
            )}
        >
            {/* Static Grid Pattern */}
            <div
                className="absolute inset-0 w-full h-full"
                style={{
                    backgroundImage: `linear-gradient(to right, ${gridColor} 1px, transparent 1px), linear-gradient(to bottom, ${gridColor} 1px, transparent 1px)`,
                    backgroundSize: '100px 100px', // Larger grid as requested
                    maskImage: 'radial-gradient(ellipse at center, black 60%, transparent 100%)', // Subtle vignette for focus
                    WebkitMaskImage: 'radial-gradient(ellipse at center, black 60%, transparent 100%)'
                }}
            />
        </div>
    );
};

export default PremiumGridBackground;


