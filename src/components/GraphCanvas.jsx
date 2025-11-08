export function GraphCanvas({
    canvasRef,
    containerRef,
    mode,
    edgeStart,
    nodes,
    onCanvasClick,
    onMouseDown,
    onMouseMove,
    onMouseUp
}) {
    const cursorClass = mode === 'addNode' ? 'cursor-crosshair' : (mode === 'move' ? 'cursor-move' : 'cursor-default');
    
    return (
        <div ref={containerRef} className="flex-1 bg-gray-100 relative overflow-hidden shadow-inner">
        <canvas
            ref={canvasRef}
            className={`w-full h-full ${cursorClass}`}
            onClick={onCanvasClick}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
        />
        {edgeStart !== null && (
            <div className="absolute top-2 left-2 p-2 bg-yellow-200 text-yellow-800 text-sm rounded-lg shadow-md">
            Connecting from: {nodes.find(n => n.id === edgeStart)?.label}. Click target node.
            </div>
        )}
        </div>
    );
}