import { useState } from 'react';

export function GreekSymbolsSection({ theme, isSimulating }) {
    const [copiedSymbol, setCopiedSymbol] = useState(null);

    const greekChars = [
        { symbol: 'ε', name: 'epsilon' },
        { symbol: 'α', name: 'alpha' },
        { symbol: 'β', name: 'beta' },
        { symbol: 'γ', name: 'gamma' },
        { symbol: 'δ', name: 'delta' }
    ];

    const copyToClipboard = (char) => {
        navigator.clipboard.writeText(char);
        setCopiedSymbol(char);
        setTimeout(() => setCopiedSymbol(null), 800);
    };

    return (
        <div className="mt-3">
            <div className="grid grid-cols-5 gap-2">
                {greekChars.map(({ symbol, name }) => (
                    <button
                        key={symbol}
                        onClick={() => copyToClipboard(symbol)}
                        disabled={isSimulating}
                        className="p-2 rounded-lg text-center font-bold text-lg relative"
                        style={{
                            backgroundColor: theme.canvas,
                            color: theme.text,
                            border: `1px solid ${theme.border}`,
                            boxShadow: copiedSymbol === symbol
                                ? `0 0 12px ${theme.nodeSelected}`
                                : 'none',
                            transition: 'box-shadow 0.3s ease'
                        }}
                        title={`Copy ${name}`}
                    >
                        {symbol}
                    </button>
                ))}
            </div>
            <p
                className="text-xs mt-2 italic"
                style={{ color: theme.nodeStroke }}
            >
                Click to copy
            </p>
        </div>
    );
}
