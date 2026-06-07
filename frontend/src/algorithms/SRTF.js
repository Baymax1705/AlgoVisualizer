const SRTF = (processes) => {
  const n = processes.length;
  let currentTime = 0;
  let completed = 0;
  let result = [];

  // Initialize the processes with their arrival, burst, and remaining times
  processes = processes.map((p) => ({
    id: p.id,
    arrival: parseInt(p.arrival, 10),
    burst: parseInt(p.burst, 10),
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
    let processIndex = findNextProcess(processes, n, currentTime);

    if (processIndex === -1) {
      // No process is ready to run, increment the time
      currentIndex = processIndex;
      currentTime++;
      continue;
    }

    if (currentIndex === -1 && processIndex >= 0){
      currentIndex = processIndex;
      startTime = currentTime;
    }

    if (currentIndex>=0 && processIndex>=0 && currentIndex !== processIndex){
      processes[currentIndex].ganttValues.push([startTime, currentTime]);
      currentIndex = processIndex;
      startTime = currentTime;
    }

    // Execute the selected process for 1 unit of time
    processes[currentIndex].remaining--;

    // Track completion percentage as the process runs
    // processes[currentIndex].completionPercentage.push(
    //   parseFloat(
    //     (
    //       (1 - processes[currentIndex].remaining / processes[currentIndex].burst) * 100
    //     ).toFixed(2)
    //   )
    // );

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
        completion: processes[currentIndex].completion,
        turnaround: processes[currentIndex].turnaround,
        waiting: processes[currentIndex].waiting,
        completionPercentage: processes[currentIndex].completionPercentage,
        ganttValues: processes[currentIndex].ganttValues, // Save the Gantt chart
      });
    }
  }
  console.log(result);
  return result;
};

function findNextProcess(processes, n, currentTime) {
  // Find the process with the shortest remaining time that has arrived
  let minRemainingTime = Number.MAX_VALUE;
  let returnIndex = -1;
  for (let i = 0; i < n; i++) {
    if (
      processes[i].arrival <= currentTime && // Process has arrived
      processes[i].remaining > 0 && // Process hasn't completed
      processes[i].remaining < minRemainingTime // Find the shortest remaining time
    ) {
      returnIndex = i;
      minRemainingTime = processes[i].remaining;
    }
  }
  return returnIndex;
}

export default SRTF;