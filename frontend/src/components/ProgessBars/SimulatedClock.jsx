import React, { useEffect, useState } from "react";
import ProgressBars from "./ProgressBars";
import "./SimulatedClock.css";

const SimulatedClock = ({ processes, tickRate = 1000 }) => {
  const [clock, setClock] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  // Reset and restart simulation
  const handleReplay = () => {
    setClock(0); // Reset clock
    setIsRunning(true); // Restart the clock
  };

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setClock((prevClock) => prevClock + 1);
    }, tickRate);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [isRunning, tickRate]);

  useEffect(() => {
    const allCompleted = processes.every((process) => {
      const lastEndTime = Math.max(
        ...process.ganttValues.map(([_, end]) => end)
      );
      return clock > lastEndTime;
    });

    if (allCompleted) {
      setIsRunning(false); // Stop the clock when all processes complete
    }
  }, [clock, processes]);

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <h3>Simulated Clock: {clock}s</h3>

        <button
          onClick={handleReplay}
          className="replay-btn"
          style={{
            backgroundColor: "#3498db",
            color: "white",
            border: "none",
            borderRadius: "5px",
            padding: "10px 5px",
            fontSize: "1rem",
            cursor: "pointer",
            minWidth: "20%",
          }}
        >
          Replay
        </button>
      </div>
      <ProgressBars processes={processes} clock={clock} />
    </>
  );
};

export default SimulatedClock;
