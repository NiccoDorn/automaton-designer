export function generateLaTeXCode(nodes, edges) {
    // Scale coordinates for better LaTeX output
    const scale = 0.02; // Adjust as needed

    // Find canvas bounds
    const minX = Math.min(...nodes.map(n => n.x), 0);
    const minY = Math.min(...nodes.map(n => n.y), 0);

    let latex = `\\begin{center}
% \\usepackage{tikz}
% \\usetikzlibrary{automata,positioning,arrows.meta}

\\begin{tikzpicture}[->,>=Stealth,shorten >=1pt,auto,node distance=2.8cm,thick]
`;

    // Add nodes
    nodes.forEach((node) => {
        const x = ((node.x - minX) * scale).toFixed(2);
        const y = (-(node.y - minY) * scale).toFixed(2); // Flip Y for LaTeX

        let nodeOptions = 'state';
        if (node.isAccepting) nodeOptions += ',accepting';
        if (node.isStart) nodeOptions += ',initial,initial text=';

        latex += `\\node[${nodeOptions}] (${node.id}) at (${x},${y}) {$${node.label}$};\n`;
    });

    latex += '\n';

    // Add edges
    edges.forEach(edge => {
        const fromNode = nodes.find(n => n.id === edge.from);
        const toNode = nodes.find(n => n.id === edge.to);

        if (!fromNode || !toNode) return;

        if (edge.from === edge.to) {
            // Self-loop
            latex += `\\path (${edge.from}) edge [loop above] node {${edge.label}} (${edge.from});\n`;
        } else {
            // Check if there's a reverse edge to determine if we need bend
            const hasReverse = edges.some(e => e.from === edge.to && e.to === edge.from);
            const bendOption = hasReverse ? ' [bend left]' : '';
            latex += `\\path (${edge.from}) edge${bendOption} node {${edge.label}} (${edge.to});\n`;
        }
    });

    latex += `\\end{tikzpicture}
\\end{center}
`;

    return latex;
}
