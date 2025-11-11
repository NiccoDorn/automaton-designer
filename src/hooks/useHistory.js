import { useState, useCallback } from 'react';

export function useHistory(initialState, maxHistory = 100) {
    const [history, setHistory] = useState([initialState]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const addToHistory = useCallback((newState) => {
        setHistory(prev => {
            const newHistory = prev.slice(0, currentIndex + 1);
            newHistory.push(newState);
            if (newHistory.length > maxHistory) {
                newHistory.shift();
                return newHistory;
            }
            return newHistory;
        });
        setCurrentIndex(prev => Math.min(prev + 1, maxHistory - 1));
    }, [currentIndex, maxHistory]);

    const undo = useCallback(() => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
            return history[currentIndex - 1];
        }
        return null;
    }, [currentIndex, history]);

    const redo = useCallback(() => {
        if (currentIndex < history.length - 1) {
            setCurrentIndex(prev => prev + 1);
            return history[currentIndex + 1];
        }
        return null;
    }, [currentIndex, history]);

    const canUndo = currentIndex > 0;
    const canRedo = currentIndex < history.length - 1;

    return {
        currentState: history[currentIndex],
        addToHistory,
        undo,
        redo,
        canUndo,
        canRedo
    };
}