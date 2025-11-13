import { useEffect } from 'react';

export function useCanvasResize(canvasRef, containerRef, drawCallback) {
    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;
        
        const resizeObserver = new ResizeObserver(() => {
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
            drawCallback();
        });
        
        resizeObserver.observe(container);
        return () => resizeObserver.unobserve(container);
    }, [canvasRef, containerRef, drawCallback]);
}