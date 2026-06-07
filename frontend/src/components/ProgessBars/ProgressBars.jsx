import GanttProgressBar from "./GanttProgressBar";

const ProgressBars = ({ processes, clock }) => {
  return (
    <div>
      {processes.map((process) => (
        <GanttProgressBar key={process.id} process={process} clock={clock} />
      ))}
    </div>
  );
};

export default ProgressBars;
