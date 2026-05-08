import { db } from '../firebase';
import { doc, setDoc, increment, onSnapshot } from 'firebase/firestore';

const STATS_DOC_ID = 'general';

export const incrementVisits = async () => {
    const today = new Date().toISOString().split('T')[0];

    // Check unique device overall
    let isUniqueDevice = false;
    let deviceId = localStorage.getItem('deviceId');
    if (!deviceId) {
        deviceId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
        localStorage.setItem('deviceId', deviceId);
        isUniqueDevice = true;
    }

    // Check unique device for today
    let lastVisitDate = localStorage.getItem('lastVisitDate');
    let isDailyUnique = lastVisitDate !== today;
    if (isDailyUnique) {
        localStorage.setItem('lastVisitDate', today);
    }

    try {
        let regionName = 'Unknown';
        // Cache region in sessionStorage to avoid spamming the ipapi
        let cachedRegion = sessionStorage.getItem('userRegion');
        if (cachedRegion) {
            regionName = cachedRegion;
        } else {
            try {
                const response = await fetch('https://ipapi.co/json/');
                const data = await response.json();
                regionName = data.country_name || 'Unknown';
                sessionStorage.setItem('userRegion', regionName);
            } catch (e) {
                console.error("Failed to fetch region:", e);
            }
        }

        // Increment total visits and region count
        const generalRef = doc(db, 'site_stats', STATS_DOC_ID);
        const updates = {
            totalVisits: increment(1), // total page views
            [`regions.${regionName}`]: increment(1) // count region on every page view
        };
        if (isUniqueDevice) {
            updates.uniqueDevices = increment(1);
        }
        await setDoc(generalRef, updates, { merge: true });

        // Increment daily visits
        const dailyRef = doc(db, 'site_stats', today);
        const dailyUpdates = {
            visits: increment(1), // daily page views
            date: today
        };
        if (isDailyUnique) {
            dailyUpdates.uniqueDevices = increment(1);
        }
        await setDoc(dailyRef, dailyUpdates, { merge: true });

    } catch (error) {
        console.error("Error incrementing stats:", error);
    }
};

export const subscribeToStats = (callback) => {
    const today = new Date().toISOString().split('T')[0];
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = yesterdayDate.toISOString().split('T')[0];

    const generalRef = doc(db, 'site_stats', STATS_DOC_ID);
    const todayRef = doc(db, 'site_stats', today);
    const yesterdayRef = doc(db, 'site_stats', yesterday);

    const unsubGeneral = onSnapshot(generalRef, (doc) => {
        const data = doc.data() || {};
        callback(prev => ({ 
            ...prev, 
            total: data.totalVisits || 0,
            uniqueDevices: data.uniqueDevices || 0,
            regions: data.regions || {}
        }));
    });

    const unsubToday = onSnapshot(todayRef, (doc) => {
        callback(prev => ({ ...prev, today: doc.data()?.visits || 0 }));
    });

    const unsubYesterday = onSnapshot(yesterdayRef, (doc) => {
        callback(prev => ({ ...prev, yesterday: doc.data()?.visits || 0 }));
    });

    return () => {
        unsubGeneral();
        unsubToday();
        unsubYesterday();
    };
};

export const subscribeToWeeklyStats = (callback) => {
    const days = 7;
    const unsubs = [];
    const statsMap = new Map();

    for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        // Format date for display (e.g., "12/04")
        const displayDate = `${date.getMonth() + 1}/${date.getDate()}`;

        const docRef = doc(db, 'site_stats', dateStr);
        const unsub = onSnapshot(docRef, (doc) => {
            statsMap.set(dateStr, {
                date: displayDate,
                fullDate: dateStr,
                visits: doc.data()?.visits || 0,
                uniqueDevices: doc.data()?.uniqueDevices || 0
            });

            // Convert map to sorted array
            const sortedStats = Array.from(statsMap.values())
                .sort((a, b) => a.fullDate.localeCompare(b.fullDate));

            // Only callback if we have data for all days (or at least initialized)
            // Actually, we should callback on every update, but maybe debounce?
            // For simplicity, just callback.
            callback(sortedStats);
        });
        unsubs.push(unsub);
    }

    return () => {
        unsubs.forEach(unsub => unsub());
    };
};

export const subscribeToStatsSettings = (callback) => {
    const settingsRef = doc(db, 'site_stats', 'settings');
    return onSnapshot(settingsRef, (doc) => {
        const data = doc.data() || {};
        callback({
            showPageViewsCurve: data.showPageViewsCurve ?? true,
            showUniqueDevicesCurve: data.showUniqueDevicesCurve ?? true,
            showUniqueDevicesCard: data.showUniqueDevicesCard ?? true,
            showYesterdayViewsCard: data.showYesterdayViewsCard ?? true
        });
    });
};

export const updateStatsSettings = async (newSettings) => {
    try {
        const settingsRef = doc(db, 'site_stats', 'settings');
        await setDoc(settingsRef, newSettings, { merge: true });
    } catch (error) {
        console.error("Error updating stats settings:", error);
        throw error;
    }
};
