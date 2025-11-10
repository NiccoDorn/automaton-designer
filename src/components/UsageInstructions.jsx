export function UsageInstructions({ theme }) {
    return (
        <div
        className="mt-8 pt-6 border-t"
        style={{ borderColor: theme.border }}
        >
        <h4
            className="font-semibold mb-3"
            style={{ color: theme.text }}
        >
            Usage Instructions
        </h4>
        <ul
            className="text-sm space-y-2 list-disc list-inside"
            style={{ color: theme.nodeStroke }}
        >
            <li><strong>Select / Move Mode:</strong> Click a state to select. Drag to move states.</li>
            <li><strong>Add Mode:</strong> Click empty space to create a state. Click a state to start an edge, then click target (or empty to create new state).</li>
            <li><strong>Delete:</strong> Select a state and press Backspace or Delete.</li>
            <li><strong>Pan Canvas:</strong> Ctrl+Click and drag, or use middle mouse button.</li>
            <li><strong>Undo/Redo:</strong> Use toolbar buttons or Ctrl+Z / Ctrl+Y.</li>
            <li>Use the <strong>Export</strong> button to save your Automaton structure as a JSON file.</li>
        </ul>
        </div>
    );
}