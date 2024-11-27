from fastapi import FastAPI
from app.routers.auth_routes import router as auth_router
from app.routers.algorithm_simulations import router as algo_router

app = FastAPI()

# Include routers
app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(algo_router, prefix="/algorithms", tags=["simulations"])

@app.get("/")
async def root():
    return {"message": "مرحبًا بكم في AI in Arabiya"}
