import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

export const useQuizStats = (user) => {
    // Initial stats state
    const [stats, setStats] = useState({
        score: 0,
        totalAnswered: 0,
        streak: 0
    });
    const [loading, setLoading] = useState(true);

    // Initialize stats from localStorage (always done first)
    // Then checks Firestore if user is present
    useEffect(() => {
        const loadStats = async () => {
            setLoading(true);

            // 1. Get local stats always as fallback or base
            const localScore = parseInt(localStorage.getItem('quiz_score') || '0');
            const localTotal = parseInt(localStorage.getItem('quiz_total') || '0');
            const localStreak = parseInt(localStorage.getItem('quiz_streak') || '0');
            const localStats = { score: localScore, totalAnswered: localTotal, streak: localStreak };

            if (!user) {
                // Guest: use localStorage
                setStats(localStats);
                setLoading(false);
                return;
            }

            // 2. User logged in: Sync with Firestore and MERGE
            const userRef = doc(db, 'users', user.uid);
            try {
                const docSnap = await getDoc(userRef);

                if (docSnap.exists() && docSnap.data().quizStats) {
                    const remoteStats = docSnap.data().quizStats;

                    // MERGE STRATEGY: Max Progress (Total Answered)
                    // If local has more answers, assume it's more recent/offline progress.
                    // If remote has more, assume it's from another device.
                    // (Ideally we'd use timestamps, but this is a good heuristic for simple stats)
                    let mergedStats = remoteStats;

                    if (localStats.totalAnswered > (remoteStats.totalAnswered || 0)) {
                        mergedStats = localStats;
                        // Local is ahead, sync to remote
                        await setDoc(userRef, { quizStats: mergedStats }, { merge: true });
                    } else {
                        // Remote is ahead (or equal), update local to match
                        localStorage.setItem('quiz_score', remoteStats.score);
                        localStorage.setItem('quiz_total', remoteStats.totalAnswered);
                        localStorage.setItem('quiz_streak', remoteStats.streak);
                    }

                    setStats(mergedStats);

                } else {
                    // Remote doesn't exist or has no stats: Initialize with Local stats
                    // And upload local stats to cloud
                    setStats(localStats);
                    await setDoc(userRef, { quizStats: localStats }, { merge: true });
                }
            } catch (error) {
                console.error("Error loading quiz stats:", error);
                // Fallback to local on error
                setStats(localStats);
            } finally {
                setLoading(false);
            }
        };

        loadStats();
    }, [user]);

    // Update function
    const updateStats = async (newStats) => {
        setStats(newStats);

        // Always save to localStorage (as backup/offline cache)
        localStorage.setItem('quiz_score', newStats.score);
        localStorage.setItem('quiz_total', newStats.totalAnswered);
        localStorage.setItem('quiz_streak', newStats.streak);

        if (user) {
            // Sync to Firestore
            const userRef = doc(db, 'users', user.uid);
            try {
                await updateDoc(userRef, {
                    quizStats: newStats
                });
            } catch (error) {
                console.error("Error updating quiz stats:", error);
                // Try setDoc if update failed (document might be missing)
                try {
                    await setDoc(userRef, { quizStats: newStats }, { merge: true });
                } catch (retryError) {
                    console.error("Retry failed:", retryError);
                }
            }
        }
    };

    return {
        stats,
        updateStats,
        loading
    };
};
