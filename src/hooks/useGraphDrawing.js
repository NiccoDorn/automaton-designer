import { useCallback, useEffect } from 'react';
import { drawNode, drawEdge, drawSelfLoop } from '../utils/drawingUtils';

export function useGraphDrawing(canvasRef, nodes, edges, selectedNode, hoveredNode, mode, edgeStart) {
    const drawGraph = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (mode === 'addEdge' && edgeStart !== null) {
            const fromNode = nodes.find(n => n.id === edgeStart);
            const toNode = nodes.find(n => n.id === hoveredNode);

            if (fromNode && toNode && toNode.id !== fromNode.id) {
                ctx.strokeStyle = '#94a3b8';
                ctx.setLineDash([5, 5]);
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(fromNode.x, fromNode.y);
                ctx.lineTo(toNode.x, toNode.y);
                ctx.stroke();
                ctx.setLineDash([]);
            }
        }

        edges.forEach(edge => {
            const fromNode = nodes.find(n => n.id === edge.from);
            const toNode = nodes.find(n => n.id === edge.to);
            if (!fromNode || !toNode) return;

            ctx.strokeStyle = '#374151';
            ctx.lineWidth = 2;
            ctx.fillStyle = '#1f2937';
            ctx.font = '14px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            if (edge.from === edge.to) {
                drawSelfLoop(ctx, fromNode, edge.label);
            } else {
                drawEdge(ctx, fromNode, toNode, edge.label, edges);
            }
        });

        nodes.forEach(node => {
            const isSelected = selectedNode === node.id;
            const isHovered = hoveredNode === node.id;
            const isEdgeStartNode = edgeStart === node.id;
            drawNode(ctx, node, { isSelected, isHovered, isEdgeStartNode });
        });
    }, [canvasRef, nodes, edges, selectedNode, hoveredNode, mode, edgeStart]);

    useEffect(() => {
        drawGraph();
    }, [drawGraph]);

    return drawGraph;
}