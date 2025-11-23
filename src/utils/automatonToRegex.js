// Automaton to Regular Expression Conversion using State Elimination Method
// Converts a finite automaton to an equivalent regular expression

export function convertAutomatonToRegex(nodes, edges) {
    if (nodes.length === 0) {
        return { regex: '∅', steps: [] };
    }

    // Clone nodes and edges to avoid mutating original
    let states = nodes.map(n => ({ ...n }));
    const transitions = new Map(); // (from, to) -> regex

    // Build transition map
    edges.forEach(edge => {
        const key = `${edge.from},${edge.to}`;
        const symbols = edge.label.split(',').map(s => s.trim()).filter(s => s);

        // Convert symbols to regex format
        let regex;
        if (symbols.length === 1) {
            const symbol = symbols[0];
            regex = symbol === 'ε' || symbol === 'epsilon' ? 'ε' : symbol;
        } else {
            // Multiple symbols: use alternation
            regex = `(${symbols.map(s => s === 'ε' || s === 'epsilon' ? 'ε' : s).join('|')})`;
        }

        if (transitions.has(key)) {
            // Combine with existing transition using alternation
            const existing = transitions.get(key);
            regex = `(${existing}|${regex})`;
        }

        transitions.set(key, regex);
    });

    const steps = [];

    steps.push({
        description: 'Initial automaton',
        states: states.map(s => s.id),
        transitions: Array.from(transitions.entries()).map(([key, regex]) => {
            const [from, to] = key.split(',').map(Number);
            return { from, to, regex };
        })
    });

    // Find start and accepting states
    let startStates = states.filter(s => s.isStart);
    let acceptStates = states.filter(s => s.isAccepting);

    // Create new unique start state if needed
    if (startStates.length !== 1 || Array.from(transitions.keys()).some(key => key.endsWith(`,${startStates[0].id}`))) {
        const newStartId = Math.max(...states.map(s => s.id)) + 1;
        const newStart = {
            id: newStartId,
            isStart: true,
            isAccepting: false,
            label: 'qs'
        };

        // Add epsilon transitions to all old start states
        startStates.forEach(oldStart => {
            transitions.set(`${newStartId},${oldStart.id}`, 'ε');
            oldStart.isStart = false;
        });

        states.push(newStart);
        startStates = [newStart];

        steps.push({
            description: 'Added new unique start state with no incoming edges',
            states: states.map(s => s.id),
            newStartId: newStartId
        });
    }

    // Create new unique accepting state if needed
    if (acceptStates.length !== 1 || Array.from(transitions.keys()).some(key => key.startsWith(`${acceptStates[0].id},`))) {
        const newAcceptId = Math.max(...states.map(s => s.id)) + 1;
        const newAccept = {
            id: newAcceptId,
            isStart: false,
            isAccepting: true,
            label: 'qf'
        };

        // Add epsilon transitions from all old accepting states
        acceptStates.forEach(oldAccept => {
            transitions.set(`${oldAccept.id},${newAcceptId}`, 'ε');
            oldAccept.isAccepting = false;
        });

        states.push(newAccept);
        acceptStates = [newAccept];

        steps.push({
            description: 'Added new unique accepting state with no outgoing edges',
            states: states.map(s => s.id),
            newAcceptId: newAcceptId
        });
    }

    const startState = startStates[0];
    const acceptState = acceptStates[0];

    // Eliminate all states except start and accept
    const statesToEliminate = states.filter(s =>
        s.id !== startState.id && s.id !== acceptState.id
    );

    for (const stateToEliminate of statesToEliminate) {
        const qRip = stateToEliminate.id;

        // Find all states with edges to/from the state being eliminated
        const predecessors = [];
        const successors = [];

        for (const [key] of transitions) {
            const [from, to] = key.split(',').map(Number);
            if (to === qRip && from !== qRip) {
                if (!predecessors.includes(from)) predecessors.push(from);
            }
            if (from === qRip && to !== qRip) {
                if (!successors.includes(to)) successors.push(to);
            }
        }

        // Get self-loop on eliminated state (if any)
        const loopKey = `${qRip},${qRip}`;
        const loopRegex = transitions.get(loopKey);

        // For each predecessor and successor, update the transition
        for (const pred of predecessors) {
            for (const succ of successors) {
                const r1 = transitions.get(`${pred},${qRip}`) || '';
                const r2 = loopRegex || '';
                const r3 = transitions.get(`${qRip},${succ}`) || '';

                // Build new regex: r1 (r2)* r3
                let newRegex = r1;

                if (r2) {
                    newRegex += `(${r2})*`;
                }

                newRegex += r3;

                // Simplify if possible
                if (newRegex === 'εε') newRegex = 'ε';
                if (newRegex.startsWith('ε')) newRegex = newRegex.substring(1);
                if (newRegex.endsWith('ε')) newRegex = newRegex.substring(0, newRegex.length - 1);
                if (newRegex === '') newRegex = 'ε';

                // Add to existing edge or create new one
                const edgeKey = `${pred},${succ}`;
                if (transitions.has(edgeKey)) {
                    const existing = transitions.get(edgeKey);
                    newRegex = `(${existing}|${newRegex})`;
                }

                transitions.set(edgeKey, newRegex);
            }
        }

        // Remove all edges involving the eliminated state
        const keysToDelete = [];
        for (const [key] of transitions) {
            const [from, to] = key.split(',').map(Number);
            if (from === qRip || to === qRip) {
                keysToDelete.push(key);
            }
        }
        keysToDelete.forEach(key => transitions.delete(key));

        // Remove state from list
        states = states.filter(s => s.id !== qRip);

        steps.push({
            description: `Eliminated state ${stateToEliminate.label} (id: ${qRip})`,
            eliminatedStateId: qRip,
            states: states.map(s => s.id),
            transitions: Array.from(transitions.entries()).map(([key, regex]) => {
                const [from, to] = key.split(',').map(Number);
                return { from, to, regex };
            })
        });
    }

    // The final regex is the edge from start to accept
    const finalKey = `${startState.id},${acceptState.id}`;
    let finalRegex = transitions.get(finalKey) || '∅';

    // Simplify final regex
    finalRegex = simplifyRegex(finalRegex);

    steps.push({
        description: 'Final regular expression',
        regex: finalRegex
    });

    return {
        regex: finalRegex,
        steps
    };
}

function simplifyRegex(regex) {
    // Basic simplifications
    let result = regex;
    let iterations = 0;
    const maxIterations = 10;

    // Iteratively apply simplifications until no more changes occur
    while (iterations < maxIterations) {
        const old = result;
        iterations++;

        // Flatten nested alternations: (a|b)|c -> (a|b|c)
        result = flattenAlternations(result);

        // Remove redundant parentheses
        result = result.replace(/\(\(([^()]+)\)\)/g, '($1)');

        // Simplify ε patterns
        result = result.replace(/ε\*/g, 'ε');
        result = result.replace(/\(ε\)\*/g, 'ε');
        result = result.replace(/εε+/g, 'ε');

        // Remove empty alternations
        result = result.replace(/\|\)/g, ')');
        result = result.replace(/\(\|/g, '(');

        // Simplify single-element alternations
        result = result.replace(/\(([^|()]+)\)/g, '$1');

        // If no changes, we're done
        if (old === result) break;
    }

    return result;
}

// Flatten nested alternations: (a|b)|c -> (a|b|c), a|(b|c) -> (a|b|c)
function flattenAlternations(regex) {
    let result = regex;
    let changed = true;
    let iterations = 0;
    const maxIterations = 10;

    while (changed && iterations < maxIterations) {
        changed = false;
        iterations++;

        // Pattern: (expr1|expr2|...)|expr -> (expr1|expr2|...|expr)
        // This handles cases like ((a|b)|c) or (a|b)|c
        result = result.replace(/\(([^()]+)\)\|([^|()]+)/g, (match, group1, expr2) => {
            if (group1.includes('|')) {
                changed = true;
                return `(${group1}|${expr2})`;
            }
            return match;
        });

        // Pattern: expr|(expr1|expr2|...) -> (expr|expr1|expr2|...)
        // This handles cases like a|(b|c)
        result = result.replace(/([^|()]+)\|\(([^()]+)\)/g, (match, expr1, group2) => {
            if (group2.includes('|')) {
                changed = true;
                return `(${expr1}|${group2})`;
            }
            return match;
        });

        // Pattern: (expr1)|(expr2) where both are groups -> (expr1|expr2)
        result = result.replace(/\(([^()]+)\)\|\(([^()]+)\)/g, (match, expr1, expr2) => {
            changed = true;
            return `(${expr1}|${expr2})`;
        });
    }

    return result;
}
