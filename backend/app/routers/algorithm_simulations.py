from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List
import numpy as np
from sklearn.datasets import make_classification
from sklearn.svm import SVC
from sklearn.tree import DecisionTreeClassifier
from sklearn.neighbors import KNeighborsClassifier

# Create a FastAPI router
router = APIRouter()

# Predefined datasets for simulations
LINEAR_REGRESSION_DATA = [
    {"x": 1.0, "y": 3.1},
    {"x": 2.0, "y": 6.2},
    {"x": 3.0, "y": 9.3},
    {"x": 4.0, "y": 12.4},
    {"x": 5.0, "y": 15.5},
    {"x": 6.0, "y": 18.6},
    {"x": 7.0, "y": 21.7},
    {"x": 8.0, "y": 24.8},
    {"x": 9.0, "y": 27.9},
    {"x": 10.0, "y": 31.0},
]

LOGISTIC_REGRESSION_DATA = [
    {"x": [1.0, 2.1], "y": 0},
    {"x": [2.0, 3.5], "y": 0},
    {"x": [3.0, 4.6], "y": 1},
    {"x": [4.0, 5.7], "y": 1},
    {"x": [5.0, 6.2], "y": 1},
    {"x": [6.0, 7.3], "y": 1},
]

# Shared dataset for classification tasks
X, y = make_classification(
    n_samples=100,
    n_features=2,
    n_informative=2,
    n_redundant=0,
    n_repeated=0,
    n_classes=2,
    n_clusters_per_class=1,
    random_state=42,
)


# Linear Regression Simulation
class LinearRegressionParams(BaseModel):
    learning_rate: float = Field(..., gt=0, example=0.01)
    iterations: int = Field(..., gt=0, le=1000, example=100)
    initial_weights: List[float] = Field(..., example=[0.0, 0.0])


@router.post("/simulate/linear-regression")
async def simulate_linear_regression(params: LinearRegressionParams):
    try:
        lr = params.learning_rate
        iterations = params.iterations
        weights = np.array(params.initial_weights)

        data = np.array([[point["x"], point["y"]] for point in LINEAR_REGRESSION_DATA])
        X = np.c_[np.ones(data.shape[0]), data[:, 0]]  # Add bias term
        y = data[:, 1]
        costs = []

        for _ in range(iterations):
            predictions = X @ weights
            errors = predictions - y
            cost = (1 / (2 * len(y))) * np.sum(errors**2)
            costs.append(cost)

            gradients = (1 / len(y)) * X.T @ errors
            weights -= lr * gradients

        return {
            "final_weights": weights.tolist(),
            "cost_history": costs,
            "iterations": list(range(1, iterations + 1)),
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Logistic Regression Simulation
class LogisticRegressionParams(BaseModel):
    learning_rate: float = Field(..., gt=0, example=0.01)
    iterations: int = Field(..., gt=0, le=1000, example=100)
    initial_weights: List[float] = Field(..., example=[0.0, 0.0, 0.0])  # Bias + 2 features


def sigmoid(x):
    return 1 / (1 + np.exp(-x))


@router.post("/simulate/logistic-regression")
async def simulate_logistic_regression(params: LogisticRegressionParams):
    try:
        lr = params.learning_rate
        iterations = params.iterations
        weights = np.array(params.initial_weights)

        data = np.array([[*point["x"], point["y"]] for point in LOGISTIC_REGRESSION_DATA])
        X = np.c_[np.ones(data.shape[0]), data[:, :-1]]  # Add bias term
        y = data[:, -1]
        costs = []

        for _ in range(iterations):
            z = X @ weights
            predictions = sigmoid(z)
            errors = predictions - y
            cost = (-1 / len(y)) * np.sum(y * np.log(predictions) + (1 - y) * np.log(1 - predictions))
            costs.append(cost)

            gradients = (1 / len(y)) * X.T @ errors
            weights -= lr * gradients

        return {
            "final_weights": weights.tolist(),
            "cost_history": costs,
            "iterations": list(range(1, iterations + 1)),
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# SVM Simulation
class SVMParams(BaseModel):
    C: float = Field(..., gt=0, example=1.0)
    kernel: str = Field(..., example="linear")
    max_iter: int = Field(..., gt=0, le=1000, example=100)


@router.post("/simulate/svm")
async def simulate_svm(params: SVMParams):
    try:
        svm_model = SVC(C=params.C, kernel=params.kernel, max_iter=params.max_iter)
        svm_model.fit(X, y)

        return {
            "support_vectors": svm_model.support_vectors_.tolist(),
            "coefficients": svm_model.coef_.tolist() if params.kernel == "linear" else None,
            "intercept": svm_model.intercept_.tolist(),
            "number_of_support_vectors": len(svm_model.support_vectors_),
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# K-Nearest Neighbors Simulation
class KNNParams(BaseModel):
    n_neighbors: int = Field(..., gt=0, example=3)
    metric: str = Field(..., example="euclidean")


@router.post("/simulate/knn")
async def simulate_knn(params: KNNParams):
    try:
        knn_model = KNeighborsClassifier(n_neighbors=params.n_neighbors, metric=params.metric)
        knn_model.fit(X, y)

        return {
            "model_score": knn_model.score(X, y),
            "neighbors_used": params.n_neighbors,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Decision Tree Simulation
class DecisionTreeParams(BaseModel):
    max_depth: int = Field(..., gt=0, le=10, example=3)
    criterion: str = Field(..., example="gini")


@router.post("/simulate/decision-tree")
async def simulate_decision_tree(params: DecisionTreeParams):
    try:
        dt_model = DecisionTreeClassifier(max_depth=params.max_depth, criterion=params.criterion)
        dt_model.fit(X, y)

        return {
            "model_score": dt_model.score(X, y),
            "tree_depth": params.max_depth,
            "tree_criterion": params.criterion,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
