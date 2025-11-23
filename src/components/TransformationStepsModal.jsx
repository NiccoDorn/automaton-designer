import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Play, Check } from 'lucide-react';

export function TransformationStepsModal({
    isOpen,
    onClose,
    onApply,
    transformationResult,
    transformationType,
    theme
}) {
    const [currentStep, setCurrentStep] = useState(0);

    if (!isOpen || !transformationResult) return null;

    const steps = transformationResult.steps || [];
    const totalSteps = steps.length;

    const handlePrevious = () => {
        setCurrentStep(prev => Math.max(0, prev - 1));
    };

    const handleNext = () => {
        setCurrentStep(prev => Math.min(totalSteps - 1, prev + 1));
    };

    const handleApply = () => {
        onApply(transformationResult);
        onClose();
        setCurrentStep(0);
    };

    const handleClose = () => {
        onClose();
        setCurrentStep(0);
    };

    const renderStepContent = () => {
        if (steps.length === 0) {
            return (
                <div className="text-center py-8" style={{ color: theme.nodeStroke }}>
                    No steps available
                </div>
            );
        }

        const step = steps[currentStep];

        return (
            <div className="space-y-4">
                {/* Step Description */}
                <div
                    className="p-4 rounded-lg"
                    style={{
                        backgroundColor: theme.canvas,
                        border: `2px solid ${theme.border}`
                    }}
                >
                    <p
                        className="text-sm font-medium"
                        style={{ color: theme.text }}
                    >
                        {step.description}
                    </p>
                </div>

                {/* Step Details */}
                {renderStepDetails(step)}
            </div>
        );
    };

    const renderStepDetails = (step) => {
        // For DFA Minimization
        if (step.partitions) {
            return (
                <div
                    className="p-4 rounded-lg space-y-3"
                    style={{
                        backgroundColor: theme.node,
                        border: `1px solid ${theme.border}`
                    }}
                >
                    <h4
                        className="font-semibold text-sm"
                        style={{ color: theme.text }}
                    >
                        Partitions:
                    </h4>
                    <div className="space-y-2">
                        {step.partitions.map((partition, idx) => (
                            <div
                                key={`partition-${partition.join('-')}`}
                                className="px-3 py-2 rounded font-mono text-sm"
                                style={{
                                    backgroundColor: theme.canvas,
                                    border: `1px solid ${theme.border}`,
                                    color: theme.text
                                }}
                            >
                                P{idx}: {'{'}
                                {partition.join(', ')}
                                {'}'}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        // For NFA → DFA
        if (step.newDfaState || step.dfaState) {
            return (
                <div
                    className="p-4 rounded-lg space-y-3"
                    style={{
                        backgroundColor: theme.node,
                        border: `1px solid ${theme.border}`
                    }}
                >
                    {step.dfaState && (
                        <div>
                            <h4
                                className="font-semibold text-sm mb-2"
                                style={{ color: theme.text }}
                            >
                                DFA State:
                            </h4>
                            <div
                                className="px-3 py-2 rounded font-mono text-sm"
                                style={{
                                    backgroundColor: theme.canvas,
                                    border: `1px solid ${theme.border}`,
                                    color: theme.text
                                }}
                            >
                                {'{'}
                                {step.dfaState.join(', ')}
                                {'}'}
                            </div>
                        </div>
                    )}

                    {step.symbol && (
                        <div>
                            <h4
                                className="font-semibold text-sm mb-2"
                                style={{ color: theme.text }}
                            >
                                Input Symbol:
                            </h4>
                            <div
                                className="px-3 py-2 rounded font-mono text-sm text-center"
                                style={{
                                    backgroundColor: theme.canvas,
                                    border: `1px solid ${theme.border}`,
                                    color: theme.nodeSelected
                                }}
                            >
                                {step.symbol}
                            </div>
                        </div>
                    )}

                    {step.newDfaState && (
                        <div>
                            <h4
                                className="font-semibold text-sm mb-2"
                                style={{ color: theme.text }}
                            >
                                Resulting DFA State:
                            </h4>
                            <div
                                className="px-3 py-2 rounded font-mono text-sm"
                                style={{
                                    backgroundColor: theme.canvas,
                                    border: `1px solid ${theme.border}`,
                                    color: theme.text
                                }}
                            >
                                {'{'}
                                {step.newDfaState.join(', ')}
                                {'}'}
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        // For Automaton → Regex
        if (step.regex) {
            return (
                <div
                    className="p-4 rounded-lg"
                    style={{
                        backgroundColor: theme.node,
                        border: `1px solid ${theme.border}`
                    }}
                >
                    <h4
                        className="font-semibold text-sm mb-3"
                        style={{ color: theme.text }}
                    >
                        Regular Expression:
                    </h4>
                    <div
                        className="px-4 py-3 rounded font-mono text-lg break-all text-center"
                        style={{
                            backgroundColor: theme.canvas,
                            border: `2px solid ${theme.nodeSelected}`,
                            color: theme.text
                        }}
                    >
                        {step.regex}
                    </div>
                </div>
            );
        }

        // For eliminated state info
        if (step.eliminatedStateId !== undefined) {
            return (
                <div
                    className="p-4 rounded-lg space-y-3"
                    style={{
                        backgroundColor: theme.node,
                        border: `1px solid ${theme.border}`
                    }}
                >
                    <div>
                        <h4
                            className="font-semibold text-sm mb-2"
                            style={{ color: theme.text }}
                        >
                            Eliminated State ID:
                        </h4>
                        <div
                            className="px-3 py-2 rounded font-mono text-center"
                            style={{
                                backgroundColor: theme.canvas,
                                border: `1px solid ${theme.border}`,
                                color: '#ef4444'
                            }}
                        >
                            {step.eliminatedStateId}
                        </div>
                    </div>

                    {step.states && (
                        <div>
                            <h4
                                className="font-semibold text-sm mb-2"
                                style={{ color: theme.text }}
                            >
                                Remaining States:
                            </h4>
                            <div
                                className="px-3 py-2 rounded font-mono text-sm"
                                style={{
                                    backgroundColor: theme.canvas,
                                    border: `1px solid ${theme.border}`,
                                    color: theme.text
                                }}
                            >
                                {step.states.join(', ')}
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        // For new start/accept state additions
        if (step.newStartId !== undefined || step.newAcceptId !== undefined) {
            return (
                <div
                    className="p-4 rounded-lg"
                    style={{
                        backgroundColor: theme.node,
                        border: `1px solid ${theme.border}`
                    }}
                >
                    <div
                        className="px-3 py-2 rounded font-mono text-center"
                        style={{
                            backgroundColor: theme.canvas,
                            border: `1px solid ${theme.border}`,
                            color: '#10b981'
                        }}
                    >
                        New State ID: {step.newStartId || step.newAcceptId}
                    </div>
                </div>
            );
        }

        // For transitions display
        if (step.transitions && step.transitions.length > 0) {
            return (
                <div
                    className="p-4 rounded-lg space-y-2"
                    style={{
                        backgroundColor: theme.node,
                        border: `1px solid ${theme.border}`
                    }}
                >
                    <h4
                        className="font-semibold text-sm mb-2"
                        style={{ color: theme.text }}
                    >
                        Transitions:
                    </h4>
                    <div className="space-y-1 max-h-48 overflow-y-auto">
                        {step.transitions.map((trans) => (
                            <div
                                key={`trans-${trans.from}-${trans.to}-${trans.regex || trans.symbol}`}
                                className="px-3 py-1 rounded font-mono text-xs"
                                style={{
                                    backgroundColor: theme.canvas,
                                    border: `1px solid ${theme.border}`,
                                    color: theme.text
                                }}
                            >
                                {trans.from} --[ {trans.regex || trans.symbol} ]-&gt; {trans.to}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        // Default: show states if available
        if (step.states) {
            return (
                <div
                    className="p-4 rounded-lg"
                    style={{
                        backgroundColor: theme.node,
                        border: `1px solid ${theme.border}`
                    }}
                >
                    <h4
                        className="font-semibold text-sm mb-2"
                        style={{ color: theme.text }}
                    >
                        States:
                    </h4>
                    <div
                        className="px-3 py-2 rounded font-mono text-sm"
                        style={{
                            backgroundColor: theme.canvas,
                            border: `1px solid ${theme.border}`,
                            color: theme.text
                        }}
                    >
                        {step.states.join(', ')}
                    </div>
                </div>
            );
        }

        return null;
    };

    const getTransformationTitle = () => {
        switch (transformationType) {
            case 'minimize':
                return 'DFA Minimization (Hopcroft\'s Algorithm)';
            case 'nfaToDfa':
                return 'NFA → DFA Conversion (Subset Construction)';
            case 'automatonToRegex':
                return 'Automaton → Regular Expression (State Elimination)';
            default:
                return 'Transformation Steps';
        }
    };

    const getSummary = () => {
        if (!transformationResult) return null;

        switch (transformationType) {
            case 'minimize':
                return `${transformationResult.originalStateCount} states → ${transformationResult.minimizedStateCount} states`;
            case 'nfaToDfa':
                return `${transformationResult.nfaStateCount} NFA states → ${transformationResult.dfaStateCount} DFA states`;
            case 'automatonToRegex':
                return `Regex: ${transformationResult.regex}`;
            default:
                return '';
        }
    };

    const isLastStep = currentStep === totalSteps - 1;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            onClick={handleClose}
        >
            <div
                className="rounded-lg shadow-2xl overflow-hidden"
                style={{
                    backgroundColor: theme.panel,
                    borderColor: theme.border,
                    border: '2px solid',
                    maxWidth: '700px',
                    width: '90%',
                    maxHeight: '85vh',
                    display: 'flex',
                    flexDirection: 'column'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div
                    className="px-6 py-4 border-b"
                    style={{ borderColor: theme.border }}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h2
                                className="text-xl font-bold"
                                style={{ color: theme.text }}
                            >
                                {getTransformationTitle()}
                            </h2>
                            <p
                                className="text-sm mt-1"
                                style={{ color: theme.nodeStroke }}
                            >
                                {getSummary()}
                            </p>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-1 rounded hover:opacity-70 transition-opacity"
                            style={{ color: theme.text }}
                            aria-label="Close"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Step Counter */}
                <div
                    className="px-6 py-3 border-b"
                    style={{
                        borderColor: theme.border,
                        backgroundColor: theme.canvas
                    }}
                >
                    <div className="flex items-center justify-between">
                        <span
                            className="text-sm font-medium"
                            style={{ color: theme.text }}
                        >
                            Step {currentStep + 1} of {totalSteps}
                        </span>

                        {/* Progress Bar */}
                        <div
                            className="flex-1 mx-4 h-2 rounded-full overflow-hidden"
                            style={{ backgroundColor: theme.border }}
                        >
                            <div
                                className="h-full rounded-full transition-all duration-300"
                                style={{
                                    width: `${((currentStep + 1) / totalSteps) * 100}%`,
                                    backgroundColor: theme.nodeSelected
                                }}
                            />
                        </div>

                        <span
                            className="text-xs"
                            style={{ color: theme.nodeStroke }}
                        >
                            {Math.round(((currentStep + 1) / totalSteps) * 100)}%
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div
                    className="flex-1 overflow-y-auto px-6 py-6"
                >
                    {renderStepContent()}
                </div>

                {/* Footer - Navigation */}
                <div
                    className="px-6 py-4 border-t flex items-center justify-between"
                    style={{ borderColor: theme.border }}
                >
                    <button
                        onClick={handlePrevious}
                        disabled={currentStep === 0}
                        className="px-4 py-2 rounded-lg font-medium transition flex items-center gap-2"
                        style={{
                            backgroundColor: currentStep === 0 ? theme.border : theme.canvas,
                            color: currentStep === 0 ? theme.nodeStroke : theme.text,
                            border: `1px solid ${theme.border}`,
                            cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
                            opacity: currentStep === 0 ? 0.5 : 1
                        }}
                    >
                        <ChevronLeft size={18} />
                        Previous
                    </button>

                    {isLastStep ? (
                        <button
                            onClick={handleApply}
                            className="px-6 py-2 rounded-lg font-medium transition flex items-center gap-2"
                            style={{
                                backgroundColor: theme.nodeSelected,
                                color: '#ffffff'
                            }}
                        >
                            <Check size={18} />
                            Apply Result
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            className="px-4 py-2 rounded-lg font-medium transition flex items-center gap-2"
                            style={{
                                backgroundColor: theme.nodeSelected,
                                color: '#ffffff'
                            }}
                        >
                            Next
                            <ChevronRight size={18} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
