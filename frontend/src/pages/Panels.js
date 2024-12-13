import React from "react";
import { useNavigate } from "react-router-dom";
import LinearRegressionImage from "../assets/images/linearregression.png";
import LogisticRegressionImage from "../assets/images/linearregression.png"; // Update as needed
import SVMImage from "../assets/images/bg.png";
import KNNImage from "../assets/images/bg.png";
import DecisionTreeImage from "../assets/images/decisiontree.svg";

const AlgorithmsPage = () => {
  const navigate = useNavigate();

  const algorithms = [
    {
      name: "الانحدار الخطي",
      image: LinearRegressionImage,
      route: "/simulate/linear-regression", // Route for Linear Regression
    },
    {
      name: "الانحدار اللوجستي",
      image: LogisticRegressionImage,
      route: "/simulate/logistic-regression", // Route for Logistic Regression
    },
    {
      name: "دعم آلات المتجهات (SVM)",
      image: SVMImage,
      route: "/simulate/svm",
    },
    {
      name: "خوارزمية الجيران الأقرب (KNN)",
      image: KNNImage,
      route: "/simulate/knn",
    },
    {
      name: "شجرة القرار",
      image: DecisionTreeImage,
      route: "/simulate/decision-tree",
    },
  ];

  return (
    <div className="relative bg-gradient-to-b from-blue-50 via-blue-100 to-blue-200 min-h-screen">
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl md:text-6xl font-extrabold text-center text-blue-700 mb-8">
          محاكاة الخوارزميات
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {algorithms.map((algo, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition duration-300 cursor-pointer"
              onClick={() => navigate(algo.route)}
            >
              <img
                src={algo.image}
                alt={algo.name}
                className="w-full h-48 object-contain bg-gradient-to-t from-blue-200 via-blue-100 to-blue-50"
              />
              <div className="p-6 text-center">
                <h2 className="text-2xl font-bold text-blue-600">{algo.name}</h2>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AlgorithmsPage;
