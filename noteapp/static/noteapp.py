from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
from typing import List

class Note(BaseModel):
    title: str
    content: str
    created_at: datetime = datetime.now()




app = FastAPI()
# Enable CORS (Cross-Origin Resource Sharing)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500"],  # Replace with the origin of your frontend
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)
notes_db = []

@app.post("/notes/")
async def create_note(note: Note):
    notes_db.append(note)
    return note

@app.get("/notes/", response_model=List[Note])  # Use List[Note] as the response model
async def get_all_notes():
    return notes_db

@app.get("/notes/{note_id}")
async def get_note(note_id: int):
    for note in notes_db:
        if note_id == notes_db.index(note):
            return note
    raise HTTPException(status_code=404, detail="Note not found")

@app.put("/notes/{note_id}")
async def update_note(note_id: int, note: Note):
    if note_id >= len(notes_db):
        raise HTTPException(status_code=404, detail="Note not found")
    notes_db[note_id] = note
    return note

@app.delete("/notes/{note_id}")
async def delete_note(note_id: int):
    if note_id >= len(notes_db):
        raise HTTPException(status_code=404, detail="Note not found")
    deleted_note = notes_db.pop(note_id)
    return deleted_note
