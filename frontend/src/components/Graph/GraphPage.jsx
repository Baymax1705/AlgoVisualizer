import React, { useState, useEffect, useRef } from "react";

const GraphPage = () => {
  const [grid, setGrid] = useState([]);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [dragType, setDragType] = useState(null); // 'start', 'end', 'wall', 'clear'
  const [startNode, setStartNode] = useState({ row: 10, col: 10 });
  const [endNode, setEndNode] = useState({ row: 10, col: 30 });
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [speed, setSpeed] = useState(15); // delay in ms
  const [algo, setAlgo] = useState("dijkstra");
  const [weightType, setWeightType] = useState("unweighted");

  const gridRef = useRef([]);

  // Helper to sleep/delay execution
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Initialize nodes grid
  const initializeGrid = (customStart = startNode, customEnd = endNode) => {
    const nodes = [];
    for (let r = 0; r < 20; r++) {
      const row = [];
      for (let c = 0; c < 40; c++) {
        row.push({
          row: r,
          col: c,
          isStart: r === customStart.row && c === customStart.col,
          isEnd: r === customEnd.row && c === customEnd.col,
          isWall: false,
          isVisited: false,
          isShortestPath: false,
          weight: weightType === "weighted" ? Math.floor(Math.random() * 5) + 2 : 1,
          cost: Infinity,
          parent: null,
        });
      }
      nodes.push(row);
    }
    setGrid(nodes);
    gridRef.current = nodes;
  };

  useEffect(() => {
    initializeGrid();
  }, [weightType]);

  // Handle weightType update and reset walls
  const handleWeightChange = (e) => {
    if (isVisualizing) return;
    setWeightType(e.target.value);
  };

  // Dragging and wall handlers
  const handleMouseDown = (row, col) => {
    if (isVisualizing) return;
    setIsMouseDown(true);
    const node = grid[row][col];
    if (node.isStart) {
      setDragType("start");
    } else if (node.isEnd) {
      setDragType("end");
    } else {
      const isWall = node.isWall;
      setDragType(isWall ? "clear" : "wall");
      toggleWall(row, col, !isWall);
    }
  };

  const handleMouseEnter = (row, col) => {
    if (!isMouseDown || isVisualizing) return;
    const node = grid[row][col];

    if (dragType === "start") {
      if (node.isEnd || node.isWall) return;
      updateStartNode(row, col);
    } else if (dragType === "end") {
      if (node.isStart || node.isWall) return;
      updateEndNode(row, col);
    } else if (dragType === "wall") {
      if (node.isStart || node.isEnd) return;
      toggleWall(row, col, true);
    } else if (dragType === "clear") {
      if (node.isStart || node.isEnd) return;
      toggleWall(row, col, false);
    }
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
    setDragType(null);
  };

  const toggleWall = (row, col, value) => {
    const newGrid = grid.map((r) =>
      r.map((node) => {
        if (node.row === row && node.col === col) {
          return { ...node, isWall: value };
        }
        return node;
      })
    );
    setGrid(newGrid);
    gridRef.current = newGrid;
  };

  const updateStartNode = (row, col) => {
    const newGrid = grid.map((r) =>
      r.map((node) => ({
        ...node,
        isStart: node.row === row && node.col === col,
      }))
    );
    setStartNode({ row, col });
    setGrid(newGrid);
    gridRef.current = newGrid;
  };

  const updateEndNode = (row, col) => {
    const newGrid = grid.map((r) =>
      r.map((node) => ({
        ...node,
        isEnd: node.row === row && node.col === col,
      }))
    );
    setEndNode({ row, col });
    setGrid(newGrid);
    gridRef.current = newGrid;
  };

  // Helper to fetch neighbors
  const getNeighbors = (node, currentGrid) => {
    const neighbors = [];
    const { row, col } = node;
    if (row > 0) neighbors.push(currentGrid[row - 1][col]);
    if (row < currentGrid.length - 1) neighbors.push(currentGrid[row + 1][col]);
    if (col > 0) neighbors.push(currentGrid[row][col - 1]);
    if (col < currentGrid[0].length - 1) neighbors.push(currentGrid[row][col + 1]);
    return neighbors.filter((neighbor) => !neighbor.isWall);
  };

  // Dijkstra path solver
  const solveDijkstra = (currentGrid) => {
    const visitedNodesInOrder = [];
    const nodes = [];

    for (let r = 0; r < currentGrid.length; r++) {
      for (let c = 0; c < currentGrid[0].length; c++) {
        currentGrid[r][c].cost = Infinity;
        currentGrid[r][c].parent = null;
        nodes.push(currentGrid[r][c]);
      }
    }

    const startInGrid = currentGrid[startNode.row][startNode.col];
    startInGrid.cost = 0;

    const unvisited = [...nodes];

    while (unvisited.length > 0) {
      unvisited.sort((a, b) => a.cost - b.cost);
      const closest = unvisited.shift();

      if (closest.isWall) continue;
      if (closest.cost === Infinity) break;

      visitedNodesInOrder.push(closest);

      if (closest.row === endNode.row && closest.col === endNode.col) break;

      const neighbors = getNeighbors(closest, currentGrid);
      for (const neighbor of neighbors) {
        const edgeWeight = weightType === "weighted" ? neighbor.weight : 1;
        const tentative = closest.cost + edgeWeight;
        if (tentative < neighbor.cost) {
          neighbor.cost = tentative;
          neighbor.parent = closest;
        }
      }
    }

    const path = [];
    let current = currentGrid[endNode.row][endNode.col];
    while (current !== null) {
      path.unshift(current);
      current = current.parent;
    }

    return { visitedNodesInOrder, shortestPath: path };
  };

  // A* path solver
  const solveAStar = (currentGrid) => {
    const visitedNodesInOrder = [];
    const openSet = [];

    for (let r = 0; r < currentGrid.length; r++) {
      for (let c = 0; c < currentGrid[0].length; c++) {
        currentGrid[r][c].cost = Infinity; // cost as gScore
        currentGrid[r][c].parent = null;
      }
    }

    const startInGrid = currentGrid[startNode.row][startNode.col];
    startInGrid.cost = 0;
    openSet.push(startInGrid);

    while (openSet.length > 0) {
      // Sort by fScore = gScore + hScore (Manhattan Distance)
      openSet.sort((a, b) => {
        const fA = a.cost + Math.abs(a.row - endNode.row) + Math.abs(a.col - endNode.col);
        const fB = b.cost + Math.abs(b.row - endNode.row) + Math.abs(b.col - endNode.col);
        return fA - fB;
      });

      const current = openSet.shift();
      if (current.isWall) continue;

      visitedNodesInOrder.push(current);

      if (current.row === endNode.row && current.col === endNode.col) break;

      const neighbors = getNeighbors(current, currentGrid);
      for (const neighbor of neighbors) {
        const edgeWeight = weightType === "weighted" ? neighbor.weight : 1;
        const tentativeG = current.cost + edgeWeight;
        if (tentativeG < neighbor.cost) {
          neighbor.cost = tentativeG;
          neighbor.parent = current;
          if (!openSet.includes(neighbor)) {
            openSet.push(neighbor);
          }
        }
      }
    }

    const path = [];
    let current = currentGrid[endNode.row][endNode.col];
    while (current !== null) {
      path.unshift(current);
      current = current.parent;
    }

    return { visitedNodesInOrder, shortestPath: path };
  };

  // BFS path solver (unweighted queue)
  const solveBFS = (currentGrid) => {
    const visitedNodesInOrder = [];
    const queue = [];

    for (let r = 0; r < currentGrid.length; r++) {
      for (let c = 0; c < currentGrid[0].length; c++) {
        currentGrid[r][c].parent = null;
      }
    }

    const startInGrid = currentGrid[startNode.row][startNode.col];
    queue.push(startInGrid);
    const visited = new Set([`${startNode.row},${startNode.col}`]);

    while (queue.length > 0) {
      const current = queue.shift();
      visitedNodesInOrder.push(current);

      if (current.row === endNode.row && current.col === endNode.col) break;

      const neighbors = getNeighbors(current, currentGrid);
      for (const neighbor of neighbors) {
        const id = `${neighbor.row},${neighbor.col}`;
        if (!visited.has(id)) {
          visited.add(id);
          neighbor.parent = current;
          queue.push(neighbor);
        }
      }
    }

    const path = [];
    let current = currentGrid[endNode.row][endNode.col];
    while (current !== null) {
      path.unshift(current);
      current = current.parent;
    }

    return { visitedNodesInOrder, shortestPath: path };
  };

  // DFS path solver (unweighted stack)
  const solveDFS = (currentGrid) => {
    const visitedNodesInOrder = [];
    const stack = [];

    for (let r = 0; r < currentGrid.length; r++) {
      for (let c = 0; c < currentGrid[0].length; c++) {
        currentGrid[r][c].parent = null;
      }
    }

    const startInGrid = currentGrid[startNode.row][startNode.col];
    stack.push(startInGrid);
    const visited = new Set([`${startNode.row},${startNode.col}`]);

    while (stack.length > 0) {
      const current = stack.pop();
      visitedNodesInOrder.push(current);

      if (current.row === endNode.row && current.col === endNode.col) break;

      const neighbors = getNeighbors(current, currentGrid);
      for (const neighbor of neighbors) {
        const id = `${neighbor.row},${neighbor.col}`;
        if (!visited.has(id)) {
          visited.add(id);
          neighbor.parent = current;
          stack.push(neighbor);
        }
      }
    }

    const path = [];
    let current = currentGrid[endNode.row][endNode.col];
    while (current !== null) {
      path.unshift(current);
      current = current.parent;
    }

    return { visitedNodesInOrder, shortestPath: path };
  };

  // Visualizer main triggers
  const handleStart = async () => {
    if (isVisualizing) return;
    setIsVisualizing(true);

    // Deep clone grid state for solver computations
    const currentGrid = grid.map((r) => r.map((node) => ({ ...node, isVisited: false, isShortestPath: false })));

    let solverResult;
    if (algo === "dijkstra") {
      solverResult = solveDijkstra(currentGrid);
    } else if (algo === "astar") {
      solverResult = solveAStar(currentGrid);
    } else if (algo === "bfs") {
      solverResult = solveBFS(currentGrid);
    } else if (algo === "dfs") {
      solverResult = solveDFS(currentGrid);
    }

    const { visitedNodesInOrder, shortestPath } = solverResult;

    // Reset visualization states in actual grid
    let animationGrid = grid.map((r) =>
      r.map((node) => ({
        ...node,
        isVisited: false,
        isShortestPath: false,
      }))
    );
    setGrid(animationGrid);

    // Animate visited traversal
    for (let i = 0; i < visitedNodesInOrder.length; i++) {
      const visitedNode = visitedNodesInOrder[i];
      if (visitedNode.isStart || visitedNode.isEnd) continue;

      animationGrid = animationGrid.map((r) =>
        r.map((node) => {
          if (node.row === visitedNode.row && node.col === visitedNode.col) {
            return { ...node, isVisited: true };
          }
          return node;
        })
      );
      setGrid(animationGrid);
      await sleep(speed);
    }

    // Animate shortest path
    if (shortestPath.length > 1 && shortestPath[0].isStart) {
      for (let i = 0; i < shortestPath.length; i++) {
        const pathNode = shortestPath[i];
        if (pathNode.isStart || pathNode.isEnd) continue;

        animationGrid = animationGrid.map((r) =>
          r.map((node) => {
            if (node.row === pathNode.row && node.col === pathNode.col) {
              return { ...node, isShortestPath: true };
            }
            return node;
          })
        );
        setGrid(animationGrid);
        await sleep(speed * 2);
      }
    }

    setIsVisualizing(false);
  };

  // Reload/Reset Grid
  const handleReload = () => {
    if (isVisualizing) return;
    initializeGrid();
  };

  // Clear animation path, preserve walls
  const handleClearPath = () => {
    if (isVisualizing) return;
    const newGrid = grid.map((r) =>
      r.map((node) => ({
        ...node,
        isVisited: false,
        isShortestPath: false,
      }))
    );
    setGrid(newGrid);
    gridRef.current = newGrid;
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px 20px",
        minHeight: "calc(100vh - 70px)",
        color: "#f8fafc",
      }}
      onMouseUp={handleMouseUp}
    >
      <h1
        style={{
          fontSize: "2.2rem",
          fontWeight: "800",
          marginBottom: "30px",
          background: "linear-gradient(135deg, #38bdf8, #818cf8)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Graph Pathfinding Visualizer
      </h1>

      {/* Control Panel */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "24px",
          justifyContent: "center",
          alignItems: "center",
          background: "rgba(30, 41, 59, 0.45)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "16px",
          padding: "20px 30px",
          maxWidth: "1100px",
          width: "100%",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
          marginBottom: "35px",
        }}
      >
        {/* Dropdown for Algorithm */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Algorithm</label>
          <select
            value={algo}
            onChange={(e) => setAlgo(e.target.value)}
            disabled={isVisualizing}
            style={{
              padding: "10px 14px",
              background: "rgba(15, 23, 42, 0.6)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "8px",
              color: "#f8fafc",
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="dijkstra">Dijkstra's Algorithm</option>
            <option value="astar">A* Search</option>
            <option value="bfs">Breadth First Search (BFS)</option>
            <option value="dfs">Depth First Search (DFS)</option>
          </select>
        </div>

        {/* Dropdown for Weight Type */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Grid Mode</label>
          <select
            value={weightType}
            onChange={handleWeightChange}
            disabled={isVisualizing}
            style={{
              padding: "10px 14px",
              background: "rgba(15, 23, 42, 0.6)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "8px",
              color: "#f8fafc",
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="unweighted">Unweighted Grid</option>
            <option value="weighted">Weighted Grid</option>
          </select>
        </div>

        {/* Speed Slider */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px", minWidth: "160px" }}>
          <label style={{ fontSize: "0.85rem", color: "#94a3b8", display: "flex", justifyContent: "space-between" }}>
            <span>Visualization Speed</span>
            <span>{speed}ms</span>
          </label>
          <input
            type="range"
            min="1"
            max="100"
            value={speed}
            onChange={(e) => setSpeed(parseInt(e.target.value))}
            style={{
              cursor: "pointer",
              accentColor: "#38bdf8",
            }}
          />
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
          <button
            onClick={handleStart}
            disabled={isVisualizing}
            style={{
              backgroundColor: isVisualizing ? "rgba(56, 189, 248, 0.2)" : "#38bdf8",
              color: isVisualizing ? "#94a3b8" : "#090d16",
              border: "none",
              borderRadius: "8px",
              padding: "10px 20px",
              fontWeight: "600",
              cursor: isVisualizing ? "not-allowed" : "pointer",
              boxShadow: isVisualizing ? "none" : "0 4px 15px rgba(56, 189, 248, 0.2)",
              transition: "all 0.3s ease",
            }}
          >
            START
          </button>
          <button
            onClick={handleClearPath}
            disabled={isVisualizing}
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              color: "#e2e8f0",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              borderRadius: "8px",
              padding: "10px 18px",
              fontWeight: "600",
              cursor: isVisualizing ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
            }}
          >
            CLEAR PATH
          </button>
          <button
            onClick={handleReload}
            disabled={isVisualizing}
            style={{
              backgroundColor: "rgba(239, 68, 68, 0.15)",
              color: "#f87171",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              borderRadius: "8px",
              padding: "10px 18px",
              fontWeight: "600",
              cursor: isVisualizing ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
            }}
          >
            RESET GRID
          </button>
        </div>
      </div>

      {/* Grid Guide */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          fontSize: "0.85rem",
          color: "#94a3b8",
          marginBottom: "20px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: "16px", height: "16px", borderRadius: "4px", backgroundColor: "#38bdf8" }} /> Start
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: "16px", height: "16px", borderRadius: "4px", backgroundColor: "#f43f5e" }} /> Target
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: "16px", height: "16px", borderRadius: "4px", backgroundColor: "#ffffff" }} /> Wall
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: "16px", height: "16px", borderRadius: "4px", backgroundColor: "rgba(139, 92, 246, 0.45)" }} /> Visited
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: "16px", height: "16px", borderRadius: "4px", backgroundColor: "#fbbf24" }} /> Path
        </div>
        {weightType === "weighted" && (
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{ width: "16px", height: "16px", borderRadius: "4px", backgroundColor: "rgba(30, 41, 59, 0.6)", border: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", color: "#38bdf8" }}>5</div> Weight
          </div>
        )}
      </div>

      {/* 2D Interactive Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateRows: "repeat(20, 1fr)",
          background: "rgba(15, 23, 42, 0.35)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "16px",
          padding: "12px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.35)",
          overflow: "auto",
          maxWidth: "100%",
        }}
      >
        {grid.map((row, rIdx) => (
          <div key={`row-${rIdx}`} style={{ display: "flex", flexDirection: "row" }}>
            {row.map((node, cIdx) => {
              const { isStart, isEnd, isWall, isVisited, isShortestPath, weight } = node;

              // Compute color codes for node states
              let bg = "rgba(15, 23, 42, 0.35)";
              let border = "1px solid rgba(255, 255, 255, 0.05)";

              if (isStart) {
                bg = "#38bdf8"; // Cyan
                border = "1px solid #38bdf8";
              } else if (isEnd) {
                bg = "#f43f5e"; // Rose
                border = "1px solid #f43f5e";
              } else if (isWall) {
                bg = "#f8fafc"; // Wall white
                border = "1px solid #f8fafc";
              } else if (isShortestPath) {
                bg = "#fbbf24"; // Amber/Gold path
                border = "1px solid #fbbf24";
              } else if (isVisited) {
                bg = "rgba(139, 92, 246, 0.45)"; // Translucent Purple
                border = "1px solid rgba(139, 92, 246, 0.3)";
              }

              return (
                <div
                  key={`node-${rIdx}-${cIdx}`}
                  onMouseDown={() => handleMouseDown(rIdx, cIdx)}
                  onMouseEnter={() => handleMouseEnter(rIdx, cIdx)}
                  style={{
                    width: "22px",
                    height: "22px",
                    backgroundColor: bg,
                    border: border,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "9px",
                    fontWeight: "700",
                    color: "#38bdf8",
                    cursor: isStart || isEnd ? "grab" : "crosshair",
                    userSelect: "none",
                    transition: isVisited || isShortestPath ? "background-color 0.2s ease, transform 0.15s ease" : "none",
                  }}
                  title={
                    isStart
                      ? "Start Node (Drag me!)"
                      : isEnd
                      ? "Target Node (Drag me!)"
                      : `Node (${rIdx}, ${cIdx}) ${weightType === "weighted" ? `Weight: ${weight}` : ""}`
                  }
                >
                  {weightType === "weighted" && !isStart && !isEnd && !isWall && !isShortestPath && !isVisited
                    ? weight
                    : ""}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GraphPage;
