from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can specify specific origins here, e.g., ["http://localhost", "http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

notes = []

# Mount the directory containing static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Define your FastAPI routes and application logic here
@app.get("/notes")
async def get_notes():
    return notes

@app.post("/notes")
async def create_note(note: str):
    notes.append(note)
    return {"message": "Note created successfully"}

# Implement update and delete endpoints similarly
