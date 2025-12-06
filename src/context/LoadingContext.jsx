import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const LoadingContext = createContext();

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [loadingText, setLoadingText] = useState('Initializing...');
    const [visitedRoutes, setVisitedRoutes] = useState(new Set());
    const location = useLocation();
    const prevPathRef = useRef(null);

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
        const isTagSwitch = location.pathname.startsWith('/tags/') && prevPathRef.current?.startsWith('/tags/');

        // Update prevPath
        prevPathRef.current = location.pathname;

        // If route has been visited OR it's a tag switch, don't show loading screen
        if (visitedRoutes.has(location.pathname) || isTagSwitch) {
            setIsLoading(false);
            return;
        }

        // Trigger loading on route change
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

                // Mark route as visited
                setVisitedRoutes(prev => {
                    const newSet = new Set(prev);
                    newSet.add(location.pathname);
                    return newSet;
                });

                setTimeout(() => {
                    setIsLoading(false);
                    setLoadingText('Ready');
                }, 500); // Short delay at 100% before hiding
            }
            setProgress(currentProgress);
        }, 100); // Update every 100ms

        return () => clearInterval(interval);
    }, [location.pathname]); // Re-run on path change

    return (
        <LoadingContext.Provider value={{ isLoading, progress, loadingText }}>
            {children}
        </LoadingContext.Provider>
    );
};
