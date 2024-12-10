import React, { useState } from "react";
import Plot from "react-plotly.js";

const DecisionTreePage = () => {
  const [maxDepth, setMaxDepth] = useState(3); // Max depth of the tree
  const [plotData, setPlotData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSimulate = async () => {
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
          محاكاة شجرة القرار
        </h1>
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block mb-4">
                <span className="text-blue-600 font-bold">العمق الأقصى:</span>
                <input
                  type="number"
                  value={maxDepth}
                  onChange={(e) => setMaxDepth(parseInt(e.target.value))}
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
                        x: plotData.decision_boundary.xx.flat(),
                        y: plotData.decision_boundary.yy.flat(),
                        z: plotData.decision_boundary.Z.flat(),
                        type: "contour",
                        colorscale: "Blues",
                        name: "Decision Boundary",
                      },
                    ]}
                    layout={{
                      title: "النقاط وخط الفصل",
                      xaxis: { title: "X1" },
                      yaxis: { title: "X2" },
                      margin: { t: 50, l: 50, r: 50, b: 50 },
                    }}
                  />
                  <div className="text-center mt-4">
                    <p className="text-blue-600 font-bold">
                      دقة النموذج: {plotData.model_score.toFixed(2)}
                    </p>
                  </div>
                  <h2 className="text-xl font-bold text-blue-600 text-center my-4">
                    هيكل شجرة القرار
                  </h2>
                  <img
                    src={`data:image/png;base64,${plotData.tree_image}`}
                    alt="Decision Tree Visualization"
                    className="mx-auto rounded-lg shadow-md"
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

export default DecisionTreePage;
