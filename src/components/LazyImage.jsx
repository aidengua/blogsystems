import { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';

const LazyImage = ({ src, alt, className, wrapperClassName, placeholderSrc }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const imgRef = useRef(null);

    useEffect(() => {
        if (imgRef.current && imgRef.current.complete) {
            setIsLoaded(true);
        }
    }, []);

    return (
        <div className={clsx("relative overflow-hidden bg-gray-200 dark:bg-gray-800", wrapperClassName)}>
            {/* Skeleton / Placeholder Layer */}
            <div
                className={clsx(
                    "absolute inset-0 w-full h-full transition-opacity duration-700",
                    isLoaded ? "opacity-0" : "opacity-100 animate-pulse"
                )}
            />

            {/* Optional Specific Low-Res Placeholder */}
            {placeholderSrc && (
                <img
                    src={placeholderSrc}
                    alt=""
                    className={clsx(
                        "absolute inset-0 w-full h-full object-cover blur-xl scale-110",
                        isLoaded ? "opacity-0" : "opacity-100"
                    )}
                />
            )}

            {/* Main Image */}
            <img
                ref={imgRef}
                src={src}
                alt={alt}
                loading="lazy"
                className={clsx(
                    "w-full h-full object-cover transition-all duration-700 ease-out transform",
                    isLoaded ? "opacity-100 blur-0 scale-100" : "opacity-0 blur-xl scale-110",
                    className
                )}
                onLoad={() => setIsLoaded(true)}
                onError={() => setIsLoaded(true)}
            />
        </div>
    );
};

export default LazyImage;
