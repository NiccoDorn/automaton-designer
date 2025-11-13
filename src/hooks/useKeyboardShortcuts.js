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
    panByOffset,
    handleUndo,
    handleRedo
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

            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') { return; }

            if (e.key === 'd' || e.key === 'D') {
                e.preventDefault();
                deleteSelectedNodes();
            }

            if (e.key === 'a' || e.key === 'A') {
                e.preventDefault();
                setMode(mode === 'add' ? 'add' : 'add'); // I might implement something here that if a is pressed a second time, a state is added
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
                    edges.forEach(e => {
                        if (e.from === selectedNode) connected.add(e.to);
                        if (e.to === selectedNode) connected.add(e.from);
                    });
                    setSelectedNodes(connected);
                }
            }

            if (e.key === 's' || e.key === 'S') {
                e.preventDefault();
                setMode('select');
                setEdgeStart(null);
            }

            if (e.key.startsWith('Arrow')) {
                e.preventDefault();
                const panSpeed = 10;
                if (e.key === 'ArrowLeft') panByOffset(panSpeed, 0);
                if (e.key === 'ArrowRight') panByOffset(-panSpeed, 0);
                if (e.key === 'ArrowUp') panByOffset(0, panSpeed);
                if (e.key === 'ArrowDown') panByOffset(0, -panSpeed);
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
        panByOffset,
        handleUndo,
        handleRedo
    ]);
}