import { useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const DotMatrixBackground = () => {
    const canvasRef = useRef(null);
    const { isDark } = useTheme();
    const isDarkRef = useRef(isDark);

    // Keep ref in sync
    useEffect(() => {
        isDarkRef.current = isDark;
    }, [isDark]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Dot configuration
        const gridSize = 30;
        const dotSize = 2;
        const dots = [];

        // Initialize dots
        const initDots = () => {
            dots.length = 0;
            const cols = Math.ceil(canvas.width / gridSize);
            const rows = Math.ceil(canvas.height / gridSize);

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    dots.push({
                        x: i * gridSize,
                        y: j * gridSize,
                        baseOpacity: 0.1 + Math.random() * 0.2,
                        phase: Math.random() * Math.PI * 2,
                        speed: 0.02 + Math.random() * 0.05
                    });
                }
            }
        };

        const handleResize = () => {
            resizeCanvas();
            initDots();
        };

        window.removeEventListener('resize', resizeCanvas);
        window.addEventListener('resize', handleResize);

        initDots();

        const render = () => {
            const currentIsDark = isDarkRef.current;

            // Background Color
            ctx.fillStyle = currentIsDark ? '#020617' : '#f0f9eb';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const time = Date.now() / 1000;

            dots.forEach(dot => {
                const opacity = dot.baseOpacity + Math.sin(time * dot.speed + dot.phase) * 0.1;
                const finalOpacity = Math.max(0, Math.min(1, opacity));

                if (currentIsDark) {
                    ctx.fillStyle = `rgba(29, 78, 216, ${finalOpacity})`;
                } else {
                    ctx.fillStyle = `rgba(96, 165, 250, ${finalOpacity})`;
                }

                ctx.beginPath();
                ctx.rect(dot.x, dot.y, dotSize, dotSize);
                ctx.fill();
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full -z-50 pointer-events-none transition-colors duration-500"
        />
    );
};

export default DotMatrixBackground;
