export function GraphCanvas({
    canvasRef,
    containerRef,
    mode,
    edgeStart,
    nodes,
    onCanvasClick,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    theme
    }) {
    const cursorClass = mode === 'add' ? 'cursor-crosshair' : 'cursor-default';

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
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onContextMenu={(e) => e.preventDefault()}
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
            Connecting from: {nodes.find(n => n.id === edgeStart)?.label}. Click target node or empty space.
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
            {mode === 'select' ? 'Click to select • Drag to move • Ctrl+Click to pan' : 'Click empty: add node • Click node: add edge'}
        </div>
        </div>
    );
}