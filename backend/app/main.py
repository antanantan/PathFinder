from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

#creates app instance
app = FastAPI()

#using vite frontend origin
origins = ["http://localhost:5173"]

#Add CORS middleware to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],

)

@app.get("/api/test")
async def read_root():
    return {"message": "Pathfinder backend is running"}