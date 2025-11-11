import { useState, useRef, useEffect } from 'react';

export function MultiAddDialog({ isOpen, onClose, onConfirm, theme }) {
    const [count, setCount] = useState(5);
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen && inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
        }
    }, [isOpen]);

    const handleConfirm = () => {
        const finalCount = Math.min(Math.max(1, parseInt(count) || 5), 30);
        onConfirm(finalCount);
        onClose();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
        handleConfirm();
        } else if (e.key === 'Escape') {
        onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <>
        <div
            className="fixed z-50 p-6 rounded-lg shadow-xl left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
            style={{
            backgroundColor: theme.panel,
            borderColor: theme.border,
            border: '2px solid',
            minWidth: '300px'
            }}
        >
            <h3
            className="font-bold text-lg mb-4"
            style={{ color: theme.text }}
            >
            Multi-Add States
            </h3>
            <p
            className="text-sm mb-4"
            style={{ color: theme.nodeStroke }}
            >
            How many states would you like to create? (1-30)
            </p>
            <input
            ref={inputRef}
            type="number"
            min="1"
            max="30"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full px-4 py-2 rounded-lg border mb-4 text-center text-lg"
            style={{
                backgroundColor: theme.canvas,
                borderColor: theme.border,
                color: theme.text
            }}
            />
            <div className="flex gap-3 justify-end">
            <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg"
                style={{
                backgroundColor: theme.node,
                color: theme.text
                }}
            >
                Cancel
            </button>
            <button
                onClick={handleConfirm}
                className="px-4 py-2 rounded-lg font-semibold"
                style={{
                backgroundColor: theme.nodeSelected,
                color: '#ffffff'
                }}
            >
                Create
            </button>
            </div>
        </div>
        </>
    );
}