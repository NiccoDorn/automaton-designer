import { useState, useRef, useEffect, useCallback } from 'react';
import { Toolbar } from './components/Toolbar';
import { GraphCanvas } from './components/GraphCanvas';
import { PropertiesPanel } from './components/PropertiesPanel';
import { useGraphDrawing } from './hooks/useGraphDrawing';
import { useCanvasResize } from './hooks/useCanvasResize';
import { useHistory } from './hooks/useHistory';
import { useTheme } from './hooks/useTheme';
import { useCanvasPan } from './hooks/useCanvasPan';
import { getCanvasCoords, findNode } from './utils/canvasUtils';
import { createNode, createEdge, exportGraph, importGraphFromFile } from './utils/graphOperations';
import { INITIAL_NODES, INITIAL_EDGES } from './constants';

export default function App() {
  const [mode, setMode] = useState('select');
  const [selectedNode, setSelectedNode] = useState(null);
  const [edgeStart, setEdgeStart] = useState(null);
  const [draggingNode, setDraggingNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultEdgeLabel, setDefaultEdgeLabel] = useState('ε');

  const canvasRef = useRef(null);
  const canvasContainerRef = useRef(null);

  const { currentTheme, cycleTheme, themeName } = useTheme();
  const { offset, isPanning, startPan, updatePan, endPan } = useCanvasPan();

  const {
    currentState,
    addToHistory,
    undo,
    redo,
    canUndo,
    canRedo
  } = useHistory({ nodes: INITIAL_NODES, edges: INITIAL_EDGES }, 20);

  const nodes = currentState.nodes;
  const edges = currentState.edges;

  const saveState = useCallback(
    (newNodes, newEdges) => {
      addToHistory({ nodes: newNodes, edges: newEdges });
    },
    [addToHistory]
  );

  const deleteNode = useCallback(
    (nodeId) => {
      const newNodes = nodes.filter((n) => n.id !== nodeId);
      const newEdges = edges.filter((e) => e.from !== nodeId && e.to !== nodeId);
      saveState(newNodes, newEdges);
      setSelectedNode(null);
    },
    [nodes, edges, saveState, setSelectedNode]
  );

  const handleUndo = useCallback(() => {
    const prevState = undo();
    if (prevState) {
      setSelectedNode(null);
      setEdgeStart(null);
    }
  }, [undo, setSelectedNode, setEdgeStart]);

  const handleRedo = useCallback(() => {
    const nextState = redo();
    if (nextState) {
      setSelectedNode(null);
      setEdgeStart(null);
    }
  }, [redo, setSelectedNode, setEdgeStart]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === 'Backspace' || e.key === 'Delete') && selectedNode !== null) {
        e.preventDefault();
        deleteNode(selectedNode);
      }
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          handleUndo();
        }
        if (e.key === 'y' || (e.key === 'z' && e.shiftKey)) {
          e.preventDefault();
          handleRedo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [deleteNode, handleRedo, handleUndo, selectedNode, nodes, edges]);

  const addNode = (x, y) => {
    const newNode = createNode(nodes, x - offset.x, y - offset.y);
    const newNodes = [...nodes, newNode];
    saveState(newNodes, edges);
  };

  const addEdge = (from, to) => {
    const newEdge = createEdge(edges, from, to, defaultEdgeLabel);
    const newEdges = [...edges, newEdge];
    saveState(nodes, newEdges);
  };

  const deleteEdge = (edgeId) => {
    const newEdges = edges.filter(e => e.id !== edgeId);
    saveState(nodes, newEdges);
  };

  const toggleAccepting = (nodeId) => {
    const newNodes = nodes.map(n =>
      n.id === nodeId ? { ...n, isAccepting: !n.isAccepting } : n
    );
    saveState(newNodes, edges);
  };

  const setStartState = (nodeId) => {
    const newNodes = nodes.map(n =>
      n.id === nodeId ? { ...n, isStart: true } : { ...n, isStart: false }
    );
    saveState(newNodes, edges);
  };

  const updateNodeLabel = (nodeId, label) => {
    const newNodes = nodes.map(n =>
      n.id === nodeId ? { ...n, label } : n
    );
    saveState(newNodes, edges);
  };

  const updateEdgeLabel = (edgeId, label) => {
    const newEdges = edges.map(e =>
      e.id === edgeId ? { ...e, label } : e
    );
    saveState(nodes, newEdges);
  };

  const handleCanvasClick = (e) => {
    if (isPanning) return;

    const coords = getCanvasCoords(canvasRef.current, e);
    const adjustedCoords = { x: coords.x - offset.x, y: coords.y - offset.y };
    const clickedNode = findNode(nodes, adjustedCoords.x, adjustedCoords.y);

    if (mode === 'add') {
      if (!clickedNode) {
        addNode(coords.x, coords.y);
      } else {
        if (edgeStart === null) {
          setEdgeStart(clickedNode.id);
        } else {
          addEdge(edgeStart, clickedNode.id);
          setEdgeStart(null);
        }
      }
    } else if (mode === 'select') {
      setSelectedNode(clickedNode ? clickedNode.id : null);
    }
  };

  const handleMouseDown = (e) => {
    const coords = getCanvasCoords(canvasRef.current, e);
    
    if (e.button === 1 || e.ctrlKey) {
      startPan(coords.x, coords.y);
      return;
    }

    const adjustedCoords = { x: coords.x - offset.x, y: coords.y - offset.y };
    const clickedNode = findNode(nodes, adjustedCoords.x, adjustedCoords.y);

    if (mode === 'select' && clickedNode && !isPanning) {
      setDraggingNode(clickedNode.id);
    }
  };

  const handleMouseMove = (e) => {
    const coords = getCanvasCoords(canvasRef.current, e);
    const adjustedCoords = { x: coords.x - offset.x, y: coords.y - offset.y };
    const hovNode = findNode(nodes, adjustedCoords.x, adjustedCoords.y);
    setHoveredNode(hovNode ? hovNode.id : null);

    if (isPanning) {
      updatePan(coords.x, coords.y);
    } else if (draggingNode !== null) {
      const newNodes = nodes.map(n =>
        n.id === draggingNode ? { ...n, x: adjustedCoords.x, y: adjustedCoords.y } : n
      );
      saveState(newNodes, edges);
    }
  };

  const handleMouseUp = () => {
    setDraggingNode(null);
    endPan();
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setEdgeStart(null);
  };

  const handleExport = () => {
    exportGraph(nodes, edges);
  };

  const validateAutomatonData = (data) => {
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
  };

  const handleImport = (e) => {
    setErrorMessage(null);

    const file = e.target.files[0];
    if (file) {
      importGraphFromFile(
        file,
        (data) => {
          const validationResult = validateAutomatonData(data);

          if (!validationResult.isValid) {
            setErrorMessage(validationResult.message);
            return;
          }

          saveState(data.nodes, data.edges);
          setSelectedNode(null);
        },
        (error) => {
          console.error("Error importing graph:", error);
          setErrorMessage(`Import Error: Failed to read or parse the graph file. Check the file format.`);
        }
      );
      e.target.value = null;
    }
  };

    const handleClearCanvas = () => {
      saveState([], []);
      setSelectedNode(null);
      setEdgeStart(null);
  };

  const handleMultiAdd = (count) => {
    const canvasWidth = canvasContainerRef.current?.clientWidth || 800;
    const canvasHeight = canvasContainerRef.current?.clientHeight || 600;
    
    const cols = Math.ceil(Math.sqrt(count));
    const rows = Math.ceil(count / cols);
    
    const spacingX = Math.min((canvasWidth - 100) / (cols + 1), 150);
    const spacingY = Math.min((canvasHeight - 100) / (rows + 1), 150);
    
    const startX = (canvasWidth - (cols - 1) * spacingX) / 4;
    const startY = (canvasHeight - (rows - 1) * spacingY) / 4;
    
    const newNodes = [];
    const baseId = nodes.length > 0 ? Math.max(...nodes.map(n => n.id)) + 1 : 0;
    
    for (let i = 0; i < count; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      
      newNodes.push({
        id: baseId + i,
        x: startX + col * spacingX - offset.x,
        y: startY + row * spacingY - offset.y,
        label: `q${baseId + i}`,
        isAccepting: false,
        isStart: nodes.length === 0 && i === 0
      });
    }
    
    saveState([...nodes, ...newNodes], edges);
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
    offset
  );
  useCanvasResize(canvasRef, canvasContainerRef, drawGraph);

  return (
    <div
      className="app-container w-full min-h-screen flex flex-col font-sans"
      style={{ backgroundColor: currentTheme.background }}
    >
      <div
        className="w-full min-h-screen flex flex-col font-sans"
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
        onImport={handleImport}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={canUndo}
        canRedo={canRedo}
        theme={currentTheme}
        themeName={themeName}
        onThemeToggle={cycleTheme}
        defaultEdgeLabel={defaultEdgeLabel}
        onDefaultEdgeLabelChange={setDefaultEdgeLabel}
        onClearCanvas={handleClearCanvas}
        onMultiAdd={handleMultiAdd}
      />

      <div className="flex-1 flex min-h-0">
        <GraphCanvas
          canvasRef={canvasRef}
          containerRef={canvasContainerRef}
          mode={mode}
          edgeStart={edgeStart}
          nodes={nodes}
          onCanvasClick={handleCanvasClick}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          theme={currentTheme}
        />

        <PropertiesPanel
          selectedNode={selectedNode}
          nodes={nodes}
          edges={edges}
          onUpdateNodeLabel={updateNodeLabel}
          onToggleAccepting={toggleAccepting}
          onSetStart={setStartState}
          onDeleteNode={deleteNode}
          onUpdateEdgeLabel={updateEdgeLabel}
          onDeleteEdge={deleteEdge}
          theme={currentTheme}
        />
      </div>
    </div>
    </div>
  );
}