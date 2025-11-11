import { useState, useRef, useEffect, useCallback } from 'react';
import { Toolbar } from './components/Toolbar';
import { GraphCanvas } from './components/GraphCanvas';
import { PropertiesPanel } from './components/PropertiesPanel';
import { EdgeLabelDialog } from './components/EdgeLabelDialog';
import { KeyboardHelp } from './components/KeyboardHelp';
import { MultiAddDialog } from './components/MultiAddDialog';
import { useGraphDrawing } from './hooks/useGraphDrawing';
import { useCanvasResize } from './hooks/useCanvasResize';
import { useHistory } from './hooks/useHistory';
import { useTheme } from './hooks/useTheme';
import { useCanvasPan } from './hooks/useCanvasPan';
import { getCanvasCoords, findNode } from './utils/canvasUtils';
import { createNode, createEdge, exportGraph, importGraphFromFile, findNonOverlappingPosition } from './utils/graphOperations';
import { INITIAL_NODES, INITIAL_EDGES, NODE_RADIUS } from './constants';

export default function App() {
  const [mode, setMode] = useState('select');
  const [selectedNodes, setSelectedNodes] = useState(new Set());
  const [selectedNode, setSelectedNode] = useState(null);
  const [edgeStart, setEdgeStart] = useState(null);
  const [draggingNode, setDraggingNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState(null);
  const [selectionEnd, setSelectionEnd] = useState(null);
  const [isDraggingSelection, setIsDraggingSelection] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const [edgeLabelDialog, setEdgeLabelDialog] = useState({
    isOpen: false,
    edgeId: null,
    initialLabel: '',
    position: { x: 0, y: 0 },
    pendingEdge: null
  });

  const [multiAddDialog, setMultiAddDialog] = useState(false);
  const canvasRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const { currentTheme, cycleTheme, themeName } = useTheme();
  const { offset, isPanning, startPan, updatePan, endPan, panByOffset } = useCanvasPan();

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

  const deleteNode = useCallback(
    (nodeId) => {
      const newNodes = nodes.filter((n) => n.id !== nodeId);
      const newEdges = edges.filter((e) => e.from !== nodeId && e.to !== nodeId);
      saveState(newNodes, newEdges);
      setSelectedNode(null);
    },
    [nodes, edges, saveState]
  );

  const deleteSelectedNodes = useCallback(() => {
    if (selectedNodes.size === 0 && selectedNode) {
      deleteNode(selectedNode);
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
  }, [selectedNodes, selectedNode, nodes, edges, saveState, deleteNode]);

  const handleUndo = useCallback(() => {
    const prevState = undo();
    if (prevState) {
      setSelectedNode(null);
      setSelectedNodes(new Set());
      setEdgeStart(null);
    }
  }, [undo]);

  const handleRedo = useCallback(() => {
    const nextState = redo();
    if (nextState) {
      setSelectedNode(null);
      setSelectedNodes(new Set());
      setEdgeStart(null);
    }
  }, [redo]);

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
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      if (e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        deleteSelectedNodes();
      }

      if (e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        setMode(mode === 'add' ? 'select' : 'add');
        setEdgeStart(null);
      }

      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        setMultiAddDialog(true);
      }

      if (e.key === 'i' || e.key === 'I') {
        e.preventDefault();
        if (selectedNode) {
            const connected = new Set([selectedNode]);
            edges.forEach(e => {
                if (e.from === selectedNode) connected.add(e.to);
                if (e.to === selectedNode) connected.add(e.from);
            });
            setSelectedNodes(connected);
        }
      }

      if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        setMode('select');
        setEdgeStart(null);
      }

      if (e.key.startsWith('Arrow')) {
        e.preventDefault();
        const panSpeed = 10;
        if (e.key === 'ArrowLeft') panByOffset(panSpeed, 0);
        if (e.key === 'ArrowRight') panByOffset(-panSpeed, 0);
        if (e.key === 'ArrowUp') panByOffset(0, panSpeed);
        if (e.key === 'ArrowDown') panByOffset(0, -panSpeed);
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
  }, [deleteSelectedNodes, handleUndo, handleRedo, panByOffset, offset, mode, edges, selectedNode]);

  const addNode = (x, y) => {
    const basePos = { x: x - offset.x, y: y - offset.y };
    const finalPos = findNonOverlappingPosition(basePos.x, basePos.y, nodes);
    const newNode = createNode(nodes, finalPos.x, finalPos.y);
    const newNodes = [...nodes, newNode];
    saveState(newNodes, edges);
    return newNode.id;
  };

  const addEdge = (from, to, label = 'ε') => {
    if (from === to) {
      const existingSelfLoop = edges.find(e => e.from === from && e.to === to);
      if (existingSelfLoop) {
        const newLabel = existingSelfLoop.label + ', ' + label;
        updateEdgeLabel(existingSelfLoop.id, newLabel);
        return;
      }
    }
    
    const newEdge = createEdge(edges, from, to, label);
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
    const finalLabel = label.trim() === '' ? 'ε' : label;
    const newEdges = edges.map(e =>
      e.id === edgeId ? { ...e, label: finalLabel } : e
    );
    saveState(nodes, newEdges);
  };

  const handleCanvasClick = (e) => {
    if (isPanning || isSelecting) return;

    const coords = getCanvasCoords(canvasRef.current, e);
    const adjustedCoords = { x: coords.x - offset.x, y: coords.y - offset.y };
    const clickedNode = findNode(nodes, adjustedCoords.x, adjustedCoords.y);

    if (mode === 'add') {
      if (!clickedNode) {
        const newNodeId = addNode(coords.x, coords.y);
        
        if (edgeStart !== null) {
          setEdgeLabelDialog({
            isOpen: true,
            edgeId: null,
            initialLabel: 'ε',
            position: { x: e.clientX, y: e.clientY },
            pendingEdge: { from: edgeStart, to: newNodeId }
          });
          setEdgeStart(null);
        }
      } else {
        if (edgeStart === null) {
          setEdgeStart(clickedNode.id);
        } else {
          setEdgeLabelDialog({
            isOpen: true,
            edgeId: null,
            initialLabel: 'ε',
            position: { x: e.clientX, y: e.clientY },
            pendingEdge: { from: edgeStart, to: clickedNode.id }
          });
          setEdgeStart(null);
        }
      }
    } else if (mode === 'select') {
      if (clickedNode) {
        setSelectedNode(clickedNode.id);
        setSelectedNodes(new Set());
      } else {
        setSelectedNode(null);
        setSelectedNodes(new Set());
      }
    }
  };

  const handleCanvasRightClick = (e) => {
    e.preventDefault();
    if (mode === 'add' && edgeStart !== null) {
      setEdgeStart(null);
    }
  };

  const handleMouseDown = (e) => {
    const coords = getCanvasCoords(canvasRef.current, e);
    
    if (e.button === 1 || e.ctrlKey) {
      startPan(coords.x, coords.y);
      return;
    }

    if (e.button === 2) {
      return;
    }

    const adjustedCoords = { x: coords.x - offset.x, y: coords.y - offset.y };
    const clickedNode = findNode(nodes, adjustedCoords.x, adjustedCoords.y);

    if (mode === 'select') {
      if (clickedNode) {
        if (selectedNodes.size > 1) {
          return;
        }
        if (selectedNodes.has(clickedNode.id)) {
          setIsDraggingSelection(true);
          setDragOffset({
            x: adjustedCoords.x - clickedNode.x,
            y: adjustedCoords.y - clickedNode.y
          });
        } else {
          setDraggingNode(clickedNode.id);
        }
      } else if (!isPanning) {
        setIsSelecting(true);
        setSelectionStart({ x: adjustedCoords.x, y: adjustedCoords.y });
        setSelectionEnd({ x: adjustedCoords.x, y: adjustedCoords.y });
      }
    }
  };

  const handleMouseMove = (e) => {
    const coords = getCanvasCoords(canvasRef.current, e);
    const adjustedCoords = { x: coords.x - offset.x, y: coords.y - offset.y };
    const hovNode = findNode(nodes, adjustedCoords.x, adjustedCoords.y);
    setHoveredNode(hovNode ? hovNode.id : null);

    if (isPanning) {
      updatePan(coords.x, coords.y);
    } else if (isSelecting && selectionStart) {
      setSelectionEnd({ x: adjustedCoords.x, y: adjustedCoords.y });
    } else if (isDraggingSelection && selectedNodes.size > 0) {
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
      const newNodes = nodes.map(n =>
        n.id === draggingNode ? { ...n, x: adjustedCoords.x, y: adjustedCoords.y } : n
      );
      saveState(newNodes, edges);
    }
  };

  const handleMouseUp = () => {
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
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setEdgeStart(null);
    setSelectedNodes(new Set());
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
          setSelectedNodes(new Set());
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
    setSelectedNodes(new Set());
    setEdgeStart(null);
  };

  const handleMultiAdd = (count) => {
    const canvasWidth = canvasContainerRef.current?.clientWidth || 800;
    const canvasHeight = canvasContainerRef.current?.clientHeight || 600;
    
    const cols = Math.ceil(Math.sqrt(count));
    const rows = Math.ceil(count / cols);
    
    const spacingX = Math.min((canvasWidth - 100) / (cols + 1), 150);
    const spacingY = Math.min((canvasHeight - 100) / (rows + 1), 150);
    
    const startX = 100;
    const startY = 100;
    
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

  const handleEdgeLabelSave = (label) => {
    if (edgeLabelDialog.pendingEdge) {
      addEdge(edgeLabelDialog.pendingEdge.from, edgeLabelDialog.pendingEdge.to, label);
    } else if (edgeLabelDialog.edgeId !== null) {
      updateEdgeLabel(edgeLabelDialog.edgeId, label);
    }
  };

  const handleEdgeLabelClick = (edgeId, x, y) => {
    const edge = edges.find(e => e.id === edgeId);
    if (edge) {
      setEdgeLabelDialog({
        isOpen: true,
        edgeId: edge.id,
        initialLabel: edge.label,
        position: { x, y },
        pendingEdge: null
      });
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
    isSelecting ? { start: selectionStart, end: selectionEnd } : null
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
        onImport={handleImport}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={canUndo}
        canRedo={canRedo}
        theme={currentTheme}
        themeName={themeName}
        onThemeToggle={cycleTheme}
        onClearCanvas={handleClearCanvas}
        onMultiAdd={() => setMultiAddDialog(true)}
      />

      <KeyboardHelp theme={currentTheme} />

      <div className="flex-1 flex min-h-0">
        <GraphCanvas
          canvasRef={canvasRef}
          containerRef={canvasContainerRef}
          mode={mode}
          edgeStart={edgeStart}
          nodes={nodes}
          onCanvasClick={handleCanvasClick}
          onCanvasRightClick={handleCanvasRightClick}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          theme={currentTheme}
          onEdgeLabelClick={handleEdgeLabelClick}
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

      <EdgeLabelDialog
        isOpen={edgeLabelDialog.isOpen}
        onClose={() => setEdgeLabelDialog({ ...edgeLabelDialog, isOpen: false })}
        onSave={handleEdgeLabelSave}
        initialLabel={edgeLabelDialog.initialLabel}
        theme={currentTheme}
        position={edgeLabelDialog.position}
      />

      <MultiAddDialog
        isOpen={multiAddDialog}
        onClose={() => setMultiAddDialog(false)}
        onConfirm={handleMultiAdd}
        theme={currentTheme}
      />
    </div>
  );
}