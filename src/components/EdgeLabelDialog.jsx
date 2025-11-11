import { useState, useEffect, useRef } from 'react';

export function EdgeLabelDialog({ isOpen, onClose, onSave, initialLabel, theme, position }) {
    const [label, setLabel] = useState(initialLabel || 'ε');
    const inputRef = useRef(null);

    useEffect(() => {
        setLabel(initialLabel || 'ε');
    }, [initialLabel]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
        }
    }, [isOpen]);

    const handleSave = () => {
        const finalLabel = label.trim() === '' ? 'ε' : label;
        onSave(finalLabel);
        onClose();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
        handleSave();
        } else if (e.key === 'Escape') {
        onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <>
        <div
            className="fixed z-50 p-4 rounded-lg shadow-xl"
            style={{
            backgroundColor: theme.panel,
            borderColor: theme.border,
            border: '2px solid',
            left: `${position.x}px`,
            top: `${position.y}px`,
            minWidth: '200px'
            }}
        >
            <h3
            className="font-semibold mb-2"
            style={{ color: theme.text }}
            >
            Transition Label
            </h3>
            <input
            ref={inputRef}
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="ε"
            className="w-full px-3 py-2 rounded-lg border mb-3"
            style={{
                backgroundColor: theme.canvas,
                borderColor: theme.border,
                color: theme.text
            }}
            />
            <div className="flex gap-2 justify-end">
            <button
                onClick={onClose}
                className="px-3 py-1 rounded-lg"
                style={{
                backgroundColor: theme.node,
                color: theme.text
                }}
            >
                Cancel
            </button>
            <button
                onClick={handleSave}
                className="px-3 py-1 rounded-lg"
                style={{
                backgroundColor: theme.nodeSelected,
                color: '#ffffff'
                }}
            >
                Save
            </button>
            </div>
        </div>
        </>
    );
}