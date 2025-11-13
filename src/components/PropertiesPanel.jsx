import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { NodeEditor } from './NodeEditor';
import { EdgeList } from './EdgeList';

export function PropertiesPanel({
    selectedNode,
    nodes,
    edges,
    onUpdateNodeLabel,
    onToggleAccepting,
    onSetStart,
    onDeleteNode,
    onUpdateEdgeLabel,
    onDeleteEdge,
    theme,
    isSimulating = false
    }) {
    const [isGreekExpanded, setIsGreekExpanded] = useState(false);
    const selectedNodeData = nodes.find(n => n.id === selectedNode);
    const selectedEdges = edges.filter(e => e.from === selectedNode);

    const greekChars = [
        { symbol: 'ε', name: 'epsilon' },
        { symbol: 'α', name: 'alpha' },
        { symbol: 'β', name: 'beta' },
        { symbol: 'γ', name: 'gamma' },
        { symbol: 'δ', name: 'delta' }
    ];

    const copyToClipboard = (char) => {
        navigator.clipboard.writeText(char);
    };

    return (
        <div
        className="w-80 border-l p-6 overflow-y-auto shadow-lg"
        style={{
            backgroundColor: theme.panel,
            borderColor: theme.border,
            color: theme.text,
            opacity: isSimulating ? 0.6 : 1,
            pointerEvents: isSimulating ? 'none' : 'auto'
        }}
        >
        <h3
            className="font-bold text-xl mb-6 border-b pb-2"
            style={{ borderColor: theme.border }}
        >
            Edit Properties
        </h3>

        <div
            className="mb-6 border rounded-lg"
            style={{ borderColor: theme.border }}
        >
            <button
            onClick={() => setIsGreekExpanded(!isGreekExpanded)}
            disabled={isSimulating}
            className="w-full px-4 py-3 flex items-center justify-between"
            style={{ color: theme.text }}
            >
            <span className="font-semibold text-sm">Special Greek Characters</span>
            {isGreekExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            
            {isGreekExpanded && (
            <div
                className="px-4 pb-3 border-t"
                style={{ borderColor: theme.border }}
            >
                <div className="grid grid-cols-5 gap-2 mt-3">
                {greekChars.map(({ symbol, name }) => (
                    <button
                    key={symbol}
                    onClick={() => copyToClipboard(symbol)}
                    disabled={isSimulating}
                    className="p-2 rounded-lg text-center font-bold text-lg"
                    style={{
                        backgroundColor: theme.canvas,
                        color: theme.text,
                        border: `1px solid ${theme.border}`
                    }}
                    title={`Copy ${name}`}
                    >
                    {symbol}
                    </button>
                ))}
                </div>
                <p
                className="text-xs mt-2 italic"
                style={{ color: theme.nodeStroke }}
                >
                Click to copy
                </p>
            </div>
            )}
        </div>

        {selectedNodeData ? (
            <>
            <NodeEditor
                node={selectedNodeData}
                onUpdateLabel={(label) => onUpdateNodeLabel(selectedNode, label)}
                onToggleAccepting={() => onToggleAccepting(selectedNode)}
                onSetStart={() => onSetStart(selectedNode)}
                onDelete={() => onDeleteNode(selectedNode)}
                theme={theme}
                isSimulating={isSimulating}
            />
            <EdgeList
                edges={selectedEdges}
                nodes={nodes}
                onUpdateLabel={onUpdateEdgeLabel}
                onDelete={onDeleteEdge}
                theme={theme}
                isSimulating={isSimulating}
            />
            </>
        ) : (
            <p
            className="text-sm italic"
            style={{ color: theme.nodeStroke }}
            >
            {isSimulating
                ? 'Simulation running... Properties locked. Press ESC to escape the simulation, Neo!'
                : 'Click on a state in the canvas to view and edit its properties, or start by using the tools in the toolbar!'
            }
            </p>
        )}
        </div>
    );
}