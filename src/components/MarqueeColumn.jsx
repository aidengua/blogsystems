import { useRef, useEffect } from 'react';
import TiltCard from './TiltCard';

const MarqueeColumn = ({ images, duration }) => {
    const scrollerRef = useRef(null);
    const animationRef = useRef(null);
    const startTimeRef = useRef(null);

    useEffect(() => {
        const scroller = scrollerRef.current;
        if (!scroller) return;

        const animate = (timestamp) => {
            if (!startTimeRef.current) startTimeRef.current = timestamp;
            const elapsed = timestamp - startTimeRef.current;

            // Calculate progress: 0 to 1 over 'duration' seconds
            const progress = (elapsed % (duration * 1000)) / (duration * 1000);

            // Move from 0% to -50% (since we doubled the images)
            const translateY = progress * -50;

            // Use translate3d for GPU acceleration
            scroller.style.transform = `translate3d(0, ${translateY}%, 0)`;

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [duration]);

    return (
        <div className="relative w-1/3 h-full overflow-hidden">
            <div
                ref={scrollerRef}
                className="flex flex-col will-change-transform"
                style={{ transform: 'translate3d(0, 0, 0)' }}
            >
                {[...images, ...images].map((img, index) => (
                    <TiltCard key={index} className="aspect-square rounded-xl overflow-hidden shadow-lg border-2 border-white/20 hover:border-white/60 transition-colors">
                        <img
                            src={img}
                            alt={`Gallery Image ${index}`}
                            className="w-full h-full object-cover pointer-events-none"
                            loading="lazy"
                            decoding="async"
                        />
                    </TiltCard>
                ))}
            </div>
        </div>
    );
};

export default MarqueeColumn;
