document.addEventListener('DOMContentLoaded', function () {
    const addNoteForm = document.getElementById('addNoteForm');
    const notesContainer = document.getElementById('notesContainer');

    addNoteForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const formData = new FormData(addNoteForm);
        const noteData = {};
        formData.forEach((value, key) => {
            noteData[key] = value;
        });

        try {
            const response = await fetch('http://127.0.0.1:8000/notes/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(noteData)
            });

            if (!response.ok) {
                throw new Error('Failed to add note');
            }

            addNoteForm.reset();
            loadNotes();
        } catch (error) {
            console.error('Error adding note:', error);
        }
    });

    async function loadNotes() {
        try {
            const response = await fetch('http://127.0.0.1:8000/notes/');
            const notes = await response.json();
            displayNotes(notes);
        } catch (error) {
            console.error('Error loading notes:', error);
        }
    }

    function displayNotes(notes) {
        notesContainer.innerHTML = '';
        notes.forEach((note, index) => {
            const noteElement = document.createElement('div');
            noteElement.className = 'note bg-gray-100 rounded-md p-4 mb-4';
            noteElement.innerHTML = `<h3 class="text-lg font-semibold mb-2">${note.title}</h3><p>${note.content}</p>`;
            notesContainer.appendChild(noteElement);

            const updateButton = document.createElement('button');
            updateButton.textContent = 'Update';
            updateButton.className = 'bg-gray-700 text-white py-2 px-4 rounded-md mr-2 transition duration-300 hover:bg-gray-600';

            updateButton.addEventListener('click', async function () {
                const textarea = document.createElement('textarea');
                textarea.className = 'note-content w-full px-4 py-2 rounded-md border border-gray-300 mb-4';
                textarea.value = note.content;

                noteElement.replaceChild(textarea, noteElement.querySelector('p'));
                
                const saveButton = document.createElement('button');
                saveButton.textContent = 'Save';
                saveButton.className = 'bg-blue-500 text-white py-2 px-4 rounded-md mr-2 transition duration-300 hover:bg-blue-600';

                saveButton.addEventListener('click', async function () {
                    const updatedContent = textarea.value;

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

                        loadNotes();
                    } catch (error) {
                        console.error('Error updating note:', error);
                    }
                });

                noteElement.replaceChild(saveButton, updateButton);
            });

            noteElement.appendChild(updateButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.className = 'bg-black text-white py-2 px-4 rounded-md transition duration-300 hover:bg-gray-800';

            deleteButton.addEventListener('click', async function () {
                const confirmDelete = true;
                if (confirmDelete) {
                    try {
                        const response = await fetch(`http://127.0.0.1:8000/notes/${index}`, {
                            method: 'DELETE'
                        });

                        if (!response.ok) {
                            throw new Error('Failed to delete note');
                        }

                        loadNotes();
                    } catch (error) {
                        console.error('Error deleting note:', error);
                    }
                }
            });
            noteElement.appendChild(deleteButton);
        });
    }

    loadNotes();

    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('change', function () {
        if (this.checked) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    });
});
