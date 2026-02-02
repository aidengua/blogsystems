import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Custom Animated Details Component
const Details = ({ children, open, ...props }) => {
    const [isOpen, setIsOpen] = useState(open || false);

    // Filter children to separate summary and content
    const childrenArray = React.Children.toArray(children);
    const summary = childrenArray.find(child => child.type === 'summary' || child.props?.node?.tagName === 'summary');
    const content = childrenArray.filter(child => child !== summary);

    return (
        <div className="group my-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl overflow-hidden shadow-sm transition-all duration-300">
            <div
                onClick={(e) => {
                    e.preventDefault();
                    setIsOpen(!isOpen);
                }}
                className="cursor-pointer px-5 py-4 font-bold text-gray-800 dark:text-gray-200 select-none flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
            >
                {/* Icon */}
                <span className={`material-symbols-rounded text-gray-400 transform transition-transform duration-300 ${isOpen ? 'rotate-90 text-primary' : ''}`}>
                    chevron_right
                </span>
                {summary ? summary.props.children : 'Details'}
            </div>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="px-6 pb-6 pt-2 border-t border-gray-100 dark:border-gray-700/50 text-base leading-relaxed text-gray-700 dark:text-gray-300">
                            {content}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Details;
