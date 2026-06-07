const FCFS = (processes) => {
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

    if (currentIndex === -1 && processIndex >= 0) {
      currentIndex = processIndex;
      startTime = currentTime;
    }

    if (currentIndex >= 0 && processIndex >= 0 && currentIndex !== processIndex) {
      processes[currentIndex].ganttValues.push([startTime, currentTime]);
      currentIndex = processIndex;
      startTime = currentTime;
    }

    // Execute the selected process until completion
    const process = processes[currentIndex];
    if (currentTime < process.arrival) {
      currentTime = process.arrival; // If CPU is idle, skip to the process's arrival
    }
    currentTime += process.remaining;
    process.remaining = 0;
    completed++;

    // Record the last Gantt segment for the completed process
    process.ganttValues.push([startTime, currentTime]);

    // Set the completion time and calculate turnaround and waiting times
    process.completion = currentTime;
    process.turnaround = process.completion - process.arrival;
    process.waiting = process.turnaround - process.burst;

    // Store the completed process results
    result.push({
      id: process.id,
      arrival: process.arrival,
      burst: process.burst,
      completion: process.completion,
      turnaround: process.turnaround,
      waiting: process.waiting,
      completionPercentage: process.completionPercentage,
      ganttValues: process.ganttValues, // Save the Gantt chart
    });
  }

  console.log(result);
  return result;
};

function findNextProcess(processes, n, currentTime) {
  // Find the first process that has arrived and is not yet completed
  for (let i = 0; i < n; i++) {
    if (processes[i].arrival <= currentTime && processes[i].remaining > 0) {
      return i; // FCFS selects the first arrived process
    }
  }
  return -1; // No process is ready
}

export default FCFS;
