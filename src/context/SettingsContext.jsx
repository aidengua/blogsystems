import { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
    const [smoothScrollEnabled, setSmoothScrollEnabled] = useState(() => {
        const saved = localStorage.getItem('smoothScrollEnabled');
        return saved !== null ? JSON.parse(saved) : true;
    });

    const [glslBackgroundEnabled, setGlslBackgroundEnabled] = useState(false);
    const [currentGlslEffect, setCurrentGlslEffect] = useState(0);

    useEffect(() => {
        localStorage.setItem('smoothScrollEnabled', JSON.stringify(smoothScrollEnabled));
    }, [smoothScrollEnabled]);

    const toggleSmoothScroll = () => {
        setSmoothScrollEnabled(prev => !prev);
    };

    const toggleGlslBackground = () => {
        setGlslBackgroundEnabled(prev => !prev);
    };

    return (
        <SettingsContext.Provider value={{
            smoothScrollEnabled,
            toggleSmoothScroll,
            glslBackgroundEnabled,
            toggleGlslBackground,
            currentGlslEffect,
            setCurrentGlslEffect
        }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
