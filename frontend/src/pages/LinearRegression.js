import React, { useState } from "react";
import Plot from "react-plotly.js";

const LinearRegressionPage = () => {
  const [learningRate, setLearningRate] = useState(0.01);
  const [iterations, setIterations] = useState(100);
  const [initialWeights, setInitialWeights] = useState([0, 0]);
  const [plotData, setPlotData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSimulate = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/simulate/linear-regression", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          learning_rate: learningRate,
          iterations,
          initial_weights: initialWeights,
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
          محاكاة الانحدار الخطي
        </h1>
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block mb-4">
                <span className="text-blue-600 font-bold">معدل التعلم:</span>
                <input
                  type="number"
                  value={learningRate}
                  onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                  className="w-full border-blue-300 rounded-lg shadow-sm focus:ring focus:ring-blue-200"
                  step="0.01"
                />
              </label>
              <label className="block mb-4">
                <span className="text-blue-600 font-bold">عدد التكرارات:</span>
                <input
                  type="number"
                  value={iterations}
                  onChange={(e) => setIterations(parseInt(e.target.value))}
                  className="w-full border-blue-300 rounded-lg shadow-sm focus:ring focus:ring-blue-200"
                  step="1"
                />
              </label>
              <label className="block mb-4">
                <span className="text-blue-600 font-bold">الأوزان الابتدائية:</span>
                <input
                  type="text"
                  value={initialWeights}
                  onChange={(e) => setInitialWeights(e.target.value.split(",").map(Number))}
                  className="w-full border-blue-300 rounded-lg shadow-sm focus:ring focus:ring-blue-200"
                  placeholder="مثال: 0, 0"
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
              {plotData ? (
                <>
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
                  />
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

export default LinearRegressionPage;
