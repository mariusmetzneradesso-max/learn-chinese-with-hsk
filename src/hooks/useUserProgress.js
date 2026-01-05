import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';

export const useUserProgress = (user) => {
    const [clickedWords, setClickedWords] = useState({
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: []
    });
    const [loading, setLoading] = useState(true);

    // Load progress from localStorage or Firestore
    useEffect(() => {
        const loadProgress = async () => {
            setLoading(true);

            // 1. Always load local data first
            let localData = {
                1: [], 2: [], 3: [], 4: [], 5: [], 6: []
            };
            try {
                const stored = localStorage.getItem('hsk_progress');
                if (stored) {
                    const parsed = JSON.parse(stored);
                    localData = { ...localData, ...parsed };
                }
            } catch (e) {
                console.error("Error parsing local progress:", e);
            }

            if (user) {
                // 2. Load from Firestore
                const userRef = doc(db, 'users', user.uid);
                try {
                    const docSnap = await getDoc(userRef);
                    if (docSnap.exists()) {
                        const remoteData = docSnap.data().clickedWords || {};

                        // 3. MERGE: Union of Local and Remote arrays
                        const mergedData = { ...localData };

                        Object.keys(mergedData).forEach(level => {
                            const localArr = localData[level] || [];
                            const remoteArr = remoteData[level] || [];
                            // Union set
                            const union = [...new Set([...localArr, ...remoteArr])];
                            mergedData[level] = union;
                        });

                        setClickedWords(mergedData);

                        // 4. Sync merged result back to BOTH locations
                        // Update Local
                        localStorage.setItem('hsk_progress', JSON.stringify(mergedData));

                        // Update Remote (only if different or valid)
                        // utilizing setDoc with merge to be safe
                        await setDoc(userRef, { clickedWords: mergedData }, { merge: true });

                    } else {
                        // Remote doesn't exist: Initialize with Local
                        setClickedWords(localData);
                        await setDoc(userRef, { clickedWords: localData }, { merge: true });
                    }
                } catch (error) {
                    console.error("Error loading user progress:", error);
                    // Fallback to local
                    setClickedWords(localData);
                }
            } else {
                // Guest: just use local
                setClickedWords(localData);
            }
            setLoading(false);
        };

        loadProgress();
    }, [user]);

    const markAsClicked = async (level, wordChar) => {
        if (!clickedWords[level] || clickedWords[level].includes(wordChar)) return;

        const newLevelProgress = [...(clickedWords[level] || []), wordChar];
        const newProgress = {
            ...clickedWords,
            [level]: newLevelProgress
        };

        setClickedWords(newProgress);

        // Always update localStorage as backup/cache
        localStorage.setItem('hsk_progress', JSON.stringify(newProgress));

        if (user) {
            // Update Firestore
            const userRef = doc(db, 'users', user.uid);
            try {
                await updateDoc(userRef, {
                    [`clickedWords.${level}`]: arrayUnion(wordChar)
                });
            } catch (error) {
                console.error("Error updating progress in Firestore:", error);
                // Fallback: setDoc with merge if updateDoc fails (e.g. doc doesn't exist somehow)
                await setDoc(userRef, { clickedWords: newProgress }, { merge: true });
            }
        }
    };

    const isClicked = (level, wordChar) => {
        return clickedWords[level]?.includes(wordChar);
    };

    const getProgressCount = (level) => {
        return clickedWords[level]?.length || 0;
    };

    return {
        clickedWords,
        loading,
        markAsClicked,
        isClicked,
        getProgressCount
    };
};
