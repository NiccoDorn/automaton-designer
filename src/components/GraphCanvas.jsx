export function GraphCanvas({
    canvasRef,
    containerRef,
    mode,
    edgeStart,
    nodes,
    onCanvasClick,
    onCanvasRightClick,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    theme,
    }) {
    const cursorClass =
        mode === 'add' ? 'cursor-crosshair' :
        mode === 'screenshot' ? 'cursor-crosshair' :
        'cursor-default';

    const getInstructionText = () => {
        if (mode === 'select') return 'Click to select • Ctrl + Drag to move in canvas';
        if (mode === 'add') return 'Click empty: add node • Click node: add edge';
        if (mode === 'screenshot') return 'Drag to select area for PNG screenshot • Press T to exit';
        return '';
    };

    return (
        <div
        ref={containerRef}
        className="flex-1 relative overflow-hidden shadow-inner"
        style={{ backgroundColor: theme.canvas }}
        >
        <canvas
            ref={canvasRef}
            className={`w-full h-full ${cursorClass}`}
            onClick={onCanvasClick}
            onContextMenu={onCanvasRightClick}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
        />
        {edgeStart !== null && (
            <div
            className="absolute top-2 left-2 p-2 text-sm rounded-lg shadow-md"
            style={{
                backgroundColor: theme.node,
                color: theme.text,
                borderColor: theme.border,
                border: '1px solid'
            }}
            >
            Connecting from: {nodes.find(n => n.id === edgeStart)?.label}. Click target state or empty space (creates new state).
            </div>
        )}
        {mode === 'screenshot' && (
            <div
            className="absolute top-2 left-1/2 transform -translate-x-1/2 p-3 text-sm rounded-lg shadow-lg font-semibold"
            style={{
                backgroundColor: '#3b82f6',
                color: '#ffffff',
                border: '2px solid #1d4ed8'
            }}
            >
            📸 Screenshot Mode Active
            </div>
        )}
        <div
            className="absolute bottom-2 right-2 text-xs p-2 rounded-lg"
            style={{
            backgroundColor: theme.node,
            color: theme.text,
            opacity: 0.7
            }}
        >
            {getInstructionText()}
        </div>
        </div>
    );
}