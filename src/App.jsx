import { Plus, Trash2, Move, MousePointer, Download, Upload } from 'lucide-react';
import { useState, useRef, useEffect, useCallback } from 'react';

export default function App() {
  const [nodes, setNodes] = useState([
    { id: 0, x: 100, y: 150, label: 'q0', isAccepting: true, isStart: true },
    { id: 1, x: 300, y: 150, label: 'q1', isAccepting: false, isStart: false },
    { id: 2, x: 500, y: 150, label: 'q2', isAccepting: false, isStart: false }
  ]);
  const [edges, setEdges] = useState([
    { from: 0, to: 1, label: 'a', id: 0 },
    { from: 1, to: 2, label: 'b', id: 1 },
    { from: 2, to: 2, label: 'c', id: 2 }
  ]);

  const [mode, setMode] = useState('select');
  const [selectedNode, setSelectedNode] = useState(null);
  const [edgeStart, setEdgeStart] = useState(null);
  const [draggingNode, setDraggingNode] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);

  const canvasRef = useRef(null);
  const canvasContainerRef = useRef(null);

  const addNode = (x, y) => {
    const newNodeId = nodes.length > 0 ? Math.max(...nodes.map(n => n.id)) + 1 : 0;
    const newNode = {
      id: newNodeId,
      x,
      y,
      label: `q${newNodeId}`,
      isAccepting: false,
      isStart: nodes.length === 0
    };
    setNodes([...nodes, newNode]);
  };

  const addEdge = (from, to, label = 'ε') => {
    const newEdgeId = edges.length > 0 ? Math.max(...edges.map(e => e.id)) + 1 : 0;
    const newEdge = {
      from,
      to,
      label,
      id: newEdgeId
    };
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

  const drawGraph = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const NODE_RADIUS = 25;
    const ACCEPTING_RADIUS = 30;

    if (mode === 'addEdge' && edgeStart !== null) {
      const fromNode = nodes.find(n => n.id === edgeStart);
      const toNode = nodes.find(n => n.id === hoveredNode);

      if (fromNode) {
        let endX = fromNode.x;
        let endY = fromNode.y;
        if (toNode && toNode.id !== fromNode.id) {
          endX = toNode.x;
          endY = toNode.y;
        }
        if (toNode && toNode.id !== fromNode.id) {
          ctx.strokeStyle = '#94a3b8';
          ctx.setLineDash([5, 5]);
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(fromNode.x, fromNode.y);
          ctx.lineTo(endX, endY);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }
    }

    edges.forEach(edge => {
      const fromNode = nodes.find(n => n.id === edge.from);
      const toNode = nodes.find(n => n.id === edge.to);
      if (!fromNode || !toNode) return;
      ctx.strokeStyle = '#374151'; // Slate-700
      ctx.lineWidth = 2;
      ctx.fillStyle = '#1f2937'; // Gray-800
      ctx.font = '14px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      if (edge.from === edge.to) {
        const loopRadius = 20;
        const offset = ACCEPTING_RADIUS + 5;
        const loopCenterX = fromNode.x;
        const loopCenterY = fromNode.y - offset;
        const arrowAngle = Math.PI * 0.7;
        ctx.beginPath();
        ctx.arc(loopCenterX, loopCenterY, loopRadius, Math.PI * 0.6, Math.PI * 2.4);
        ctx.stroke();
        const arrowHeadX = loopCenterX - loopRadius * Math.cos(arrowAngle);
        const arrowHeadY = loopCenterY - loopRadius * Math.sin(arrowAngle);
        ctx.beginPath();
        ctx.moveTo(arrowHeadX, arrowHeadY);
        ctx.lineTo(arrowHeadX - 7 * Math.cos(arrowAngle - Math.PI / 4), arrowHeadY - 7 * Math.sin(arrowAngle - Math.PI / 4));
        ctx.lineTo(arrowHeadX - 7 * Math.cos(arrowAngle + Math.PI / 4), arrowHeadY - 7 * Math.sin(arrowAngle + Math.PI / 4));
        ctx.closePath();
        ctx.fill();
        // Label
        ctx.fillText(edge.label, loopCenterX, loopCenterY - loopRadius - 10);
      } else {
        const dx = toNode.x - fromNode.x;
        const dy = toNode.y - fromNode.y;
        const angle = Math.atan2(dy, dx);
        const fromX = fromNode.x + NODE_RADIUS * Math.cos(angle);
        const fromY = fromNode.y + NODE_RADIUS * Math.sin(angle);
        const toX = toNode.x - NODE_RADIUS * Math.cos(angle);
        
        const toY = toNode.y - NODE_RADIUS * Math.sin(angle);
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(toX, toY);
        ctx.lineTo(toX - 10 * Math.cos(angle - Math.PI / 6), toY - 10 * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(toX - 10 * Math.cos(angle + Math.PI / 6), toY - 10 * Math.sin(angle + Math.PI / 6));
        ctx.closePath();
        ctx.fill();

        const midX = (fromX + toX) / 2;
        const midY = (fromY + toY) / 2;

        const labelAngle = angle + Math.PI / 2;
        const labelX = midX + 10 * Math.cos(labelAngle);
        const labelY = midY + 10 * Math.sin(labelAngle);

        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(labelX - ctx.measureText(edge.label).width/2 - 5, labelY - 10, ctx.measureText(edge.label).width + 10, 20);
        ctx.fillStyle = '#1f2937';
        ctx.fillText(edge.label, labelX, labelY);
      }
    });

    nodes.forEach(node => {
      const isSelected = selectedNode === node.id;
      const isHovered = hoveredNode === node.id;
      const isEdgeStartNode = edgeStart === node.id;

      if (node.isStart) {
        ctx.strokeStyle = '#374151';
        ctx.lineWidth = 2;
        ctx.fillStyle = '#374151';

        const startX = node.x - ACCEPTING_RADIUS - 20;
        const endX = node.x - ACCEPTING_RADIUS;
        ctx.beginPath();
        ctx.moveTo(startX, node.y);
        ctx.lineTo(endX, node.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(endX, node.y);
        ctx.lineTo(endX - 8, node.y - 5);
        ctx.lineTo(endX - 8, node.y + 5);
        ctx.closePath();
        ctx.fill();
      }

      if (node.isAccepting) {
        ctx.strokeStyle = isSelected ? '#3b82f6' : '#64748b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(node.x, node.y, ACCEPTING_RADIUS, 0, Math.PI * 2);
        ctx.stroke();
      }
      // 3. Main circle
      ctx.fillStyle = isEdgeStartNode ? '#fcd34d' : (isHovered ? '#e5e7eb' : '#f9fafb');
      ctx.strokeStyle = isSelected ? '#3b82f6' : '#64748b';
      ctx.lineWidth = isSelected ? 4 : 2;
      ctx.beginPath();
      ctx.arc(node.x, node.y, NODE_RADIUS, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // 4. Label
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 16px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.label, node.x, node.y);
    });
  }, [nodes, edges, selectedNode, hoveredNode, mode, edgeStart, draggingNode]);

  useEffect(() => {
    drawGraph();
  }, [drawGraph]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvasContainerRef.current;
    if (!canvas || !container) return;
    const resizeObserver = new ResizeObserver(() => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      drawGraph();
    });
    resizeObserver.observe(container);
    return () => resizeObserver.unobserve(container);
  }, [drawGraph]);

  const getCanvasCoords = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const findNode = (x, y) => {
    return nodes.find(n =>
      Math.sqrt((n.x - x) ** 2 + (n.y - y) ** 2) < 25
    );
  };

  const handleCanvasClick = (e) => {
    const { x, y } = getCanvasCoords(e);
    const clickedNode = findNode(x, y);
    if (mode === 'addNode' && !clickedNode) {
      addNode(x, y);
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
      const { x, y } = getCanvasCoords(e);
      const clickedNode = findNode(x, y);
      if (clickedNode) {
        setDraggingNode(clickedNode.id);
      }
    }
  };

  const handleMouseMove = (e) => {
    const { x, y } = getCanvasCoords(e);
    const hovNode = findNode(x, y);
    setHoveredNode(hovNode ? hovNode.id : null);
    if (draggingNode !== null) {
      setNodes(nodes.map(n =>
        n.id === draggingNode ? { ...n, x, y } : n
      ));
    }
  };

  const handleMouseUp = () => {
    setDraggingNode(null);
  };

  const exportGraph = () => {
    const data = { nodes, edges };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fsa_graph.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importGraph = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          if (Array.isArray(data.nodes) && Array.isArray(data.edges)) {
            setNodes(data.nodes);
            setEdges(data.edges);
            setSelectedNode(null);
          } else {
            console.error("Invalid graph structure in file.");
          }
        } catch (error) {
          console.error("Error parsing JSON file:", error);
        }
      };
      reader.readAsText(file);
      e.target.value = null;
    }
  };

  const selectedNodeData = nodes.find(n => n.id === selectedNode);
  const selectedEdges = edges.filter(e => e.from === selectedNode || e.to === selectedNode);

  return (
    <div className="w-full min-h-screen flex flex-col font-sans bg-gray-50">

      {/* Top Toolbar */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center gap-4 flex-wrap shadow-md">
        <h1 className="text-xl font-extrabold text-blue-600 mr-4">FSA Designer</h1>

        <div className="flex gap-2">
          {[
            { key: 'select', icon: MousePointer, label: 'Select' },
            { key: 'addNode', icon: Plus, label: 'Add Node' },
            { key: 'addEdge', icon: Plus, label: 'Add Edge' },
            { key: 'move', icon: Move, label: 'Move/Drag' },
          ].map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => {
                setMode(key);
                setEdgeStart(null);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition duration-150 ease-in-out shadow-sm
                ${mode === key
                  ? 'bg-blue-600 text-white shadow-blue-400/50 hover:bg-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } flex items-center gap-2`}
            >
              <Icon size={18} /> {label}
            </button>
          ))}
        </div>

        <div className="flex gap-2 ml-auto">
          <button
            onClick={exportGraph}
            className="px-4 py-2 rounded-lg bg-green-500 text-white font-medium shadow-md shadow-green-400/50 hover:bg-green-600 transition duration-150 ease-in-out flex items-center gap-2"
          >
            <Download size={18} /> Export
          </button>
          <label className="px-4 py-2 rounded-lg bg-purple-500 text-white font-medium shadow-md shadow-purple-400/50 hover:bg-purple-600 transition duration-150 ease-in-out flex items-center gap-2 cursor-pointer">
            <Upload size={18} /> Import
            <input type="file" accept=".json" onChange={importGraph} className="hidden" />
          </label>
        </div>
      </div>

      <div className="flex-1 flex min-h-0">

        {/* graph viz */}
        <div ref={canvasContainerRef} className="flex-1 bg-gray-100 relative overflow-hidden shadow-inner">
          <canvas
            ref={canvasRef}
            className={`w-full h-full ${mode === 'addNode' ? 'cursor-crosshair' : (mode === 'move' ? 'cursor-move' : 'cursor-default')}`}
            onClick={handleCanvasClick}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          />
          {edgeStart !== null && (
            <div className="absolute top-2 left-2 p-2 bg-yellow-200 text-yellow-800 text-sm rounded-lg shadow-md">
              Connecting from: {nodes.find(n => n.id === edgeStart)?.label}. Click target node.
            </div>
          )}
        </div>

        <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto shadow-lg">
          <h3 className="font-bold text-xl text-gray-800 mb-6 border-b pb-2">Edit Properties</h3>

          {selectedNodeData ? (
            <div className="space-y-6">
              <h4 className="font-semibold text-lg text-blue-600">Node: {selectedNodeData.label} (ID: {selectedNode})</h4>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Node Label</label>
                <input
                  type="text"
                  value={selectedNodeData.label}
                  onChange={(e) => updateNodeLabel(selectedNode, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  aria-label="Node Label"
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg shadow-inner cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedNodeData.isAccepting}
                    onChange={() => toggleAccepting(selectedNode)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-800">Accepting State (Double Ring)</span>
                </label>
                <label className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg shadow-inner cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedNodeData.isStart}
                    onChange={() => setStartState(selectedNode)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-800">Start State (Initial State)</span>
                </label>
              </div>

              <button
                onClick={() => deleteNode(selectedNode)}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg font-semibold shadow-lg shadow-red-400/50 hover:bg-red-700 transition duration-150 ease-in-out flex items-center justify-center gap-2"
              >
                <Trash2 size={16} /> Delete Node
              </button>

              {selectedEdges.length > 0 && (
                <div className="mt-6 border-t pt-4">
                  <h4 className="font-semibold mb-3 text-gray-700">Connected Transitions</h4>
                  {selectedEdges.map(edge => (
                    <div key={edge.id} className="p-3 border border-gray-200 rounded-xl mb-3 bg-white shadow-sm">
                      <div className="text-xs text-gray-500 mb-1">
                        {nodes.find(n => n.id === edge.from)?.label} → {nodes.find(n => n.id === edge.to)?.label}
                      </div>
                      <div className="flex gap-2 items-center">
                        <input
                          type="text"
                          placeholder="Label (e.g., a, b, 0, 1, ε)"
                          value={edge.label}
                          onChange={(e) => updateEdgeLabel(edge.id, e.target.value)}
                          className="flex-1 px-2 py-1 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                          aria-label={`Edge label for transition ${edge.from} to ${edge.to}`}
                        />
                        <button
                          onClick={() => deleteEdge(edge.id)}
                          className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                          title="Delete Edge"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-sm italic">
              Click on a state in the canvas to view and edit its properties, or start by using the tools in the toolbar!
            </p>
          )}

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
        </div>
      </div>
    </div>
  );
}