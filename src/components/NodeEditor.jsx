import { Trash2 } from 'lucide-react';

export function NodeEditor({ node, onUpdateLabel, onToggleAccepting, onSetStart, onDelete, theme }) {
    return (
        <div className="space-y-6">
        <h4
            className="font-semibold text-lg"
            style={{ color: theme.nodeSelected }}
        >
            Node: {node.label} (ID: {node.id})
        </h4>

        <div>
            <label
            className="block text-sm font-medium mb-1"
            style={{ color: theme.text }}
            >
            State Label
            </label>
            <input
            type="text"
            value={node.label}
            onChange={(e) => onUpdateLabel(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg shadow-sm"
            style={{
                backgroundColor: theme.node,
                borderColor: theme.border,
                color: theme.text
            }}
            aria-label="State Label"
            />
        </div>

        <div className="space-y-3">
            <label
            className="flex items-center gap-3 p-2 rounded-lg shadow-inner cursor-pointer"
            style={{ backgroundColor: theme.canvas }}
            >
            <input
                type="checkbox"
                checked={node.isAccepting}
                onChange={onToggleAccepting}
                className="w-4 h-4 rounded"
                style={{ accentColor: theme.nodeSelected }}
            />
            <span
                className="text-sm font-medium"
                style={{ color: theme.text }}
            >
                Accepting State (Double Ring)
            </span>
            </label>
            <label
            className="flex items-center gap-3 p-2 rounded-lg shadow-inner cursor-pointer"
            style={{ backgroundColor: theme.canvas }}
            >
            <input
                type="checkbox"
                checked={node.isStart}
                onChange={onSetStart}
                className="w-4 h-4 rounded"
                style={{ accentColor: theme.nodeSelected }}
            />
            <span
                className="text-sm font-medium"
                style={{ color: theme.text }}
            >
                Start State (Initial State)
            </span>
            </label>
        </div>

        <button
            onClick={onDelete}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg font-semibold shadow-lg hover:bg-red-700 transition duration-150 ease-in-out flex items-center justify-center gap-2"
        >
            <Trash2 size={16} /> Delete State
        </button>
        </div>
    );
}