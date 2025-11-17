import { NodeEditor } from './NodeEditor';
import { EdgeList } from './EdgeList';

export function PropertiesSection({
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
    isSimulating
}) {
    const selectedNodeData = nodes.find(n => n.id === selectedNode);
    const selectedEdges = edges.filter(e => e.from === selectedNode);

    return (
        <div className="mt-3">
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
