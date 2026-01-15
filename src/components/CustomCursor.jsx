import { useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';
import { useTheme } from '../contexts/ThemeContext';

const CustomCursor = () => {
    const { customCursorEnabled } = useSettings();
    const { isDark } = useTheme();

    useEffect(() => {
        if (!customCursorEnabled) return;

        // Determine cursor set based on theme
        // Light Mode (White BG) -> Needs Dark Cursor (from 'dark' folder?)
        // Dark Mode (Black BG) -> Needs Light Cursor (from 'light' folder?)
        // Let's assume folder names represent the cursor COLOR.
        // Dark folder = Dark Cursors. Light folder = Light Cursors.
        const cursorTheme = isDark ? 'light' : 'dark';

        const style = document.createElement('style');
        style.type = 'text/css';
        style.id = 'custom-cursor-style';
        style.innerHTML = `
            @media (pointer: fine) {
                :root {
                    --cursor-normal: url('/cursors/${cursorTheme}/arrow.cur'), auto;
                    --cursor-pointer: url('/cursors/${cursorTheme}/hand.cur'), pointer;
                    --cursor-text: url('/cursors/${cursorTheme}/ibeam.cur'), text;
                    --cursor-zoom: url('/cursors/${cursorTheme}/crosshair.cur') 16 16, crosshair;
                }
                
                body, html {
                    cursor: var(--cursor-normal) !important;
                }

                a, button, [role="button"], input, label, select, textarea, .cursor-pointer {
                    cursor: var(--cursor-pointer) !important;
                }

                /* Zoom/Magnify Cursor */
                .cursor-zoom-in, [style*="cursor: zoom-in"], .medium-zoom-image {
                    cursor: var(--cursor-zoom) !important;
                }

                /* Text Cursor */
                p, h1, h2, h3, h4, h5, h6, span, div, article, section {
                   /* Intentionally left auto/normal for container, but text inputs need specific handling */
                }

                input[type="text"], input[type="password"], input[type="email"], textarea {
                    cursor: var(--cursor-text) !important;
                }

                .cursor-text {
                    cursor: var(--cursor-text) !important;
                }
                
                /* Override specific specific cursors if needed */
                .cursor-move {
                    cursor: move !important;
                }
                .cursor-not-allowed {
                    cursor: not-allowed !important;
                }
            }
        `;
        document.head.appendChild(style);

        return () => {
            const existingStyle = document.getElementById('custom-cursor-style');
            if (existingStyle) existingStyle.remove();
        };
    }, [customCursorEnabled, isDark]);

    return null;
};

export default CustomCursor;
