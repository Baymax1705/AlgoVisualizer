import React from "react";
import "./SchedulingMetrics.css";

const SchedulingMetrics = ({ processes = [] }) => {
  const totalWaitTime = processes.reduce((sum, p) => sum + (p.waiting || 0), 0);
  const totalTurnAroundTime = processes.reduce(
    (sum, p) => sum + (p.turnaround || 0),
    0
  );
  const totalCompletionTime = processes.reduce(
    (sum, p) => sum + (p.completion || 0),
    0
  );

  const avgWaitTime =
    processes.length > 0 ? totalWaitTime / processes.length : 0;
  const avgTurnAroundTime =
    processes.length > 0 ? totalTurnAroundTime / processes.length : 0;
  const avgCompletionTime =
    processes.length > 0 ? totalCompletionTime / processes.length : 0;

  return (
    <div>
      <h1 className="metric-header" style={{ margin: "7% 0" }}>Scheduling Metrics</h1>

      <div className="metrics-div">
        <strong>Average Wait Time:</strong> {avgWaitTime.toFixed(2)} s
      </div>
      <div className="metrics-div">
        <strong>Average Turn Around Time:</strong>{" "}
        {avgTurnAroundTime.toFixed(2)} s
      </div>
      <div className="metrics-div">
        <strong>Average Completion Time:</strong> {avgCompletionTime.toFixed(2)}{" "}
        s
      </div>
    </div>
  );
};

export default SchedulingMetrics;
