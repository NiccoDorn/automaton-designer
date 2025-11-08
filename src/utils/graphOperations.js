export function createNode(nodes, x, y) {
    const newNodeId = nodes.length > 0 ? Math.max(...nodes.map(n => n.id)) + 1 : 0;
    return {
        id: newNodeId,
        x,
        y,
        label: `q${newNodeId}`,
        isAccepting: false,
        isStart: nodes.length === 0
    };
}

export function createEdge(edges, from, to, label = 'ε') {
    const newEdgeId = edges.length > 0 ? Math.max(...edges.map(e => e.id)) + 1 : 0;
    return {
        from,
        to,
        label,
        id: newEdgeId
    };
}

export function exportGraph(nodes, edges) {
    const data = { nodes, edges };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fsa_graph.json';
    a.click();
    URL.revokeObjectURL(url);
}

export function importGraphFromFile(file, onSuccess, onError) {
    const reader = new FileReader();
    reader.onload = (event) => {
        try {
        const data = JSON.parse(event.target.result);
        if (Array.isArray(data.nodes) && Array.isArray(data.edges)) {
            onSuccess(data);
        } else {
            onError(new Error("Invalid graph structure in file."));
        }
        } catch (error) {
        onError(error);
        }
    };
    reader.readAsText(file);
}