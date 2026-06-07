// src/pages/GraphPage.jsx
const GraphPage = () => {
  return (
    <div style={{ height: "100vh", width: "100%", border: "none" }}>
      <iframe
        src="/graph-visualizer/graph/graph.html"
        title="Graph Algorithm Visualizer"
        width="100%"
        height="100%"
        style={{ border: "none" }}
      ></iframe>
    </div>
  );
};

export default GraphPage;
