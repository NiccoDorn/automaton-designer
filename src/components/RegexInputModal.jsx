import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

export function RegexInputModal({ isOpen, onClose, onSubmit, theme }) {
    const [regexInput, setRegexInput] = useState('');
    const [validation, setValidation] = useState(null);

    useEffect(() => {
        if (isOpen) {
            setRegexInput('');
            setValidation(null);
        }
    }, [isOpen]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setRegexInput(value);

        // Validate as user types
        if (value.trim().length > 0) {
            try {
                // Dynamic import to avoid circular dependencies
                import('../utils/regexParser.js').then(({ validateRegex }) => {
                    const result = validateRegex(value);
                    setValidation(result);
                });
            } catch (error) {
                setValidation({ isValid: false, errors: [error.message] });
            }
        } else {
            setValidation(null);
        }
    };

    const handleSubmit = () => {
        if (validation && validation.isValid) {
            onSubmit(regexInput);
            onClose();
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && validation && validation.isValid) {
            handleSubmit();
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            onClick={onClose}
        >
            <div
                className="rounded-lg shadow-2xl overflow-hidden"
                style={{
                    backgroundColor: theme.panel,
                    borderColor: theme.border,
                    border: '2px solid',
                    maxWidth: '600px',
                    width: '90%'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div
                    className="px-6 py-4 flex items-center justify-between border-b"
                    style={{ borderColor: theme.border }}
                >
                    <h2
                        className="text-xl font-bold"
                        style={{ color: theme.text }}
                    >
                        Convert Regex to Automaton
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded hover:opacity-70 transition-opacity"
                        style={{ color: theme.text }}
                        aria-label="Close"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: theme.text }}
                    >
                        Enter Regular Expression
                    </label>

                    <input
                        type="text"
                        value={regexInput}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder="e.g., (a|b)*abb"
                        autoFocus
                        className="w-full px-4 py-3 rounded-lg font-mono text-lg"
                        style={{
                            backgroundColor: theme.canvas,
                            color: theme.text,
                            border: `2px solid ${validation === null ? theme.border : validation.isValid ? '#10b981' : '#ef4444'}`,
                            outline: 'none'
                        }}
                    />

                    {/* Validation Feedback */}
                    {validation && (
                        <div
                            className="mt-3 p-3 rounded-lg flex items-start gap-2 text-sm"
                            style={{
                                backgroundColor: validation.isValid ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                border: `1px solid ${validation.isValid ? '#10b981' : '#ef4444'}`,
                                color: validation.isValid ? '#10b981' : '#ef4444'
                            }}
                        >
                            {validation.isValid ? (
                                <>
                                    <CheckCircle size={18} className="flex-shrink-0 mt-0.5" />
                                    <span>Valid regular expression</span>
                                </>
                            ) : (
                                <>
                                    <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                                    <div>
                                        <div className="font-medium mb-1">Invalid regular expression:</div>
                                        <ul className="list-disc list-inside space-y-1">
                                            {validation.errors.map((error, idx) => (
                                                <li key={idx}>{error}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* Syntax Help */}
                    <div
                        className="mt-4 p-3 rounded-lg text-xs"
                        style={{
                            backgroundColor: theme.canvas,
                            border: `1px solid ${theme.border}`,
                            color: theme.nodeStroke
                        }}
                    >
                        <strong>Supported operators:</strong>
                        <ul className="mt-2 space-y-1 ml-4">
                            <li><code>|</code> - Alternation (OR)</li>
                            <li><code>*</code> - Kleene star (0 or more)</li>
                            <li><code>+</code> - Plus (1 or more)</li>
                            <li><code>?</code> - Optional (0 or 1)</li>
                            <li><code>()</code> - Grouping</li>
                            <li><code>{'{'}{'{'}n{'}'}</code> - Exactly n times</li>
                            <li><code>{'{'}{'{'}n,m{'}'}</code> - Between n and m times</li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 flex gap-3 justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg font-medium transition"
                            style={{
                                backgroundColor: theme.canvas,
                                color: theme.text,
                                border: `1px solid ${theme.border}`
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!validation || !validation.isValid}
                            className="px-4 py-2 rounded-lg font-medium transition"
                            style={{
                                backgroundColor: validation && validation.isValid ? theme.nodeSelected : theme.border,
                                color: '#ffffff',
                                opacity: validation && validation.isValid ? 1 : 0.5,
                                cursor: validation && validation.isValid ? 'pointer' : 'not-allowed'
                            }}
                        >
                            Generate Automaton
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
