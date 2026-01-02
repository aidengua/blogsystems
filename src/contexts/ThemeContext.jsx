import { createContext, useContext, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved ? saved === 'dark' : true; // Default to true (dark)
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (isDark) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }, [isDark]);

    const toggleTheme = async (event) => {
        // Fallback for browsers that don't support View Transitions
        if (!document.startViewTransition || !event) {
            setIsDark(!isDark);
            return;
        }

        // Get click coordinates
        const x = event.clientX;
        const y = event.clientY;

        // Calculate the distance to the farthest corner
        const endRadius = Math.hypot(
            Math.max(x, window.innerWidth - x),
            Math.max(y, window.innerHeight - y)
        );

        // Start the transition
        const transition = document.startViewTransition(() => {
            flushSync(() => {
                setIsDark(!isDark);
            });
        });

        // Wait for the pseudo-elements to be created
        await transition.ready;

        // Animate the circle
        const clipPath = [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`
        ];

        document.documentElement.animate(
            {
                clipPath: clipPath,
            },
            {
                duration: 800,
                easing: 'ease-in-out', // Smoother easing
                pseudoElement: '::view-transition-new(root)', // Always animate the new view on top
            }
        );
    };

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
