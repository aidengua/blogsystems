import { useEffect, useRef } from 'react';

const PixelBackground = () => {
    const canvasRef = useRef(null);
    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        const handleMouseMove = (e) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener('mousemove', handleMouseMove);

        // Configuration
        const gap = 30; // Distance between dots
        const radius = 1.5; // Base radius of dots
        const hoverRadius = 150; // Radius of mouse influence

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw Dots
            for (let x = 0; x < canvas.width; x += gap) {
                for (let y = 0; y < canvas.height; y += gap) {
                    // Calculate distance to mouse
                    const dx = x - mouseRef.current.x;
                    const dy = y - mouseRef.current.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    // Calculate scale/opacity based on distance
                    let scale = 1;
                    let alpha = 0.1; // Base opacity

                    if (distance < hoverRadius) {
                        const factor = 1 - distance / hoverRadius;
                        scale = 1 + factor * 1.5; // Grow up to 2.5x
                        alpha = 0.1 + factor * 0.4; // Increase opacity
                    }

                    ctx.beginPath();
                    ctx.arc(x, y, radius * scale, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(59, 130, 246, ${alpha})`; // Primary blue color
                    ctx.fill();
                }
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-0"
            style={{ opacity: 0.6 }}
        />
    );
};

export default PixelBackground;
