/* eslint-disable no-unused-vars */
import { MousePointer, Plus, Download, Upload, Undo, Redo, Palette, Trash2, SquarePlus, Share2 } from 'lucide-react';
import { useState } from 'react';

export function Toolbar({
    mode,
    onModeChange,
    onExport,
    onImport,
    onUndo,
    onRedo,
    canUndo,
    canRedo,
    theme,
    themeName,
    onThemeToggle,
    defaultEdgeLabel,
    onDefaultEdgeLabelChange,
    onClearCanvas,
    onMultiAdd
    }) {
    const [showMultiAdd, setShowMultiAdd] = useState(false);
    const [nodeCount, setNodeCount] = useState(5);

    const modes = [
        { key: 'select', icon: MousePointer, label: 'Select & Move' },
        { key: 'add', icon: Plus, label: 'Add' },
    ];

    const handleMultiAdd = () => {
        const count = Math.min(Math.max(1, parseInt(nodeCount) || 5), 30);
        onMultiAdd(count);
        setShowMultiAdd(false);
    };

    return (
        <div
        className="border-b p-4 flex items-center gap-4 flex-wrap shadow-md">
        <Share2
            size={24}
            className='icon-glow-share2'
            style={{
                '--glow-color': theme.nodeSelected || 'rgba(229, 242, 246, 1)',
                color: theme.nodeSelected || 'rgb(173, 216, 230)',
            }}
        />
        <h1
            className="text-xl font-extrabold mr-4"
            style={{ color: theme.nodeSelected }}
        >
            Automaton Designer
        </h1>

        <div className="flex gap-2">
            {modes.map(({ key, icon: IconComponent, label }) => (
            <button
                key={key}
                onClick={() => onModeChange(key)}
                className="px-4 py-2 rounded-lg font-medium transition duration-150 ease-in-out shadow-sm flex items-center gap-2"
                style={{
                backgroundColor: mode === key ? theme.nodeSelected : theme.node,
                color: mode === key ? '#ffffff' : theme.text
                }}
            >
                <IconComponent size={18} /> {label}
            </button>
            ))}
        </div>

        {mode === 'add' && (
            <div className="flex items-center gap-2">
            <label
                className="text-sm font-medium"
                style={{ color: theme.text }}
            >
                Transition Label:
            </label>
            <input
                type="text"
                value={defaultEdgeLabel}
                onChange={(e) => onDefaultEdgeLabelChange(e.target.value)}
                placeholder="ε"
                className="px-3 py-2 rounded-lg border text-sm w-24"
                style={{
                backgroundColor: theme.node,
                borderColor: theme.border,
                color: theme.text
                }}
            />
            </div>
        )}

        <div className="flex gap-2">
            <button
            onClick={onUndo}
            disabled={!canUndo}
            className="px-3 py-2 rounded-lg font-medium transition duration-150 ease-in-out shadow-sm flex items-center gap-2"
            style={{
                backgroundColor: canUndo ? theme.node : theme.border,
                color: canUndo ? theme.text : theme.nodeStroke,
                opacity: canUndo ? 1 : 0.5,
                cursor: canUndo ? 'pointer' : 'not-allowed'
            }}
            title="Undo (Ctrl+Z)"
            >
            <Undo size={18} />
            </button>
            <button
            onClick={onRedo}
            disabled={!canRedo}
            className="px-3 py-2 rounded-lg font-medium transition duration-150 ease-in-out shadow-sm flex items-center gap-2"
            style={{
                backgroundColor: canRedo ? theme.node : theme.border,
                color: canRedo ? theme.text : theme.nodeStroke,
                opacity: canRedo ? 1 : 0.5,
                cursor: canRedo ? 'pointer' : 'not-allowed'
            }}
            title="Redo (Ctrl+Y)"
            >
            <Redo size={18} />
            </button>
        </div>

        <div className="flex gap-2">
            <button
            onClick={() => setShowMultiAdd(!showMultiAdd)}
            className="px-4 py-2 rounded-lg font-medium shadow-sm transition duration-150 ease-in-out flex items-center gap-2"
            style={{
                backgroundColor: theme.node,
                color: theme.text
            }}
            title="Add multiple states at once"
            >
            <SquarePlus size={18} /> Multi-Add
            </button>

            {showMultiAdd && (
            <div className="flex items-center gap-2">
                <input
                type="number"
                min="1"
                max="30"
                value={nodeCount}
                onChange={(e) => setNodeCount(e.target.value)}
                className="px-3 py-2 rounded-lg border text-sm w-20"
                style={{
                    backgroundColor: theme.node,
                    borderColor: theme.border,
                    color: theme.text
                }}
                />
                <button
                onClick={handleMultiAdd}
                className="px-3 py-2 rounded-lg font-medium shadow-sm transition duration-150 ease-in-out"
                style={{
                    backgroundColor: theme.nodeSelected,
                    color: '#ffffff'
                }}
                >
                Create
                </button>
            </div>
            )}

            <button
            onClick={onClearCanvas}
            className="px-4 py-2 rounded-lg text-white font-medium shadow-md transition duration-150 ease-in-out flex items-center gap-2"
            style={{ backgroundColor: '#ef4444' }}
            title="Clear entire canvas"
            >
            <Trash2 size={18} /> Clear all
            </button>
        </div>

        <div className="flex gap-2 ml-auto">
            <button
            onClick={onThemeToggle}
            className="px-4 py-2 rounded-lg font-medium shadow-sm transition duration-150 ease-in-out flex items-center gap-2"
            style={{
                backgroundColor: theme.node,
                color: theme.text
            }}
            title={`Current: ${themeName}`}
            >
            <Palette size={18} /> {themeName}
            </button>
            <button
            onClick={onExport}
            className="px-4 py-2 rounded-lg text-white font-medium shadow-md transition duration-150 ease-in-out flex items-center gap-2"
            style={{ backgroundColor: '#10b981' }}
            >
            <Download size={18} /> Export
            </button>
            <label
            className="px-4 py-2 rounded-lg text-white font-medium shadow-md transition duration-150 ease-in-out flex items-center gap-2 cursor-pointer"
            style={{ backgroundColor: '#a855f7' }}
            >
            <Upload size={18} /> Import
            <input type="file" accept=".json" onChange={onImport} className="hidden" />
            </label>
        </div>
        </div>
    );
}