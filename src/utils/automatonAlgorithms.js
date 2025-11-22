export function checkLanguageEmptiness(nodes, edges) {
    const startNode = nodes.find(n => n.isStart);

    if (!startNode) {
        return {
            isEmpty: true,
            message: 'No start state defined. Language is empty.'
        };
    }

    const reachable = new Set();
    const queue = [startNode.id];
    reachable.add(startNode.id);

    while (queue.length > 0) {
        const currentId = queue.shift();
        const outgoingEdges = edges.filter(e => e.from === currentId);

        for (const edge of outgoingEdges) {
            if (!reachable.has(edge.to)) {
                reachable.add(edge.to);
                queue.push(edge.to);
            }
        }
    }

    const hasAcceptingState = nodes.some(n => reachable.has(n.id) && n.isAccepting);

    if (hasAcceptingState) {
        return {
            isEmpty: false,
            message: `Language is non-empty. Found ${reachable.size} reachable state(s), including accepting state(s).`
        };
    } else {
        return {
            isEmpty: true,
            message: `Language is empty. No accepting states reachable from start state, including itself.`
        };
    }
}

export function detectUnreachableStates(nodes, edges) {
    const startNode = nodes.find(n => n.isStart);
    const reachable = new Set();

    if (startNode) {
        const queue = [startNode.id];
        reachable.add(startNode.id);

        while (queue.length > 0) {
            const currentId = queue.shift();
            const outgoingEdges = edges.filter(e => e.from === currentId);

            for (const edge of outgoingEdges) {
                if (!reachable.has(edge.to)) {
                    reachable.add(edge.to);
                    queue.push(edge.to);
                }
            }
        }
    }

    const unreachable = new Set(
        nodes.filter(n => !reachable.has(n.id)).map(n => n.id)
    );

    const message = unreachable.size > 0
        ? `Found ${unreachable.size} unreachable state(s)`
        : 'No unreachable states found';

    return {
        unreachable,
        message
    };
}

export function detectDeadStates(nodes, edges) {
    const canReachAccepting = new Set();
    const acceptingNodes = nodes.filter(n => n.isAccepting);

    acceptingNodes.forEach(n => canReachAccepting.add(n.id));

    let changed = true;
    while (changed) {
        changed = false;

        for (const edge of edges) {
            if (canReachAccepting.has(edge.to) && !canReachAccepting.has(edge.from)) {
                canReachAccepting.add(edge.from);
                changed = true;
            }
        }
    }

    const dead = new Set(nodes.filter(n => !canReachAccepting.has(n.id)).map(n => n.id));
    const message = dead.size > 0 ? `Found ${dead.size} dead state(s)` : 'No dead states found';

    return { dead, message };
}

export function checkDFACompleteness(nodes, edges) {
    if (nodes.length === 0) {
        return {
            isComplete: true,
            message: 'Empty automaton is trivially complete.',
            incompleteStates: [],
            alphabet: new Set()
        };
    }

    const alphabet = new Set();
    edges.forEach(edge => {
        const symbols = edge.label.split(',').map(s => s.trim()).filter(s => s.length > 0);
        symbols.forEach(symbol => alphabet.add(symbol));
    });

    if (alphabet.size === 0) {
        return {
            isComplete: false,
            message: 'No alphabet symbols defined in edges.',
            incompleteStates: nodes.map(n => n.id),
            alphabet
        };
    }

    const incompleteStates = [];

    for (const node of nodes) {
        const outgoingEdges = edges.filter(e => e.from === node.id);

        const coveredSymbols = new Set();
        outgoingEdges.forEach(edge => {
            const symbols = edge.label.split(',').map(s => s.trim()).filter(s => s.length > 0);
            symbols.forEach(symbol => coveredSymbols.add(symbol));
        });

        const symbolToTargets = new Map();
        outgoingEdges.forEach(edge => {
            const symbols = edge.label.split(',').map(s => s.trim()).filter(s => s.length > 0);
            symbols.forEach(symbol => {
                if (!symbolToTargets.has(symbol)) {
                    symbolToTargets.set(symbol, []);
                }
                symbolToTargets.get(symbol).push(edge.to);
            });
        });

        let hasNondeterminism = false;
        for (const [targets] of symbolToTargets.entries()) { // _symbols maybe needed later
            if (targets.length > 1) {
                hasNondeterminism = true;
                break;
            }
        }

        const missingSymbols = [...alphabet].filter(s => !coveredSymbols.has(s));

        if (missingSymbols.length > 0 || hasNondeterminism) {
            incompleteStates.push({
                id: node.id,
                label: node.label,
                missingSymbols,
                hasNondeterminism
            });
        }
    }

    const isComplete = incompleteStates.length === 0;

    let message;
    if (isComplete) {
        message = `DFA is complete. All ${nodes.length} state(s) have transitions for all ${alphabet.size} alphabet symbol(s).`;
    } else {
        const issues = [];
        const statesWithMissing = incompleteStates.filter(s => s.missingSymbols.length > 0);
        const statesWithNondeterminism = incompleteStates.filter(s => s.hasNondeterminism);

        if (statesWithMissing.length > 0) { issues.push(`${statesWithMissing.length} state(s) missing transitions`); }
        if (statesWithNondeterminism.length > 0) {
            issues.push(`${statesWithNondeterminism.length} state(s) with non-deterministic transitions`);
        }
        message = `DFA is incomplete: ${issues.join(', ')}.`;
    }

    return { isComplete, message, incompleteStates, alphabet };
}

export function checkAutomatonType(nodes, edges) {
    const issues = [];

    // Check if automaton has any states
    if (nodes.length === 0) {
        return {
            type: 'INVALID',
            isDFA: false,
            isNFA: false,
            message: 'Empty automaton',
            issues: ['No states defined']
        };
    }

    // Check for exactly one start state
    const startStates = nodes.filter(n => n.isStart);
    if (startStates.length === 0) {
        issues.push('No start state defined');
    } else if (startStates.length > 1) {
        issues.push(`Multiple start states (${startStates.length})`);
    }

    // Check for epsilon transitions
    const hasEpsilonTransitions = edges.some(edge => {
        const symbols = edge.label.split(',').map(s => s.trim());
        return symbols.some(s => s === 'ε' || s === 'epsilon' || s === '');
    });

    if (hasEpsilonTransitions) {
        issues.push('Contains ε-transitions');
    }

    // Check for non-determinism (multiple transitions with same symbol from same state)
    let hasNondeterminism = false;
    for (const node of nodes) {
        const outgoingEdges = edges.filter(e => e.from === node.id);
        const symbolToTargets = new Map();

        outgoingEdges.forEach(edge => {
            const symbols = edge.label.split(',').map(s => s.trim()).filter(s => s.length > 0);
            symbols.forEach(symbol => {
                if (!symbolToTargets.has(symbol)) {
                    symbolToTargets.set(symbol, []);
                }
                symbolToTargets.get(symbol).push(edge.to);
            });
        });

        for (const [symbol, targets] of symbolToTargets.entries()) {
            if (targets.length > 1) {
                hasNondeterminism = true;
                issues.push(`Non-deterministic: state '${node.label}' has ${targets.length} transitions for symbol '${symbol}'`);
            }
        }
    }

    // Determine type
    const isDFA = startStates.length === 1 && !hasEpsilonTransitions && !hasNondeterminism;
    const isNFA = startStates.length > 0 && !isDFA;

    let type, message;
    if (startStates.length === 0) {
        type = 'INVALID';
        message = 'Invalid automaton: no start state';
    } else if (isDFA) {
        type = 'DFA';
        message = 'Deterministic Finite Automaton';
    } else {
        type = 'NFA';
        message = 'Non-deterministic Finite Automaton';
    }

    return {
        type,
        isDFA,
        isNFA,
        message,
        issues
    };
}

export function complementDFA(nodes) {
    // Simply invert all accepting states
    return nodes.map(node => ({
        ...node,
        isAccepting: !node.isAccepting
    }));
}
