const SJF = (processes) => {
  const n = processes.length;
  let currentTime = 0;
  let completed = 0;
  let result = [];

  // Initialize the processes with their arrival, burst, and remaining burst times
  processes = processes.map((p) => ({
    id: p.id,
    arrival: parseInt(p.arrival, 10),
    burst: parseInt(p.burst, 10),
    remaining: parseInt(p.burst, 10),
    completion: 0,
    turnaround: 0,
    waiting: 0,
    ganttValues: [], // Stores start and end time pairs for Gantt chart
  }));

  // Sort processes by arrival time
  processes.sort((a, b) => a.arrival - b.arrival);

  while (completed < n) {
    // Find all processes that have arrived and are not completed
    const readyQueue = processes.filter(
      (p) => p.arrival <= currentTime && p.remaining > 0
    );

    if (readyQueue.length === 0) {
      // If no process is ready, increment time
      currentTime++;
      continue;
    }

    // Select the process with the shortest burst time
    readyQueue.sort((a, b) => a.remaining - b.remaining);
    const selectedProcess = readyQueue[0];

    // Record the Gantt chart value (start and end times)
    selectedProcess.ganttValues.push([currentTime, currentTime + selectedProcess.remaining]);

    // Execute the selected process
    currentTime += selectedProcess.remaining;
    selectedProcess.remaining = 0;
    selectedProcess.completion = currentTime;

    // Calculate turnaround time and waiting time
    selectedProcess.turnaround = selectedProcess.completion - selectedProcess.arrival;
    selectedProcess.waiting = selectedProcess.turnaround - selectedProcess.burst;

    // Update completed count
    completed++;

    // Store the completed process in the result array
    result.push({
      id: selectedProcess.id,
      arrival: selectedProcess.arrival,
      burst: selectedProcess.burst,
      completion: selectedProcess.completion,
      turnaround: selectedProcess.turnaround,
      waiting: selectedProcess.waiting,
      ganttValues: selectedProcess.ganttValues, // Save the Gantt chart
    });

    // Log process completion (for debugging purposes)
    console.log(`Process ${selectedProcess.id} completed at time ${currentTime}`);
  }

  return result;
};

export default SJF;
