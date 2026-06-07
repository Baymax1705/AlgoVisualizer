import { useState, useEffect } from "react";

const GanttProgressBar = ({ process, clock }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const calculateProgress = () => {
      let totalDuration = 0; // Total execution time of this process
      let executedDuration = 0; // Time this process has already executed

      process.ganttValues.forEach(([start, end]) => {
        if (clock >= start && clock <= end) {
          // Clock is within the current range
          executedDuration += clock - start;
        } else if (clock > end) {
          // Clock is past the current range
          executedDuration += end - start;
        }

        totalDuration += end - start;
      });

      // Avoid division by zero
      return totalDuration ? (executedDuration / totalDuration) * 100 : 0;
    };

    setProgress(calculateProgress());
  }, [clock, process]);

  return (
    <div style={{ marginBottom: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "2%",
        }}
      >
        <div>{`Process ${process.id}`}</div>
        <div>{progress.toFixed(2)}%</div>
      </div>
      <div
        style={{
          border: "1px solid #000000",
          width: "100%",
          position: "relative",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            backgroundColor: "#4caf50",
            height: "20px",
            transition: "width 0.5s linear",
          }}
        />
      </div>
    </div>
  );
};

export default GanttProgressBar;
