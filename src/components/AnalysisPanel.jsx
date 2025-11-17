import { useState } from 'react';
import { ChevronDown, ChevronUp, AlertCircle, CheckCircle, Info } from 'lucide-react';
import {
    checkLanguageEmptiness,
    detectUnreachableAndDeadStates,
    checkDFACompleteness
} from '../utils/automatonAlgorithms';

export function AnalysisPanel({ nodes, edges, theme, isSimulating = false }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [analysisResults, setAnalysisResults] = useState(null);

    const runEmptinessCheck = () => {
        const result = checkLanguageEmptiness(nodes, edges);
        setAnalysisResults({
            type: 'emptiness',
            ...result
        });
    };

    const runUnreachableDeadCheck = () => {
        const result = detectUnreachableAndDeadStates(nodes, edges);
        setAnalysisResults({
            type: 'unreachable',
            ...result
        });
    };

    const runCompletenessCheck = () => {
        const result = checkDFACompleteness(nodes, edges);
        setAnalysisResults({
            type: 'completeness',
            ...result
        });
    };

    const clearResults = () => {
        setAnalysisResults(null);
    };

    const getResultIcon = () => {
        if (!analysisResults) return null;

        switch (analysisResults.type) {
            case 'emptiness':
                return analysisResults.isEmpty ? (
                    <AlertCircle size={20} color="#f59e0b" />
                ) : (
                    <CheckCircle size={20} color="#10b981" />
                );
            case 'unreachable':
                return analysisResults.unreachable.size === 0 && analysisResults.dead.size === 0 ? (
                    <CheckCircle size={20} color="#10b981" />
                ) : (
                    <AlertCircle size={20} color="#f59e0b" />
                );
            case 'completeness':
                return analysisResults.isComplete ? (
                    <CheckCircle size={20} color="#10b981" />
                ) : (
                    <AlertCircle size={20} color="#f59e0b" />
                );
            default:
                return <Info size={20} color="#3b82f6" />;
        }
    };

    const renderDetailedResults = () => {
        if (!analysisResults) return null;

        switch (analysisResults.type) {
            case 'unreachable':
                if (analysisResults.unreachable.size === 0 && analysisResults.dead.size === 0) {
                    return null;
                }
                return (
                    <div
                        className="mt-3 p-3 rounded text-sm space-y-2"
                        style={{
                            backgroundColor: theme.canvas,
                            border: `1px solid ${theme.border}`
                        }}
                    >
                        {analysisResults.unreachable.size > 0 && (
                            <div>
                                <p className="font-semibold" style={{ color: theme.text }}>
                                    Unreachable states:
                                </p>
                                <p className="text-xs mt-1" style={{ color: theme.nodeStroke }}>
                                    {Array.from(analysisResults.unreachable).map(id => {
                                        const node = nodes.find(n => n.id === id);
                                        return node?.label || id;
                                    }).join(', ')}
                                </p>
                            </div>
                        )}
                        {analysisResults.dead.size > 0 && (
                            <div>
                                <p className="font-semibold" style={{ color: theme.text }}>
                                    Dead states:
                                </p>
                                <p className="text-xs mt-1" style={{ color: theme.nodeStroke }}>
                                    {Array.from(analysisResults.dead).map(id => {
                                        const node = nodes.find(n => n.id === id);
                                        return node?.label || id;
                                    }).join(', ')}
                                </p>
                            </div>
                        )}
                    </div>
                );

            case 'completeness':
                if (analysisResults.isComplete) {
                    return null;
                }
                return (
                    <div
                        className="mt-3 p-3 rounded text-sm space-y-2"
                        style={{
                            backgroundColor: theme.canvas,
                            border: `1px solid ${theme.border}`
                        }}
                    >
                        {analysisResults.alphabet.size > 0 && (
                            <div>
                                <p className="font-semibold" style={{ color: theme.text }}>
                                    Alphabet: {Array.from(analysisResults.alphabet).join(', ')}
                                </p>
                            </div>
                        )}
                        {analysisResults.incompleteStates.length > 0 && (
                            <div>
                                <p className="font-semibold" style={{ color: theme.text }}>
                                    Issues found in {analysisResults.incompleteStates.length} state(s):
                                </p>
                                <ul className="text-xs mt-1 space-y-1" style={{ color: theme.nodeStroke }}>
                                    {analysisResults.incompleteStates.map((state) => (
                                        <li key={state.id}>
                                            <span className="font-medium">{state.label || state.id}</span>:
                                            {state.missingSymbols.length > 0 && (
                                                <> missing [{state.missingSymbols.join(', ')}]</>
                                            )}
                                            {state.hasNondeterminism && (
                                                <> non-deterministic</>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div
            className="mb-6 border rounded-lg"
            style={{ borderColor: theme.border }}
        >
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                disabled={isSimulating}
                className="w-full px-4 py-3 flex items-center justify-between"
                style={{ color: theme.text }}
            >
                <span className="font-semibold text-sm">Analysis Tools</span>
                {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {isExpanded && (
                <div
                    className="px-4 pb-3 border-t"
                    style={{ borderColor: theme.border }}
                >
                    <div className="space-y-2 mt-3">
                        <button
                            onClick={runEmptinessCheck}
                            disabled={isSimulating}
                            className="w-full px-3 py-2 rounded-lg text-sm font-medium transition"
                            style={{
                                backgroundColor: theme.canvas,
                                color: theme.text,
                                border: `1px solid ${theme.border}`
                            }}
                            title="Check if the language is empty"
                        >
                            Check Language Emptiness
                        </button>

                        <button
                            onClick={runUnreachableDeadCheck}
                            disabled={isSimulating}
                            className="w-full px-3 py-2 rounded-lg text-sm font-medium transition"
                            style={{
                                backgroundColor: theme.canvas,
                                color: theme.text,
                                border: `1px solid ${theme.border}`
                            }}
                            title="Detect unreachable and dead states"
                        >
                            Detect Unreachable/Dead States
                        </button>

                        <button
                            onClick={runCompletenessCheck}
                            disabled={isSimulating}
                            className="w-full px-3 py-2 rounded-lg text-sm font-medium transition"
                            style={{
                                backgroundColor: theme.canvas,
                                color: theme.text,
                                border: `1px solid ${theme.border}`
                            }}
                            title="Check if DFA is complete"
                        >
                            Check DFA Completeness
                        </button>
                    </div>

                    {analysisResults && (
                        <div className="mt-4">
                            <div className="flex items-center justify-between mb-2">
                                <h4
                                    className="font-semibold text-sm"
                                    style={{ color: theme.text }}
                                >
                                    Results:
                                </h4>
                                <button
                                    onClick={clearResults}
                                    className="text-xs px-2 py-1 rounded"
                                    style={{
                                        color: theme.nodeStroke,
                                        backgroundColor: theme.canvas
                                    }}
                                >
                                    Clear
                                </button>
                            </div>
                            <div
                                className="p-3 rounded-lg"
                                style={{
                                    backgroundColor: theme.node,
                                    border: `2px solid ${theme.border}`
                                }}
                            >
                                <div className="flex items-start gap-2">
                                    {getResultIcon()}
                                    <p
                                        className="text-sm flex-1"
                                        style={{ color: theme.text }}
                                    >
                                        {analysisResults.message}
                                    </p>
                                </div>
                                {renderDetailedResults()}
                            </div>
                        </div>
                    )}

                    <p
                        className="text-xs mt-3 italic"
                        style={{ color: theme.nodeStroke }}
                    >
                        Run analysis to check automaton properties
                    </p>
                </div>
            )}
        </div>
    );
}
