document.addEventListener('DOMContentLoaded', function () {
    const addNoteForm = document.getElementById('addNoteForm');
    const notesContainer = document.getElementById('notesContainer');

    addNoteForm.addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent the default form submission behavior

        const formData = new FormData(addNoteForm); // Get form data

        // Convert form data to JSON object
        const noteData = {};
        formData.forEach((value, key) => {
            noteData[key] = value;
        });

        // Send POST request to create a new note
        try {
            const response = await fetch('http://127.0.0.1:8000/notes/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(noteData) // Convert data to JSON string
            });

            if (!response.ok) {
                throw new Error('Failed to add note');
            }

            // Clear the form after successful submission
            addNoteForm.reset();

            // Reload notes after adding a new one
            loadNotes();
        } catch (error) {
            console.error('Error adding note:', error);
        }
    });

    // Function to load notes from the server
    async function loadNotes() {
        try {
            const response = await fetch('http://127.0.0.1:8000/notes/');
            const notes = await response.json();
            displayNotes(notes);
        } catch (error) {
            console.error('Error loading notes:', error);
        }
    }

    // Function to display notes in the container
    function displayNotes(notes) {
        notesContainer.innerHTML = '';
        notes.forEach((note, index) => {
            const noteElement = document.createElement('div');
            noteElement.className = 'note bg-gray-100 rounded-md p-4 mb-4';
            noteElement.innerHTML = `<h3 class="text-lg font-semibold mb-2">${note.title}</h3><p>${note.content}</p>`;
            notesContainer.appendChild(noteElement);

            // Add update and delete buttons
            const updateButton = document.createElement('button');
            updateButton.textContent = 'Update';
            updateButton.className = 'bg-gray-700 text-white py-2 px-4 rounded-md mr-2 transition duration-300 hover:bg-gray-600';

            updateButton.addEventListener('click', async function () {
                const textarea = document.createElement('textarea');
                textarea.className = 'note-content w-full px-4 py-2 rounded-md border border-gray-300 mb-4';
                textarea.value = note.content;

                // Replace the paragraph with the textarea for editing
                noteElement.replaceChild(textarea, noteElement.querySelector('p'));
                
                // Create a save button
                const saveButton = document.createElement('button');
                saveButton.textContent = 'Save';
                saveButton.className = 'bg-blue-500 text-white py-2 px-4 rounded-md mr-2 transition duration-300 hover:bg-blue-600';

                // Save button event listener
                saveButton.addEventListener('click', async function () {
                    // Get the updated content from the textarea
                    const updatedContent = textarea.value;

                    // Send PUT request to update the note
                    try {
                        const response = await fetch(`http://127.0.0.1:8000/notes/${index}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ title: note.title, content: updatedContent })
                        });

                        if (!response.ok) {
                            throw new Error('Failed to update note');
                        }

                        // Reload notes after updating
                        loadNotes();
                    } catch (error) {
                        console.error('Error updating note:', error);
                    }
                });

                // Replace update button with save button
                noteElement.replaceChild(saveButton, updateButton);
            });

            // Add update button to note element
            noteElement.appendChild(updateButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.className = 'bg-black text-white py-2 px-4 rounded-md transition duration-300 hover:bg-gray-800';

            deleteButton.addEventListener('click', async function () {
                // const confirmDelete = confirm('Are you sure you want to delete this note?');
                const confirmDelete = true;
                if (confirmDelete) {
                    // Send DELETE request to delete the note
                    try {
                        const response = await fetch(`http://127.0.0.1:8000/notes/${index}`, {
                            method: 'DELETE'
                        });

                        if (!response.ok) {
                            throw new Error('Failed to delete note');
                        }

                        // Reload notes after deletion
                        loadNotes();
                    } catch (error) {
                        console.error('Error deleting note:', error);
                    }
                }
            });
            noteElement.appendChild(deleteButton);
        });
    }

    // Load notes when the page loads
    loadNotes();
});
