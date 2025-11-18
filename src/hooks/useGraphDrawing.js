import { useCallback, useEffect } from 'react';
import { drawNode, drawEdge, drawSelfLoop } from '../utils/drawingUtils';

export function useGraphDrawing(
    canvasRef,
    nodes,
    edges,
    selectedNode,
    hoveredNode,
    mode,
    edgeStart,
    theme,
    offset,
    selectedNodes = new Set(),
    selectionBox = null,
    simulationState = null,
    deadStates = new Set()
    ) {
    const drawGraph = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        ctx.translate(offset.x, offset.y);

        if (selectionBox && selectionBox.start && selectionBox.end) {
            const minX = Math.min(selectionBox.start.x, selectionBox.end.x);
            const maxX = Math.max(selectionBox.start.x, selectionBox.end.x);
            const minY = Math.min(selectionBox.start.y, selectionBox.end.y);
            const maxY = Math.max(selectionBox.start.y, selectionBox.end.y);

            ctx.strokeStyle = theme.nodeSelected;
            ctx.fillStyle = theme.nodeSelected + '20';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.fillRect(minX, minY, maxX - minX, maxY - minY);
            ctx.strokeRect(minX, minY, maxX - minX, maxY - minY);
            ctx.setLineDash([]);
        }

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

        const isActiveSimulation = simulationState?.currentStateId === edge.from;
        const isSelectedEdge = selectedNodes.has(edge.from) && selectedNodes.has(edge.to);

        ctx.strokeStyle = isActiveSimulation ? '#fbbf24' : (isSelectedEdge ? theme.nodeSelected : theme.edge);
        ctx.lineWidth = isActiveSimulation ? 4 : (isSelectedEdge ? 3 : 2);
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
            const isSelected = selectedNode === node.id || selectedNodes.has(node.id);
            const isHovered = hoveredNode === node.id;
            const isEdgeStartNode = edgeStart === node.id;
            const isSimulationActive = simulationState?.currentStateId === node.id;
            const isDead = deadStates.has(node.id);

            drawNode(ctx, node, {
                isSelected,
                isHovered,
                isEdgeStartNode,
                isSimulationActive,
                isDead
            }, theme);
        });

        ctx.restore();
    }, [canvasRef, nodes, edges, selectedNode, hoveredNode, mode, edgeStart, theme, offset, selectedNodes, selectionBox, simulationState, deadStates]);

    useEffect(() => {
        drawGraph();
    }, [drawGraph]);

    return drawGraph;
}