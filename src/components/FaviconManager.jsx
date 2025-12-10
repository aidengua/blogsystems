import { useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import whiteLogo from '../assets/misc/whitelogo.png';
import blackLogo from '../assets/misc/blacklogo.png';

const FaviconManager = () => {
    const { isDark } = useTheme();

    useEffect(() => {
        const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
        link.type = 'image/png';
        link.rel = 'icon';
        link.href = isDark ? whiteLogo : blackLogo;

        document.getElementsByTagName('head')[0].appendChild(link);
    }, [isDark]);

    return null;
};

export default FaviconManager;
