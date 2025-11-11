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
    a.download = 'automaton_graph.json';
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

export function checkNodeOverlap(newNode, existingNodes, minDistance = 60) {
    for (const node of existingNodes) {
        const dx = newNode.x - node.x;
        const dy = newNode.y - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < minDistance) {
        return true;
        }
    }
    return false;
}

export function findNonOverlappingPosition(baseX, baseY, existingNodes, maxAttempts = 50) {
    let x = baseX;
    let y = baseY;
    let attempt = 0;
    const spiralStep = 70;
    
    while (attempt < maxAttempts) {
        const testNode = { x, y };
        if (!checkNodeOverlap(testNode, existingNodes)) {
        return { x, y };
        }
        
        const angle = (attempt * 0.5) * Math.PI;
        const radius = spiralStep * (1 + attempt * 0.3);
        x = baseX + radius * Math.cos(angle);
        y = baseY + radius * Math.sin(angle);
        attempt++;
    }
    
    return { x: baseX, y: baseY };
}