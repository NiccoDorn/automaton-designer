import { useState } from 'react';
import { AlertCircle, CheckCircle, Info, Copy } from 'lucide-react';
import {
    checkLanguageEmptiness,
    detectUnreachableStates,
    detectDeadStates,
    checkDFACompleteness,
    checkAutomatonType
} from '../utils/automatonAlgorithms';
import { convertAutomatonToRegex } from '../utils/automatonToRegex';

export function AnalysisSection({ nodes, edges, theme, isSimulating = false, onDeadStatesDetected }) {
    const [analysisResults, setAnalysisResults] = useState(null);
    const [regexResult, setRegexResult] = useState(null);
    const [regexCopied, setRegexCopied] = useState(false);

    const runEmptinessCheck = () => {
        const result = checkLanguageEmptiness(nodes, edges);
        setAnalysisResults({
            type: 'emptiness',
            ...result
        });
    };

    const runUnreachableCheck = () => {
        const result = detectUnreachableStates(nodes, edges);
        setAnalysisResults({
            type: 'unreachable',
            ...result
        });
    };

    const runDeadStatesCheck = () => {
        const result = detectDeadStates(nodes, edges);
        setAnalysisResults({
            type: 'dead',
            ...result
        });
        if (onDeadStatesDetected) {
            onDeadStatesDetected(result.dead);
        }
    };

    const runCompletenessCheck = () => {
        const result = checkDFACompleteness(nodes, edges);
        setAnalysisResults({
            type: 'completeness',
            ...result
        });
    };

    const runTypeCheck = () => {
        const result = checkAutomatonType(nodes, edges);
        setAnalysisResults({
            type: 'automatonType',
            ...result
        });
    };

    const runRegexConversion = () => {
        try {
            const result = convertAutomatonToRegex(nodes, edges);
            setRegexResult(result.regex);
        } catch (error) {
            setRegexResult(`Error: ${error.message}`);
        }
    };

    const copyRegexToClipboard = () => {
        if (regexResult) {
            navigator.clipboard.writeText(regexResult).then(() => {
                setRegexCopied(true);
                setTimeout(() => setRegexCopied(false), 2000);
            });
        }
    };

    // Get current automaton type for display
    const automatonType = checkAutomatonType(nodes, edges);

    const clearResults = () => {
        setAnalysisResults(null);
        if (onDeadStatesDetected) {
            onDeadStatesDetected(new Set());
        }
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
                return analysisResults.unreachable.size === 0 ? (
                    <CheckCircle size={20} color="#10b981" />
                ) : (
                    <AlertCircle size={20} color="#f59e0b" />
                );
            case 'dead':
                return analysisResults.dead.size === 0 ? (
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
            case 'automatonType':
                if (analysisResults.type === 'DFA') {
                    return <CheckCircle size={20} color="#10b981" />;
                } else if (analysisResults.type === 'NFA') {
                    return <Info size={20} color="#3b82f6" />;
                } else {
                    return <AlertCircle size={20} color="#f59e0b" />;
                }
            default:
                return <Info size={20} color="#3b82f6" />;
        }
    };

    const renderDetailedResults = () => {
        if (!analysisResults) return null;

        switch (analysisResults.type) {
            case 'unreachable':
                if (analysisResults.unreachable.size === 0) return null;
                return (
                    <div
                        className="mt-3 p-3 rounded text-sm"
                        style={{
                            backgroundColor: theme.canvas,
                            border: `1px solid ${theme.border}`
                        }}
                    >
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
                );

            case 'dead':
                if (analysisResults.dead.size === 0) return null;
                return (
                    <div
                        className="mt-3 p-3 rounded text-sm"
                        style={{
                            backgroundColor: theme.canvas,
                            border: `1px solid ${theme.border}`
                        }}
                    >
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
                );

            case 'completeness':
                if (analysisResults.isComplete) return null;
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

            case 'automatonType':
                if (analysisResults.issues.length === 0 && analysisResults.isDFA) return null;
                return (
                    <div
                        className="mt-3 p-3 rounded text-sm space-y-2"
                        style={{
                            backgroundColor: theme.canvas,
                            border: `1px solid ${theme.border}`
                        }}
                    >
                        {analysisResults.issues.length > 0 && (
                            <div>
                                <p className="font-semibold" style={{ color: theme.text }}>
                                    {analysisResults.isNFA ? 'NFA Properties:' : 'Issues:'}
                                </p>
                                <ul className="text-xs mt-1 space-y-1" style={{ color: theme.nodeStroke }}>
                                    {analysisResults.issues.map((issue) => (
                                        <li key={issue}>• {issue}</li>
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
        <div className="mt-3">
            {/* Automaton Type Badge */}
            <div
                className="mb-3 px-3 py-2 rounded-lg text-sm font-semibold text-center"
                style={{
                    backgroundColor: automatonType.isDFA ? '#10b981' : automatonType.isNFA ? '#3b82f6' : '#f59e0b',
                    color: '#ffffff'
                }}
            >
                {automatonType.type === 'DFA' && 'DFA - Deterministic Finite Automaton'}
                {automatonType.type === 'NFA' && 'NFA - Non-deterministic Finite Automaton'}
                {automatonType.type === 'INVALID' && 'Invalid Automaton'}
            </div>

            <div className="space-y-2">
                <button
                    onClick={runTypeCheck}
                    disabled={isSimulating}
                    className="w-full px-3 py-2 rounded-lg text-sm font-medium transition"
                    style={{
                        backgroundColor: theme.canvas,
                        color: theme.text,
                        border: `1px solid ${theme.border}`
                    }}
                    title="Show detailed automaton type information"
                >
                    Check Automaton Type
                </button>

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
                    onClick={runUnreachableCheck}
                    disabled={isSimulating}
                    className="w-full px-3 py-2 rounded-lg text-sm font-medium transition"
                    style={{
                        backgroundColor: theme.canvas,
                        color: theme.text,
                        border: `1px solid ${theme.border}`
                    }}
                    title="Detect unreachable states"
                >
                    Detect Unreachable States
                </button>

                <button
                    onClick={runDeadStatesCheck}
                    disabled={isSimulating}
                    className="w-full px-3 py-2 rounded-lg text-sm font-medium transition"
                    style={{
                        backgroundColor: theme.canvas,
                        color: theme.text,
                        border: `1px solid ${theme.border}`
                    }}
                    title="Detect dead states"
                >
                    Detect Dead States
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

                <button
                    onClick={runRegexConversion}
                    disabled={isSimulating}
                    className="w-full px-3 py-2 rounded-lg text-sm font-medium transition"
                    style={{
                        backgroundColor: theme.canvas,
                        color: theme.text,
                        border: `1px solid ${theme.border}`
                    }}
                    title="Convert automaton to regular expression"
                >
                    Compute Regex
                </button>
            </div>

            {/* Regex Display */}
            {regexResult && (
                <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                        <h4
                            className="font-semibold text-sm"
                            style={{ color: theme.text }}
                        >
                            Regular Expression:
                        </h4>
                        <button
                            onClick={copyRegexToClipboard}
                            className="text-xs px-2 py-1 rounded flex items-center gap-1"
                            style={{
                                color: regexCopied ? '#10b981' : theme.nodeStroke,
                                backgroundColor: theme.canvas
                            }}
                        >
                            <Copy size={14} />
                            {regexCopied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                    <div
                        className="p-3 rounded-lg font-mono text-lg break-all"
                        style={{
                            backgroundColor: theme.node,
                            border: `2px solid ${theme.border}`,
                            color: theme.text
                        }}
                    >
                        {regexResult}
                    </div>
                </div>
            )}

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
    );
}
