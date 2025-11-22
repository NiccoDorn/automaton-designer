import { useState, useEffect, useCallback } from 'react';

export function useCanvasZoom(canvasRef) {
    const [zoomLevel, setZoomLevel] = useState(1.0);
    const MIN_ZOOM = 0.5;
    const MAX_ZOOM = 3.0;
    const ZOOM_STEP = 0.1;

    const zoomIn = useCallback(() => {
        setZoomLevel(prev => Math.min(prev + ZOOM_STEP, MAX_ZOOM));
    }, []);

    const zoomOut = useCallback(() => {
        setZoomLevel(prev => Math.max(prev - ZOOM_STEP, MIN_ZOOM));
    }, []);

    const resetZoom = useCallback(() => {
        setZoomLevel(1.0);
    }, []);

    // Handle keyboard shortcuts (Ctrl + +/-)
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Skip if focus is on input/textarea
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }

            if (e.ctrlKey || e.metaKey) {
                if (e.key === '+' || e.key === '=') {
                    e.preventDefault();
                    zoomIn();
                } else if (e.key === '-' || e.key === '_') {
                    e.preventDefault();
                    zoomOut();
                } else if (e.key === '0') {
                    e.preventDefault();
                    resetZoom();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [zoomIn, zoomOut, resetZoom]);

    // Handle mouse wheel zoom (Ctrl + Wheel)
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const handleWheel = (e) => {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();

                if (e.deltaY < 0) {
                    zoomIn();
                } else {
                    zoomOut();
                }
            }
        };

        canvas.addEventListener('wheel', handleWheel, { passive: false });
        return () => canvas.removeEventListener('wheel', handleWheel);
    }, [canvasRef, zoomIn, zoomOut]);

    return {
        zoomLevel,
        zoomIn,
        zoomOut,
        resetZoom,
        setZoomLevel
    };
}
