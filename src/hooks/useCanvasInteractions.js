import { useCallback } from 'react';
import { getCanvasCoords, findNode } from '../utils/canvasUtils';

export function useCanvasInteractions({
    canvasRef,
    nodes,
    mode,
    edgeStart,
    offset,
    selectedNodes,
    isPanning,
    isSelecting,
    selectionStart,
    addNode,
    openEdgeLabelDialog,
    setEdgeStart,
    setSelectedNode,
    setSelectedNodes,
    setDraggingNode,
    setIsSelecting,
    setSelectionStart,
    setSelectionEnd,
    setIsDraggingSelection,
    setDragOffset,
    startPan,
    updatePan,
    setHoveredNode,
    zoomLevel = 1.0,
}) {
    const handleCanvasClick = useCallback((e) => {
        if (isPanning || isSelecting) return;

        const coords = getCanvasCoords(canvasRef.current, e, zoomLevel);
        const adjustedCoords = { x: coords.x - offset.x, y: coords.y - offset.y };
        const clickedNode = findNode(nodes, adjustedCoords.x, adjustedCoords.y);

        if (mode === 'add') {
            if (!clickedNode) {
                const newNodeId = addNode(coords.x, coords.y);
                
                if (edgeStart !== null) {
                    openEdgeLabelDialog(null, 'ε', { x: e.clientX, y: e.clientY }, { from: edgeStart, to: newNodeId });
                    setEdgeStart(null);
                }
            } else {
                if (edgeStart === null) {
                    setEdgeStart(clickedNode.id);
                } else {
                    openEdgeLabelDialog(null, 'ε', { x: e.clientX, y: e.clientY }, { from: edgeStart, to: clickedNode.id });
                    setEdgeStart(null);
                }
            }
        } else if (mode === 'select') {
            if (clickedNode) {
                if (e.shiftKey) {
                    // Shift+Click: Toggle node in multi-selection
                    const newSelected = new Set(selectedNodes);
                    if (newSelected.has(clickedNode.id)) {
                        newSelected.delete(clickedNode.id);
                    } else {
                        newSelected.add(clickedNode.id);
                    }
                    setSelectedNodes(newSelected);
                    setSelectedNode(newSelected.size === 1 ? Array.from(newSelected)[0] : null);
                } else {
                    // Normal click: Select only this node
                    setSelectedNode(clickedNode.id);
                    setSelectedNodes(new Set());
                }
            } else {
                setSelectedNode(null);
                setSelectedNodes(new Set());
            }
        }
    }, [isPanning, isSelecting, canvasRef, nodes, offset, mode, edgeStart, addNode, openEdgeLabelDialog, setEdgeStart, setSelectedNode, setSelectedNodes, selectedNodes, zoomLevel]);

    const handleCanvasRightClick = useCallback((e) => {
        e.preventDefault();
        if (mode === 'add' && edgeStart !== null) { setEdgeStart(null); }
    }, [mode, edgeStart, setEdgeStart]);

    const handleMouseDown = useCallback((e) => {
        const coords = getCanvasCoords(canvasRef.current, e, zoomLevel);
        
        if (e.button === 1 || e.ctrlKey) {
            startPan(coords.x, coords.y);
            return;
        }

        if (e.button === 2) { return; }

        const adjustedCoords = { x: coords.x - offset.x, y: coords.y - offset.y };
        const clickedNode = findNode(nodes, adjustedCoords.x, adjustedCoords.y);

        if (mode === 'select') {
            if (clickedNode) {
                if (selectedNodes.size > 1) { return; }
                if (selectedNodes.has(clickedNode.id)) {
                    setIsDraggingSelection(true);
                    setDragOffset({
                        x: adjustedCoords.x - clickedNode.x,
                        y: adjustedCoords.y - clickedNode.y
                    });
                } else { setDraggingNode(clickedNode.id); }
            } else if (!isPanning) {
                setIsSelecting(true);
                setSelectionStart({ x: adjustedCoords.x, y: adjustedCoords.y });
                setSelectionEnd({ x: adjustedCoords.x, y: adjustedCoords.y });
            }
        } else if (mode === 'screenshot') {
            // Start screenshot selection (use raw canvas coords)
            setIsSelecting(true);
            setSelectionStart({ x: coords.x, y: coords.y });
            setSelectionEnd({ x: coords.x, y: coords.y });
        }
    }, [canvasRef, nodes, offset, mode, selectedNodes, isPanning, startPan, setDraggingNode, setIsSelecting, setSelectionStart, setSelectionEnd, setIsDraggingSelection, setDragOffset, zoomLevel]);

    const handleMouseMove = useCallback((e) => {
        const coords = getCanvasCoords(canvasRef.current, e, zoomLevel);
        const adjustedCoords = { x: coords.x - offset.x, y: coords.y - offset.y };
        const hovNode = findNode(nodes, adjustedCoords.x, adjustedCoords.y);
        setHoveredNode(hovNode ? hovNode.id : null);

        if (isPanning) {
            updatePan(coords.x, coords.y);
        } else if (isSelecting && selectionStart) {
            // Screenshot mode uses raw coords, select mode uses adjusted coords
            if (mode === 'screenshot') {
                setSelectionEnd({ x: coords.x, y: coords.y });
            } else {
                setSelectionEnd({ x: adjustedCoords.x, y: adjustedCoords.y });
            }
        }

    }, [canvasRef, nodes, offset, isPanning, isSelecting, selectionStart, updatePan, setHoveredNode, setSelectionEnd, zoomLevel, mode]);

    const handleMouseUp = useCallback((nodes, selectionStart, selectionEnd, isSelecting, setSelectedNodes, setSelectedNode, setDraggingNode, setIsSelecting, setIsDraggingSelection, setSelectionStart, setSelectionEnd, endPan) => {
        if (isSelecting && selectionStart && selectionEnd) {
            const minX = Math.min(selectionStart.x, selectionEnd.x);
            const maxX = Math.max(selectionStart.x, selectionEnd.x);
            const minY = Math.min(selectionStart.y, selectionEnd.y);
            const maxY = Math.max(selectionStart.y, selectionEnd.y);

            const selected = new Set();
            nodes.forEach(node => {
                if (node.x >= minX && node.x <= maxX && node.y >= minY && node.y <= maxY) { selected.add(node.id); }
            });

            setSelectedNodes(selected);
            setSelectedNode(null);
        }

        setDraggingNode(null);
        setIsSelecting(false);
        setIsDraggingSelection(false);
        setSelectionStart(null);
        setSelectionEnd(null);
        endPan();
    }, []);

    const handleEdgeLabelClick = useCallback((edgeId, x, y, edges, openEdgeLabelDialog) => {
        const edge = edges.find(e => e.id === edgeId);
        if (edge) { openEdgeLabelDialog(edge.id, edge.label, { x, y }, null); }
    }, []);

    return {
        handleCanvasClick,
        handleCanvasRightClick,
        handleMouseDown,
        handleMouseMove,
        handleMouseUp,
        handleEdgeLabelClick
    };
}