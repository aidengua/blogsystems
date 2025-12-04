import { db } from '../firebase';
import { doc, setDoc, increment, onSnapshot } from 'firebase/firestore';

const STATS_DOC_ID = 'general';

export const incrementVisits = async () => {
    const today = new Date().toISOString().split('T')[0];
    const visitedKey = `visited_${today}`;

    if (sessionStorage.getItem(visitedKey)) {
        return;
    }

    sessionStorage.setItem(visitedKey, 'true');

    try {
        // Increment total visits
        const generalRef = doc(db, 'site_stats', STATS_DOC_ID);
        await setDoc(generalRef, {
            totalVisits: increment(1)
        }, { merge: true });

        // Increment daily visits
        const dailyRef = doc(db, 'site_stats', today);
        await setDoc(dailyRef, {
            visits: increment(1),
            date: today
        }, { merge: true });

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
        callback(prev => ({ ...prev, total: doc.data()?.totalVisits || 0 }));
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
                visits: doc.data()?.visits || 0
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
