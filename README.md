# CPU Scheduling Visualizer

An interactive web application to visualize and understand various CPU scheduling algorithms. This project aims to help learn about how scheduling works in operating systems through dynamic, graphical representations of different algorithms.

## Features

- **Algorithms Supported**:

  - First-Come, First-Served (FCFS)
  - Shortest Job First (SJF)
  - Shortest Remaining Time First (SRTF)
  - Priority Scheduling
  - Round Robin Scheduling (RR)

- **Visualization Tools**:

  - Gantt Chart to depict scheduling processes.
  - Progress bars to visualise the process execution and waiting with a simulated clock.
  - CPU utilization and average waiting/turnaround time calculations.

- **User Interaction**:
  - Input processes with custom arrival time, burst time, priority, and time quantum.
  - Modify scheduling parameters and observe the effects on scheduling behavior.

## Tech Stack

- **Frontend**:
  - ReactJS
  - CSS/Bootstrap for styling
- **Backend**:
  - Javascript
  - C for scheduling logic integration

## Installation

1. Setup the project files:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Start the application:

   ```
   npm run dev
   ```

4. Open the application in your browser:

   ```
   http://localhost:5173
   ```

## Usage

- Choose a scheduling algorithm from the home page.
- Input the number of processes and their parameters (e.g., arrival time, burst time, priority, etc.).
- View the Gantt chart and other statistics generated for the selected algorithm.
- Experiment with different scheduling strategies and parameters to compare results.

## Screenshots

<img src="./screenshots/Screenshot%202024-11-28%20at%206.24.41%E2%80%AFAM.png" alt="CPU Scheduling Visualization" width="400px" >
<img src="./screenshots/Screenshot%202024-11-28%20at%206.26.22%E2%80%AFAM.png" alt="CPU Scheduling Visualization" width="400px" >
<img src="./screenshots/Screenshot%202024-11-28%20at%206.26.34%E2%80%AFAM.png" alt="CPU Scheduling Visualization" width="800px" >
<img src="./screenshots/Screenshot%202024-11-28%20at%206.26.42%E2%80%AFAM.png" alt="CPU Scheduling Visualization" width="800px" >

## Contributing

Contributions are welcome! If you'd like to contribute, follow these steps:

1. Create a new branch for your feature or bugfix:

   ```bash
   git checkout -b feature-name
   ```

2. Commit your changes.

3. Open a pull request.

## Acknowledgments

- Developed as part of the Operating Systems Lab Project.

