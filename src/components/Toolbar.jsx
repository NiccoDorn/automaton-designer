/* eslint-disable no-unused-vars */
import { Plus, Move, MousePointer, Download, Upload } from 'lucide-react';

export function Toolbar({ mode, onModeChange, onExport, onImport }) {
    const modes = [
        { key: 'select', icon: MousePointer, label: 'Select' },
        { key: 'addNode', icon: Plus, label: 'Add Node' },
        { key: 'addEdge', icon: Plus, label: 'Add Edge' },
        { key: 'move', icon: Move, label: 'Move/Drag' },
    ];

    return (
        <div className="bg-white border-b border-gray-200 p-4 flex items-center gap-4 flex-wrap shadow-md">
        <h1 className="text-xl font-extrabold text-blue-600 mr-4">Auomaton Designer</h1>

        <div className="flex gap-2">
            {modes.map(({ key, icon: IconComponent, label }) => (
            <button
                key={key}
                onClick={() => onModeChange(key)}
                className={`px-4 py-2 rounded-lg font-medium transition duration-150 ease-in-out shadow-sm
                ${mode === key
                    ? 'bg-blue-600 text-white shadow-blue-400/50 hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } flex items-center gap-2`}
            >
                <IconComponent size={18} /> {label}
            </button>
            ))}
        </div>

        <div className="flex gap-2 ml-auto">
            <button
            onClick={onExport}
            className="px-4 py-2 rounded-lg bg-green-500 text-white font-medium shadow-md shadow-green-400/50 hover:bg-green-600 transition duration-150 ease-in-out flex items-center gap-2"
            >
            <Download size={18} /> Export
            </button>
            <label className="px-4 py-2 rounded-lg bg-purple-500 text-white font-medium shadow-md shadow-purple-400/50 hover:bg-purple-600 transition duration-150 ease-in-out flex items-center gap-2 cursor-pointer">
            <Upload size={18} /> Import
            <input type="file" accept=".json" onChange={onImport} className="hidden" />
            </label>
        </div>
        </div>
    );
}