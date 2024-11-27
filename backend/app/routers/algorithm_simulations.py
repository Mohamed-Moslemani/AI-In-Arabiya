from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import List, Dict
import numpy as np

router = APIRouter()

class LinearRegressionParams(BaseModel):
    learning_rate: float = Field(..., gt=0, example=0.01)
    iterations: int = Field(..., gt=0, le=1000, example=100)
    initial_weights: List[float] = Field(..., example=[0.0, 0.0])
    data_points: List[Dict[str, float]] = Field(
        ..., example=[{"x": 1.0, "y": 2.0}, {"x": 2.0, "y": 4.1}]
    )

@router.post("/simulate/linear-regression")
async def simulate_linear_regression(params: LinearRegressionParams):
    try:
        # Extract parameters
        lr = params.learning_rate
        iterations = params.iterations
        weights = np.array(params.initial_weights)
        data = np.array([[p["x"], p["y"]] for p in params.data_points])

        # Gradient Descent Simulation
        X = np.c_[np.ones(data.shape[0]), data[:, 0]]  # Add bias term
        y = data[:, 1]
        costs = []

        for _ in range(iterations):
            predictions = X @ weights
            errors = predictions - y
            cost = (1 / (2 * len(y))) * np.sum(errors**2)
            costs.append(cost)

            # Gradient computation
            gradients = (1 / len(y)) * X.T @ errors
            weights -= lr * gradients

        return {
            "final_weights": weights.tolist(),
            "cost_history": costs,
            "iterations": list(range(1, iterations + 1)),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
