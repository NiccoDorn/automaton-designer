export function SimulationPanel({
    inputWord,
    setInputWord,
    onStart,
    onStop,
    isSimulating,
    processedChars,
    theme,
    isStepMode,
    onStartStep,
    onStep,
    simulationResult,
    }) {
    return (
        <div
            className="border-t flex items-center justify-between gap-4 px-6 py-3"
            style={{
                backgroundColor: theme.panel,
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

        {processedChars > 0 && !simulationResult && (
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

        {isStepMode && simulationResult && (
            <span
            className="text-base font-bold px-3 py-1 rounded-lg"
            style={{
                color: simulationResult.success ? '#10b981' : '#ef4444',
                backgroundColor: theme.canvas,
                border: `2px solid ${simulationResult.success ? '#10b981' : '#ef4444'}`,
            }}
            >
            {simulationResult.message}
            </span>
        )}

        {!isSimulating ? (
            <div className="flex gap-2" style={{ minWidth: '200px' }}>
                <button
                    onClick={onStart}
                    disabled={!inputWord.trim()}
                    className={`button-laser px-4 py-2 rounded-lg font-bold text-lg shadow-lg transition flex items-center gap-2 ${
                        inputWord.trim()
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-gray-400 text-white cursor-not-allowed opacity-50'
                    }`}
                    title="Auto Simulate (Enter)"
                >
                    Run
                </button>
                <button
                    onClick={onStartStep}
                    disabled={!inputWord.trim()}
                    className={`button-laser px-4 py-2 rounded-lg font-bold text-lg shadow-lg transition flex items-center gap-2 ${
                        inputWord.trim()
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-gray-400 text-white cursor-not-allowed opacity-50'
                    }`}
                    title="Step Through (S)"
                >
                    Step
                </button>
            </div>
        ) : (
            <div className="flex gap-2" style={{ minWidth: '200px', justifyContent: 'flex-end' }}>
                <button
                    onClick={onStep}
                    className="px-4 py-2 rounded-lg font-bold text-lg shadow-lg bg-blue-600 hover:bg-blue-700 text-white transition flex items-center gap-2"
                    title="Next Step (S)"
                    style={{
                        visibility: isStepMode ? 'visible' : 'hidden',
                        width: isStepMode ? 'auto' : '0',
                        padding: isStepMode ? '0.5rem 1rem' : '0',
                        margin: isStepMode ? '0' : '0',
                        overflow: 'hidden'
                    }}
                >
                    Step
                </button>
                <button
                    onClick={onStop}
                    className="px-4 py-2 rounded-lg font-bold text-lg shadow-lg bg-red-500 hover:bg-red-600 text-white transition flex items-center gap-2"
                    title={isStepMode ? "Reset (Escape)" : "Stop (Escape)"}
                >
                    {isStepMode ? "Reset" : "Stop"}
                </button>
            </div>
        )}
        </div>
    );
}