import "./App.css";
import Home from "./components/Home/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AlgorithmPage from "./pages/AlgorithmPage/AlgorithmPage";
import SortingPage from "./components/Sorting/SortingPage";
import GraphPage from "./components/Graph/GraphPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/FCFS"
            element={<AlgorithmPage algorithmName="FCFS" />}
          />
          <Route path="/SJF" element={<AlgorithmPage algorithmName="SJF" />} />
          <Route
            path="/SRTF"
            element={<AlgorithmPage algorithmName="SRTF" />}
          />
          <Route
            path="/Priority"
            element={<AlgorithmPage algorithmName="Priority" />}
          />
          <Route
            path="/RoundRobin"
            element={<AlgorithmPage algorithmName="RoundRobin" />}
          />

          {/* ✅ New Route for Sorting Visualizer */}
          <Route path="/sorting" element={<SortingPage />} />
          <Route path="/graph" element={<GraphPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
