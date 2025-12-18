import { motion } from 'framer-motion';
import TiltCard from './TiltCard';

const MarqueeColumn = ({ images, duration }) => {
    return (
        <div className="relative w-1/3 h-full overflow-hidden">
            <motion.div
                className="flex flex-col will-change-transform"
                animate={{ y: ["0%", "-50%"] }}
                transition={{
                    duration: duration,
                    repeat: Infinity,
                    ease: "linear",
                    repeatType: "loop"
                }}
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
            </motion.div>
        </div>
    );
};

export default MarqueeColumn;
