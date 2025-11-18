import { useState, useEffect } from 'react';
import { Settings, Type, FlaskConical } from 'lucide-react';
import { CollapsibleSection } from './CollapsibleSection';
import { PropertiesSection } from './PropertiesSection';
import { GreekSymbolsSection } from './GreekSymbolsSection';
import { AnalysisSection } from './AnalysisSection';

export function PropertiesPanel({
    selectedNode,
    nodes,
    edges,
    onUpdateNodeLabel,
    onToggleAccepting,
    onSetStart,
    onDeleteNode,
    onUpdateEdgeLabel,
    onDeleteEdge,
    theme,
    isSimulating = false,
    onDeadStatesDetected
}) {
    const [isPropertiesExpanded, setIsPropertiesExpanded] = useState(true);
    const [isGreekExpanded, setIsGreekExpanded] = useState(false);
    const [isAnalysisExpanded, setIsAnalysisExpanded] = useState(false);

    useEffect(() => {
        if (selectedNode && !isSimulating) {
            setIsPropertiesExpanded(true);
        }
    }, [selectedNode, isSimulating]);

    return (
        <div
            className="w-80 border-l p-6 overflow-y-auto shadow-lg"
            style={{
                backgroundColor: theme.panel,
                borderColor: theme.border,
                color: theme.text,
                opacity: isSimulating ? 0.6 : 1,
                pointerEvents: isSimulating ? 'none' : 'auto'
            }}
        >
            <h3
                className="font-bold text-xl mb-6 border-b pb-2"
                style={{ borderColor: theme.border, textAlign: 'center' }}
            >
                Automaton Panel
            </h3>

            <CollapsibleSection
                title="Properties"
                icon={Settings}
                isExpanded={isPropertiesExpanded}
                onToggle={() => setIsPropertiesExpanded(!isPropertiesExpanded)}
                theme={theme}
                isDisabled={isSimulating}
            >
                <PropertiesSection
                    selectedNode={selectedNode}
                    nodes={nodes}
                    edges={edges}
                    onUpdateNodeLabel={onUpdateNodeLabel}
                    onToggleAccepting={onToggleAccepting}
                    onSetStart={onSetStart}
                    onDeleteNode={onDeleteNode}
                    onUpdateEdgeLabel={onUpdateEdgeLabel}
                    onDeleteEdge={onDeleteEdge}
                    theme={theme}
                    isSimulating={isSimulating}
                />
            </CollapsibleSection>

            <CollapsibleSection
                title="Greek Symbols"
                icon={Type}
                isExpanded={isGreekExpanded}
                onToggle={() => setIsGreekExpanded(!isGreekExpanded)}
                theme={theme}
                isDisabled={isSimulating}
            >
                <GreekSymbolsSection
                    theme={theme}
                    isSimulating={isSimulating}
                />
            </CollapsibleSection>

            <CollapsibleSection
                title="Analysis Tools"
                icon={FlaskConical}
                isExpanded={isAnalysisExpanded}
                onToggle={() => setIsAnalysisExpanded(!isAnalysisExpanded)}
                theme={theme}
                isDisabled={isSimulating}
            >
                <AnalysisSection
                    nodes={nodes}
                    edges={edges}
                    theme={theme}
                    isSimulating={isSimulating}
                    onDeadStatesDetected={onDeadStatesDetected}
                />
            </CollapsibleSection>
        </div>
    );
}
