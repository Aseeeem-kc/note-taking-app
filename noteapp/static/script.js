const noteForm = document.getElementById("addNoteForm");
const noteInput = document.getElementById("noteInput");
const noteList = document.getElementById("noteList");

noteForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const note = noteInput.value.trim();
    console.log(note);
    if (note !== "") {
        try {
            const response = await fetch("http://localhost:8000/notes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ note })
            });
            if (!response.ok) {
                throw new Error("Failed to add note");
            }
            noteInput.value = "";
            fetchNotes();
        } catch (error) {
            console.error("Error adding note:", error.message);
        }
    }
});

async function fetchNotes() {
    try {
        const response = await fetch("http://localhost:8000/notes");
        if (!response.ok) {
            throw new Error("Failed to fetch notes");
        }
        const data = await response.json();
        renderNotes(data);
    } catch (error) {
        console.error("Error fetching notes:", error.message);
    }
}

function renderNotes(notes) {
    noteList.innerHTML = "";
    notes.forEach(note => {
        const li = document.createElement("li");
        li.textContent = note;
        noteList.appendChild(li);
    });
}

fetchNotes();
