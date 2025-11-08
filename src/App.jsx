import { useState, useRef, useEffect } from 'react';
import { Toolbar } from './components/Toolbar';
import { GraphCanvas } from './components/GraphCanvas';
import { PropertiesPanel } from './components/PropertiesPanel';
import { useGraphDrawing } from './hooks/useGraphDrawing';
import { useCanvasResize } from './hooks/useCanvasResize';
import { getCanvasCoords, findNode } from './utils/canvasUtils';
import { createNode, createEdge, exportGraph, importGraphFromFile } from './utils/graphOperations';
import { INITIAL_NODES, INITIAL_EDGES } from './constants';

export default function App() {
  const [nodes, setNodes] = useState(INITIAL_NODES);
  const [edges, setEdges] = useState(INITIAL_EDGES);
  const [mode, setMode] = useState('select');
  const [selectedNode, setSelectedNode] = useState(null);
  const [edgeStart, setEdgeStart] = useState(null);
  const [draggingNode, setDraggingNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const canvasRef = useRef(null);
  const canvasContainerRef = useRef(null);

  useEffect(() => {
        if (errorMessage) {
            const timer = setTimeout(() => {
                setErrorMessage(null);
            }, 5000); // 5 sekunden display
            return () => clearTimeout(timer);
        }
    }, [errorMessage, setErrorMessage]);

  const addNode = (x, y) => {
    const newNode = createNode(nodes, x, y);
    setNodes([...nodes, newNode]);
  };

  const addEdge = (from, to) => {
    const newEdge = createEdge(edges, from, to);
    setEdges([...edges, newEdge]);
  };

  const deleteNode = (nodeId) => {
    setNodes(nodes.filter(n => n.id !== nodeId));
    setEdges(edges.filter(e => e.from !== nodeId && e.to !== nodeId));
    setSelectedNode(null);
  };

  const deleteEdge = (edgeId) => {
    setEdges(edges.filter(e => e.id !== edgeId));
  };

  const toggleAccepting = (nodeId) => {
    setNodes(nodes.map(n =>
      n.id === nodeId ? { ...n, isAccepting: !n.isAccepting } : n
    ));
  };

  const setStartState = (nodeId) => {
    setNodes(nodes.map(n =>
      n.id === nodeId ? { ...n, isStart: true } : { ...n, isStart: false }
    ));
  };

  const updateNodeLabel = (nodeId, label) => {
    setNodes(nodes.map(n =>
      n.id === nodeId ? { ...n, label } : n
    ));
  };

  const updateEdgeLabel = (edgeId, label) => {
    setEdges(edges.map(e =>
      e.id === edgeId ? { ...e, label } : e
    ));
  };

  const handleCanvasClick = (e) => {
    const coords = getCanvasCoords(canvasRef.current, e);
    const clickedNode = findNode(nodes, coords.x, coords.y);
    
    if (mode === 'addNode' && !clickedNode) {
      addNode(coords.x, coords.y);
    } else if (mode === 'addEdge') {
      if (clickedNode) {
        if (edgeStart === null) {
          setEdgeStart(clickedNode.id);
        } else {
          addEdge(edgeStart, clickedNode.id);
          setEdgeStart(null);
        }
      } else {
        setEdgeStart(null);
      }
    } else if (mode === 'select') {
      setSelectedNode(clickedNode ? clickedNode.id : null);
    }
  };

  const handleMouseDown = (e) => {
    if (mode === 'move') {
      const coords = getCanvasCoords(canvasRef.current, e);
      const clickedNode = findNode(nodes, coords.x, coords.y);
      if (clickedNode) {
        setDraggingNode(clickedNode.id);
      }
    }
  };

  const handleMouseMove = (e) => {
    const coords = getCanvasCoords(canvasRef.current, e);
    const hovNode = findNode(nodes, coords.x, coords.y);
    setHoveredNode(hovNode ? hovNode.id : null);
    
    if (draggingNode !== null) {
      setNodes(nodes.map(n =>
        n.id === draggingNode ? { ...n, x: coords.x, y: coords.y } : n
      ));
    }
  };

  const handleMouseUp = () => {
    setDraggingNode(null);
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

                  setNodes(data.nodes);
                  setEdges(data.edges);
                  setSelectedNode(null);
              },
              (error) => {
                  console.error("Error importing graph:", error); // meh, lass ich mal drin für debugging
                  setErrorMessage(`Import Error: Failed to read or parse the graph file. Check the file format.`);
              }
          );
          e.target.value = null;
      }
  };

  const drawGraph = useGraphDrawing(canvasRef, nodes, edges, selectedNode, hoveredNode, mode, edgeStart);
  useCanvasResize(canvasRef, canvasContainerRef, drawGraph);

  return (
    <div className="w-full min-h-screen flex flex-col font-sans bg-gray-50">
        {errorMessage && (
            <div
                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 sticky top-0 z-50"
                role="alert"
            >
                <p className="font-bold">Validation Error</p>
                <p>{errorMessage}</p>
                <button
                    onClick={() => setErrorMessage(null)}
                    className="absolute top-1 right-2 text-red-500 hover:text-red-700"
                >
                    &times;
                </button>
            </div>
        )}
      <Toolbar
        mode={mode}
        onModeChange={handleModeChange}
        onExport={handleExport}
        onImport={handleImport}
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
        />
      </div>
    </div>
  );
}