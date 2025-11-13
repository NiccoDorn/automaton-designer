export function SimulationResultOverlay({ result, isVisible, theme }) {
    if (!isVisible || !result) return null;

    const isSuccess = result.success;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{
                backgroundColor: theme.canvas + 'E6',
                animation: 'fadeIn 0.3s ease-in-out'
            }}
        >
            <div
                className="text-center p-8 rounded-2xl shadow-2xl max-w-2xl"
                style={{
                    backgroundColor: isSuccess ? '#10b981' : '#ef4444',
                    borderColor: theme.border,
                    border: '3px solid',
                    animation: 'scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
            >
                <div
                    className="text-6xl mb-4"
                    style={{
                        animation: 'bounce 0.6s ease-in-out'
                    }}
                >
                    {isSuccess ? 'Yay!' : 'Hell nah!'}
                </div>
                <h2
                    className="text-4xl font-extrabold mb-4"
                    style={{
                        color: '#ffffff',
                        textShadow: `2px 2px 8px ${theme.nodeStroke}`,
                        animation: 'slideUp 0.5s ease-out'
                    }}
                >
                    {result.message}
                </h2>
                {!isSuccess && (
                    <p
                        className="text-xl italic"
                        style={{
                            color: '#ffffff',
                            opacity: 0.9,
                            textShadow: `1px 1px 4px ${theme.nodeStroke}`,
                            animation: 'slideUp 0.7s ease-out'
                        }}
                    >
                        - Some guy, probably ...
                    </p>
                )}
            </div>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scaleIn {
                    from { transform: scale(0.3); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
}