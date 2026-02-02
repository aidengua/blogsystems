
import { useTheme } from '../contexts/ThemeContext';
import BlackLogo from '../assets/misc/blacklogo.png';
import WhiteLogo from '../assets/misc/whitelogo.png';

const LogoLoader = ({ size = "w-12 h-12", className = "", animate = true }) => {
    const { isDark } = useTheme();

    return (
        <div className={`flex items-center justify-center ${className}`}>
            <img
                src={isDark ? WhiteLogo : BlackLogo}
                alt="Loading..."
                className={`${size} object-contain ${animate ? 'animate-pulse' : ''}`}
            />
        </div>
    );
};

export default LogoLoader;
