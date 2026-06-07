import React, { useState, useEffect, useRef } from "react";

const SortingPage = () => {
  const [array, setArray] = useState([]);
  const [algo, setAlgo] = useState("bubble");
  const [count, setCount] = useState(60);
  const [speed, setSpeed] = useState(15); // delay in milliseconds
  const [activeIndices, setActiveIndices] = useState([]);
  const [sortedIndices, setSortedIndices] = useState([]);
  const [isSorting, setIsSorting] = useState(false);
  const isSortingRef = useRef(false);

  // Helper to sleep/delay execution
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // Generate a random array
  const generateNewArray = () => {
    if (isSorting) return;
    const arr = [];
    for (let i = 0; i < count; i++) {
      // Generate numbers between 10 and 380 (for visual height)
      arr.push(Math.floor(Math.random() * 370) + 15);
    }
    setArray(arr);
    setActiveIndices([]);
    setSortedIndices([]);
  };

  useEffect(() => {
    generateNewArray();
  }, [count]);

  // Bubble Sort algorithm
  const bubbleSort = async () => {
    let arr = [...array];
    let n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (!isSortingRef.current) return;
        setActiveIndices([j, j + 1]);
        if (arr[j] > arr[j + 1]) {
          let temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          setArray([...arr]);
          await sleep(speed);
        }
      }
      setSortedIndices((prev) => [...prev, n - i - 1]);
    }
    setSortedIndices(Array.from({ length: n }, (_, idx) => idx));
  };

  // Selection Sort algorithm
  const selectionSort = async () => {
    let arr = [...array];
    let n = arr.length;
    for (let i = 0; i < n; i++) {
      let minIdx = i;
      for (let j = i + 1; j < n; j++) {
        if (!isSortingRef.current) return;
        setActiveIndices([j, minIdx]);
        if (arr[j] < arr[minIdx]) {
          minIdx = j;
        }
        await sleep(speed);
      }
      if (minIdx !== i) {
        let temp = arr[i];
        arr[i] = arr[minIdx];
        arr[minIdx] = temp;
        setArray([...arr]);
        await sleep(speed);
      }
      setSortedIndices((prev) => [...prev, i]);
    }
  };

  // Insertion Sort algorithm
  const insertionSort = async () => {
    let arr = [...array];
    let n = arr.length;
    setSortedIndices([0]);
    for (let i = 1; i < n; i++) {
      let key = arr[i];
      let j = i - 1;
      while (j >= 0 && arr[j] > key) {
        if (!isSortingRef.current) return;
        setActiveIndices([j, j + 1]);
        arr[j + 1] = arr[j];
        setArray([...arr]);
        j = j - 1;
        await sleep(speed);
      }
      arr[j + 1] = key;
      setArray([...arr]);
      
      const sorted = Array.from({ length: i + 1 }, (_, index) => index);
      setSortedIndices(sorted);
      await sleep(speed);
    }
    setSortedIndices(Array.from({ length: n }, (_, idx) => idx));
  };

  // Quick Sort recursive wrapper
  const runQuickSort = async () => {
    let arr = [...array];
    setSortedIndices([]);
    await quickSort(arr, 0, arr.length - 1);
    if (isSortingRef.current) {
      setArray(arr);
      setSortedIndices(Array.from({ length: arr.length }, (_, idx) => idx));
    }
  };

  const quickSort = async (arr, start, end) => {
    if (start >= end) {
      if (start >= 0 && start < arr.length && isSortingRef.current) {
        setSortedIndices((prev) => [...prev, start]);
      }
      return;
    }
    if (!isSortingRef.current) return;
    let pivotIdx = await partition(arr, start, end);
    await quickSort(arr, start, pivotIdx - 1);
    await quickSort(arr, pivotIdx + 1, end);
  };

  const partition = async (arr, start, end) => {
    let pivotVal = arr[end];
    let pivotIdx = start;
    for (let i = start; i < end; i++) {
      if (!isSortingRef.current) return pivotIdx;
      setActiveIndices([i, end]);
      if (arr[i] < pivotVal) {
        let temp = arr[i];
        arr[i] = arr[pivotIdx];
        arr[pivotIdx] = temp;
        setArray([...arr]);
        pivotIdx++;
        await sleep(speed);
      }
    }
    let temp = arr[pivotIdx];
    arr[pivotIdx] = arr[end];
    arr[end] = temp;
    setArray([...arr]);
    setSortedIndices((prev) => [...prev, pivotIdx]);
    await sleep(speed);
    return pivotIdx;
  };

  // Triggers sorting
  const handleStart = async () => {
    if (isSorting) return;
    setIsSorting(true);
    isSortingRef.current = true;
    setSortedIndices([]);

    if (algo === "bubble") await bubbleSort();
    else if (algo === "selection") await selectionSort();
    else if (algo === "insertion") await insertionSort();
    else if (algo === "quick") await runQuickSort();

    setActiveIndices([]);
    setIsSorting(false);
    isSortingRef.current = false;
  };

  // Reset or Stop sorting
  const handleReload = () => {
    isSortingRef.current = false;
    setIsSorting(false);
    setTimeout(() => {
      generateNewArray();
    }, 50);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px 20px",
        minHeight: "calc(100vh - 70px)",
        color: "#f8fafc",
      }}
    >
      <h1
        style={{
          fontSize: "2.2rem",
          fontWeight: "800",
          marginBottom: "30px",
          background: "linear-gradient(135deg, #38bdf8, #818cf8)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Array Sorting Visualizer
      </h1>

      {/* Control Panel */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "24px",
          justifyContent: "center",
          alignItems: "center",
          background: "rgba(30, 41, 59, 0.45)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "16px",
          padding: "20px 30px",
          maxWidth: "1000px",
          width: "100%",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
          marginBottom: "40px",
        }}
      >
        {/* Dropdown for Selection */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Sorting Algorithm</label>
          <select
            value={algo}
            onChange={(e) => setAlgo(e.target.value)}
            disabled={isSorting}
            style={{
              padding: "10px 14px",
              background: "rgba(15, 23, 42, 0.6)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "8px",
              color: "#f8fafc",
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="bubble">Bubble Sort</option>
            <option value="selection">Selection Sort</option>
            <option value="insertion">Insertion Sort</option>
            <option value="quick">Quick Sort</option>
          </select>
        </div>

        {/* Array Size Slider */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px", minWidth: "160px" }}>
          <label style={{ fontSize: "0.85rem", color: "#94a3b8", display: "flex", justifyContent: "space-between" }}>
            <span>Array Count</span>
            <span>{count}</span>
          </label>
          <input
            type="range"
            min="10"
            max="120"
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value))}
            disabled={isSorting}
            style={{
              cursor: "pointer",
              accentColor: "#38bdf8",
            }}
          />
        </div>

        {/* Speed Slider */}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px", minWidth: "160px" }}>
          <label style={{ fontSize: "0.85rem", color: "#94a3b8", display: "flex", justifyContent: "space-between" }}>
            <span>Animation Delay</span>
            <span>{speed}ms</span>
          </label>
          <input
            type="range"
            min="1"
            max="300"
            value={speed}
            onChange={(e) => setSpeed(parseInt(e.target.value))}
            style={{
              cursor: "pointer",
              accentColor: "#38bdf8",
            }}
          />
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
          <button
            onClick={handleStart}
            disabled={isSorting}
            style={{
              backgroundColor: isSorting ? "rgba(56, 189, 248, 0.2)" : "#38bdf8",
              color: isSorting ? "#94a3b8" : "#090d16",
              border: "none",
              borderRadius: "8px",
              padding: "10px 24px",
              fontWeight: "600",
              cursor: isSorting ? "not-allowed" : "pointer",
              boxShadow: isSorting ? "none" : "0 4px 15px rgba(56, 189, 248, 0.2)",
              transition: "all 0.3s ease",
            }}
          >
            START
          </button>
          <button
            onClick={handleReload}
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              color: "#e2e8f0",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              borderRadius: "8px",
              padding: "10px 24px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            RELOAD
          </button>
        </div>
      </div>

      {/* Array Bars Visualization */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          height: "400px",
          width: "100%",
          maxWidth: "1000px",
          background: "rgba(15, 23, 42, 0.35)",
          border: "1px solid rgba(255, 255, 255, 0.06)",
          borderRadius: "16px",
          padding: "24px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
          gap: count > 80 ? "1px" : "2px",
          overflow: "hidden",
        }}
      >
        {array.map((val, idx) => {
          let barColor = "#475569"; // default slate gray

          if (activeIndices.includes(idx)) {
            barColor = "#f43f5e"; // Rose red for active swap/compare
          } else if (sortedIndices.includes(idx)) {
            barColor = "#10b981"; // Emerald green for sorted items
          }

          const barWidth = 100 / count;

          return (
            <div
              key={`bar-${idx}`}
              style={{
                height: `${(val / 400) * 100}%`,
                width: `${barWidth}%`,
                backgroundColor: barColor,
                borderRadius: "3px 3px 0 0",
                transition: "height 0.1s ease, background-color 0.15s ease",
                boxShadow: activeIndices.includes(idx)
                  ? "0 -2px 10px rgba(244, 63, 94, 0.5)"
                  : "none",
              }}
              title={`Value: ${val}`}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SortingPage;
