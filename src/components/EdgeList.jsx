import { Trash2 } from 'lucide-react';

export function EdgeList({ edges, nodes, onUpdateLabel, onDelete }) {
    if (edges.length === 0) return null;

    return (
        <div className="mt-6 border-t pt-4">
        <h4 className="font-semibold mb-3 text-gray-700">Connected Transitions</h4>
        {edges.map(edge => (
            <div key={edge.id} className="p-3 border border-gray-200 rounded-xl mb-3 bg-white shadow-sm">
            <div className="text-xs text-gray-500 mb-1">
                {nodes.find(n => n.id === edge.from)?.label} → {nodes.find(n => n.id === edge.to)?.label}
            </div>
            <div className="flex gap-2 items-center">
                <input
                type="text"
                placeholder="Label (e.g., a, b, 0, 1, ε)"
                value={edge.label}
                onChange={(e) => onUpdateLabel(edge.id, e.target.value)}
                className="flex-1 px-2 py-1 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                aria-label={`Edge label for transition ${edge.from} to ${edge.to}`}
                />
                <button
                onClick={() => onDelete(edge.id)}
                className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                title="Delete Edge"
                >
                <Trash2 size={14} />
                </button>
            </div>
            </div>
        ))}
        </div>
    );
}