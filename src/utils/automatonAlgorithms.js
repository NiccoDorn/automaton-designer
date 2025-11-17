/**
 * Automaton Algorithms
 *
 * This file contains various algorithms for analyzing and validating automata.
 */

/**
 * Checks if the language accepted by the automaton is empty.
 *
 * Algorithm:
 * 1. Find the start state
 * 2. Perform BFS/DFS to find all reachable states
 * 3. Check if any reachable state is an accepting state
 *
 * @param {Array} nodes - Array of node objects
 * @param {Array} edges - Array of edge objects
 * @returns {Object} { isEmpty: boolean, message: string }
 */
export function checkLanguageEmptiness(nodes, edges) {
    // Find start state
    const startNode = nodes.find(n => n.isStart);

    if (!startNode) {
        return {
            isEmpty: true,
            message: 'No start state defined. Language is empty.'
        };
    }

    // BFS to find all reachable states
    const reachable = new Set();
    const queue = [startNode.id];
    reachable.add(startNode.id);

    while (queue.length > 0) {
        const currentId = queue.shift();

        // Find all edges from current state
        const outgoingEdges = edges.filter(e => e.from === currentId);

        for (const edge of outgoingEdges) {
            if (!reachable.has(edge.to)) {
                reachable.add(edge.to);
                queue.push(edge.to);
            }
        }
    }

    // Check if any reachable state is accepting
    const hasAcceptingState = nodes.some(n => reachable.has(n.id) && n.isAccepting);

    if (hasAcceptingState) {
        return {
            isEmpty: false,
            message: `Language is non-empty. Found ${reachable.size} reachable state(s), including accepting state(s).`
        };
    } else {
        return {
            isEmpty: true,
            message: `Language is empty. No accepting states reachable from start state.`
        };
    }
}

/**
 * Detects unreachable and dead states in the automaton.
 *
 * Unreachable states: States that cannot be reached from the start state.
 * Dead states: States from which no accepting state can be reached.
 *
 * @param {Array} nodes - Array of node objects
 * @param {Array} edges - Array of edge objects
 * @returns {Object} { unreachable: Set, dead: Set, message: string }
 */
export function detectUnreachableAndDeadStates(nodes, edges) {
    const startNode = nodes.find(n => n.isStart);

    // Find unreachable states
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

    // Find dead states (states from which no accepting state can be reached)
    // Use reverse BFS from all accepting states
    const canReachAccepting = new Set();
    const acceptingNodes = nodes.filter(n => n.isAccepting);

    // Mark all accepting states
    acceptingNodes.forEach(n => canReachAccepting.add(n.id));

    // Reverse BFS: find all states that can reach accepting states
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

    const dead = new Set(
        nodes.filter(n => !canReachAccepting.has(n.id)).map(n => n.id)
    );

    // Build message
    const messages = [];
    if (unreachable.size > 0) {
        messages.push(`Found ${unreachable.size} unreachable state(s)`);
    }
    if (dead.size > 0) {
        messages.push(`Found ${dead.size} dead state(s)`);
    }
    if (unreachable.size === 0 && dead.size === 0) {
        messages.push('No unreachable or dead states found');
    }

    return {
        unreachable,
        dead,
        message: messages.join('. ') + '.'
    };
}

/**
 * Checks if the automaton is a complete DFA.
 *
 * A complete DFA has exactly one transition for each symbol in the alphabet
 * from every state.
 *
 * @param {Array} nodes - Array of node objects
 * @param {Array} edges - Array of edge objects
 * @returns {Object} { isComplete: boolean, message: string, incompleteStates: Array, alphabet: Set }
 */
export function checkDFACompleteness(nodes, edges) {
    if (nodes.length === 0) {
        return {
            isComplete: true,
            message: 'Empty automaton is trivially complete.',
            incompleteStates: [],
            alphabet: new Set()
        };
    }

    // Extract alphabet from all edge labels
    const alphabet = new Set();
    edges.forEach(edge => {
        // Handle comma-separated labels
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

    // Check each state for completeness
    const incompleteStates = [];

    for (const node of nodes) {
        const outgoingEdges = edges.filter(e => e.from === node.id);

        // Get all symbols that have transitions from this state
        const coveredSymbols = new Set();
        outgoingEdges.forEach(edge => {
            const symbols = edge.label.split(',').map(s => s.trim()).filter(s => s.length > 0);
            symbols.forEach(symbol => coveredSymbols.add(symbol));
        });

        // Check for determinism: each symbol should have exactly one transition
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

        // Check if any symbol has multiple targets (non-deterministic)
        let hasNondeterminism = false;
        for (const [_symbol, targets] of symbolToTargets.entries()) {
            if (targets.length > 1) {
                hasNondeterminism = true;
                break;
            }
        }

        // Check if all alphabet symbols are covered
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

        if (statesWithMissing.length > 0) {
            issues.push(`${statesWithMissing.length} state(s) missing transitions`);
        }
        if (statesWithNondeterminism.length > 0) {
            issues.push(`${statesWithNondeterminism.length} state(s) with non-deterministic transitions`);
        }

        message = `DFA is incomplete: ${issues.join(', ')}.`;
    }

    return {
        isComplete,
        message,
        incompleteStates,
        alphabet
    };
}
