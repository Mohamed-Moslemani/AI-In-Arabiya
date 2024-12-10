from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List
import numpy as np
from sklearn.datasets import make_blobs
from sklearn.svm import SVC
from sklearn.tree import DecisionTreeClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.tree import export_graphviz
import pydotplus
import base64
from io import BytesIO

router = APIRouter()

# Create dataset
X, y = make_blobs(
    n_samples=200,
    centers=2,
    cluster_std=1.5,
    random_state=42,
)


# Helper Functions
def sigmoid(x):
    return 1 / (1 + np.exp(-x))


# Linear Regression
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

        # Create a simple dataset
        X_data = np.linspace(0, 10, 100).reshape(-1, 1)
        y_data = 3 * X_data.squeeze() + np.random.normal(0, 1, X_data.shape[0])

        # Prepare X with bias
        X_bias = np.c_[np.ones(X_data.shape[0]), X_data]
        costs = []

        for _ in range(iterations):
            predictions = X_bias @ weights
            errors = predictions - y_data
            cost = (1 / (2 * len(y_data))) * np.sum(errors**2)
            costs.append(cost)

            gradients = (1 / len(y_data)) * X_bias.T @ errors
            weights -= lr * gradients

        # Predicted line
        predicted_y = X_bias @ weights

        return {
            "final_weights": weights.tolist(),
            "cost_history": costs,
            "iterations": list(range(1, iterations + 1)),
            "scatter_data": {"X": X_data.squeeze().tolist(), "y": y_data.tolist()},
            "predicted_line": {"X": X_data.squeeze().tolist(), "y": predicted_y.tolist()},
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



# Logistic Regression
class LogisticRegressionParams(BaseModel):
    learning_rate: float = Field(..., gt=0, example=0.01)
    iterations: int = Field(..., gt=0, le=1000, example=100)
    initial_weights: List[float] = Field(..., example=[0.0, 0.0, 0.0])


@router.post("/simulate/logistic-regression")
async def simulate_logistic_regression(params: LogisticRegressionParams):
    try:
        lr = params.learning_rate
        iterations = params.iterations
        weights = np.array(params.initial_weights)

        # Prepare data with bias
        X_bias = np.c_[np.ones(X.shape[0]), X]
        costs = []

        for _ in range(iterations):
            z = X_bias @ weights
            predictions = sigmoid(z)
            errors = predictions - y
            cost = (-1 / len(y)) * np.sum(
                y * np.log(predictions) + (1 - y) * np.log(1 - predictions)
            )
            costs.append(cost)

            gradients = (1 / len(y)) * X_bias.T @ errors
            weights -= lr * gradients

        # Decision boundary
        x_min, x_max = X[:, 0].min() - 1, X[:, 0].max() + 1
        y_min, y_max = X[:, 1].min() - 1, X[:, 1].max() + 1
        xx, yy = np.meshgrid(
            np.linspace(x_min, x_max, 100),
            np.linspace(y_min, y_max, 100),
        )
        Z = sigmoid(np.c_[np.ones(xx.ravel().shape[0]), xx.ravel(), yy.ravel()] @ weights)
        Z = Z.reshape(xx.shape)

        return {
            "final_weights": weights.tolist(),
            "cost_history": costs,
            "iterations": list(range(1, iterations + 1)),
            "scatter_data": {"X": X.tolist(), "y": y.tolist()},
            "decision_boundary": {"xx": xx.tolist(), "yy": yy.tolist(), "Z": Z.tolist()},
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Support Vector Machines
class SVMParams(BaseModel):
    C: float = Field(..., gt=0, example=1.0)
    kernel: str = Field(..., example="linear")
    max_iter: int = Field(..., gt=0, le=1000, example=100)

@router.post("/simulate/svm")
async def simulate_svm(params: SVMParams):
    try:
        # Fit SVM model
        svm_model = SVC(C=params.C, kernel=params.kernel, max_iter=params.max_iter)
        svm_model.fit(X, y)

        # Decision boundary
        x_min, x_max = X[:, 0].min() - 1, X[:, 0].max() + 1
        y_min, y_max = X[:, 1].min() - 1, X[:, 1].max() + 1
        xx, yy = np.meshgrid(
            np.linspace(x_min, x_max, 100),
            np.linspace(y_min, y_max, 100),
        )
        Z = svm_model.decision_function(np.c_[xx.ravel(), yy.ravel()])
        Z = Z.reshape(xx.shape)

        return {
            "support_vectors": svm_model.support_vectors_.tolist(),
            "decision_boundary": {"xx": xx.tolist(), "yy": yy.tolist(), "Z": Z.tolist()},
            "scatter_data": {"X": X.tolist(), "y": y.tolist()},
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# K-Nearest Neighbors
class KNNParams(BaseModel):
    n_neighbors: int = Field(..., gt=0, example=3)


@router.post("/simulate/knn")
async def simulate_knn(params: KNNParams):
    try:
        knn_model = KNeighborsClassifier(n_neighbors=params.n_neighbors)
        knn_model.fit(X, y)

        # Generate predictions on a grid
        x_min, x_max = X[:, 0].min() - 1, X[:, 0].max() + 1
        y_min, y_max = X[:, 1].min() - 1, X[:, 1].max() + 1
        xx, yy = np.meshgrid(
            np.linspace(x_min, x_max, 100),
            np.linspace(y_min, y_max, 100),
        )
        Z = knn_model.predict(np.c_[xx.ravel(), yy.ravel()])
        Z = Z.reshape(xx.shape)

        return {
            "model_score": knn_model.score(X, y),
            "decision_boundary": {"xx": xx.tolist(), "yy": yy.tolist(), "Z": Z.tolist()},
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Decision Tree
class DecisionTreeParams(BaseModel):
    max_depth: int = Field(..., gt=0, le=10, example=3)

@router.post("/simulate/decision-tree")
async def simulate_decision_tree(params: DecisionTreeParams):
    try:
        dt_model = DecisionTreeClassifier(max_depth=params.max_depth)
        dt_model.fit(X, y)

        # Generate predictions on a grid
        x_min, x_max = X[:, 0].min() - 1, X[:, 0].max() + 1
        y_min, y_max = X[:, 1].min() - 1, X[:, 1].max() + 1
        xx, yy = np.meshgrid(
            np.linspace(x_min, x_max, 100),
            np.linspace(y_min, y_max, 100),
        )
        Z = dt_model.predict(np.c_[xx.ravel(), yy.ravel()])
        Z = Z.reshape(xx.shape)

        # Export decision tree as a graph
        dot_data = export_graphviz(
            dt_model,
            out_file=None,
            feature_names=["Feature 1", "Feature 2"],
            class_names=["Class 0", "Class 1"],
            filled=True,
            rounded=True,
            special_characters=True,
        )
        graph = pydotplus.graph_from_dot_data(dot_data)
        png_image = graph.create_png()

        # Encode the PNG image to base64
        image_base64 = base64.b64encode(png_image).decode("utf-8")

        return {
            "model_score": dt_model.score(X, y),
            "decision_boundary": {"xx": xx.tolist(), "yy": yy.tolist(), "Z": Z.tolist()},
            "scatter_data": {"X": X.tolist(), "y": y.tolist()},
            "tree_image": image_base64,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))