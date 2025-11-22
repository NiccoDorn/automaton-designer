import { NODE_RADIUS } from '../constants';

export function getCanvasCoords(canvas, e, zoomLevel = 1.0) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: (e.clientX - rect.left) / zoomLevel,
        y: (e.clientY - rect.top) / zoomLevel,
    };
}

export function findNode(nodes, x, y) {
    return nodes.find(n =>
        Math.sqrt((n.x - x) ** 2 + (n.y - y) ** 2) < NODE_RADIUS
    );
}