import React, { useState } from "react";
import Plot from "react-plotly.js";

const SVMPage = () => {
  const [C, setC] = useState(1.0); // Regularization parameter
  const [kernel, setKernel] = useState("linear"); // Kernel type
  const [maxIter, setMaxIter] = useState(100); // Maximum iterations
  const [plotData, setPlotData] = useState(null);

  const handleSimulate = async () => {
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
        throw new Error("Simulation failed!");
      }

      const result = await response.json();
      setPlotData(result);
    } catch (error) {
      console.error("Simulation failed:", error);
    }
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 via-blue-100 to-blue-200 min-h-screen">
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl md:text-6xl font-extrabold text-center text-blue-700 mb-8">
          محاكاة دعم آلات المتجهات (SVM)
        </h1>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Parameter Inputs */}
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
              >
                ابدأ المحاكاة
              </button>
            </div>

            {/* Simulation Results */}
            <div>
              {plotData ? (
                <div>
                  <h2 className="text-xl text-center text-blue-600 font-bold mb-4">
                    نتائج المحاكاة
                  </h2>
                  <p>عدد نقاط الدعم: {plotData.number_of_support_vectors}</p>
                  <p>
                    المعاملات:{" "}
                    {plotData.coefficients
                      ? plotData.coefficients.map((coef, idx) => (
                          <span key={idx}>{coef.toFixed(2)} </span>
                        ))
                      : "N/A"}
                  </p>
                  <p>المقدار الثابت: {plotData.intercept}</p>
                </div>
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
