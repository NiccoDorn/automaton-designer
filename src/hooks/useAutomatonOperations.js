import { useCallback } from 'react';
import { createNode, createEdge, exportGraph, importGraphFromFile, findNonOverlappingPosition } from '../utils/graphOperations';
import { validateAutomatonData } from '../utils/validation';
// import { detectDeadStates } from '../utils/automatonAlgorithms';

export function useAutomatonOperations(nodes, edges, saveState, offset, canvasContainerRef) {
    const addNode = useCallback((x, y) => {
        const basePos = { x: x - offset.x, y: y - offset.y };
        const finalPos = findNonOverlappingPosition(basePos.x, basePos.y, nodes);
        const newNode = createNode(nodes, finalPos.x, finalPos.y);
        const newNodes = [...nodes, newNode];
        saveState(newNodes, edges);
        return newNode.id;
    }, [nodes, edges, saveState, offset]);

    /* // for now, no automated dead state dections
    const runDeadStatesCheck = () => {
        const result = detectDeadStates(nodes, edges);
        setAnalysisResults({
            type: 'dead',
            ...result
        });
        if (onDeadStatesDetected) {
            onDeadStatesDetected(result.dead);
        }
    };*/

    const addEdge = useCallback((from, to, label = 'ε', updateEdgeLabel) => {
        // Normalize the new label
        const newSymbols = label.split(',').map(s => s.trim()).filter(s => s.length > 0);

        // Check for duplicate transitions
        const existingEdges = edges.filter(e => e.from === from && e.to === to);
        for (const edge of existingEdges) {
            const existingSymbols = edge.label.split(',').map(s => s.trim());
            for (const newSymbol of newSymbols) {
                if (existingSymbols.includes(newSymbol)) {
                    // Duplicate transition detected - ignore
                    return;
                }
            }
        }

        // Handle self-loops by appending to existing edge
        if (from === to) {
            const existingSelfLoop = edges.find(e => e.from === from && e.to === to);
            if (existingSelfLoop) {
                const newLabel = existingSelfLoop.label + ', ' + label;
                updateEdgeLabel(existingSelfLoop.id, newLabel);
                return;
            }
        }

        const newEdge = createEdge(edges, from, to, label);
        const newEdges = [...edges, newEdge];
        saveState(nodes, newEdges);
    }, [nodes, edges, saveState]);

    const deleteNode = useCallback((nodeId) => {
        const newNodes = nodes.filter((n) => n.id !== nodeId);
        const newEdges = edges.filter((e) => e.from !== nodeId && e.to !== nodeId);
        saveState(newNodes, newEdges);
    }, [nodes, edges, saveState]);

    const deleteEdge = useCallback((edgeId) => {
        const newEdges = edges.filter(e => e.id !== edgeId);
        saveState(nodes, newEdges);
    }, [nodes, edges, saveState]);

    const toggleAccepting = useCallback((nodeId) => {
        const newNodes = nodes.map(n =>
            n.id === nodeId ? { ...n, isAccepting: !n.isAccepting } : n
        );
        saveState(newNodes, edges);
    }, [nodes, edges, saveState]);

    const setStartState = useCallback((nodeId) => {
        const newNodes = nodes.map(n =>
            n.id === nodeId ? { ...n, isStart: true } : { ...n, isStart: false }
        );
        saveState(newNodes, edges);
    }, [nodes, edges, saveState]);

    const updateNodeLabel = useCallback((nodeId, label) => {
        const newNodes = nodes.map(n =>
            n.id === nodeId ? { ...n, label } : n
        );
        saveState(newNodes, edges);
    }, [nodes, edges, saveState]);

    const updateEdgeLabel = useCallback((edgeId, label) => {
        const finalLabel = label.trim() === '' ? 'ε' : label;
        const newEdges = edges.map(e => e.id === edgeId ? { ...e, label: finalLabel } : e );
        saveState(nodes, newEdges);
    }, [nodes, edges, saveState]);

    const handleMultiAdd = useCallback((count) => {
        const canvasWidth = canvasContainerRef.current?.clientWidth || 800;
        const canvasHeight = canvasContainerRef.current?.clientHeight || 600;
        const cols = Math.ceil(Math.sqrt(count));
        const rows = Math.ceil(count / cols);
        const spacingX = Math.min((canvasWidth - 100) / (cols + 1), 150);
        const spacingY = Math.min((canvasHeight - 100) / (rows + 1), 150);
        const startX = 100;
        const startY = 100;
        const newNodes = [];
        const baseId = nodes.length > 0 ? Math.max(...nodes.map(n => n.id)) + 1 : 0;
        
        for (let i = 0; i < count; i++) {
            const col = i % cols;
            const row = Math.floor(i / cols);
            
            newNodes.push({
                id: baseId + i,
                x: startX + col * spacingX - offset.x,
                y: startY + row * spacingY - offset.y,
                label: `q${baseId + i}`,
                isAccepting: false,
                isStart: nodes.length === 0 && i === 0
            });
        }
        
        saveState([...nodes, ...newNodes], edges);
    }, [nodes, edges, saveState, offset, canvasContainerRef]);

    const handleClearCanvas = useCallback(() => {
        saveState([], []);
    }, [saveState]);

    const handleExport = useCallback(() => {
        exportGraph(nodes, edges);
    }, [nodes, edges]);

    const handleImport = useCallback((file, onSuccess, onError) => {
        importGraphFromFile(
            file,
            (data) => {
                const validationResult = validateAutomatonData(data);
                if (!validationResult.isValid) {
                    onError(validationResult.message);
                    return;
                }
                saveState(data.nodes, data.edges);
                onSuccess();
            },
            (error) => {
                console.error("Error importing graph:", error);
                onError(`Import Error: Failed to read or parse the graph file. Check the file format.`);
            }
        );
    }, [saveState]);

    return {
        addNode,
        addEdge,
        deleteNode,
        deleteEdge,
        toggleAccepting,
        setStartState,
        updateNodeLabel,
        updateEdgeLabel,
        handleMultiAdd,
        handleClearCanvas,
        handleExport,
        handleImport
    };
}