import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";

const LinearRegressionPage = () => {
  const [learningRate, setLearningRate] = useState(0.01);
  const [iterations, setIterations] = useState(100);
  const [initialWeights, setInitialWeights] = useState([0, 0]);
  const [plotData, setPlotData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to fetch data from the backend
  const fetchSimulation = async (lr, iters, initW) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/simulate/linear-regression", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          learning_rate: lr,
          iterations: iters,
          initial_weights: initW,
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

  // Trigger fetch whenever any of the inputs changes
  useEffect(() => {
    // For real-world scenarios, you may want to debounce here
    fetchSimulation(learningRate, iterations, initialWeights);
  }, [learningRate, iterations, initialWeights]);

  return (
    <div className="bg-gradient-to-b from-blue-50 via-blue-100 to-blue-200 min-h-screen">
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl md:text-6xl font-extrabold text-center text-blue-700 mb-8">
          محاكاة الانحدار الخطي
        </h1>
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left column: sliders & initial weights */}
            <div>
              {/* Learning Rate Slider */}
              <label className="block mb-4">
                <span className="text-blue-600 font-bold">معدل التعلم:</span>
                <div className="flex items-center space-x-2 mt-2">
                  <input
                    type="range"
                    min="0.0"
                    max="1.0"
                    step="0.01"
                    value={learningRate}
                    onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-blue-800 font-semibold">
                    {learningRate.toFixed(2)}
                  </span>
                </div>
              </label>

              {/* Iterations Slider */}
              <label className="block mb-4">
                <span className="text-blue-600 font-bold">عدد التكرارات:</span>
                <div className="flex items-center space-x-2 mt-2">
                  <input
                    type="range"
                    min="1"
                    max="300"
                    step="1"
                    value={iterations}
                    onChange={(e) => setIterations(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-blue-800 font-semibold">{iterations}</span>
                </div>
              </label>

              {/* Initial Weights */}
              <label className="block mb-4">
                <span className="text-blue-600 font-bold">الأوزان الابتدائية:</span>
                <input
                  type="text"
                  value={initialWeights}
                  onChange={(e) =>
                    setInitialWeights(e.target.value.split(",").map(Number))
                  }
                  className="w-full border-blue-300 rounded-lg shadow-sm focus:ring focus:ring-blue-200 mt-2"
                  placeholder="مثال: 0, 0"
                />
              </label>

              {/* Loading Indicator */}
              {loading && (
                <p className="text-blue-500 font-semibold">
                  جارٍ حساب النتائج...
                </p>
              )}
            </div>

            {/* Right column: the Plots */}
            <div>
              {plotData ? (
                <>
                  {/* Cost History Plot */}
                  <Plot
                    data={[
                      {
                        x: plotData.iterations,
                        y: plotData.cost_history,
                        type: "scatter",
                        mode: "lines+markers",
                        marker: { color: "blue" },
                        name: "Cost History",
                      },
                    ]}
                    layout={{
                      title: "تاريخ التكلفة",
                      xaxis: { title: "التكرارات" },
                      yaxis: { title: "التكلفة" },
                      margin: { t: 50, l: 50, r: 50, b: 50 },
                    }}
                    config={{ responsive: true, displayModeBar: true, scrollZoom: true }}
                    style={{ width: "100%", height: "400px" }}
                  />

                  {/* Data + Regression Line Plot */}
                  <Plot
                    data={[
                      {
                        x: plotData.scatter_data.X,
                        y: plotData.scatter_data.y,
                        mode: "markers",
                        marker: { color: "red" },
                        name: "Data Points",
                      },
                      {
                        x: plotData.predicted_line.X,
                        y: plotData.predicted_line.y,
                        mode: "lines",
                        line: { color: "blue" },
                        name: "Regression Line",
                      },
                    ]}
                    layout={{
                      title: "النقاط والخط التوقعي",
                      xaxis: { title: "X" },
                      yaxis: { title: "y" },
                      margin: { t: 50, l: 50, r: 50, b: 50 },
                    }}
                    config={{ responsive: true, displayModeBar: true, scrollZoom: true }}
                    style={{ width: "100%", height: "400px" }}
                  />
                </>
              ) : (
                <p className="text-blue-600 font-bold text-center">
                  حرّك المؤشرات لرؤية النتائج.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinearRegressionPage;
