document.addEventListener('DOMContentLoaded', () => {
    const notesContainer = document.getElementById('notes');
    const addButton = document.getElementById('addButton');
    const addNewButton = document.getElementById('addNewButton');
    const noteModal = document.getElementById('noteModal');
    const deleteModal = document.getElementById('deleteModal');
    const closeModal = document.querySelectorAll('.cancelButton');
    const saveNoteButton = document.getElementById('saveNoteButton');
    const noteTitle = document.getElementById('noteTitle');
    const noteContent = document.getElementById('noteContent');
    const searchInput = document.getElementById('search');
    const clearSearchButton = document.getElementById('clearSearchButton');
    const cancelDeleteButton = document.getElementById('cancelDeleteButton');
    const confirmDeleteButton = document.getElementById('confirmDeleteButton');
    const noNotesMessage = document.getElementById('noNotesMessage');

    let notes = JSON.parse(localStorage.getItem('notes')) || [];
    let editIndex = null;
    let deleteIndex = null;

    const renderNotes = () => {
        notesContainer.replaceChildren();
        const filteredNotes = notes.filter(note => 
            note.title.toLowerCase().includes(searchInput.value.toLowerCase()) ||
            note.content.toLowerCase().includes(searchInput.value.toLowerCase())
        );
        filteredNotes.forEach((note, index) => {
            const noteElement = document.createElement('div');
            noteElement.classList.add('note');
            
            const noteTitleElement = document.createElement('h3');
            noteTitleElement.textContent = note.title;

            const noteText = document.createElement('p');
            noteText.textContent = note.content;

            const dateElement = document.createElement('p');
            dateElement.classList.add('date-element'); 
            const currentDate = new Date();
            const monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"];
            const formattedDate = `${monthNames[currentDate.getMonth()]} ${currentDate.getDate()}`;
            dateElement.textContent = formattedDate;

            const editButton = document.createElement('button');
            editButton.classList.add('edit-button');
            const editIcon = document.createElement('img');
            editIcon.src = 'assets/icon-edit.svg';
            editIcon.alt = 'edit icon';
            editButton.appendChild(editIcon);
            editButton.addEventListener('click', () => editNote(index));

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-button'); 
            const deleteIcon = document.createElement('img');
            deleteIcon.src = 'assets/icon-delete.svg';
            deleteIcon.alt = 'delete icon';
            deleteButton.appendChild(deleteIcon);
            deleteButton.addEventListener('click', () => {
                deleteIndex = index;
                deleteModal.style.display = 'block';
            });

            noteElement.appendChild(noteTitleElement);
            noteElement.appendChild(noteText);
            noteElement.appendChild(dateElement);
            noteElement.appendChild(editButton);
            noteElement.appendChild(deleteButton);
            notesContainer.appendChild(noteElement);
        });

        if (notes.length) {
            addButton.style.display = 'none';
            addNewButton.style.display = 'flex';
            noNotesMessage.style.display = 'none';
        } else {
            addButton.style.display = 'flex';
            addNewButton.style.display = 'none';
            noNotesMessage.style.display = 'block';
        }

        updateSaveButtonVisibility(); 
    };

    const editNote = (index) => {
        editIndex = index;
        noteTitle.value = notes[index].title;
        noteContent.value = notes[index].content;
        noteModal.style.display = 'block';
        updateSaveButtonVisibility(); 
    };

    const deleteNote = () => {
        notes.splice(deleteIndex, 1);
        localStorage.setItem('notes', JSON.stringify(notes));
        renderNotes();
        deleteModal.style.display = 'none';
    };

    addButton.addEventListener('click', openModal);
    addNewButton.addEventListener('click', openModal);

    function openModal() {
        editIndex = null;
        noteTitle.value = '';
        noteContent.value = '';
        noteContent.placeholder = 'Your note...';
        noteModal.style.display = 'block';
        updateSaveButtonVisibility(); 
    }

    closeModal.forEach(button => {
        button.addEventListener('click', () => {
            noteModal.style.display = 'none';
            deleteModal.style.display = 'none';
            noteContent.value = '';
            noteContent.placeholder = 'Your note...'; 
            updateSaveButtonVisibility(); 
        });
    });

    saveNoteButton.addEventListener('click', () => {
        const title = noteTitle.value.trim();
        const content = noteContent.value.trim();
        if (title || content) {
            if (editIndex !== null) {
                notes[editIndex].title = title || 'Untitled Note';
                notes[editIndex].content = content;
            } else {
                notes.push({ title: title || 'Untitled Note', content });
            }
            localStorage.setItem('notes', JSON.stringify(notes));
            renderNotes();
            noteModal.style.display = 'none';
            noteContent.value = '';
            noteContent.placeholder = 'Your note...';
            updateSaveButtonVisibility(); 
        }
    });

    noteTitle.addEventListener('input', () => {
        updateSaveButtonVisibility();
    });

    noteContent.addEventListener('input', () => {
        updateSaveButtonVisibility();
    });

    function updateSaveButtonVisibility() {
        const title = noteTitle.value.trim();
        const content = noteContent.value.trim();
        saveNoteButton.style.display = (title || content) ? 'inline-block' : 'none';
    }
    
    noteContent.addEventListener('focus', function() {
        if (this.placeholder) {
            this.removeAttribute('placeholder');
        }
    });

    noteContent.addEventListener('blur', function() {
        if (!this.value.trim()) {
            this.setAttribute('placeholder', 'Your note...');
        }
    });

    searchInput.addEventListener('input', () => {
        renderNotes();
        clearSearchButton.style.display = searchInput.value ? 'inline' : 'none';
    });

    clearSearchButton.addEventListener('click', () => {
        searchInput.value = '';
        renderNotes();
        clearSearchButton.style.display = 'none';
    });

    cancelDeleteButton.addEventListener('click', () => {
        deleteModal.style.display = 'none';
    });

    confirmDeleteButton.addEventListener('click', deleteNote);

    renderNotes();
});