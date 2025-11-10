import { useCallback, useEffect } from 'react';
import { drawNode, drawEdge, drawSelfLoop } from '../utils/drawingUtils';

export function useGraphDrawing(canvasRef, nodes, edges, selectedNode, hoveredNode, mode, edgeStart, theme, offset) {
    const drawGraph = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.translate(offset.x, offset.y);

        if (mode === 'add' && edgeStart !== null) {
        const fromNode = nodes.find(n => n.id === edgeStart);
        const toNode = nodes.find(n => n.id === hoveredNode);

        if (fromNode && toNode && toNode.id !== fromNode.id) {
            ctx.strokeStyle = theme.nodeStroke;
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

        ctx.strokeStyle = theme.edge;
        ctx.lineWidth = 2;
        ctx.fillStyle = theme.edgeLabel;
        ctx.font = '14px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        if (edge.from === edge.to) {
            drawSelfLoop(ctx, fromNode, edge.label, theme);
        } else {
            drawEdge(ctx, fromNode, toNode, edge.label, edges, edge, theme);
        }
        });

        nodes.forEach(node => {
        const isSelected = selectedNode === node.id;
        const isHovered = hoveredNode === node.id;
        const isEdgeStartNode = edgeStart === node.id;
        drawNode(ctx, node, { isSelected, isHovered, isEdgeStartNode }, theme);
        });

        ctx.restore();
    }, [canvasRef, nodes, edges, selectedNode, hoveredNode, mode, edgeStart, theme, offset]);

    useEffect(() => {
        drawGraph();
    }, [drawGraph]);

    return drawGraph;
}