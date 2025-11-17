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
    isStepMode
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
                if (selectedNode) {
                    const connected = new Set([selectedNode]);
                    edges.forEach(edge => {
                        if (edge.from === selectedNode) connected.add(edge.to);
                        if (edge.to === selectedNode) connected.add(edge.from);
                    });
                    setSelectedNodes(connected);
                }
            }

            if (e.key === 's' || e.key === 'S') {
                // Don't switch to select mode if in step mode (handled separately)
                if (isStepMode) return;
                e.preventDefault();
                setMode('select');
                setEdgeStart(null);
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
        isStepMode
    ]);
}