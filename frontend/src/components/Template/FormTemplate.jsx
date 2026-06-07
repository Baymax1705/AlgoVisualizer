import React, { useState } from "react";
import "./FormTemplate.css";

const FormTemplate = ({ algorithm, setOutput, calculateAlgorithm }) => {
  const [processes, setProcesses] = useState([
    { id: "", arrival: "", burst: "", priority: "" },
  ]);
  const [quantum, setQuantum] = useState("");

  const fieldsByAlgorithm = {
    FCFS: ["Process ID", "Arrival Time", "Burst Time"],
    SJF: ["Process ID", "Arrival Time", "Burst Time"],
    SRTF: ["Process ID", "Arrival Time", "Burst Time"],
    Priority: ["Process ID", "Arrival Time", "Burst Time", "Priority"],
    RoundRobin: ["Process ID", "Arrival Time", "Burst Time"],
  };

  const fields = fieldsByAlgorithm[algorithm] || [];

  const handleInputChange = (index, field, value) => {
    const updatedProcesses = [...processes];
    updatedProcesses[index][field] = value;
    setProcesses(updatedProcesses);
  };

  const addProcess = () => {
    setProcesses([
      ...processes,
      { id: "", arrival: "", burst: "", priority: "" },
    ]);
  };

  const removeProcess = (indexToRemove) => {
    setProcesses(processes.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = processes.every(
      (p) => p.id && p.arrival !== "" && p.burst !== ""
    );

    if (!isValid) {
      alert("Please fill in all the required fields.");
      return;
    }

    const dataToSubmit =
      algorithm === "RoundRobin" ? { processes, quantum } : { processes };

    console.log(dataToSubmit);

    const result =
      algorithm === "RoundRobin"
        ? calculateAlgorithm(dataToSubmit.processes, dataToSubmit.quantum)
        : calculateAlgorithm(dataToSubmit.processes);

    console.log(result);
    setOutput(result);
  };

  // Clear form inputs
  const handleClearForm = () => {
    setProcesses([{ id: "", arrival: "", burst: "", priority: "" }]);
    setQuantum("");
    setOutput([]);
  };

  return (
    <div className="template-form-container">
      <h2 className="template-title">
        {algorithm === "RoundRobin" ? "Round Robin" : algorithm}
      </h2>

      <form className="template-form" onSubmit={handleSubmit}>
        {processes.map((process, index) => (
          <div key={index} className="template-process-row">
            {fields.includes("Process ID") && (
              <input
                type="text"
                placeholder="Process ID"
                className="template-input"
                value={process.id}
                onChange={(e) => handleInputChange(index, "id", e.target.value)}
                required
              />
            )}
            {fields.includes("Arrival Time") && (
              <input
                type="number"
                placeholder="Arrival Time"
                className="template-input"
                value={process.arrival}
                onChange={(e) =>
                  handleInputChange(index, "arrival", e.target.value)
                }
                min="0"
                required
              />
            )}
            {fields.includes("Burst Time") && (
              <input
                type="number"
                placeholder="Burst Time"
                className="template-input"
                value={process.burst}
                onChange={(e) =>
                  handleInputChange(index, "burst", e.target.value)
                }
                min="1"
                required
              />
            )}
            {fields.includes("Priority") && (
              <input
                type="number"
                placeholder="Priority"
                className="template-input"
                value={process.priority}
                onChange={(e) =>
                  handleInputChange(index, "priority", e.target.value)
                }
                min="1"
                required
              />
            )}
            <button
              type="button"
              className="template-add-btn"
              onClick={addProcess}
            >
              +
            </button>
            <button
              type="button"
              className="template-remove-btn"
              onClick={() => removeProcess(index)}
            >
              -
            </button>
          </div>
        ))}
        {algorithm === "RoundRobin" && (
          <div className="template-quantum">
            <label htmlFor="quantum">Time Quantum : </label>
            <input
              type="number"
              id="quantum"
              placeholder="Quantum"
              className="template-input"
              value={quantum}
              onChange={(e) => setQuantum(e.target.value)}
              min="1"
              required
            />
          </div>
        )}
        <div className="template-submit-div-btn">
          <button type="submit" className="template-submit-btn">
            Run
          </button>
          <button
            type="button"
            className="template-clear-btn"
            onClick={handleClearForm}
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormTemplate;
