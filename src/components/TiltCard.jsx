import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const TiltCard = ({ children, className }) => {
    const cardRef = useRef(null);
    const [rotate, setRotate] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -20;
        const rotateY = ((x - centerX) / centerX) * 20;

        setRotate({ x: rotateX, y: rotateY });
    };

    const handleMouseLeave = () => {
        setRotate({ x: 0, y: 0 });
    };

    return (
        <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ perspective: '1000px' }}
            className={clsx("relative shrink-0 mb-4", className)}
        >
            <motion.div
                animate={{
                    rotateX: rotate.x,
                    rotateY: rotate.y,
                    scale: rotate.x !== 0 ? 1.1 : 1
                }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                style={{ transformStyle: 'preserve-3d' }}
                className="w-full h-full"
            >
                {children}
            </motion.div>
        </motion.div>
    );
};

export default TiltCard;
