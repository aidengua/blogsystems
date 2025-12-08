import { useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import clsx from 'clsx';

const LazyImage = ({ src, alt, className, wrapperClassName }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div className={clsx("relative overflow-hidden", wrapperClassName)}>
            {!isLoaded && (
                <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse" />
            )}
            <LazyLoadImage
                src={src}
                alt={alt}
                className={clsx(
                    "transition-all duration-500 ease-in-out",
                    isLoaded ? "opacity-100" : "opacity-0",
                    className
                )}
                wrapperClassName="w-full h-full !block"
                effect="blur"
                onLoad={() => setIsLoaded(true)}
                onError={() => setIsLoaded(true)} // Handle error by showing image (alt text) or placeholder
            />
        </div>
    );
};

export default LazyImage;
