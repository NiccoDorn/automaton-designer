import { NodeEditor } from './NodeEditor';
import { EdgeList } from './EdgeList';
import { UsageInstructions } from './UsageInstructions';

export function PropertiesPanel({
    selectedNode,
    nodes,
    edges,
    onUpdateNodeLabel,
    onToggleAccepting,
    onSetStart,
    onDeleteNode,
    onUpdateEdgeLabel,
    onDeleteEdge
    }) {
    const selectedNodeData = nodes.find(n => n.id === selectedNode);
    const selectedEdges = edges.filter(e => e.from === selectedNode || e.to === selectedNode);

    return (
        <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto shadow-lg">
        <h3 className="font-bold text-xl text-gray-800 mb-6 border-b pb-2">Edit Properties</h3>

        {selectedNodeData ? (
            <>
            <NodeEditor
                node={selectedNodeData}
                onUpdateLabel={(label) => onUpdateNodeLabel(selectedNode, label)}
                onToggleAccepting={() => onToggleAccepting(selectedNode)}
                onSetStart={() => onSetStart(selectedNode)}
                onDelete={() => onDeleteNode(selectedNode)}
            />
            <EdgeList
                edges={selectedEdges}
                nodes={nodes}
                onUpdateLabel={onUpdateEdgeLabel}
                onDelete={onDeleteEdge}
            />
            </>
        ) : (
            <p className="text-gray-500 text-sm italic">
            Click on a state in the canvas to view and edit its properties, or start by using the tools in the toolbar!
            </p>
        )}

        <UsageInstructions />
        </div>
    );
}