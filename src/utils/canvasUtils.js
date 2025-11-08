import { NODE_RADIUS } from '../constants';

export function getCanvasCoords(canvas, e) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
    };
}

export function findNode(nodes, x, y) {
    return nodes.find(n =>
        Math.sqrt((n.x - x) ** 2 + (n.y - y) ** 2) < NODE_RADIUS
    );
}