const Priority = (processes) => {
  const n = processes.length;
  let currentTime = 0;
  let completed = 0;
  let result = [];

  // Initialize the processes with their arrival, burst, priority, and remaining times
  processes = processes.map((p) => ({
    id: p.id,
    arrival: parseInt(p.arrival, 10),
    burst: parseInt(p.burst, 10),
    priority: parseInt(p.priority, 10),
    remaining: parseInt(p.burst, 10),
    completion: 0,
    turnaround: 0,
    waiting: 0,
    completionPercentage: [],
    ganttValues: [],
  }));

  // Sort processes by arrival time
  processes.sort((a, b) => a.arrival - b.arrival);

  let currentIndex = -1;
  let startTime = 0;

  // While not all processes are completed
  while (completed < n) {
    let processIndex = findNextProcessByPriority(processes, n, currentTime);

    if (processIndex === -1) {
      // No process is ready to run, increment the time
      currentIndex = processIndex;
      currentTime++;
      continue;
    }

    if (currentIndex === -1 && processIndex >= 0) {
      currentIndex = processIndex;
      startTime = currentTime;
    }

    if (currentIndex >= 0 && processIndex >= 0 && currentIndex !== processIndex) {
      processes[currentIndex].ganttValues.push([startTime, currentTime]);
      currentIndex = processIndex;
      startTime = currentTime;
    }

    // Execute the selected process for 1 unit of time
    processes[currentIndex].remaining--;

    // Track completion percentage as the process runs
    processes[currentIndex].completionPercentage.push(
      parseFloat(
        ((processes[currentIndex].burst - processes[currentIndex].remaining) /
          processes[currentIndex].burst) *
          100
      ).toFixed(2)
    );

    currentTime++;
    // If the process has completed execution
    if (processes[currentIndex].remaining === 0) {
      completed++;

      // Record the last Gantt segment for the completed process
      processes[currentIndex].ganttValues.push([startTime, currentTime]);

      // Set the completion time and calculate turnaround and waiting times
      processes[currentIndex].completion = currentTime;
      processes[currentIndex].turnaround =
        processes[currentIndex].completion - processes[currentIndex].arrival;
      processes[currentIndex].waiting =
        processes[currentIndex].turnaround - processes[currentIndex].burst;

      // Store the completed process results
      result.push({
        id: processes[currentIndex].id,
        arrival: processes[currentIndex].arrival,
        burst: processes[currentIndex].burst,
        priority: processes[currentIndex].priority,
        completion: processes[currentIndex].completion,
        turnaround: processes[currentIndex].turnaround,
        waiting: processes[currentIndex].waiting,
        completionPercentage: processes[currentIndex].completionPercentage,
        ganttValues: processes[currentIndex].ganttValues, // Save the Gantt chart
      });
    }
  }
  return result;
};

function findNextProcessByPriority(processes, n, currentTime) {
  // Find the process with the highest priority (lowest priority number) among arrived and not completed processes
  let highestPriority = Number.MAX_VALUE;
  let returnIndex = -1;
  for (let i = 0; i < n; i++) {
    if (
      processes[i].arrival <= currentTime && // Process has arrived
      processes[i].remaining > 0 && // Process hasn't completed
      processes[i].priority < highestPriority // Find the highest priority
    ) {
      returnIndex = i;
      highestPriority = processes[i].priority;
    }
  }
  return returnIndex;
}

export default Priority;
