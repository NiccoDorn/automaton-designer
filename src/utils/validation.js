export function validateAutomatonData(data) {
    const labels = data.nodes.map(node => node.label);
    const uniqueLabels = new Set(labels);

    if (labels.length !== uniqueLabels.size) {
        const seen = new Set();
        const duplicates = labels.filter(label => {
            if (seen.has(label)) return true;
            seen.add(label);
            return false;
        });
        const duplicateList = [...new Set(duplicates)].join(', ');
        return {
            isValid: false,
            message: `Invalid Automaton File: Found duplicate state names (${duplicateList}). Each state must have a unique label.`
        };
    }

    if (data.nodes.length === 0) {
        return {
            isValid: false,
            message: "Invalid Automaton File: The file contains no states."
        };
    }

    const startNodes = data.nodes.filter(node => node.isStart);
    if (startNodes.length === 0) {
        return {
            isValid: false,
            message: "Invalid Automaton File: The automaton must define at least one start state."
        };
    }

    return { isValid: true, message: null };
}