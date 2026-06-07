# AlgoVisualizer

**AlgoVisualizer** is an interactive, premium single-page web application designed to visualize and understand algorithms. It features interactive simulators for **CPU Scheduling**, **Array Sorting**, and **Graph Pathfinding** algorithms.

Built with **React**, **Vite**, and **Tailwind CSS**, the app runs entirely client-side with smooth animations and responsive controls.

---

## Features & Modules

### 1. CPU Scheduling Visualizer
Simulate process execution timelines and calculate scheduling metrics in real-time.
*   **Algorithms Supported**:
    *   First-Come, First-Served (FCFS)
    *   Shortest Job First (SJF)
    *   Shortest Remaining Time First (SRTF)
    *   Priority Scheduling (Preemptive)
    *   Round Robin Scheduling (RR)
*   **Visualization Outputs**:
    *   **Proportional Gantt Chart**: Automatically calculates and renders duration-based blocks with percentage width and idle-time gap highlights.
    *   **Live Output Table**: Displays Arrival, Burst, Completion, Turnaround, and Waiting times for each process.
    *   **Metrics Panel**: Computes Average Waiting, Turnaround, and Completion times.
    *   **Simulated Clock & Progress Bars**: Plays a tick-by-tick playback animation of active processes.

### 2. Array Sorting Visualizer
Visualize data sorting mechanisms step-by-step.
*   **Algorithms Supported**: Bubble Sort, Selection Sort, Insertion Sort, and Quick Sort.
*   **Interactive Controls**: Change array size (number of bars) and animation speed delay in real-time.
*   **Visual States**: Highlight active elements being compared/swapped (red) and finished sorted elements (green).

### 3. Graph Pathfinding Visualizer
Explore search and pathfinding traversals on a 2D interactive grid.
*   **Algorithms Supported**: Dijkstra's Algorithm, A* Search, Breadth First Search (BFS), and Depth First Search (DFS).
*   **Interactive Grid**: Click and drag to paint walls, drag-and-drop the Start/Target nodes, and switch between Weighted (custom node weights) and Unweighted grids.
*   **Traversals**: Animated scan passes showing the visited frontier nodes (purple) and drawing the optimal shortest path (gold).

---

## Tech Stack

*   **Framework**: React (v18)
*   **Build Tool**: Vite
*   **Styling**: Tailwind CSS (v4) & CSS Variables
*   **Routing**: React Router DOM (v6)

---

## Installation & Setup

1.  **Navigate to the frontend directory**:
    ```bash
    cd frontend
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Start the development server**:
    ```bash
    npm run dev
    ```

4.  **Open in your browser**:
    Navigate to `http://localhost:5173`.

---

## Screenshots

<div align="center">
  <img src="./screenshots/Screenshot%202024-11-28%20at%206.24.41%E2%80%AFAM.png" alt="CPU Scheduling" width="400px">
  <img src="./screenshots/Screenshot%202024-11-28%20at%206.26.22%E2%80%AFAM.png" alt="Process Simulation" width="400px">
  <br>
  <img src="./screenshots/Screenshot%202024-11-28%20at%206.26.34%E2%80%AFAM.png" alt="Metrics Table" width="600px">
</div>

---

## Contributing

Contributions are welcome! To contribute:
1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/amazing-feature`).
3.  Commit your changes (`git commit -m 'Add amazing feature'`).
4.  Push to the branch (`git push origin feature/amazing-feature`).
5.  Open a Pull Request.
