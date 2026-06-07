import React from "react";

const getRandomColor = () => {
  // Generate highly saturated, modern colors
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 80%, 60%)`;
};

const GanttChart = ({ processes = [] }) => {
  // Define premium colors for processes
  const colors = [
    "#3b82f6", // Blue
    "#10b981", // Emerald
    "#f59e0b", // Amber
    "#ef4444", // Red
    "#8b5cf6", // Purple
    "#ec4899", // Pink
    "#06b6d4", // Cyan
    "#f97316", // Orange
    "#14b8a6", // Teal
    "#a855f7", // Light Purple
  ];

  // Create a color mapping based on process IDs
  const colorMap = {};
  processes.forEach((process) => {
    const colorIndex = parseInt(process.id.replace(/\D/g, ""), 10) - 1; // Extract number
    if (colorIndex >= 0 && colorIndex < colors.length) {
      colorMap[process.id] = colors[colorIndex];
    } else {
      colorMap[process.id] = getRandomColor();
    }
  });

  // Flatten and map processes to segments
  const ganttSegments = processes.flatMap((process) =>
    process.ganttValues.map(([start, end]) => ({
      id: process.id,
      start: parseInt(start, 10),
      end: parseInt(end, 10),
      color: colorMap[process.id],
    }))
  );

  // Sort segments by start time
  ganttSegments.sort((a, b) => a.start - b.start);

  // Build the timeline blocks, filling idle intervals
  const blocks = [];
  let lastTime = 0;

  ganttSegments.forEach((segment) => {
    // Fill idle gap
    if (segment.start > lastTime) {
      blocks.push({
        id: "Idle",
        start: lastTime,
        end: segment.start,
        color: "rgba(148, 163, 184, 0.15)", // Subtle slate gray for idle
        isIdle: true,
      });
    }

    // Add process execution block (skip redundant overlaps)
    if (segment.start >= lastTime && segment.end > segment.start) {
      blocks.push({
        id: segment.id,
        start: segment.start,
        end: segment.end,
        color: segment.color,
        isIdle: false,
      });
      lastTime = segment.end;
    }
  });

  const totalDuration = lastTime;

  if (blocks.length === 0) {
    return (
      <div style={{ color: "#94a3b8", textAlign: "center", padding: "20px" }}>
        No scheduling data to render.
      </div>
    );
  }

  return (
    <div style={{ width: "100%", padding: "10px 0" }}>
      {/* Gantt Timeline Blocks */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          borderRadius: "8px",
          overflow: "hidden",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          backgroundColor: "rgba(15, 23, 42, 0.3)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
          backdropFilter: "blur(10px)",
        }}
      >
        {blocks.map((block, index) => {
          const duration = block.end - block.start;
          // Percentage width representation
          const percentWidth = totalDuration > 0 ? (duration / totalDuration) * 100 : 0;

          return (
            <div
              key={`gantt-block-${index}`}
              style={{
                width: `${percentWidth}%`,
                backgroundColor: block.color,
                minWidth: "60px",
                height: "65px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                color: block.isIdle ? "#94a3b8" : "#ffffff",
                fontSize: "14px",
                fontWeight: "600",
                borderRight: index < blocks.length - 1 ? "1px solid rgba(0, 0, 0, 0.2)" : "none",
                transition: "all 0.3s ease",
                position: "relative",
              }}
              title={`${block.id} (${block.start}s - ${block.end}s)`}
            >
              <span>{block.id === "Idle" ? "Idle" : block.id}</span>
              <span
                style={{
                  fontSize: "10px",
                  opacity: 0.8,
                  fontWeight: "normal",
                  marginTop: "2px",
                }}
              >
                {duration}s
              </span>
            </div>
          );
        })}
      </div>

      {/* Gantt Timeline Labels / Grid ruler */}
      <div
        style={{
          display: "flex",
          width: "100%",
          position: "relative",
          marginTop: "6px",
          height: "20px",
        }}
      >
        {blocks.map((block, index) => {
          const duration = block.end - block.start;
          const percentWidth = totalDuration > 0 ? (duration / totalDuration) * 100 : 0;

          return (
            <div
              key={`gantt-label-${index}`}
              style={{
                width: `${percentWidth}%`,
                position: "relative",
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
                color: "#94a3b8",
                fontWeight: "500",
              }}
            >
              {/* Left boundary tick marker */}
              <span
                style={{
                  position: "absolute",
                  left: "0",
                  transform: "translateX(-50%)",
                }}
              >
                {block.start}
              </span>

              {/* Only show the last end-tick marker on the very last block to avoid overlap */}
              {index === blocks.length - 1 && (
                <span
                  style={{
                    position: "absolute",
                    right: "0",
                    transform: "translateX(50%)",
                  }}
                >
                  {block.end}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GanttChart;
