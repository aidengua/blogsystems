import { createContext, useContext, useState, useEffect } from 'react';

const LoadingContext = createContext();

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [loadingText, setLoadingText] = useState('Initializing...');

    // Simulated loading assets
    const loadingAssets = [
        'Loading styles...',
        'Parsing scripts...',
        'Connecting to database...',
        'Fetching user data...',
        'Rendering components...',
        'Optimizing images...',
        'Finalizing layout...'
    ];

    useEffect(() => {
        // Trigger loading ONLY on initial mount (first time entering website)
        setIsLoading(true);
        setProgress(0);
        setLoadingText('Preparing...');

        let currentProgress = 0;
        const interval = setInterval(() => {
            currentProgress += Math.random() * 15;

            // Update text based on progress
            const textIndex = Math.floor((currentProgress / 100) * loadingAssets.length);
            if (loadingAssets[textIndex]) {
                setLoadingText(loadingAssets[textIndex]);
            }

            if (currentProgress >= 100) {
                currentProgress = 100;
                clearInterval(interval);

                setTimeout(() => {
                    setIsLoading(false);
                    setLoadingText('Ready');
                }, 500); // Short delay at 100% before hiding
            }
            setProgress(currentProgress);
        }, 100); // Update every 100ms

        return () => clearInterval(interval);
    }, []); // Empty dependency array ensures this runs only once on mount

    return (
        <LoadingContext.Provider value={{ isLoading, progress, loadingText }}>
            {children}
        </LoadingContext.Provider>
    );
};
