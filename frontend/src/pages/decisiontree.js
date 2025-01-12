import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";

const DecisionTreePage = () => {
  const [maxDepth, setMaxDepth] = useState(3);
  const [plotData, setPlotData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Auto-refetch whenever maxDepth changes
  useEffect(() => {
    fetchSimulation();
  }, [maxDepth]);

  const fetchSimulation = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/simulate/decision-tree", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          max_depth: maxDepth,
        }),
      });

      if (!response.ok) {
        throw new Error("Decision Tree simulation failed");
      }

      const result = await response.json();
      setPlotData(result);
    } catch (error) {
      console.error("Decision Tree simulation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 via-blue-100 to-blue-200 min-h-screen">
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl md:text-6xl font-extrabold text-center text-blue-700 mb-8">
          محاكاة شجرة القرار
        </h1>
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: slider for max_depth */}
            <div>
              <label className="block mb-4">
                <span className="text-blue-600 font-bold">العمق الأقصى (max_depth):</span>
                <div className="flex items-center space-x-2 mt-2">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={maxDepth}
                    onChange={(e) => setMaxDepth(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-blue-800 font-semibold">
                    {maxDepth}
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

            {/* Right Column: Plot & Tree Image */}
            <div>
              {plotData ? (
                <>
                  {/* Decision Boundary Plot */}
                  <Plot
                    data={[
                      // 1) Contour for predicted classes
                      {
                        x: plotData.decision_boundary.xx[0],
                        y: plotData.decision_boundary.yy.map((row) => row[0]),
                        z: plotData.decision_boundary.Z,
                        type: "contour",
                        showscale: false,
                        colorscale: "RdBu",
                        contours: {
                          coloring: "fill",
                          showlines: false,
                        },
                        opacity: 0.5,
                        hoverinfo: "none",
                        name: "Decision Regions",
                      },
                      // 2) Optionally add scatter_data
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
                    ]}
                    layout={{
                      title: "خط الفصل لشجرة القرار",
                      xaxis: { title: "X1" },
                      yaxis: { title: "X2" },
                      margin: { t: 50, l: 50, r: 50, b: 50 },
                    }}
                    style={{ width: "100%", height: "400px" }}
                    config={{ displayModeBar: true, responsive: true }}
                  />

                  {/* Decision Tree as an Image (Base64) */}
                  <div className="mt-4">
                    <h3 className="text-blue-600 font-semibold mb-2">
                      تمثيل شجرة القرار:
                    </h3>
                    <img
                      src={`data:image/png;base64,${plotData.tree_image}`}
                      alt="Decision Tree Graph"
                      style={{ maxWidth: "100%", border: "1px solid #ccc" }}
                    />
                  </div>
                </>
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

export default DecisionTreePage;
