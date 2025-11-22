import { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';

export function LaTeXExportModal({ isOpen, onClose, latexCode, theme }) {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(latexCode).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

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
                    maxWidth: '800px',
                    maxHeight: '80vh',
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
                        Export as LaTeX (TikZ)
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
                    <p
                        className="text-sm mb-4"
                        style={{ color: theme.text }}
                    >
                        Copy this LaTeX code and paste it into your document. Make sure to include the required packages in your preamble.
                    </p>

                    <div className="relative">
                        <pre
                            className="p-4 rounded-lg overflow-auto text-sm font-mono"
                            style={{
                                backgroundColor: theme.canvas,
                                color: theme.text,
                                border: `1px solid ${theme.border}`,
                                maxHeight: '400px'
                            }}
                        >
                            <code>{latexCode}</code>
                        </pre>

                        <button
                            onClick={handleCopy}
                            className="absolute top-2 right-2 px-3 py-2 rounded-lg font-medium shadow-md transition flex items-center gap-2"
                            style={{
                                backgroundColor: copied ? '#10b981' : theme.nodeSelected,
                                color: '#ffffff'
                            }}
                        >
                            {copied ? (
                                <>
                                    <Check size={18} />
                                    Copied!
                                </>
                            ) : (
                                <>
                                    <Copy size={18} />
                                    Copy to Clipboard
                                </>
                            )}
                        </button>
                    </div>

                    <div
                        className="mt-4 p-3 rounded-lg text-xs"
                        style={{
                            backgroundColor: theme.canvas,
                            border: `1px solid ${theme.border}`,
                            color: theme.text
                        }}
                    >
                        <strong>Required packages:</strong>
                        <br />
                        <code>{'\\usepackage{tikz}'}</code>
                        <br />
                        <code>{'\\usetikzlibrary{automata,positioning,arrows.meta}'}</code>
                    </div>
                </div>
            </div>
        </div>
    );
}
