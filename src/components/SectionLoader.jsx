import React from 'react';
import LogoLoader from './LogoLoader';

const SectionLoader = ({ className = "" }) => {
    return (
        <div className={`flex flex-col items-center justify-center w-full min-h-[200px] gap-4 ${className}`}>
            <LogoLoader size="w-16 h-16" animate={true} />
        </div>
    );
};

export default SectionLoader;
