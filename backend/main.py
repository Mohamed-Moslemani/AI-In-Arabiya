from fastapi import FastAPI
from app.routers.auth_routes import router as auth_router
from app.routers.algorithm_simulations import router as algo_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"], 
)

app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(algo_router)

@app.get("/")
async def root():
    return {"message": "مرحبًا بكم في AI in Arabiya"}
