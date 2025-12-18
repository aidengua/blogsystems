import { useEffect } from 'react';
import Lenis from 'lenis';
import { useSettings } from '../context/SettingsContext';

const SmoothScroll = () => {
    const { smoothScrollEnabled } = useSettings();

    useEffect(() => {
        if (!smoothScrollEnabled) return;

        const lenis = new Lenis({
            duration: 1.0, // Reduced from 1.2 for snappier feel
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential easing
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false, // Disable on mobile to prevent native conflict/lag
            touchMultiplier: 2,
        });

        let rafId;

        function raf(time) {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        }

        rafId = requestAnimationFrame(raf);

        return () => {
            cancelAnimationFrame(rafId);
            lenis.destroy();
        };
    }, [smoothScrollEnabled]);

    return null;
};

export default SmoothScroll;
