import "./Home.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const cpuAlgorithms = [
    {
      name: "First Come First Serve",
      path: "/FCFS",
      description:
        "Processes are executed in the order they arrive. Simple but can lead to long wait times.",
    },
    {
      name: "Shortest Job First",
      path: "/SJF",
      description:
        "Executes the job with the smallest burst time next. Efficient but may starve longer jobs.",
    },
    {
      name: "Shortest Remaining Time First",
      path: "/SRTF",
      description:
        "Preemptive version of SJF. Chooses the process with the least remaining time to execute.",
    },
    {
      name: "Priority Scheduling",
      path: "/Priority",
      description:
        "Executes processes based on priority. Higher priority means earlier execution.",
    },
    {
      name: "Round Robin Scheduling",
      path: "/RoundRobin",
      description:
        "Each process gets an equal time slice. Fair for all processes and prevents starvation.",
    },
  ];

  const sortingAlgorithms = [
    {
      name: "Array Sorting Algorithms",
      path: "/sorting",
      customContent: (
        <div>
          <h3 className="card-title">Sorting Algorithms</h3>
          <ul>
            <li>Bubble Sort</li>
            <li>Insertion Sort</li>
            <li>Selection Sort</li>
            <li>Quick Sort</li>
          </ul>
        </div>
      ),
    },
  ];

  const graphAlgorithms = [
    {
      name: "Graph Algorithms",
      path: "/graph",
      customContent: (
        <div>
          <h3 className="card-title">Graph Algorithms</h3>
          <ul>
            <li>Breadth First Search (BFS)</li>
            <li>Depth First Search (DFS)</li>
            <li>Dijkstra Algorithm</li>
            <li>Minimum Spanning Tree</li>
          </ul>
        </div>
      ),
    },
  ];

  return (
    <div className="home-container">
      <h1 className="title">CPU Scheduling Visualizer</h1>
      <div className="card-grid">
        {cpuAlgorithms.map((algo, index) => (
          <div key={index} className="card" onClick={() => navigate(algo.path)}>
            <h2 className="card-title">{algo.name}</h2>
            <p className="card-description">{algo.description}</p>
          </div>
        ))}
      </div>

      <h1 className="title">Sorting & Graph Algorithms</h1>
      <div className="dual-card-grid">
        {sortingAlgorithms.map((algo, index) => (
          <div key={index} className="card" onClick={() => navigate(algo.path)}>
            {algo.customContent}
          </div>
        ))}
        {graphAlgorithms.map((algo, index) => (
          <div key={index} className="card" onClick={() => navigate(algo.path)}>
            {algo.customContent}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
