import { useEffect, useRef } from 'react';

const DotMatrixBackground = () => {
    const canvasRef = useRef(null);

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
        const gridSize = 30; // Spacing between dots
        const dotSize = 2;   // Size of each dot
        const dots = [];

        // Initialize dots
        const initDots = () => {
            dots.length = 0; // Clear existing dots
            const cols = Math.ceil(canvas.width / gridSize);
            const rows = Math.ceil(canvas.height / gridSize);

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    dots.push({
                        x: i * gridSize,
                        y: j * gridSize,
                        baseOpacity: 0.1 + Math.random() * 0.2, // Random base opacity between 0.1 and 0.3
                        phase: Math.random() * Math.PI * 2,
                        speed: 0.02 + Math.random() * 0.05
                    });
                }
            }
        };

        // Re-initialize dots on resize to fill new area
        // Debounce could be added here for performance, but simple reset is fine for now
        const handleResize = () => {
            resizeCanvas();
            initDots();
        };

        window.removeEventListener('resize', resizeCanvas); // Remove the basic one
        window.addEventListener('resize', handleResize);

        initDots();

        const render = () => {
            ctx.fillStyle = '#020617'; // Clear with base background color
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const time = Date.now() / 1000;

            dots.forEach(dot => {
                // Determine opacity using a sine wave for smooth pulsing
                const opacity = dot.baseOpacity + Math.sin(time * dot.speed + dot.phase) * 0.1;
                // Clamp opacity values
                const finalOpacity = Math.max(0, Math.min(1, opacity));

                // Deep blue/greenish tint for the dots
                // We'll use a slightly lighter teal/blue color for the dots against the dark background
                ctx.fillStyle = `rgba(6, 182, 212, ${finalOpacity})`; // Cyan-500 equivalent-ish

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
            className="fixed top-0 left-0 w-full h-full -z-50 pointer-events-none"
        />
    );
};

export default DotMatrixBackground;
