import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";

const SVMPage = () => {
  const [C, setC] = useState(1.0);         // Regularization parameter
  const [kernel, setKernel] = useState("linear"); // Kernel type
  const [maxIter, setMaxIter] = useState(100);    // Max iterations
  const [plotData, setPlotData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Automatically refetch whenever these dependencies change:
  useEffect(() => {
    fetchSimulation();
  }, [C, kernel, maxIter]);

  const fetchSimulation = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/simulate/svm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          C,
          kernel,
          max_iter: maxIter,
        }),
      });

      if (!response.ok) {
        throw new Error("Simulation failed");
      }

      const result = await response.json();
      setPlotData(result);
    } catch (error) {
      console.error("Simulation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 via-blue-100 to-blue-200 min-h-screen">
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl md:text-6xl font-extrabold text-center text-blue-700 mb-8">
          محاكاة دعم آلات المتجهات (SVM)
        </h1>

        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Sliders & Kernel Selection */}
            <div>
              {/* Slider for C */}
              <label className="block mb-4">
                <span className="text-blue-600 font-bold">معامل التنظيم (C):</span>
                <div className="flex items-center space-x-2 mt-2">
                  <input
                    type="range"
                    min="0.1"
                    max="10.0"
                    step="0.1"
                    value={C}
                    onChange={(e) => setC(parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-blue-800 font-semibold">
                    {C.toFixed(1)}
                  </span>
                </div>
              </label>

              {/* Select for Kernel Type */}
              <label className="block mb-4">
                <span className="text-blue-600 font-bold">نوع النواة:</span>
                <select
                  value={kernel}
                  onChange={(e) => setKernel(e.target.value)}
                  className="w-full border-blue-300 rounded-lg shadow-sm focus:ring focus:ring-blue-200"
                >
                  <option value="linear">Linear</option>
                  <option value="poly">Polynomial</option>
                  <option value="rbf">RBF</option>
                  <option value="sigmoid">Sigmoid</option>
                </select>
              </label>

              {/* Slider for maxIter */}
              <label className="block mb-4">
                <span className="text-blue-600 font-bold">عدد التكرارات القصوى:</span>
                <div className="flex items-center space-x-2 mt-2">
                  <input
                    type="range"
                    min="1"
                    max="1000"
                    step="1"
                    value={maxIter}
                    onChange={(e) => setMaxIter(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-blue-800 font-semibold">
                    {maxIter}
                  </span>
                </div>
              </label>

              {loading && (
                <p className="text-blue-500 font-semibold">
                  جارٍ حساب النتائج...
                </p>
              )}
            </div>

            {/* Right Column: Plot */}
            <div>
              {plotData ? (
                <Plot
                  data={[
                    // 1) Contour trace for decision region
                    {
                      x: plotData.decision_boundary.xx[0],
                      y: plotData.decision_boundary.yy.map((row) => row[0]),
                      z: plotData.decision_boundary.Z,
                      type: "contour",
                      colorscale: "RdBu",
                      autocontour: false,
                      contours: {
                        start: -1,
                        end: 1,
                        size: 1,
                        showlines: true,
                        coloring: "fill",
                      },
                      opacity: 0.5,
                      hoverinfo: "none",
                      name: "Decision Region",
                    },
                    // 2) Scatter trace for data points
                    {
                      x: plotData.scatter_data.X.map((p) => p[0]),
                      y: plotData.scatter_data.X.map((p) => p[1]),
                      mode: "markers",
                      marker: {
                        color: plotData.scatter_data.y,
                        colorscale: "Viridis",
                        size: 8,
                      },
                      name: "Data Points",
                    },
                    // 3) Scatter trace for support vectors
                    {
                      x: plotData.support_vectors.map((p) => p[0]),
                      y: plotData.support_vectors.map((p) => p[1]),
                      mode: "markers",
                      marker: {
                        color: "red",
                        symbol: "x",
                        size: 10,
                      },
                      name: "Support Vectors",
                    },
                  ]}
                  layout={{
                    title: "النقاط وخط الفصل (Decision Boundary)",
                    xaxis: { title: "X1" },
                    yaxis: { title: "X2" },
                    margin: { t: 50, l: 50, r: 50, b: 50 },
                  }}
                  style={{ width: "100%", height: "500px" }}
                />
              ) : (
                <p className="text-blue-600 font-bold text-center">
                  حرّك المؤشرات أو اختر نوع النواة لرؤية النتائج.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SVMPage;
