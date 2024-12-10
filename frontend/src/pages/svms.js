import React, { useState } from "react";
import Plot from "react-plotly.js";

const SVMPage = () => {
  const [C, setC] = useState(1.0); // Regularization parameter
  const [kernel, setKernel] = useState("linear"); // Kernel type
  const [maxIter, setMaxIter] = useState(100); // Max iterations
  const [plotData, setPlotData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSimulate = async () => {
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
            <div>
              <label className="block mb-4">
                <span className="text-blue-600 font-bold">معامل التنظيم (C):</span>
                <input
                  type="number"
                  value={C}
                  onChange={(e) => setC(parseFloat(e.target.value))}
                  className="w-full border-blue-300 rounded-lg shadow-sm focus:ring focus:ring-blue-200"
                  step="0.1"
                />
              </label>
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
              <label className="block mb-4">
                <span className="text-blue-600 font-bold">عدد التكرارات القصوى:</span>
                <input
                  type="number"
                  value={maxIter}
                  onChange={(e) => setMaxIter(parseInt(e.target.value))}
                  className="w-full border-blue-300 rounded-lg shadow-sm focus:ring focus:ring-blue-200"
                  step="1"
                />
              </label>
              <button
                onClick={handleSimulate}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition"
                disabled={loading}
              >
                {loading ? "جارٍ التشغيل..." : "ابدأ المحاكاة"}
              </button>
            </div>
            <div>
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="loader ease-linear rounded-full border-8 border-t-8 border-blue-600 h-16 w-16"></div>
                </div>
              ) : plotData ? (
                <>
                  <Plot
                    data={[
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
                      {
                        x: plotData.support_vectors.map((p) => p[0]),
                        y: plotData.support_vectors.map((p) => p[1]),
                        mode: "markers",
                        marker: { color: "red", symbol: "x", size: 10 },
                        name: "Support Vectors",
                      },
                    ]}
                    layout={{
                      title: "النقاط وخط الفصل",
                      xaxis: { title: "X1" },
                      yaxis: { title: "X2" },
                      margin: { t: 50, l: 50, r: 50, b: 50 },
                      shapes: [
                        {
                          type: "contour",
                          x0: plotData.decision_boundary.xx[0][0],
                          x1: plotData.decision_boundary.xx[0][1],
                          line: { color: "blue", width: 2 },
                        },
                      ],
                    }}
                  />
                </>
              ) : (
                <p className="text-blue-600 font-bold text-center">
                  ابدأ المحاكاة لرؤية النتائج.
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
