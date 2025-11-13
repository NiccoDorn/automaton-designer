import { useState, useCallback } from 'react';

export function useDialogs() {
    const [edgeLabelDialog, setEdgeLabelDialog] = useState({
        isOpen: false,
        edgeId: null,
        initialLabel: '',
        position: { x: 0, y: 0 },
        pendingEdge: null
    });

    const [multiAddDialog, setMultiAddDialog] = useState(false);

    const openEdgeLabelDialog = useCallback((edgeId, label, position, pendingEdge = null) => {
        setEdgeLabelDialog({
            isOpen: true,
            edgeId,
            initialLabel: label,
            position,
            pendingEdge
        });
    }, []);

    const closeEdgeLabelDialog = useCallback(() => {
        setEdgeLabelDialog(prev => ({ ...prev, isOpen: false }));
    }, []);

    const openMultiAddDialog = useCallback(() => {
        setMultiAddDialog(true);
    }, []);

    const closeMultiAddDialog = useCallback(() => {
        setMultiAddDialog(false);
    }, []);

    return {
        edgeLabelDialog,
        multiAddDialog,
        openEdgeLabelDialog,
        closeEdgeLabelDialog,
        openMultiAddDialog,
        closeMultiAddDialog
    };
}