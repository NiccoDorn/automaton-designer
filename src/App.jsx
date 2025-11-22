import { useRef, useEffect, useCallback, useState } from 'react';
import { Toolbar } from './components/Toolbar';
import { GraphCanvas } from './components/GraphCanvas';
import { PropertiesPanel } from './components/PropertiesPanel';
import { EdgeLabelDialog } from './components/EdgeLabelDialog';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { MultiAddDialog } from './components/MultiAddDialog';
import { SimulationPanel } from './components/SimulationPanel';
import { SimulationResultOverlay } from './components/SimulationResultOverlay';
import { useGraphDrawing } from './hooks/useGraphDrawing';
import { useCanvasResize } from './hooks/useCanvasResize';
import { useHistory } from './hooks/useHistory';
import { useTheme } from './hooks/useTheme';
import { useCanvasPan } from './hooks/useCanvasPan';
import { useCanvasZoom } from './hooks/useCanvasZoom';
import { useAutomatonState } from './hooks/useAutomatonState';
import { useDialogs } from './hooks/useDialogs';
import { useAutomatonOperations } from './hooks/useAutomatonOperations';
import { useCanvasInteractions } from './hooks/useCanvasInteractions';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useSimulation } from './hooks/useSimulation';
import { INITIAL_NODES, INITIAL_EDGES } from './constants';

export default function App() {
  const canvasRef = useRef(null);
  const canvasContainerRef = useRef(null);

  const [deadStates, setDeadStates] = useState(new Set());
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);

  const { currentTheme, cycleTheme, themeName } = useTheme();
  const { offset, isPanning, startPan, updatePan, endPan, panByOffset } = useCanvasPan();
  const { zoomLevel } = useCanvasZoom(canvasRef);

  const {
    currentState,
    addToHistory,
    undo,
    redo,
    canUndo,
    canRedo
  } = useHistory({ nodes: INITIAL_NODES, edges: INITIAL_EDGES }, 100);

  const nodes = currentState.nodes;
  const edges = currentState.edges;

  const saveState = useCallback(
    (newNodes, newEdges) => {
      addToHistory({ nodes: newNodes, edges: newEdges });
    },
    [addToHistory]
  );

  const {
    mode,
    setMode,
    selectedNodes,
    setSelectedNodes,
    selectedNode,
    setSelectedNode,
    edgeStart,
    setEdgeStart,
    hoveredNode,
    setHoveredNode,
    errorMessage,
    setErrorMessage,
    isSelecting,
    setIsSelecting,
    selectionStart,
    setSelectionStart,
    selectionEnd,
    setSelectionEnd,
    draggingNode,
    setDraggingNode,
    isDraggingSelection,
    setIsDraggingSelection,
    dragOffset,
    setDragOffset
  } = useAutomatonState();

  const {
    edgeLabelDialog,
    multiAddDialog,
    openEdgeLabelDialog,
    closeEdgeLabelDialog,
    openMultiAddDialog,
    closeMultiAddDialog
  } = useDialogs();

  const {
    isSimulating,
    inputWord,
    setInputWord,
    currentStateId,
    processedChars,
    simulationResult,
    showResultAnimation,
    startSimulation,
    stopSimulation,
    isStepMode,
    startStepMode,
    stepOnce
  } = useSimulation(nodes, edges);

  const {
    addNode,
    addEdge,
    deleteNode,
    deleteEdge,
    toggleAccepting,
    setStartState,
    updateNodeLabel,
    updateEdgeLabel,
    handleMultiAdd,
    handleClearCanvas,
    handleExport,
    handleImport
  } = useAutomatonOperations(nodes, edges, saveState, offset, canvasContainerRef);

  const deleteSelectedNodes = useCallback(() => {
    if (selectedNodes.size === 0 && selectedNode) {
      deleteNode(selectedNode);
      setSelectedNode(null);
    } else if (selectedNodes.size > 0) {
      const nodesToDelete = Array.from(selectedNodes);
      const newNodes = nodes.filter(n => !nodesToDelete.includes(n.id));
      const newEdges = edges.filter(e =>
        !nodesToDelete.includes(e.from) && !nodesToDelete.includes(e.to)
      );
      saveState(newNodes, newEdges);
      setSelectedNodes(new Set());
      setSelectedNode(null);
    }
  }, [selectedNodes, selectedNode, nodes, edges, saveState, deleteNode, setSelectedNode, setSelectedNodes]);

  const handleUndo = useCallback(() => {
    const prevState = undo();
    if (prevState) {
      setSelectedNode(null);
      setSelectedNodes(new Set());
      setEdgeStart(null);
    }
  }, [undo, setSelectedNode, setSelectedNodes, setEdgeStart]);

  const handleRedo = useCallback(() => {
    const nextState = redo();
    if (nextState) {
      setSelectedNode(null);
      setSelectedNodes(new Set());
      setEdgeStart(null);
    }
  }, [redo, setSelectedNode, setSelectedNodes, setEdgeStart]);

  const {
    handleCanvasClick,
    handleCanvasRightClick,
    handleMouseDown,
    handleMouseMove: baseHandleMouseMove
  } = useCanvasInteractions({
    canvasRef,
    nodes,
    mode,
    edgeStart,
    offset,
    selectedNodes,
    isPanning,
    isSelecting,
    selectionStart,
    addNode,
    openEdgeLabelDialog,
    setEdgeStart,
    setSelectedNode,
    setSelectedNodes,
    setDraggingNode,
    setIsSelecting,
    setSelectionStart,
    setSelectionEnd,
    setIsDraggingSelection,
    setDragOffset,
    startPan,
    updatePan,
    endPan,
    setHoveredNode,
    saveState,
    edges,
    zoomLevel
  });

  const handleMouseMove = useCallback((e) => {
    baseHandleMouseMove(e);
    
    if (isDraggingSelection && selectedNodes.size > 0) {
      const coords = { x: e.clientX, y: e.clientY };
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const adjustedCoords = {
        x: coords.x - rect.left - offset.x,
        y: coords.y - rect.top - offset.y
      };
      
      const dx = adjustedCoords.x - dragOffset.x;
      const dy = adjustedCoords.y - dragOffset.y;
      
      const firstNode = nodes.find(n => selectedNodes.has(n.id));
      const offsetX = dx - firstNode.x;
      const offsetY = dy - firstNode.y;

      const newNodes = nodes.map(n =>
        selectedNodes.has(n.id)
          ? { ...n, x: n.x + offsetX, y: n.y + offsetY }
          : n
      );
      saveState(newNodes, edges);
      setDragOffset({ x: dx, y: dy });
    } else if (draggingNode !== null) {
      const coords = { x: e.clientX, y: e.clientY };
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const adjustedCoords = {
        x: coords.x - rect.left - offset.x,
        y: coords.y - rect.top - offset.y
      };
      
      const newNodes = nodes.map(n =>
        n.id === draggingNode ? { ...n, x: adjustedCoords.x, y: adjustedCoords.y } : n
      );
      saveState(newNodes, edges);
    }
  }, [baseHandleMouseMove, isDraggingSelection, selectedNodes, draggingNode, nodes, edges, offset, dragOffset, saveState, canvasRef, setDragOffset]);

  const handleMouseUp = useCallback(() => {
    if (isSelecting && selectionStart && selectionEnd) {
      const minX = Math.min(selectionStart.x, selectionEnd.x);
      const maxX = Math.max(selectionStart.x, selectionEnd.x);
      const minY = Math.min(selectionStart.y, selectionEnd.y);
      const maxY = Math.max(selectionStart.y, selectionEnd.y);

      const selected = new Set();
      nodes.forEach(node => {
        if (node.x >= minX && node.x <= maxX && node.y >= minY && node.y <= maxY) {
          selected.add(node.id);
        }
      });

      setSelectedNodes(selected);
      setSelectedNode(null);
    }

    setDraggingNode(null);
    setIsSelecting(false);
    setIsDraggingSelection(false);
    setSelectionStart(null);
    setSelectionEnd(null);
    endPan();
  }, [isSelecting, selectionStart, selectionEnd, nodes, setSelectedNodes, setSelectedNode, setDraggingNode, setIsSelecting, setIsDraggingSelection, setSelectionStart, setSelectionEnd, endPan]);

  useKeyboardShortcuts({
    edgeLabelDialog,
    multiAddDialog,
    closeEdgeLabelDialog,
    closeMultiAddDialog,
    deleteSelectedNodes,
    mode,
    setMode,
    setEdgeStart,
    openMultiAddDialog,
    selectedNode,
    edges,
    setSelectedNodes,
    panByOffset,
    handleUndo,
    handleRedo,
    isStepMode,
    nodes,
    setSelectedNode,
    toggleAccepting,
    setStartState,
    setIsShortcutsModalOpen
  });

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isSimulating) {
        stopSimulation();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isSimulating, stopSimulation]);

  useEffect(() => {
    const handleStep = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }
      if (isStepMode && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        stepOnce();
      }
    };
    window.addEventListener('keydown', handleStep);
    return () => window.removeEventListener('keydown', handleStep);
  }, [isStepMode, stepOnce]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage, setErrorMessage]);

  const handleModeChange = (newMode) => {
    if (isSimulating) return;
    setMode(newMode);
    setEdgeStart(null);
    setSelectedNodes(new Set());
  };

  const handleImportWrapper = (e) => {
    if (isSimulating) return;
    setErrorMessage(null);
    const file = e.target.files[0];
    if (file) {
      handleImport(
        file,
        () => {
          setSelectedNode(null);
          setSelectedNodes(new Set());
        },
        (errorMsg) => {
          setErrorMessage(errorMsg);
        }
      );
      e.target.value = null;
    }
  };

  const handleClearCanvasWrapper = () => {
    if (isSimulating) return;
    handleClearCanvas();
    setSelectedNode(null);
    setSelectedNodes(new Set());
    setEdgeStart(null);
  };

  const handleMultiAddWrapper = (count) => {
    handleMultiAdd(count);
  };

  const handleEdgeLabelSave = (label) => {
    if (edgeLabelDialog.pendingEdge) {
      addEdge(edgeLabelDialog.pendingEdge.from, edgeLabelDialog.pendingEdge.to, label, updateEdgeLabel);
    } else if (edgeLabelDialog.edgeId !== null) {
      updateEdgeLabel(edgeLabelDialog.edgeId, label);
    }
  };

  const handleEdgeLabelClick = (edgeId, x, y) => {
    if (isSimulating) return;
    const edge = edges.find(e => e.id === edgeId);
    if (edge) {
      openEdgeLabelDialog(edge.id, edge.label, { x, y }, null);
    }
  };

  const drawGraph = useGraphDrawing(
    canvasRef,
    nodes,
    edges,
    selectedNode,
    hoveredNode,
    mode,
    edgeStart,
    currentTheme,
    offset,
    selectedNodes,
    isSelecting ? { start: selectionStart, end: selectionEnd } : null,
    isSimulating ? { currentStateId } : null,
    deadStates,
    zoomLevel
  );
  
  useCanvasResize(canvasRef, canvasContainerRef, drawGraph);

  return (
    <div
      className="app-container w-full min-h-screen flex flex-col font-sans"
      style={{ backgroundColor: currentTheme.background }}
    >
      {errorMessage && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 sticky top-0 z-50"
          role="alert"
        >
          <p className="font-bold">Validation Error</p>
          <p>{errorMessage}</p>
          <button
            onClick={() => setErrorMessage(null)}
            className="absolute top-1 right-2 text-red-500 hover:text-red-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>
      )}

      <Toolbar
        mode={mode}
        onModeChange={handleModeChange}
        onExport={handleExport}
        onImport={handleImportWrapper}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={canUndo}
        canRedo={canRedo}
        theme={currentTheme}
        themeName={themeName}
        onThemeToggle={cycleTheme}
        onClearCanvas={handleClearCanvasWrapper}
        onMultiAdd={openMultiAddDialog}
        onKeyboardShortcuts={() => setIsShortcutsModalOpen(true)}
        isSimulating={isSimulating}
      />

      <KeyboardShortcutsModal
        theme={currentTheme}
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
      />

      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex flex-1 min-h-0">
          <div className="flex flex-col flex-1 min-h-0">
            <GraphCanvas
              canvasRef={canvasRef}
              containerRef={canvasContainerRef}
              mode={mode}
              edgeStart={edgeStart}
              nodes={nodes}
              onCanvasClick={isSimulating ? () => {} : handleCanvasClick}
              onCanvasRightClick={isSimulating ? (e) => e.preventDefault() : handleCanvasRightClick}
              onMouseDown={isSimulating ? () => {} : handleMouseDown}
              onMouseMove={isSimulating ? () => {} : handleMouseMove}
              onMouseUp={isSimulating ? () => {} : handleMouseUp}
              theme={currentTheme}
              onEdgeLabelClick={handleEdgeLabelClick}
            />

            <SimulationPanel
              inputWord={inputWord}
              setInputWord={setInputWord}
              onStart={startSimulation}
              onStop={stopSimulation}
              isSimulating={isSimulating}
              processedChars={processedChars}
              theme={currentTheme}
              isStepMode={isStepMode}
              onStartStep={startStepMode}
              onStep={stepOnce}
              simulationResult={simulationResult}
            />
          </div>

          <PropertiesPanel
            selectedNode={selectedNode}
            nodes={nodes}
            edges={edges}
            onUpdateNodeLabel={updateNodeLabel}
            onToggleAccepting={toggleAccepting}
            onSetStart={setStartState}
            onDeleteNode={(nodeId) => {
              if (isSimulating) return;
              deleteNode(nodeId);
              setSelectedNode(null);
            }}
            onUpdateEdgeLabel={updateEdgeLabel}
            onDeleteEdge={deleteEdge}
            theme={currentTheme}
            isSimulating={isSimulating}
            onDeadStatesDetected={setDeadStates}
          />
        </div>
      </div>

      <SimulationResultOverlay
        result={simulationResult}
        isVisible={showResultAnimation}
        theme={currentTheme}
      />

      {!isSimulating && (
        <>
          <EdgeLabelDialog
            isOpen={edgeLabelDialog.isOpen}
            onClose={closeEdgeLabelDialog}
            onSave={handleEdgeLabelSave}
            initialLabel={edgeLabelDialog.initialLabel}
            theme={currentTheme}
            position={edgeLabelDialog.position}
          />

          <MultiAddDialog
            isOpen={multiAddDialog}
            onClose={closeMultiAddDialog}
            onConfirm={handleMultiAddWrapper}
            theme={currentTheme}
          />
        </>
      )}
    </div>
  );
}