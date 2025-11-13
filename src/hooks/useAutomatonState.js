import { useState } from 'react';

export function useAutomatonState() {
    const [mode, setMode] = useState('select');
    const [selectedNodes, setSelectedNodes] = useState(new Set());
    const [selectedNode, setSelectedNode] = useState(null);
    const [edgeStart, setEdgeStart] = useState(null);
    const [hoveredNode, setHoveredNode] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    const [isSelecting, setIsSelecting] = useState(false);
    const [selectionStart, setSelectionStart] = useState(null);
    const [selectionEnd, setSelectionEnd] = useState(null);
    const [draggingNode, setDraggingNode] = useState(null);
    const [isDraggingSelection, setIsDraggingSelection] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    return {
        mode,
        setMode,
        selectedNodes,
        setSelectedNodes,
        selectedNode,
        setSelectedNode,
        edgeStart,
        setEdgeStart,
        hoveredNode,
        setHoveredNode,
        errorMessage,
        setErrorMessage,
        isSelecting,
        setIsSelecting,
        selectionStart,
        setSelectionStart,
        selectionEnd,
        setSelectionEnd,
        draggingNode,
        setDraggingNode,
        isDraggingSelection,
        setIsDraggingSelection,
        dragOffset,
        setDragOffset
    };
}