const RoundRobin = (processes, quantum) => {
  const n = processes.length;
  let currentTime = 0;
  let completed = 0;
  let queue = [];
  let result = [];

  // Initialize the processes with their attributes
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

  // Add processes arriving at time 0 to the queue
  queue.push(...processes.filter((p) => p.arrival <= currentTime));

  // While not all processes are completed
  while (completed < n) {
    if (queue.length === 0) {
      // If no processes are ready, increment time and add new arrivals
      currentTime++;
      queue.push(...processes.filter((p) => p.arrival === currentTime));
      continue;
    }

    // Dequeue the next process
    const process = queue.shift();

    if (currentIndex === -1 && process) {
      currentIndex = process.id;
      startTime = currentTime;
    }

    if (currentIndex !== -1 && process && currentIndex !== process.id) {
      processes.find((p) => p.id === currentIndex).ganttValues.push([
        startTime,
        currentTime,
      ]);
      currentIndex = process.id;
      startTime = currentTime;
    }

    // Execute the process for the quantum or until completion
    const timeSlice = Math.min(process.remaining, quantum);
    process.remaining -= timeSlice;
    currentTime += timeSlice;

    // Track completion percentage as the process runs
    process.completionPercentage.push(
      parseFloat(
        ((process.burst - process.remaining) / process.burst) * 100
      ).toFixed(2)
    );

    // Add new arrivals to the queue
    queue.push(
      ...processes.filter(
        (p) =>
          p.arrival > currentTime - timeSlice &&
          p.arrival <= currentTime &&
          p.remaining > 0 &&
          !queue.includes(p)
      )
    );

    // If the process is not finished, re-add it to the queue
    if (process.remaining > 0) {
      queue.push(process);
    } else {
      // If the process is finished, calculate metrics
      completed++;
      process.completion = currentTime;
      process.turnaround = process.completion - process.arrival;
      process.waiting = process.turnaround - process.burst;

      // Record the Gantt chart value for the completed process
      process.ganttValues.push([startTime, currentTime]);

      // Store completed process results
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
  }

  return result;
};

export default RoundRobin;
