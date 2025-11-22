// DFA Minimization using Hopcroft's Algorithm
// Minimizes a DFA by merging equivalent states

export function minimizeDFA(nodes, edges) {
    // Check if it's a valid DFA first
    const startStates = nodes.filter(n => n.isStart);
    if (startStates.length !== 1) {
        throw new Error('Not a valid DFA: Must have exactly one start state');
    }

    const hasEpsilonTransitions = edges.some(edge =>
        edge.label.split(',').some(symbol => symbol.trim() === 'ε' || symbol.trim() === 'epsilon')
    );
    if (hasEpsilonTransitions) {
        throw new Error('Not a valid DFA: Cannot have ε-transitions');
    }

    // Get all symbols in the alphabet
    const alphabet = new Set();
    edges.forEach(edge => {
        edge.label.split(',').forEach(symbol => {
            const trimmed = symbol.trim();
            if (trimmed && trimmed !== 'ε' && trimmed !== 'epsilon') {
                alphabet.add(trimmed);
            }
        });
    });

    // Create transition table: state -> symbol -> state
    const transitionTable = new Map();
    nodes.forEach(node => {
        transitionTable.set(node.id, new Map());
    });

    edges.forEach(edge => {
        edge.label.split(',').forEach(symbol => {
            const trimmed = symbol.trim();
            if (trimmed && trimmed !== 'ε' && trimmed !== 'epsilon') {
                transitionTable.get(edge.from).set(trimmed, edge.to);
            }
        });
    });

    // Check for non-determinism
    for (const [stateId, transitions] of transitionTable) {
        const seenSymbols = new Set();
        for (const symbol of transitions.keys()) {
            if (seenSymbols.has(symbol)) {
                throw new Error('Not a valid DFA: Has non-deterministic transitions');
            }
            seenSymbols.add(symbol);
        }
    }

    // Hopcroft's Algorithm
    // Step 1: Initial partition (accepting vs non-accepting)
    const acceptingStates = new Set(nodes.filter(n => n.isAccepting).map(n => n.id));
    const nonAcceptingStates = new Set(nodes.filter(n => !n.isAccepting).map(n => n.id));

    let partitions = [];
    if (acceptingStates.size > 0) partitions.push(acceptingStates);
    if (nonAcceptingStates.size > 0) partitions.push(nonAcceptingStates);

    // Step 2: Refine partitions
    let changed = true;
    const steps = [];

    steps.push({
        description: 'Initial partition: Accepting vs Non-accepting states',
        partitions: partitions.map(p => Array.from(p))
    });

    let iteration = 1;
    while (changed) {
        changed = false;
        const newPartitions = [];

        for (const partition of partitions) {
            if (partition.size <= 1) {
                newPartitions.push(partition);
                continue;
            }

            // Try to split this partition
            const subPartitions = new Map();

            for (const stateId of partition) {
                // Create signature: for each symbol, which partition does it lead to?
                const signature = [];
                for (const symbol of Array.from(alphabet).sort()) {
                    const targetState = transitionTable.get(stateId).get(symbol);

                    if (targetState === undefined) {
                        signature.push(-1); // No transition
                    } else {
                        // Find which partition the target belongs to
                        const targetPartitionIndex = partitions.findIndex(p => p.has(targetState));
                        signature.push(targetPartitionIndex);
                    }
                }

                const signatureKey = signature.join(',');

                if (!subPartitions.has(signatureKey)) {
                    subPartitions.set(signatureKey, new Set());
                }
                subPartitions.get(signatureKey).add(stateId);
            }

            // Add all sub-partitions
            if (subPartitions.size > 1) {
                changed = true;
                for (const subPartition of subPartitions.values()) {
                    newPartitions.push(subPartition);
                }
            } else {
                newPartitions.push(partition);
            }
        }

        partitions = newPartitions;

        if (changed) {
            steps.push({
                description: `Iteration ${iteration}: Refining partitions based on transitions`,
                partitions: partitions.map(p => Array.from(p))
            });
            iteration++;
        }
    }

    steps.push({
        description: 'Final partitions (equivalent states merged)',
        partitions: partitions.map(p => Array.from(p))
    });

    // Step 3: Build minimized DFA
    // Each partition becomes a new state
    const partitionToNewId = new Map();
    const newNodes = [];
    let newId = 0;

    partitions.forEach((partition, index) => {
        const representativeId = Array.from(partition)[0];
        const representative = nodes.find(n => n.id === representativeId);

        partitionToNewId.set(index, newId);

        // Create new node for this partition
        const partitionStates = Array.from(partition).map(id =>
            nodes.find(n => n.id === id)?.label || `q${id}`
        ).join(',');

        const newNode = {
            id: newId,
            x: representative.x,
            y: representative.y,
            label: partition.size > 1 ? `{${partitionStates}}` : representative.label,
            isAccepting: representative.isAccepting,
            isStart: representative.isStart
        };

        newNodes.push(newNode);
        newId++;
    });

    // Build new edges
    const newEdges = [];
    const edgeMap = new Map(); // Track (from,to) -> symbols

    partitions.forEach((partition, fromPartitionIndex) => {
        const representativeId = Array.from(partition)[0];
        const fromNewId = partitionToNewId.get(fromPartitionIndex);

        // For each symbol, find where this partition goes
        for (const symbol of alphabet) {
            const targetState = transitionTable.get(representativeId).get(symbol);

            if (targetState !== undefined) {
                // Find which partition the target belongs to
                const toPartitionIndex = partitions.findIndex(p => p.has(targetState));
                const toNewId = partitionToNewId.get(toPartitionIndex);

                const edgeKey = `${fromNewId}-${toNewId}`;

                if (!edgeMap.has(edgeKey)) {
                    edgeMap.set(edgeKey, []);
                }
                edgeMap.get(edgeKey).push(symbol);
            }
        }
    });

    // Create edges from edgeMap
    let edgeId = 0;
    for (const [key, symbols] of edgeMap) {
        const [from, to] = key.split('-').map(Number);
        newEdges.push({
            id: edgeId++,
            from,
            to,
            label: symbols.join(', ')
        });
    }

    return {
        nodes: newNodes,
        edges: newEdges,
        steps,
        originalStateCount: nodes.length,
        minimizedStateCount: newNodes.length
    };
}
