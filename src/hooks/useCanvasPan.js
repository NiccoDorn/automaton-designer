import { useState, useCallback, useRef, useEffect } from 'react';

const KEY_PAN_SPEED = 10;

export function useCanvasPan() {
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const [panStart, setPanStart] = useState({ x: 0, y: 0 });

    const pressedKeysRef = useRef(new Set());
    const rafRef = useRef(null);

    const panByOffset = useCallback((dx, dy) => {
        setOffset(prev => ({
            x: prev.x + dx,
            y: prev.y + dy
        }));
    }, []);

    const startPan = useCallback((x, y) => {
        setIsPanning(true);
        setPanStart({ x, y });
    }, []);

    const updatePan = useCallback((x, y) => {
        if (isPanning) {
            const dx = x - panStart.x;
            const dy = y - panStart.y;
            panByOffset(dx, dy);
            setPanStart({ x, y });
        }
    }, [isPanning, panStart, panByOffset]);

    const endPan = useCallback(() => {
        setIsPanning(false);
    }, []);

    const animatePan = useCallback(() => {
        const keys = pressedKeysRef.current;
        let dx = 0;
        let dy = 0;

        if (keys.has('ArrowLeft')) dx += KEY_PAN_SPEED;
        if (keys.has('ArrowRight')) dx -= KEY_PAN_SPEED;
        if (keys.has('ArrowUp')) dy += KEY_PAN_SPEED;
        if (keys.has('ArrowDown')) dy -= KEY_PAN_SPEED;

        if (dx !== 0 || dy !== 0) {
            panByOffset(dx, dy);
        }

        rafRef.current = requestAnimationFrame(animatePan);
    }, [panByOffset]);

    const stopAnimatePan = useCallback(() => {
        if (rafRef.current !== null) {
            cancelAnimationFrame(rafRef.current);
            rafRef.current = null;
        }
    }, []);

    const startAnimatePan = useCallback(() => {
        if (rafRef.current === null && pressedKeysRef.current.size > 0) {
            rafRef.current = requestAnimationFrame(animatePan);
        }
    }, [animatePan]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key.startsWith('Arrow')) {
                e.preventDefault();
                pressedKeysRef.current.add(e.key);
                startAnimatePan();
            }
        };

        const handleKeyUp = (e) => {
            if (e.key.startsWith('Arrow')) {
                e.preventDefault();
                pressedKeysRef.current.delete(e.key);
                
                if (pressedKeysRef.current.size === 0) {
                    stopAnimatePan();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            stopAnimatePan();
        };
    }, [startAnimatePan, stopAnimatePan]);


    return {
        offset,
        isPanning,
        startPan,
        updatePan,
        endPan,
        panByOffset,
    };
}