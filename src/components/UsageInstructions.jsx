export function UsageInstructions() {
    return (
        <div className="mt-8 pt-6 border-t border-gray-200">
        <h4 className="font-semibold mb-3 text-gray-700">Usage Instructions</h4>
        <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
            <li><strong>Select Mode (Default):</strong> Click a state to select it and edit properties on the right.</li>
            <li><strong>Add Node Mode:</strong> Click anywhere on the canvas to create a new state.</li>
            <li><strong>Add Edge Mode:</strong> Click the starting state, then click the destination state to create a transition.</li>
            <li><strong>Move Mode:</strong> Click and drag a state to reposition it.</li>
            <li>Use the <strong>Export</strong> button to save your FSA structure as a JSON file.</li>
        </ul>
        </div>
    );
}