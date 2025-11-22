import { useEffect } from 'react';

export function useKeyboardShortcuts({
    edgeLabelDialog,
    multiAddDialog,
    closeEdgeLabelDialog,
    closeMultiAddDialog,
    deleteSelectedNodes,
    mode,
    setMode,
    setEdgeStart,
    openMultiAddDialog,
    selectedNode,
    edges,
    setSelectedNodes,
    handleUndo,
    handleRedo,
    panByOffset,
    isStepMode,
    nodes,
    setSelectedNode,
    toggleAccepting,
    setStartState,
    setIsShortcutsModalOpen
}) {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && (e.key === 'x' || e.key === 'X')) {
                e.preventDefault();
                if (edgeLabelDialog.isOpen) {
                    closeEdgeLabelDialog();
                    return;
                }
                if (multiAddDialog) {
                    closeMultiAddDialog();
                    return;
                }
            }

            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }

            if (e.key === 'd' || e.key === 'D') {
                e.preventDefault();
                deleteSelectedNodes();
            }

            if (e.key === 'a' || e.key === 'A') {
                e.preventDefault();
                setMode('add');
                setEdgeStart(null);
            }

            if (e.key === 'm' || e.key === 'M') {
                e.preventDefault();
                openMultiAddDialog();
            }

            if (e.key === 'i' || e.key === 'I') {
                e.preventDefault();
                if (selectedNode !== null && selectedNode !== undefined) {
                    const connected = new Set([selectedNode]);
                    edges.forEach(edge => {
                        if (edge.from === selectedNode) connected.add(edge.to);
                        if (edge.to === selectedNode) connected.add(edge.from);
                    });
                    setSelectedNodes(connected);
                }
            }

            if (e.key === 's' || e.key === 'S') {
                if (isStepMode) return;
                e.preventDefault();
                setMode('select');
                setEdgeStart(null);
            }

            if (e.key === 'Tab') {
                e.preventDefault();
                if (nodes.length === 0) return;
                
                const currentIndex = nodes.findIndex(n => n.id === selectedNode);
                const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % nodes.length;
                setSelectedNode(nodes[nextIndex].id);
                setSelectedNodes(new Set());
            }

            if (e.key === 'Enter') {
                e.preventDefault();
                if (mode === 'select' && selectedNode !== null && selectedNode !== undefined) {
                    toggleAccepting(selectedNode);
                }
            }

            if (e.key === 'h' || e.key === 'H') {
                e.preventDefault();
                setIsShortcutsModalOpen(prev => !prev);
            }

            if (e.key === 'w' || e.key === 'W') {
                e.preventDefault();
                if (selectedNode !== null && selectedNode !== undefined) {
                    setStartState(selectedNode);
                }
            }

            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'z' && !e.shiftKey) {
                    e.preventDefault();
                    handleUndo();
                }
                if (e.key === 'y' || (e.key === 'z' && e.shiftKey)) {
                    e.preventDefault();
                    handleRedo();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [
        edgeLabelDialog, multiAddDialog, closeEdgeLabelDialog, closeMultiAddDialog,
        deleteSelectedNodes, mode, setMode, setEdgeStart, openMultiAddDialog,
        selectedNode, edges, setSelectedNodes, handleUndo, handleRedo, panByOffset,
        isStepMode, nodes, setSelectedNode, toggleAccepting, setStartState, setIsShortcutsModalOpen
    ]);
}