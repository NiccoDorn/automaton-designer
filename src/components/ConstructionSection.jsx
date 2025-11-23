import { Shuffle, Minimize, GitMerge, FlipHorizontal } from 'lucide-react';

export function ConstructionSection({
    nodes: _nodes,
    edges: _edges,
    theme,
    isSimulating = false,
    onComplementDFA,
    onMinimizeDFA,
    onConvertNFAtoDFA,
    onRegexToAutomaton
}) {
    return (
        <div className="mt-3">
            <div className="space-y-2">
                <button
                    onClick={onComplementDFA}
                    disabled={isSimulating}
                    className="w-full px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2"
                    style={{
                        backgroundColor: theme.canvas,
                        color: theme.text,
                        border: `1px solid ${theme.border}`
                    }}
                    title="Invert accepting states (DFA only)"
                >
                    <FlipHorizontal size={18} />
                    Complement DFA
                </button>

                <button
                    onClick={onMinimizeDFA}
                    disabled={isSimulating}
                    className="w-full px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2"
                    style={{
                        backgroundColor: theme.canvas,
                        color: theme.text,
                        border: `1px solid ${theme.border}`
                    }}
                    title="Minimize DFA using Hopcroft's algorithm"
                >
                    <Minimize size={18} />
                    Minimize DFA
                </button>

                <button
                    onClick={onConvertNFAtoDFA}
                    disabled={isSimulating}
                    className="w-full px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2"
                    style={{
                        backgroundColor: theme.canvas,
                        color: theme.text,
                        border: `1px solid ${theme.border}`
                    }}
                    title="Convert NFA to DFA using subset construction"
                >
                    <GitMerge size={18} />
                    Convert NFA → DFA
                </button>

                <button
                    onClick={onRegexToAutomaton}
                    disabled={isSimulating}
                    className="w-full px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2"
                    style={{
                        backgroundColor: theme.canvas,
                        color: theme.text,
                        border: `1px solid ${theme.border}`
                    }}
                    title="Build automaton from regular expression"
                >
                    <Shuffle size={18} />
                    Regex → Automaton
                </button>
            </div>

            <p
                className="text-xs mt-3 italic"
                style={{ color: theme.nodeStroke }}
            >
                Transform and construct automata
            </p>
        </div>
    );
}
