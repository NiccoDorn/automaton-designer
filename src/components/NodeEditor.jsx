import { Trash2 } from 'lucide-react';

export function NodeEditor({ node, onUpdateLabel, onToggleAccepting, onSetStart, onDelete }) {
    return (
        <div className="space-y-6">
        <h4 className="font-semibold text-lg text-blue-600">Node: {node.label} (ID: {node.id})</h4>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Node Label</label>
            <input
            type="text"
            value={node.label}
            onChange={(e) => onUpdateLabel(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            aria-label="Node Label"
            />
        </div>

        <div className="space-y-3">
            <label className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg shadow-inner cursor-pointer">
            <input
                type="checkbox"
                checked={node.isAccepting}
                onChange={onToggleAccepting}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-800">Accepting State (Double Ring)</span>
            </label>
            <label className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg shadow-inner cursor-pointer">
            <input
                type="checkbox"
                checked={node.isStart}
                onChange={onSetStart}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-800">Start State (Initial State)</span>
            </label>
        </div>

        <button
            onClick={onDelete}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg font-semibold shadow-lg shadow-red-400/50 hover:bg-red-700 transition duration-150 ease-in-out flex items-center justify-center gap-2"
        >
            <Trash2 size={16} /> Delete Node
        </button>
        </div>
    );
}