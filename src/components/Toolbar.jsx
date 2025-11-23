/* eslint-disable no-unused-vars */
import { MousePointer, Plus, Download, Upload, Undo, Redo, Palette, Trash2, SquarePlus, Share2, Keyboard } from 'lucide-react';
import { ExportDropdown } from './ExportDropdown';

export function Toolbar({
    mode,
    onModeChange,
    onExportJSON,
    onExportPNG,
    onExportSVG,
    onExportLaTeX,
    onImport,
    onUndo,
    onRedo,
    canUndo,
    canRedo,
    theme,
    themeName,
    onThemeToggle,
    onClearCanvas,
    onMultiAdd,
    onKeyboardShortcuts,
    isSimulating = false
    }) {
    const modes = [
        { key: 'select', icon: MousePointer, label: 'Select & Move' },
        { key: 'add', icon: Plus, label: 'Add' },
    ];

    return (
        <div
        className="border-b p-4 flex items-center gap-4 flex-wrap shadow-md"
        style={{
            backgroundColor: theme.toolbar,
            borderColor: theme.border
        }}
        >
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
                disabled={isSimulating}
                className="px-4 py-2 rounded-lg font-medium transition duration-150 ease-in-out shadow-sm flex items-center gap-2"
                style={{
                backgroundColor: mode === key ? theme.nodeSelected : theme.node,
                color: mode === key ? '#ffffff' : theme.text,
                opacity: isSimulating ? 0.5 : 1,
                cursor: isSimulating ? 'not-allowed' : 'pointer'
                }}
            >
                <IconComponent size={18} /> {label}
            </button>
            ))}
        </div>

        <div className="flex gap-2">
            <button
            onClick={onUndo}
            disabled={!canUndo || isSimulating}
            className="px-3 py-2 rounded-lg font-medium transition duration-150 ease-in-out shadow-sm flex items-center gap-2"
            style={{
                backgroundColor: (canUndo && !isSimulating) ? theme.node : theme.border,
                color: (canUndo && !isSimulating) ? theme.text : theme.nodeStroke,
                opacity: (canUndo && !isSimulating) ? 1 : 0.5,
                cursor: (canUndo && !isSimulating) ? 'pointer' : 'not-allowed'
            }}
            title="Undo (Ctrl+Z)"
            >
            <Undo size={18} />
            </button>
            <button
            onClick={onRedo}
            disabled={!canRedo || isSimulating}
            className="px-3 py-2 rounded-lg font-medium transition duration-150 ease-in-out shadow-sm flex items-center gap-2"
            style={{
                backgroundColor: (canRedo && !isSimulating) ? theme.node : theme.border,
                color: (canRedo && !isSimulating) ? theme.text : theme.nodeStroke,
                opacity: (canRedo && !isSimulating) ? 1 : 0.5,
                cursor: (canRedo && !isSimulating) ? 'pointer' : 'not-allowed'
            }}
            title="Redo (Ctrl+Y)"
            >
            <Redo size={18} />
            </button>
        </div>

        <div className="flex gap-2">
            <button
            onClick={onMultiAdd}
            disabled={isSimulating}
            className="px-4 py-2 rounded-lg font-medium shadow-sm transition duration-150 ease-in-out flex items-center gap-2"
            style={{
                backgroundColor: theme.node,
                color: theme.text,
                opacity: isSimulating ? 0.5 : 1,
                cursor: isSimulating ? 'not-allowed' : 'pointer'
            }}
            title="Add multiple states at once (M)"
            >
            <SquarePlus size={18} /> Multi-Add
            </button>

            <button
            onClick={onClearCanvas}
            disabled={isSimulating}
            className="px-4 py-2 rounded-lg text-white font-medium shadow-md transition duration-150 ease-in-out flex items-center gap-2"
            style={{
                backgroundColor: '#ef4444',
                opacity: isSimulating ? 0.5 : 1,
                cursor: isSimulating ? 'not-allowed' : 'pointer'
            }}
            title="Clear entire canvas"
            >
            <Trash2 size={18} /> Clear
            </button>
        </div>

        <div className="flex gap-2 ml-auto">
            <button
            onClick={onKeyboardShortcuts}
            disabled={isSimulating}
            className="px-4 py-2 rounded-lg font-medium shadow-sm transition duration-150 ease-in-out flex items-center gap-2"
            style={{
                backgroundColor: theme.node,
                color: theme.text,
                opacity: isSimulating ? 0.5 : 1,
                cursor: isSimulating ? 'not-allowed' : 'pointer'
            }}
            title="Help (h)"
            >
            <Keyboard size={18} />
            </button>
            <button
            onClick={onThemeToggle}
            disabled={isSimulating}
            className="px-4 py-2 rounded-lg font-medium shadow-sm transition duration-150 ease-in-out flex items-center gap-2"
            style={{
                backgroundColor: theme.node,
                color: theme.text,
                opacity: isSimulating ? 0.5 : 1,
                cursor: isSimulating ? 'not-allowed' : 'pointer'
            }}
            title={`Current: ${themeName}`}
            >
            <Palette size={18} /> {themeName}
            </button>
            <ExportDropdown
                onExportJSON={onExportJSON}
                onExportPNG={onExportPNG}
                onExportSVG={onExportSVG}
                onExportLaTeX={onExportLaTeX}
                disabled={isSimulating}
                theme={theme}
            />
            <label
            className={`px-4 py-2 rounded-lg text-white font-medium shadow-md transition duration-150 ease-in-out flex items-center gap-2 ${isSimulating ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
            style={{ backgroundColor: '#a855f7' }}
            >
            <Upload size={18} /> Import
            <input
                type="file"
                accept=".json"
                onChange={onImport}
                disabled={isSimulating}
                className="hidden"
            />
            </label>
        </div>
        </div>
    );
}