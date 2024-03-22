const noteForm = document.getElementById("addNoteForm");
const noteInput = document.getElementById("noteInput");
const noteList = document.getElementById("noteList");

noteForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const note = noteInput.value.trim();
    if (note !== "") {
        await fetch("/http://localhost:8000/notes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ note })
        });
        noteInput.value = "";
        fetchNotes();
    }
});

async function fetchNotes() {
    const response = await fetch("http://localhost:8000/notes");
    const data = await response.json();
    renderNotes(data);
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
