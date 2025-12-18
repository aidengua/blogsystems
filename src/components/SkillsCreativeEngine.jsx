import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const skills = [
    { name: 'Python', icon: 'fab fa-python', color: '#3776AB' },
    { name: 'React', icon: 'fab fa-react', color: '#61DAFB' },
    { name: 'Vue.js', icon: 'fab fa-vuejs', color: '#4FC08D' },
    { name: 'Node.js', icon: 'fab fa-node', color: '#339933' },
    { name: 'HTML5', icon: 'fab fa-html5', color: '#E34F26' },
    { name: 'CSS3', icon: 'fab fa-css3', color: '#1572B6' },
    { name: 'JavaScript', icon: 'fab fa-js', color: '#F7DF1E' },
    { name: 'Docker', icon: 'fab fa-docker', color: '#2496ED' },
];

const SkillsCreativeEngine = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            // Faster rotation for "engine" feel (1.5s)
            setActiveIndex((prev) => (prev - 1 + skills.length) % skills.length);
        }, 1500);
        return () => clearInterval(timer);
    }, []);

    const getSkillStyle = (index) => {
        const len = skills.length;
        let diff = (index - activeIndex + len) % len;
        if (diff > len / 2) diff -= len;

        // Semi-circle Arc Config
        // Center: (0,0)
        // Sides: (+/- 120, 40) - "Dropping" down slightly
        // Far: (+/- 200, 150) - Dropping further down to hide

        if (diff === 0) {
            // Center
            return { x: 0, y: 0, scale: 1.3, rotate: 0, opacity: 1, zIndex: 10, filter: 'blur(0px)' };
        } else if (diff === 1) {
            // Right (Rolls out)
            return { x: 120, y: 40, scale: 0.8, rotate: 45, opacity: 0.3, zIndex: 5, filter: 'blur(1px)' };
        } else if (diff === -1) {
            // Left (Rolls in)
            return { x: -120, y: 40, scale: 0.8, rotate: -45, opacity: 0.3, zIndex: 5, filter: 'blur(1px)' };
        } else if (diff === 2) {
            // Far Right
            return { x: 200, y: 150, scale: 0.5, rotate: 90, opacity: 0, zIndex: 0, filter: 'blur(5px)' };
        } else if (diff === -2) {
            // Far Left
            return { x: -200, y: 150, scale: 0.5, rotate: -90, opacity: 0, zIndex: 0, filter: 'blur(5px)' };
        } else {
            // Hidden back
            return { x: 0, y: 200, scale: 0, rotate: 0, opacity: 0, zIndex: -1, display: 'none' };
        }
    };

    const currentSkill = skills[activeIndex];

    return (
        <div className="h-full bg-white dark:bg-[#0F1115] rounded-3xl p-6 text-gray-900 dark:text-white shadow-xl border border-gray-200 dark:border-white/5 relative overflow-hidden flex flex-col items-center justify-center min-h-[300px]">
            {/* Background Glow */}
            <motion.div
                animate={{ background: `radial-gradient(circle at 50% 50%, ${currentSkill.color}20 0%, transparent 70%)` }}
                className="absolute inset-0 transition-all duration-500"
            />

            {/* Header Text */}
            <div className="text-center z-10 mb-8 mt-4">
                <h4 className="text-[10px] md:text-xs font-bold tracking-[0.3em] text-gray-400 dark:text-gray-500 uppercase mb-2">
                    CREATIVE ENGINE
                </h4>
                <div className="h-10 relative flex justify-center items-center">
                    <AnimatePresence mode='wait'>
                        <motion.h2
                            key={currentSkill.name}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="text-3xl md:text-4xl font-bold transition-colors duration-300 absolute whitespace-nowrap"
                            style={{ color: currentSkill.color }}
                        >
                            {currentSkill.name}
                        </motion.h2>
                    </AnimatePresence>
                </div>
            </div>

            {/* Carousel Visual */}
            <div className="flex items-center justify-center w-full h-[150px] relative z-10">
                {skills.map((skill, index) => {
                    const style = getSkillStyle(index);
                    return (
                        <motion.div
                            key={skill.name}
                            className="absolute flex items-center justify-center"
                            animate={style}
                            transition={{ duration: 0.6, ease: "easeInOut" }}
                        >
                            {/* Glow Ring for Center Item */}
                            {style.scale > 1 && (
                                <motion.div
                                    className="absolute -inset-6 rounded-full blur-xl opacity-30"
                                    style={{ backgroundColor: skill.color }}
                                    transition={{ duration: 0.3 }}
                                />
                            )}

                            <div className={`rounded-full flex items-center justify-center border border-gray-200 dark:border-white/10 shadow-2xl transition-all duration-500
                                ${style.scale > 1 ? 'w-24 h-24 bg-white dark:bg-[#1A1D24]' : 'w-16 h-16 bg-gray-50 dark:bg-black/40'}`}
                            >
                                <i
                                    className={`${skill.icon} transition-colors duration-300`}
                                    style={{
                                        color: style.scale > 1 ? skill.color : '#9CA3AF',
                                        fontSize: style.scale > 1 ? '3rem' : '1.5rem'
                                    }}
                                ></i>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Bottom Decoration */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-white/10 to-transparent"></div>
        </div>
    );
};

export default SkillsCreativeEngine;
