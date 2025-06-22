import os 
import uuid
import psycopg 
from psycopg.rows import class_row # helps map results to classes
from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException, status
from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables from .env file to access DATABASE_URL
load_dotenv() 

# Async PostgreSQL database connection
DATABASE_URL = os.getenv("DATABASE_URL")
# --- Authentication ---
# placeholder for function that will verify user's JWT auth and return user ID 
async def get_current_user_id():
    #temp hardcoded user id for development 
    #Replace this with real user id from validated token
    return "ed89beb9-988f-4411-86c0-f8d1e6b0e272"

#creates app instance
app = FastAPI()

#using vite frontend origin
origins = ["http://localhost:5173"]

#Add CORS middleware allowing our frontend to communicate with this backend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],

)

# -- Pydantic Models -- 
# when a user creates a goal,, it will be used for automatic validation 
class CreateGoal(BaseModel):
    title: str
    description: Optional[str] = None # description is optional

class GoalResponse(BaseModel):
    #Config allows pydantic to map data from database record objects directly to the fields of this model 
    id: int
    model_config = ConfigDict(from_attributes=True)
    user_id: uuid.UUID
    title: str
    description: Optional[str] = None
    created_at: datetime

# -- API Endpoints --

@app.get("/api/test")
async def read_root():
    return {"message": "Pathfinder backend is running"}



@app.post("/api/v1/goals", status_code=status.HTTP_201_CREATED, response_model= GoalResponse, tags=["Goals"] )
async def create_goal(
    goal: CreateGoal,
    user_id: str = Depends(get_current_user_id)
):
    """
    Create a new goal in the db for the user identified by the dependency
    """
    try:
        # The "async with" context manager ensures the connection is properly closed, even if errors occur to prevent resource leaks
        async with await psycopg.AsyncConnection.connect(DATABASE_URL) as aConnection:
            # Using row_factory allows us to map db results directly into a specific class
            #(Avoids need to manually convert db rows and is more type safe)
            aConnection.row_factory = class_row(GoalResponse)

            async with aConnection.cursor() as aCursor:
                # RETURNING clause allows us to get the inserted row data back without a second query.
                result = await aCursor.execute(
                    """
                    INSERT INTO goals (user_id, title, description)
                    VALUES (%s, %s, %s)
                    RETURNING id, user_id, title, description, created_at
                    """,
                    (user_id, goal.title, goal.description)
                )
                # the async with block handles the commit when successful
                new_goal = await result.fetchone()
                return new_goal

    except Exception as e:
        # generic error to avoid leaking sensitive database details to the client
        print(f"Error creating goal: {e}") #Log specific error for debugging

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while creating the goal."
        )