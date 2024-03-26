// Function to fetch all notes from the backend
async function fetchNotes() {
    const response = await fetch('http://127.0.0.1:8000/notes/');
    const notes = await response.json();
    return notes;
}

// Function to render notes on the page
async function renderNotes() {
    const notes = await fetchNotes();
    const notesContainer = document.getElementById('notesContainer'); // Update to correct ID
    // Clear previous content
    notesContainer.innerHTML = '';
    notes.forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.innerHTML = `
            <h2>${note.title}</h2>
            <p>${note.content}</p>
            <button onclick="editNote(${note.id})">Edit</button>
            <button onclick="deleteNote(${note.id})">Delete</button>
        `;
        notesContainer.appendChild(noteElement);
    });
}


// Function to add a new note
async function addNote() {
    const form = document.getElementById('addNoteForm');
    const formData = new FormData(form);
    const response = await fetch('http://127.0.0.1:8000/notes/', {
        method: 'POST',
        body: formData
    });
    if (response.ok) {
        renderNotes();
        form.reset(); // Reset the form fields
    } else {
        alert('Failed to add note');
        console.log(response.status);
console.log(await response.text());

    }
}

// Function to delete a note
async function deleteNote(noteId) {
    const response = await fetch(`http://127.0.0.1:8000/notes/${noteId}`, {
        method: 'DELETE'
    });
    if (response.ok) {
        renderNotes();
    } else {
        alert('Failed to delete note');
    }
}

// Function to edit a note (not implemented in this example)
function editNote(noteId) {
    // Implement edit functionality if needed
    alert('Edit functionality not implemented in this example');
}

// Render initial notes when the page loads
document.addEventListener('DOMContentLoaded', () => {
    renderNotes();
});

// Attach event listener to the form submission
document.getElementById('addNoteForm').addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent default form submission
    addNote(); // Call addNote function to add a new note
});