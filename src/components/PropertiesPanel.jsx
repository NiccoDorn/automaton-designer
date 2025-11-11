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
    theme
    }) {
    const selectedNodeData = nodes.find(n => n.id === selectedNode);
    const selectedEdges = edges.filter(e => e.from === selectedNode);

    return (
        <div
        className="w-80 border-l p-6 overflow-y-auto shadow-lg"
        style={{
            backgroundColor: theme.panel,
            borderColor: theme.border,
            color: theme.text
        }}
        >
        <h3
            className="font-bold text-xl mb-6 border-b pb-2"
            style={{ borderColor: theme.border }}
        >
            Edit Properties
        </h3>

        {selectedNodeData ? (
            <>
            <NodeEditor
                node={selectedNodeData}
                onUpdateLabel={(label) => onUpdateNodeLabel(selectedNode, label)}
                onToggleAccepting={() => onToggleAccepting(selectedNode)}
                onSetStart={() => onSetStart(selectedNode)}
                onDelete={() => onDeleteNode(selectedNode)}
                theme={theme}
            />
            <EdgeList
                edges={selectedEdges}
                nodes={nodes}
                onUpdateLabel={onUpdateEdgeLabel}
                onDelete={onDeleteEdge}
                theme={theme}
            />
            </>
        ) : (
            <p
            className="text-sm italic"
            style={{ color: theme.nodeStroke }}
            >
            Click on a state in the canvas to view and edit its properties, or start by using the tools in the toolbar!
            </p>
        )}
        </div>
    );
}