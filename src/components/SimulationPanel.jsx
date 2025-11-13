import { Play, Square } from 'lucide-react';

export function SimulationPanel({
    inputWord,
    setInputWord,
    onStart,
    onStop,
    isSimulating,
    processedChars,
    theme
}) {
    return (
        <div
            className="border-t p-6 flex items-center gap-6 shadow-lg"
            style={{
                backgroundColor: theme.toolbar,
                borderColor: theme.border,
                borderTopWidth: '2px'
            }}
        >
            <label
                className="font-bold text-base whitespace-nowrap"
                style={{ color: theme.text }}
            >
                Input Word:
            </label>
            <input
                type="text"
                value={inputWord}
                onChange={(e) => setInputWord(e.target.value)}
                disabled={isSimulating}
                placeholder="Enter word (e.g., abc)"
                className="flex-1 px-4 py-3 border-2 rounded-lg text-base font-medium"
                style={{
                    backgroundColor: isSimulating ? theme.border : theme.canvas,
                    borderColor: theme.nodeSelected,
                    color: theme.text,
                    opacity: isSimulating ? 0.6 : 1,
                    minHeight: '48px'
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !isSimulating) {
                        onStart();
                    }
                }}
            />
            {processedChars > 0 && (
                <span
                    className="text-lg font-bold px-3 py-2 rounded-lg"
                    style={{
                        color: theme.nodeSelected,
                        backgroundColor: theme.canvas,
                        border: `2px solid ${theme.nodeSelected}`
                    }}
                >
                    {processedChars}/{inputWord.length}
                </span>
            )}
            {!isSimulating ? (
                <button
                    onClick={onStart}
                    disabled={!inputWord.trim()}
                    className="px-6 py-3 rounded-lg font-bold text-lg shadow-lg transition duration-150 ease-in-out flex items-center gap-3"
                    style={{
                        backgroundColor: inputWord.trim() ? '#10b981' : theme.border,
                        color: '#ffffff',
                        opacity: inputWord.trim() ? 1 : 0.5,
                        cursor: inputWord.trim() ? 'pointer' : 'not-allowed',
                        minHeight: '48px',
                        minWidth: '120px'
                    }}
                    title="Simulate (Enter)"
                >
                    <Play size={24} /> Run
                </button>
            ) : (
                <button
                    onClick={onStop}
                    className="px-6 py-3 rounded-lg font-bold text-lg shadow-lg transition duration-150 ease-in-out flex items-center gap-3"
                    style={{
                        backgroundColor: '#ef4444',
                        color: '#ffffff',
                        minHeight: '48px',
                        minWidth: '120px'
                    }}
                    title="Stop (Escape)"
                >
                    <Square size={24} /> Stop
                </button>
            )}
        </div>
    );
}