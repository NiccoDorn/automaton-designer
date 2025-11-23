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

export function exportCanvasAsPNG(canvas, filename = 'automaton.png') {
    canvas.toBlob((blob) => {
        if (!blob) {
            console.error('Failed to create PNG');
            return;
        }
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }, 'image/png');
}

export function exportCanvasAsSVG(canvas, nodes, edges, theme, filename = 'automaton.svg') {
    // Create SVG representation
    const width = canvas.width;
    const height = canvas.height;

    let svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="${theme.canvas}"/>
  <g id="automaton">
`;

    // Draw edges
    edges.forEach(edge => {
        const fromNode = nodes.find(n => n.id === edge.from);
        const toNode = nodes.find(n => n.id === edge.to);
        if (!fromNode || !toNode) return;

        if (fromNode.id === toNode.id) {
            svgContent += `    <path d="M ${fromNode.x},${fromNode.y - 25} Q ${fromNode.x},${fromNode.y - 80} ${fromNode.x + 40},${fromNode.y - 25}"
            stroke="${theme.nodeStroke}" fill="none" stroke-width="2"/>
    <text x="${fromNode.x}" y="${fromNode.y - 85}" fill="${theme.text}" font-size="14" text-anchor="middle">${edge.label}</text>
`;
        } else {
            // Regular edge
            svgContent += `    <line x1="${fromNode.x}" y1="${fromNode.y}" x2="${toNode.x}" y2="${toNode.y}"
            stroke="${theme.nodeStroke}" stroke-width="2"/>
    <text x="${(fromNode.x + toNode.x) / 2}" y="${(fromNode.y + toNode.y) / 2 - 5}" fill="${theme.text}" font-size="14" text-anchor="middle">${edge.label}</text>
`;
        }
    });

    // Draw nodes
    nodes.forEach(node => {
        // Accepting state (double circle)
        if (node.isAccepting) {
            svgContent += `    <circle cx="${node.x}" cy="${node.y}" r="30" fill="none" stroke="${theme.nodeStroke}" stroke-width="2"/>
`;
        }
        // Main circle
        svgContent += `    <circle cx="${node.x}" cy="${node.y}" r="25" fill="${theme.node}" stroke="${theme.nodeStroke}" stroke-width="2"/>
    <text x="${node.x}" y="${node.y + 5}" fill="${theme.text}" font-size="16" font-weight="bold" text-anchor="middle">${node.label}</text>
`;
        // Start state arrow
        if (node.isStart) {
            svgContent += `    <path d="M ${node.x - 40},${node.y} L ${node.x - 25},${node.y}" stroke="${theme.nodeStroke}" stroke-width="2" marker-end="url(#arrowhead)"/>
`;
        }
    });

    svgContent += `  </g>
  <defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="5" refY="3" orient="auto">
      <polygon points="0 0, 10 3, 0 6" fill="${theme.nodeStroke}"/>
    </marker>
  </defs>
</svg>`;

    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
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
        } catch (error) { onError(error); }
    };
    reader.readAsText(file);
}

export function checkNodeOverlap(newNode, existingNodes, minDistance = 60) {
    for (const node of existingNodes) {
        const dx = newNode.x - node.x;
        const dy = newNode.y - node.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < minDistance) { return true; }
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