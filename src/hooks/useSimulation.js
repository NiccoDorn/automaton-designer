import { useState, useCallback, useRef, useEffect } from 'react';

export function useSimulation(nodes, edges) {
    const [isSimulating, setIsSimulating] = useState(false);
    const [inputWord, setInputWord] = useState('');
    const [currentStateId, setCurrentStateId] = useState(null);
    const [processedChars, setProcessedChars] = useState(0);
    const [simulationResult, setSimulationResult] = useState(null);
    const [showResultAnimation, setShowResultAnimation] = useState(false);
    const timeoutRef = useRef(null);

    const resetSimulation = useCallback(() => {
        setIsSimulating(false);
        setCurrentStateId(null);
        setProcessedChars(0);
        setSimulationResult(null);
        setShowResultAnimation(false);
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }, []);

    const simulateStep = useCallback((stateId, charIndex) => {
        if (charIndex >= inputWord.length) {
            const currentNode = nodes.find(n => n.id === stateId);
            const success = currentNode?.isAccepting || false;
            
            setSimulationResult({
                success,
                message: success
                    ? 'Woohoo! Word accepted! You speak my language!'
                    : 'My language, mothertrucker! Do you speak it???'
            });
            setShowResultAnimation(true);
            
            timeoutRef.current = setTimeout(() => {
                resetSimulation();
            }, 5000);
            return;
        }

        const char = inputWord[charIndex];
        const possibleEdges = edges.filter(e =>
            e.from === stateId && (e.label === char || e.label.split(',').map(l => l.trim()).includes(char))
        );

        if (possibleEdges.length === 0) {
            setSimulationResult({
                success: false,
                message: 'My language, mothertrucker! Do you speak it???'
            });
            setShowResultAnimation(true);
            
            timeoutRef.current = setTimeout(() => {
                resetSimulation();
            }, 5000);
            return;
        }

        const nextEdge = possibleEdges[0];
        setCurrentStateId(nextEdge.to);
        setProcessedChars(charIndex + 1);

        timeoutRef.current = setTimeout(() => {
            simulateStep(nextEdge.to, charIndex + 1);
        }, 800);
    }, [inputWord, nodes, edges, resetSimulation]);

    const startSimulation = useCallback(() => {
        if (!inputWord.trim() || isSimulating) return;

        const startNode = nodes.find(n => n.isStart);
        if (!startNode) {
            setSimulationResult({ success: false, message: 'No start state defined!' });
            setShowResultAnimation(true);
            return;
        }

        setIsSimulating(true);
        setCurrentStateId(startNode.id);
        setProcessedChars(0);
        setSimulationResult(null);
        setShowResultAnimation(false);

        simulateStep(startNode.id, 0);
    }, [inputWord, isSimulating, nodes, simulateStep]);

    const stopSimulation = useCallback(() => {
        resetSimulation();
    }, [resetSimulation]);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return {
        isSimulating,
        inputWord,
        setInputWord,
        currentStateId,
        processedChars,
        simulationResult,
        showResultAnimation,
        startSimulation,
        stopSimulation
    };
}