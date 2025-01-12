import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";

const KNNPage = () => {
  const [nNeighbors, setNNeighbors] = useState(3);
  const [plotData, setPlotData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Automatically refetch whenever nNeighbors changes
  useEffect(() => {
    fetchSimulation();
  }, [nNeighbors]);

  const fetchSimulation = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/simulate/knn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          n_neighbors: nNeighbors,
        }),
      });

      if (!response.ok) {
        throw new Error("KNN simulation failed");
      }

      const result = await response.json();
      setPlotData(result);
    } catch (error) {
      console.error("KNN simulation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 via-blue-100 to-blue-200 min-h-screen">
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl md:text-6xl font-extrabold text-center text-blue-700 mb-8">
          محاكاة خوارزمية الجيران الأقرب (KNN)
        </h1>
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left column: slider for n_neighbors */}
            <div>
              <label className="block mb-4">
                <span className="text-blue-600 font-bold">
                  عدد الجيران (n_neighbors):
                </span>
                <div className="flex items-center space-x-2 mt-2">
                  <input
                    type="range"
                    min="1"
                    max="20"
                    step="1"
                    value={nNeighbors}
                    onChange={(e) => setNNeighbors(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-blue-800 font-semibold">
                    {nNeighbors}
                  </span>
                </div>
              </label>

              {/* Loading Indicator */}
              {loading && (
                <p className="text-blue-500 font-semibold">
                  جارٍ حساب النتائج...
                </p>
              )}

              {plotData && (
                <p className="text-green-600 font-bold mt-4">
                  دقة النموذج: {plotData.model_score.toFixed(2)}
                </p>
              )}
            </div>

            {/* Right column: Plot */}
            <div>
              {plotData ? (
                <Plot
                  data={[
                    // 1) Contour/heatmap for predicted classes
                    {
                      x: plotData.decision_boundary.xx[0],
                      y: plotData.decision_boundary.yy.map((row) => row[0]),
                      z: plotData.decision_boundary.Z,
                      type: "contour",
                      colorscale: "RdBu",
                      showscale: false,
                      contours: {
                        coloring: "fill",
                        showlines: false,
                      },
                      opacity: 0.5,
                      hoverinfo: "none",
                      name: "Decision Regions",
                    },
                    // 2) Scatter trace for original points
                  ]}
                  layout={{
                    title: "النقاط وخط الفصل (Decision Boundary)",
                    xaxis: { title: "X1" },
                    yaxis: { title: "X2" },
                    margin: { t: 50, l: 50, r: 50, b: 50 },
                  }}
                  style={{ width: "100%", height: "500px" }}
                  frames={[]}
                  config={{ displayModeBar: true, responsive: true }}
                />
              ) : (
                <p className="text-blue-600 font-bold text-center">
                  حرّك المؤشر لرؤية النتائج.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KNNPage;
