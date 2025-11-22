// Thompson's Construction: Convert Regex to NFA
// Creates an ε-NFA from a regular expression

let stateCounter = 0;

export function regexToNFA(postfixTokens) {
    stateCounter = 0;
    const stack = [];

    for (const token of postfixTokens) {
        if (token.type === 'CHAR') {
            // Create basic NFA for single character
            stack.push(createBasicNFA(token.value));
        } else if (token.type === 'CONCAT') {
            const nfa2 = stack.pop();
            const nfa1 = stack.pop();
            stack.push(concatenate(nfa1, nfa2));
        } else if (token.type === 'OR') {
            const nfa2 = stack.pop();
            const nfa1 = stack.pop();
            stack.push(union(nfa1, nfa2));
        } else if (token.type === 'STAR') {
            const nfa = stack.pop();
            stack.push(kleeneStar(nfa));
        } else if (token.type === 'PLUS') {
            const nfa = stack.pop();
            stack.push(plus(nfa));
        } else if (token.type === 'QUESTION') {
            const nfa = stack.pop();
            stack.push(question(nfa));
        } else if (token.type === 'QUANT') {
            const nfa = stack.pop();
            stack.push(quantifier(nfa, token.value.min, token.value.max));
        }
    }

    return stack[0] || createBasicNFA('ε');
}

function createState() {
    return { id: stateCounter++, isAccepting: false, isStart: false };
}

function createBasicNFA(symbol) {
    const start = createState();
    const end = createState();
    start.isStart = true;
    end.isAccepting = true;

    return {
        start,
        end,
        states: [start, end],
        transitions: [{ from: start.id, to: end.id, symbol }]
    };
}

function concatenate(nfa1, nfa2) {
    // Connect nfa1's end to nfa2's start with ε
    nfa1.end.isAccepting = false;
    nfa2.start.isStart = false;

    const epsilonTransition = { from: nfa1.end.id, to: nfa2.start.id, symbol: 'ε' };

    return {
        start: nfa1.start,
        end: nfa2.end,
        states: [...nfa1.states, ...nfa2.states],
        transitions: [...nfa1.transitions, ...nfa2.transitions, epsilonTransition]
    };
}

function union(nfa1, nfa2) {
    const newStart = createState();
    const newEnd = createState();

    newStart.isStart = true;
    newEnd.isAccepting = true;

    nfa1.start.isStart = false;
    nfa2.start.isStart = false;
    nfa1.end.isAccepting = false;
    nfa2.end.isAccepting = false;

    const transitions = [
        ...nfa1.transitions,
        ...nfa2.transitions,
        { from: newStart.id, to: nfa1.start.id, symbol: 'ε' },
        { from: newStart.id, to: nfa2.start.id, symbol: 'ε' },
        { from: nfa1.end.id, to: newEnd.id, symbol: 'ε' },
        { from: nfa2.end.id, to: newEnd.id, symbol: 'ε' }
    ];

    return {
        start: newStart,
        end: newEnd,
        states: [newStart, ...nfa1.states, ...nfa2.states, newEnd],
        transitions
    };
}

function kleeneStar(nfa) {
    const newStart = createState();
    const newEnd = createState();

    newStart.isStart = true;
    newEnd.isAccepting = true;

    nfa.start.isStart = false;
    nfa.end.isAccepting = false;

    const transitions = [
        ...nfa.transitions,
        { from: newStart.id, to: nfa.start.id, symbol: 'ε' },
        { from: newStart.id, to: newEnd.id, symbol: 'ε' }, // Empty string path
        { from: nfa.end.id, to: nfa.start.id, symbol: 'ε' }, // Loop back
        { from: nfa.end.id, to: newEnd.id, symbol: 'ε' }
    ];

    return {
        start: newStart,
        end: newEnd,
        states: [newStart, ...nfa.states, newEnd],
        transitions
    };
}

function plus(nfa) {
    // a+ = aa*
    const newEnd = createState();
    newEnd.isAccepting = true;

    nfa.end.isAccepting = false;

    const transitions = [
        ...nfa.transitions,
        { from: nfa.end.id, to: nfa.start.id, symbol: 'ε' }, // Loop back
        { from: nfa.end.id, to: newEnd.id, symbol: 'ε' }
    ];

    return {
        start: nfa.start,
        end: newEnd,
        states: [...nfa.states, newEnd],
        transitions
    };
}

function question(nfa) {
    // a? = ε|a
    const newStart = createState();
    const newEnd = createState();

    newStart.isStart = true;
    newEnd.isAccepting = true;

    nfa.start.isStart = false;
    nfa.end.isAccepting = false;

    const transitions = [
        ...nfa.transitions,
        { from: newStart.id, to: nfa.start.id, symbol: 'ε' },
        { from: newStart.id, to: newEnd.id, symbol: 'ε' }, // Empty string path
        { from: nfa.end.id, to: newEnd.id, symbol: 'ε' }
    ];

    return {
        start: newStart,
        end: newEnd,
        states: [newStart, ...nfa.states, newEnd],
        transitions
    };
}

function quantifier(nfa, min, max) {
    // {n} or {n,m} - repeat n to m times
    if (max === Infinity) {
        // {n,} = a^n a*
        let result = nfa;
        for (let i = 1; i < min; i++) {
            result = concatenate(result, cloneNFA(nfa));
        }
        result = concatenate(result, kleeneStar(cloneNFA(nfa)));
        return result;
    } else if (min === max) {
        // {n} = a^n
        let result = nfa;
        for (let i = 1; i < min; i++) {
            result = concatenate(result, cloneNFA(nfa));
        }
        return result;
    } else {
        // {n,m} = a^n (a|ε)^(m-n)
        let result = nfa;
        for (let i = 1; i < min; i++) {
            result = concatenate(result, cloneNFA(nfa));
        }
        for (let i = min; i < max; i++) {
            result = concatenate(result, question(cloneNFA(nfa)));
        }
        return result;
    }
}

function cloneNFA(nfa) {
    const idMap = new Map();
    const newStates = nfa.states.map(state => {
        const newState = createState();
        newState.isAccepting = state.isAccepting;
        newState.isStart = state.isStart;
        idMap.set(state.id, newState.id);
        return newState;
    });

    const newTransitions = nfa.transitions.map(t => ({
        from: idMap.get(t.from),
        to: idMap.get(t.to),
        symbol: t.symbol
    }));

    return {
        start: newStates.find(s => s.isStart),
        end: newStates.find(s => s.isAccepting),
        states: newStates,
        transitions: newTransitions
    };
}

export function nfaToAutomatonFormat(nfa, offsetX = 100, offsetY = 100) {
    // Convert NFA to the format used by the automaton designer
    const nodes = nfa.states.map((state, index) => ({
        id: state.id,
        x: offsetX + (index % 5) * 120,
        y: offsetY + Math.floor(index / 5) * 120,
        label: `q${state.id}`,
        isAccepting: state.isAccepting,
        isStart: state.isStart
    }));

    // Combine transitions with the same from/to but different symbols
    const edgeMap = new Map();
    nfa.transitions.forEach(t => {
        const key = `${t.from}-${t.to}`;
        if (edgeMap.has(key)) {
            const existing = edgeMap.get(key);
            if (!existing.includes(t.symbol)) {
                edgeMap.set(key, existing + ', ' + t.symbol);
            }
        } else {
            edgeMap.set(key, t.symbol);
        }
    });

    const edges = Array.from(edgeMap.entries()).map(([key, label], index) => {
        const [from, to] = key.split('-').map(Number);
        return {
            id: index,
            from,
            to,
            label
        };
    });

    return { nodes, edges };
}
