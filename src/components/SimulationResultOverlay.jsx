
import { useState, useEffect } from 'react';

export function SimulationResultOverlay({ result, isVisible, theme }) {
    const [gifPath, setGifPath] = useState(null);
    const [isGifLoading, setIsGifLoading] = useState(true);

    useEffect(() => {
        if (isVisible && result) {
            setIsGifLoading(true);
            const randomNum = Math.floor(Math.random() * 4) + 1;
            const gifType = result.success ? 'yes' : 'not';
            setGifPath(`/automaton-designer/${gifType}${randomNum}.gif`);
        }
    }, [isVisible, result]);

    if (!isVisible || !result || !gifPath) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{
                backgroundColor: theme.canvas + '99',
                backdropFilter: 'blur(8px)',
                animation: 'fadeIn 0.4s ease-in-out'
            }}
        >
            <div
                className="text-center p-6 rounded-3xl shadow-2xl max-w-3xl"
                style={{
                    backgroundColor: theme.panel + 'F0',
                    borderColor: theme.border,
                    border: `2px solid`,
                    animation: 'slideUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
            >
                {isGifLoading && (
                    <div
                        className="flex flex-col items-center justify-center p-12 text-center"
                        style={{ color: theme.text, minWidth: '300px', minHeight: '300px' }}
                    >
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-4 border-t-blue-500" style={{ borderColor: theme.border, borderTopColor: theme.nodeSelected }}></div>
                        <p className="mt-4 text-xl font-semibold">Checking...</p>
                    </div>
                )}
                <img
                    key={gifPath}
                    src={gifPath}
                    alt={result.success ? "Success" : "Failure"}
                    loading="eager"
                    onLoad={() => setIsGifLoading(false)}
                    style={{
                        maxWidth: '100%',
                        maxHeight: '60vh',
                        borderRadius: '16px',
                        boxShadow: `0 8px 32px ${theme.nodeStroke}40`,
                        display: isGifLoading ? 'none' : 'block'
                    }}
                    onError={(e) => {
                        setIsGifLoading(false);
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = `<div style="color: ${theme.text}; font-size: 2rem; padding: 2rem;">${result.message}</div>`;
                    }}
                />
            </div>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { transform: translateY(40px) scale(0.9); opacity: 0; }
                    to { transform: translateY(0) scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
}