import React from "react";

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const GanttChart = ({ processes = [] }) => {
  console.log("Processes received by GanttChart:", processes);

  // Define colors for up to 10 processes
  const colors = [
    "#FF5733",
    "#33FF57",
    "#3357FF",
    "#FFC300",
    "#DA33FF",
    "#33FFF5",
    "#FF33A8",
    "#A833FF",
    "#33A8FF",
    "#FF8C33",
  ];

  // Create a color mapping based on process IDs
  const colorMap = {};
  processes.forEach((process) => {
    const colorIndex = parseInt(process.id.replace("P", ""), 10) - 1; // Convert ID to number
    if (colorIndex >= 0 && colorIndex < colors.length) {
      colorMap[process.id] = colors[colorIndex];
    } else {
      colorMap[process.id] = getRandomColor(); // Dynamic color if out of bounds
    }
  });

  // Flatten and map processes to segments with proper color assignment
  const ganttSegments = processes.flatMap((process) =>
    process.ganttValues.map(([start, end]) => ({
      id: process.id,
      start,
      end,
      color: colorMap[process.id],
    }))
  );

  // Sort segments by start time
  ganttSegments.sort((a, b) => a.start - b.start);

  // Determine the overall timeline
  const maxTime =
    ganttSegments.length > 0
      ? Math.max(...ganttSegments.map((segment) => segment.end))
      : 0;
  const timeline = Array.from({ length: maxTime }, (_, i) => i);

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
        }}
      >
        {timeline.map((time) => {
          const activeSegment = ganttSegments.find(
            (segment) => time >= segment.start && time < segment.end
          );

          return (
            <div
              key={`time-slot-${time}`}
              style={{
                backgroundColor: activeSegment
                  ? activeSegment.color
                  : "#E0E0E0", // Idle color
                flex: "1 1 auto",
                minWidth: "30px", // Minimum size for each time slot
                height: "100px",
                border: "1px solid #000",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#000",
                fontSize: "12px",
              }}
            >
              {activeSegment ? `P${activeSegment.id.replace("P", "")}` : ""}
            </div>
          );
        })}
      </div>
      <div
        style={{
          marginTop: "10px",
          display: "flex",
          width: "100%",
        }}
      >
        {timeline.map((time) => (
          <div
            key={`time-label-${time}`}
            style={{
              flex: "1 1 auto",
              minWidth: "30px",
              // textAlign: "center",
              fontSize: "12px",
            }}
          >
            {time}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GanttChart;
