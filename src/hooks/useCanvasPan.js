import { useState, useCallback } from 'react';

export function useCanvasPan() {
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const [panStart, setPanStart] = useState({ x: 0, y: 0 });

    const startPan = useCallback((x, y) => {
        setIsPanning(true);
        setPanStart({ x, y });
    }, []);

    const updatePan = useCallback((x, y) => {
        if (isPanning) {
        const dx = x - panStart.x;
        const dy = y - panStart.y;
        setOffset(prev => ({
            x: prev.x + dx,
            y: prev.y + dy
        }));
        setPanStart({ x, y });
        }
    }, [isPanning, panStart]);

    const endPan = useCallback(() => {
        setIsPanning(false);
    }, []);

    return {
        offset,
        isPanning,
        startPan,
        updatePan,
        endPan
    };
}