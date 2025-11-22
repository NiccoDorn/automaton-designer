// NFA to DFA Conversion using Subset Construction (Powerset Construction)
// Converts a non-deterministic finite automaton to a deterministic one

export function convertNFAtoDFA(nodes, edges) {
    // Get start states
    const startStates = nodes.filter(n => n.isStart);
    if (startStates.length === 0) {
        throw new Error('NFA must have at least one start state');
    }

    // Get alphabet (excluding epsilon)
    const alphabet = new Set();
    edges.forEach(edge => {
        edge.label.split(',').forEach(symbol => {
            const trimmed = symbol.trim();
            if (trimmed && trimmed !== 'ε' && trimmed !== 'epsilon') {
                alphabet.add(trimmed);
            }
        });
    });

    // Build transition table: state -> symbol -> [states]
    const nfaTransitions = new Map();
    nodes.forEach(node => {
        nfaTransitions.set(node.id, new Map());
    });

    edges.forEach(edge => {
        edge.label.split(',').forEach(symbol => {
            const trimmed = symbol.trim();
            if (!nfaTransitions.get(edge.from).has(trimmed)) {
                nfaTransitions.get(edge.from).set(trimmed, []);
            }
            nfaTransitions.get(edge.from).get(trimmed).push(edge.to);
        });
    });

    // Compute epsilon closure for each state
    const epsilonClosure = (stateIds) => {
        const closure = new Set(stateIds);
        const stack = [...stateIds];

        while (stack.length > 0) {
            const stateId = stack.pop();
            const transitions = nfaTransitions.get(stateId);

            if (transitions) {
                const epsilonTargets = [
                    ...(transitions.get('ε') || []),
                    ...(transitions.get('epsilon') || [])
                ];

                epsilonTargets.forEach(targetId => {
                    if (!closure.has(targetId)) {
                        closure.add(targetId);
                        stack.push(targetId);
                    }
                });
            }
        }

        return Array.from(closure).sort((a, b) => a - b);
    };

    // Compute move(stateSet, symbol) - states reachable on symbol
    const move = (stateSet, symbol) => {
        const result = new Set();

        stateSet.forEach(stateId => {
            const transitions = nfaTransitions.get(stateId);
            if (transitions && transitions.has(symbol)) {
                transitions.get(symbol).forEach(target => result.add(target));
            }
        });

        return Array.from(result);
    };

    // Subset Construction Algorithm
    const steps = [];

    // Initial DFA state: epsilon-closure of all start states
    const initialNfaStates = startStates.map(s => s.id);
    const initialDfaState = epsilonClosure(initialNfaStates);

    steps.push({
        description: 'Initial state: ε-closure of NFA start states',
        dfaState: initialDfaState,
        nfaStates: initialDfaState
    });

    // DFA states: Map from state set (as string) to DFA state id
    const dfaStatesMap = new Map();
    const statesToProcess = [];

    const stateKey = (stateSet) => stateSet.join(',');

    dfaStatesMap.set(stateKey(initialDfaState), {
        id: 0,
        nfaStates: initialDfaState
    });
    statesToProcess.push(initialDfaState);

    let nextDfaId = 1;
    const dfaTransitions = [];

    // Process each DFA state
    while (statesToProcess.length > 0) {
        const currentDfaStateSet = statesToProcess.shift();
        const currentDfaStateKey = stateKey(currentDfaStateSet);
        const currentDfaState = dfaStatesMap.get(currentDfaStateKey);

        // For each symbol in alphabet
        for (const symbol of alphabet) {
            // Compute move(currentDfaStateSet, symbol)
            const movedStates = move(currentDfaStateSet, symbol);

            if (movedStates.length === 0) continue;

            // Compute epsilon-closure of moved states
            const newDfaStateSet = epsilonClosure(movedStates);
            const newDfaStateKey = stateKey(newDfaStateSet);

            steps.push({
                description: `From state {${currentDfaStateSet.map(id => nodes.find(n => n.id === id)?.label || id).join(',')}} on symbol '${symbol}'`,
                fromDfaState: currentDfaStateSet,
                symbol,
                movedStates,
                newDfaState: newDfaStateSet
            });

            // Check if this DFA state already exists
            if (!dfaStatesMap.has(newDfaStateKey)) {
                dfaStatesMap.set(newDfaStateKey, {
                    id: nextDfaId++,
                    nfaStates: newDfaStateSet
                });
                statesToProcess.push(newDfaStateSet);
            }

            // Add transition
            dfaTransitions.push({
                from: currentDfaState.id,
                to: dfaStatesMap.get(newDfaStateKey).id,
                symbol
            });
        }
    }

    // Build DFA nodes
    const dfaNodes = [];
    for (const [key, dfaState] of dfaStatesMap) {
        const nfaStates = dfaState.nfaStates.map(id => nodes.find(n => n.id === id));

        // DFA state is accepting if it contains any accepting NFA state
        const isAccepting = nfaStates.some(s => s?.isAccepting);

        // DFA state is start if it's the initial state
        const isStart = key === stateKey(initialDfaState);

        // Create label from NFA state labels
        const label = nfaStates.length > 1
            ? `{${nfaStates.map(s => s?.label || `q${s?.id}`).join(',')}}`
            : nfaStates[0]?.label || `q${nfaStates[0]?.id}`;

        // Position: average of NFA states or grid layout
        const x = nfaStates.length > 0
            ? nfaStates.reduce((sum, s) => sum + (s?.x || 0), 0) / nfaStates.length
            : 100 + (dfaState.id % 5) * 120;

        const y = nfaStates.length > 0
            ? nfaStates.reduce((sum, s) => sum + (s?.y || 0), 0) / nfaStates.length
            : 100 + Math.floor(dfaState.id / 5) * 120;

        dfaNodes.push({
            id: dfaState.id,
            x,
            y,
            label,
            isAccepting,
            isStart
        });
    }

    // Build DFA edges (combine transitions with same from/to)
    const edgeMap = new Map();
    dfaTransitions.forEach(trans => {
        const key = `${trans.from}-${trans.to}`;
        if (!edgeMap.has(key)) {
            edgeMap.set(key, []);
        }
        edgeMap.get(key).push(trans.symbol);
    });

    const dfaEdges = [];
    let edgeId = 0;
    for (const [key, symbols] of edgeMap) {
        const [from, to] = key.split('-').map(Number);
        dfaEdges.push({
            id: edgeId++,
            from,
            to,
            label: symbols.join(', ')
        });
    }

    return {
        nodes: dfaNodes,
        edges: dfaEdges,
        steps,
        nfaStateCount: nodes.length,
        dfaStateCount: dfaNodes.length
    };
}
