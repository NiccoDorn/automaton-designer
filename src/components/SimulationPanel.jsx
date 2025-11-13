export function SimulationPanel({
    inputWord,
    setInputWord,
    onStart,
    onStop,
    isSimulating,
    processedChars,
    theme,
    }) {
    return (
        <div
            className="border-t flex items-center justify-between gap-4 px-6 py-3"
            style={{
                backgroundColor: '#eaf6ff',
                borderColor: theme.border,
            }}
        >

        <div className="flex items-center gap-3 flex-1">
            <label
                htmlFor="inputWord"
                className="text-base font-bold"
                style={{ color: theme.text }}
            >
                Input Word:
            </label>
            <input
                id="inputWord"
                type="text"
                value={inputWord}
                onChange={(e) => setInputWord(e.target.value)}
                disabled={isSimulating}
                placeholder="Enter word (e.g., abc)"
                className="input-blue flex-1 px-3 py-2 text-base font-medium"
                style={{
                    backgroundColor: isSimulating ? theme.border : theme.canvas,
                    color: theme.text,
                    opacity: isSimulating ? 0.6 : 1,
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !isSimulating) onStart();
                }}
            />
        </div>

        {processedChars > 0 && (
            <span
            className="text-base font-bold px-3 py-1 rounded-lg"
            style={{
                color: theme.nodeSelected,
                backgroundColor: theme.canvas,
                border: `2px solid ${theme.nodeSelected}`,
            }}
            >
            {processedChars}/{inputWord.length}
            </span>
        )}

        {!isSimulating ? (
            <button
                onClick={onStart}
                disabled={!inputWord.trim()}
                className={`button-laser px-4 py-2 rounded-lg font-bold text-lg shadow-lg transition flex items-center gap-3 ${
                    inputWord.trim()
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-400 text-white cursor-not-allowed opacity-50'
                }`}
                title="Simulate (Enter)"
            >
                Run
            </button>
        ) : (
            <button
                onClick={onStop}
                className="px-4 py-2 rounded-lg font-bold text-lg shadow-lg bg-red-500 hover:bg-red-600 text-white transition flex items-center gap-3"
                title="Stop (Escape)"
            >
                Stop
            </button>
        )}
        </div>
    );
}
