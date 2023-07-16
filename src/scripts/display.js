import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/brands';
import '@fortawesome/fontawesome-free/js/solid';
import '../styles/main.css';
import { Storage } from './Storage.js';
import { Note } from './Note.js';
import { Task } from './Task.js';
import { Project } from './Project.js';
import { isPast } from 'date-fns/esm';
import { isToday } from 'date-fns';

class display {
    static getToDoList() {
        return this.toDoList;
    }

    static setToDoList(toDoList) {
        this.toDoList = toDoList;
    }

    // Shows or hides tasks after show tasks button click on toolbar.
    static displayProjectTasks() {
        const project = document.getElementById('display-project');
        const showTasks = document.getElementById('btn-show-tasks');
        const icon = document.createElement('i');
        icon.classList.add('fa-solid');
        icon.classList.add('fa-list-check');

        if (project.classList.contains('show-tasks')) {
            project.classList.remove('show-tasks');
            showTasks.textContent = 'Show Tasks';
            showTasks.prepend(icon);
        }
        else {
            project.classList.add('show-tasks');
            showTasks.textContent = 'Hide Tasks';
            showTasks.prepend(icon);
        }
    }

    // Shows or hides notes after show notes button click on toolbar.
    static displayProjectNotes() {
        const project = document.getElementById('display-project');
        const showNotes = document.getElementById('btn-show-notes');
        const icon = document.createElement('i');
        icon.classList.add('fa-solid');
        icon.classList.add('fa-note-sticky');

        if (project.classList.contains('show-notes')) {
            project.classList.remove('show-notes');
            showNotes.textContent = 'Show Notes';
            showNotes.prepend(icon);
        }
        else {
            project.classList.add('show-notes');
            showNotes.textContent = 'Hide Notes';
            showNotes.prepend(icon);
        }
    }

    // Creates a note container with the note object passed in and assigns to note grid. 
    static createNoteContainer(note) {
        const noteGrid = document.getElementById('project-notes-grid');
        const noteContainer = document.createElement('div');
        const noteHeader = document.createElement('div');
        const title = document.createElement('p');
        const deleteNoteContainer = document.createElement('div');
        const iconDelete = document.createElement('i');
        const content = document.createElement('p');
        const contentEditForm = document.createElement('form');
        const contentEdit = document.createElement('textarea');
        const contentSubmit = document.createElement('button');
        const contentCancel = document.createElement('button');
        const contentSubmitIcon = document.createElement('i');
        const contentCancelIcon = document.createElement('i');
        const contentEditError = document.createElement('span');

        noteContainer.classList.add('note-container');

        noteHeader.classList.add('note-header');

        content.id = 'content';

        iconDelete.classList.add('fa-solid');
        iconDelete.classList.add('fa-trash');
        iconDelete.classList.add('icon');

        title.textContent = note.name;

        content.textContent = note.content;

        contentEditForm.noValidate = true;
        contentEditForm.action = '#';

        contentEdit.minLength = 3;
        contentEdit.maxLength = 500;
        contentEdit.required = true;
        contentEdit.placeholder = 'Enter note content...'
        contentEdit.autocomplete = 'off';
        contentEdit.value = note.content;

        contentSubmit.type = 'submit';

        contentCancel.type = 'button';

        contentSubmitIcon.classList.add('fa-solid');
        contentSubmitIcon.classList.add('fa-check');
        contentSubmitIcon.classList.add('icon');

        contentCancelIcon.classList.add('fa-solid');
        contentCancelIcon.classList.add('fa-x');
        contentCancelIcon.classList.add('icon');

        contentEditError.classList.add('error');

        // Delete note then refresh.
        deleteNoteContainer.addEventListener('click', (e) => {
            const projectHeading = document.getElementById('project-heading');
            Storage.deleteNote(projectHeading.textContent, e.target.parentNode.parentNode.parentNode.children[0].textContent);
            this.displayProject(projectHeading.textContent);
        });

        // Hide note content and display edit form.
        content.addEventListener('click', () => {
            content.style.display = 'none';
            contentEditForm.style.display = 'grid';
        });

        // Validate content input and display error messages.
        contentEdit.addEventListener('input', () => {
            if (contentEdit.validity.tooShort) {
                contentEditError.textContent = 'Content needs to be at least 3 characters';
                contentEditError.classList.add('active');
                contentEdit.style.border = '2px solid #930A0A';
            }
            else if (contentEdit.validity.valueMissing) {
                contentEditError.textContent = 'Content is required';
                contentEditError.classList.add('active');
                contentEdit.style.border = '2px solid #930A0A';
            }
            else if (contentEdit.checkValidity()) {
                contentEditError.textContent = '';
                contentEditError.classList.remove('active');
                contentEdit.style.border = '2px solid var(--valid-color)';
            }
        });

        // Validate content submission and display error messages. Update content if valid.
        contentEditForm.addEventListener('submit', (e) => {
            if (contentEdit.validity.tooShort) {
                contentEditError.textContent = 'Content needs to be at least 3 characters';
                contentEditError.classList.add('active');
                contentEdit.style.border = '2px solid #930A0A';
            }
            else if (contentEdit.validity.valueMissing) {
                contentEditError.textContent = 'Content is required';
                contentEditError.classList.add('active');
                contentEdit.style.border = '2px solid #930A0A';
            }

            if (contentEditForm.checkValidity()) {
                e.preventDefault();
                note.content = contentEdit.value;
                contentEditError.classList.remove('active');
                contentEditError.textContent = '';
                content.textContent = contentEdit.value;
                content.style.display = 'inline-block';
                contentEdit.style.border = 'none';
                contentEditForm.style.display = 'none';
                Storage.saveToDoList(this.getToDoList());
            }
            else {
                e.preventDefault();
            }
        });

        // Hide edit form and display content.
        contentCancel.addEventListener('click', () => {
            contentEditError.classList.remove('active');
            contentEditError.textContent = '';
            content.style.display = 'inline-block';
            contentEdit.style.border = 'none';
            contentEditForm.style.display = 'none';
        });

        deleteNoteContainer.appendChild(iconDelete);

        contentSubmit.appendChild(contentSubmitIcon);
        contentCancel.appendChild(contentCancelIcon);

        contentEditForm.appendChild(contentEdit);
        contentEditForm.appendChild(contentEditError);
        contentEditForm.appendChild(contentSubmit);
        contentEditForm.appendChild(contentCancel);

        noteHeader.appendChild(title);
        noteHeader.appendChild(deleteNoteContainer);
        noteContainer.appendChild(noteHeader);
        noteContainer.appendChild(content);
        noteContainer.appendChild(contentEditForm);
        noteGrid.appendChild(noteContainer);
    }

    // Creates a task container with the note object passed in and assigns to note grid. 
    static createTaskContainer(task) {
        const taskGrid = document.getElementById('project-tasks-grid');
        const taskContainer = document.createElement('div');

        const iconCircleContainer = document.createElement('div');
        const iconCircle = document.createElement('i');

        const taskName = document.createElement('p');
        const taskNameEditForm = document.createElement('form');
        const taskNameEdit = document.createElement('input');
        const taskNameEditSubmit = document.createElement('button');
        const taskNameEditCancel = document.createElement('button');
        const taskNameEditSubmitIcon = document.createElement('i');
        const taskNameEditCancelIcon = document.createElement('i');
        const taskNameEditError = document.createElement('span');

        const projectName = document.createElement('p');

        const iconTrashContainer = document.createElement('div');
        const iconTrash = document.createElement('i');

        const dueDateEditForm = document.createElement('form');
        const dueDate = document.createElement('p');
        const dueDateEdit = document.createElement('input');
        const dueDateEditSubmit = document.createElement('button');
        const dueDateEditCancel = document.createElement('button');
        const dueDateEditSubmitIcon = document.createElement('i');
        const dueDateEditCancelIcon = document.createElement('i');
        const dueDateEditError = document.createElement('span');

        taskContainer.classList.add('task-container');

        // Assigns check on retrieved status.
        if (!task.getStatus()) {
            iconCircle.classList.add('fa-solid');
            iconCircle.classList.add('fa-circle');
        }
        else {
            iconCircle.classList.add('fa-solid');
            iconCircle.classList.add('fa-circle-check');
            taskContainer.classList.add('complete');
        }

        taskName.textContent = task.getName();

        taskNameEditForm.noValidate = true;
        taskNameEditForm.action = '#';

        taskNameEdit.type = 'text';
        taskNameEdit.placeholder = 'Enter new task name...';
        taskNameEdit.minLength = 3;
        taskNameEdit.autocomplete = false;
        taskNameEdit.maxLength = 200;
        taskNameEdit.required = true;

        taskNameEditSubmit.type = 'submit';

        taskNameEditCancel.type = 'button';

        taskNameEditSubmitIcon.classList.add('fa-solid');
        taskNameEditSubmitIcon.classList.add('fa-check');
        taskNameEditSubmitIcon.classList.add('icon');

        taskNameEditCancelIcon.classList.add('fa-solid');
        taskNameEditCancelIcon.classList.add('fa-x');
        taskNameEditCancelIcon.classList.add('icon');

        taskNameEditError.classList.add('error');

        iconTrash.classList.add('fa-solid');
        iconTrash.classList.add('fa-trash');

        dueDate.textContent = task.getDueDate();

        dueDateEditForm.noValidate = true;
        dueDateEditForm.action = '#';

        dueDateEdit.type = 'date';

        dueDateEditSubmit.type = 'submit';

        dueDateEditCancel.type = 'button';

        dueDateEditSubmitIcon.classList.add('fa-solid');
        dueDateEditSubmitIcon.classList.add('fa-check');
        dueDateEditSubmitIcon.classList.add('icon');

        dueDateEditCancelIcon.classList.add('fa-solid');
        dueDateEditCancelIcon.classList.add('fa-x');
        dueDateEditCancelIcon.classList.add('icon');

        dueDateEditError.classList.add('error');

        // Flips status on click.
        iconCircleContainer.addEventListener('click', (e) => {
            if (!task.getStatus()) {
                e.target.parentNode.classList.remove('fa-circle');
                e.target.parentNode.classList.add('fa-circle-check');
                taskContainer.classList.add('complete');
                task.setStatus(true);
                Storage.saveToDoList(this.getToDoList());
            }
            else {
                e.target.parentNode.classList.remove('fa-circle-check');
                e.target.parentNode.classList.add('fa-circle');
                taskContainer.classList.remove('complete');
                task.setStatus(false);
                Storage.saveToDoList(this.getToDoList());
            }
        });

        // Deletes task then refreshes.
        iconTrashContainer.addEventListener('click', (e) => {
            const projectHeading = document.getElementById('project-heading');
            const project = this.toDoList.getProject(projectHeading.textContent);
            Storage.deleteTask(project.getName(), e.target.parentNode.parentNode.parentNode.children[1].textContent);
            this.displayProject(project.getName());
        });

        // Hides task name and displays task edit form.
        taskName.addEventListener('click', () => {
            taskName.style.display = 'none';
            taskNameEditForm.style.display = 'grid';
            taskNameEdit.value = taskName.textContent;
        });

        // Redirects to project upon click.
        projectName.addEventListener('click', () => {
            this.displayProject(projectName.textContent.replace(/[()]/g, ''));
            const viewProjectButtons = document.querySelectorAll('.btn-view-project');
            viewProjectButtons.forEach((button) => {
                if (button.textContent === projectName.textContent.replace(/[()]/g, '')) {
                    button.classList.add('active');
                }
                else {
                    button.classList.remove('active');
                }
            })
        });

        // Hides due date and displays due date edit form.
        dueDate.addEventListener('click', () => {
            dueDate.style.display = 'none';
            dueDateEditForm.style.display = 'grid';
            dueDateEdit.value = dueDate.textContent;
        });

        // Hides task name edit form and displays task name.
        taskNameEditCancel.addEventListener('click', () => {
            taskNameEdit.style.border = 'none';
            taskNameEditError.textContent = '';
            taskNameEditError.classList.remove('active');
            taskName.style.display = 'inline-block';
            taskNameEdit.value = '';
            taskNameEditForm.style.display = 'none';
        });

        // Hides due date edit form and displays due date.
        dueDateEditCancel.addEventListener('click', () => {
            dueDate.style.display = 'inline-block';
            dueDateEdit.value = '';
            dueDateEdit.style.border = 'none';
            dueDateEditError.textContent = '';
            dueDateEditError.classList.remove('active');
            dueDateEditForm.style.display = 'none';
        });

        // Validates task name edit input and displays error messages.
        taskNameEdit.addEventListener('input', () => {
            if (taskNameEdit.validity.tooShort) {
                taskNameEditError.textContent = 'Name needs to be at least 3 characters';
                taskNameEditError.classList.add('active');
                taskNameEdit.style.border = '2px solid var(--error-color)';
            }
            else if (taskNameEdit.validity.valueMissing) {
                taskNameEditError.textContent = 'Name is required';
                taskNameEditError.classList.add('active');
                taskNameEdit.style.border = '2px solid var(--error-color)';
            }
            else if (taskNameEdit.checkValidity()) {
                taskNameEditError.textContent = '';
                taskNameEditError.classList.remove('active');
                taskNameEdit.style.border = '2px solid var(--valid-color)';
            }
        });

        // Validates due date edit input and displays error messages.
        dueDateEdit.addEventListener('input', () => {
            if (isPast(new Date(dueDateEdit.value))) {
                if(!isToday(new Date(dueDateEdit.value))) {
                    dueDateEditError.textContent = 'Due date is in the past';
                    dueDateEditError.classList.add('active');
                    dueDateEdit.style.border = '2px solid var(--error-color)';
                    return;
                }
            }
            dueDateEditError.textContent = '';
            dueDateEditError.classList.remove('active');
            dueDateEdit.style.border = '2px solid var(--valid-color)';
        });

        //  Validates task name edit submission. Updates and saves task name if valid.
        taskNameEditForm.addEventListener('submit', (e) => {
            if (taskNameEdit.validity.tooShort) {
                taskNameEditError.textContent = 'Name needs to be at least 3 characters';
                taskNameEditError.classList.add('active');
                taskNameEdit.style.border = '2px solid var(--error-color)';
            }
            else if (taskNameEdit.validity.valueMissing) {
                taskNameEditError.textContent = 'Name is required';
                taskNameEditError.classList.add('active');
                taskNameEdit.style.border = '2px solid var(--error-color)';
            }

            if (taskNameEditForm.checkValidity()) {
                e.preventDefault();
                task.setName(taskNameEdit.value);
                taskNameEditError.classList.remove('active');
                taskNameEditError.textContent = '';
                taskName.textContent = taskNameEdit.value;
                taskName.style.display = 'inline-block';
                taskNameEdit.style.border = 'none';
                taskNameEdit.value = '';
                taskNameEditForm.style.display = 'none';
                Storage.saveToDoList(this.getToDoList());
            }
            else {
                e.preventDefault();
            }
        });

        // Validates due date edit submission. Updates and saves due date if valid. 
        dueDateEditForm.addEventListener('submit', (e) => {
            if (isPast(new Date(dueDateEdit.value))) {
                if(!isToday(new Date(dueDateEdit.value))) {
                    dueDateEditError.textContent = 'Due date is in the past';
                    dueDateEditError.classList.add('active');
                    dueDateEdit.style.border = '2px solid var(--error-color)';
                    return;
                }
            }
            
            if(dueDateEdit.validity.valueMissing) {
                dueDateEditError.textContent = 'Due date is required';
                dueDateEditError.classList.add('active');
                dueDateEdit.style.border = '2px solid var(--error-color)';
                return;
            }

            e.preventDefault();
            task.setDueDate(dueDateEdit.value);
            dueDateEditError.textContent = '';
            dueDateEditError.classList.remove('active');
            dueDate.textContent = dueDateEdit.value;
            dueDate.style.display = 'inline-block';
            dueDateEdit.style.border = 'none';
            dueDateEdit.value = '';
            dueDateEditForm.style.display = 'none';
            Storage.saveToDoList(this.getToDoList());
        });

        iconCircleContainer.appendChild(iconCircle);
        iconTrashContainer.appendChild(iconTrash);

        taskNameEditSubmit.appendChild(taskNameEditSubmitIcon);
        taskNameEditCancel.appendChild(taskNameEditCancelIcon);
        dueDateEditSubmit.appendChild(dueDateEditSubmitIcon);
        dueDateEditCancel.appendChild(dueDateEditCancelIcon);

        taskNameEditForm.appendChild(taskNameEdit);
        taskNameEditForm.appendChild(taskNameEditSubmit);
        taskNameEditForm.appendChild(taskNameEditCancel);
        taskNameEditForm.appendChild(taskNameEditError);

        dueDateEditForm.appendChild(dueDateEdit);
        dueDateEditForm.appendChild(dueDateEditSubmit);
        dueDateEditForm.appendChild(dueDateEditCancel);
        dueDateEditForm.appendChild(dueDateEditError);

        taskContainer.appendChild(iconCircleContainer);
        taskContainer.appendChild(taskName);
        taskContainer.appendChild(taskNameEditForm);

        // If task is due today.
        if (this.getToDoList().getProject('Today').contains(task.getName())) {
            // Find which project it belongs to.
            this.getToDoList().getProjects().forEach((project) => {
                // Not including the today and this week projects themselves.
                if (project.getName() !== 'Today' && project.getName() !== 'This Week') {
                    // If project contains task.
                    if (project.contains(task.getName())) {
                        // If we are creating tasks for the today project display.
                        if (document.getElementById('project-heading').textContent === 'Today') {
                            projectName.textContent = `(${project.getName()})`; 
                            taskContainer.classList.add('show-project-name');
                            taskContainer.appendChild(projectName);
                        }
                    }
                }
            });
        }

        // If task is due this week.
        if (this.getToDoList().getProject('This Week').contains(task.getName())) {
            // Find which project it belongs to.
            this.getToDoList().getProjects().forEach((project) => {
                // Not including the today and this week projects themselves.
                if (project.getName() !== 'Today' && project.getName() !== 'This Week') {
                    // If project contains task.
                    if (project.contains(task.getName())) {
                        // If we are creating tasks for the this week project display.
                        if (document.getElementById('project-heading').textContent === 'This Week') {
                            projectName.textContent = `(${project.getName()})`; 
                            taskContainer.classList.add('show-project-name');
                            taskContainer.appendChild(projectName);
                        }
                    }
                }
            });
        }

        taskContainer.appendChild(dueDate);
        taskContainer.appendChild(dueDateEditForm);
        taskContainer.appendChild(iconTrashContainer);
        taskGrid.appendChild(taskContainer);
    }

    // Creates a note container for each note passed through as an array.
    static updateNotes(notes) {
        const notesGrid = document.getElementById('project-notes-grid');
        notesGrid.innerHTML = '';
        notes.forEach((note) => {
            this.createNoteContainer(note);
        });
    }

    // Creates a task container for each task passed through as an array.
    static updateTasks(tasks) {
        const taskGrid = document.getElementById('project-tasks-grid');
        taskGrid.innerHTML = '';
        tasks.forEach((task) => {
            this.createTaskContainer(task);   
        });
    }

    // Displays a selected project and passes through the retrieved tasks and notes gathered from the project.
    static displayProject(projectName) {
        this.setToDoList(Storage.getToDoList());
        const project = this.getToDoList().getProject(projectName);
        const projectHeading = document.getElementById('project-heading');
        projectHeading.textContent = project.getName();
        const taskArr = [];

        // If the project is today/this week, gather tasks today from projects not including today and this week.
        if (project.getName() === 'Today') {
            this.getToDoList().getProjects().forEach((projectInArr) => {
                if (projectInArr.getName() !== 'Today' && projectInArr.getName() !== 'This Week') {
                    projectInArr.getTasksToday().forEach((task) => {
                        taskArr.push(task);
                    });
                }
            });
            project.setTasks(taskArr);
            Storage.saveToDoList(this.getToDoList());
            this.updateTasks(project.getTasks());
        }
        else if (project.getName() === 'This Week') {
            this.getToDoList().getProjects().forEach((projectInArr) => {
                if (projectInArr.getName() !== 'Today' && projectInArr.getName() !== 'This Week') {
                    projectInArr.getTasksThisWeek().forEach((task) => {
                        taskArr.push(task);
                    });
                }
            });
            project.setTasks(taskArr);
            Storage.saveToDoList(this.getToDoList());
            this.updateTasks(project.getTasks());
        }
        else {
            this.updateTasks(project.getTasks());
            this.updateNotes(project.getNotes());
        }
    }

    // Closes all modals and creates new project with passed project name. Project is saved and generated projects updated on display.
    static handleAddProjectModal(newProjectName) {
        this.closeAllModals();
        const newProject = new Project(newProjectName);
        Storage.addProject(newProject);
        this.updateGeneratedProjects();
    }

    // Closes all modals and creates new task with passed name and due date. Task is added to current project, is saved and tasks are updated on display.
    static handleAddTaskModal(newTaskName, newDueDate) {
        this.closeAllModals();
        const newTask = new Task(newTaskName, newDueDate);
        const currentProject = document.getElementById('project-heading');
        Storage.addTask(currentProject.textContent, newTask);
        this.setToDoList(Storage.getToDoList());
        this.updateTasks(this.getToDoList().getProject(currentProject.textContent).getTasks());
    }

    // Closes all modals and creates new note with passed name and content. Note is added to current project, is saved and notes are updated on display.
    static handleAddNoteModal(newNoteName, newNoteContent) {
        this.closeAllModals();
        const newNote = new Note(newNoteName, newNoteContent);
        const currentProject = document.getElementById('project-heading');
        Storage.addNote(currentProject.textContent, newNote);
        this.setToDoList(Storage.getToDoList());
        this.updateNotes(this.getToDoList().getProject(currentProject.textContent).getNotes());
    }

    // Grabs references to all modal elements and removes the active class, values and resets border. 
    static closeAllModals() {
        const modals = document.querySelectorAll('.modal');
        const overlay = document.getElementById('overlay');

        const projectNameField = document.getElementById('project-name-field');
        const projectNameError = document.getElementById('project-name-error');

        const taskNameField = document.getElementById('task-name-field');
        const taskNameError = document.getElementById('task-name-error');
        const dueDateField = document.getElementById('due-date-field');
        const dueDateError = document.getElementById('due-date-error');

        const noteTitleField = document.getElementById('note-title-field');
        const noteTitleError = document.getElementById('note-title-error');
        const noteContentField = document.getElementById('note-content-field');
        const noteContentError = document.getElementById('note-content-error');

        modals.forEach((modal) => {
            modal.classList.remove('active');
        });
        overlay.classList.remove('active');
        projectNameError.classList.remove('active');
        taskNameError.classList.remove('active');
        dueDateError.classList.remove('active');
        noteTitleError.classList.remove('active');
        noteContentError.classList.remove('active');

        projectNameError.textContent = '';
        taskNameError.textContent = '';
        dueDateError.textContent = '';
        noteTitleError.textContent = '';
        noteContentError.textContent = '';

        projectNameField.value = '';
        taskNameField.value = '';
        dueDateField.value = '';
        noteTitleField.value = '';
        noteContentField.value = '';

        projectNameField.style.border = 'none';
        taskNameField.style.border = 'none';
        dueDateField.style.border = 'none';
        noteTitleField.style.border = 'none';
        noteContentField.style.border = 'none';
    }


    // Adds active class to passed modal.
    static openModal(modalName) {
        const modal = document.getElementById(modalName);
        const overlay = document.getElementById('overlay');
        modal.classList.add('active');
        overlay.classList.add('active');
    }

    // Initializes keyboard access with escape to close all modals (enter is the default key to submit in forms).
    static initKeyboardInput() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        })
    }

    // Initializes create note modal validation.
    static initCreateNoteValidation() {
        const noteTitleField = document.getElementById('note-title-field');
        const noteTitleError = document.getElementById('note-title-error');
        const noteContentField = document.getElementById('note-content-field');
        const noteContentError = document.getElementById('note-content-error');
        const createNoteForm = document.getElementById('create-note-form');

        // Validates title field input and displays error messages.
        noteTitleField.addEventListener('input', () => {
            if (noteTitleField.validity.tooShort) {
                noteTitleError.textContent = 'Title needs to have at least 3 characters';
                noteTitleError.classList.add('active');
                noteTitleField.style.border = '2px solid var(--error-color)';
            }
            else if (noteTitleField.validity.valueMissing) {
                noteTitleError.textContent = 'Title is required';
                noteTitleError.classList.add('active');
                noteTitleField.style.border = '2px solid var(--error-color)';
            }
            else if (noteTitleField.checkValidity()) {
                noteTitleError.textContent = '';
                noteTitleError.classList.remove('active');
                noteTitleField.style.border = '2px solid var(--valid-color)';
            }
        });

        // Validates content field input and displays error messages.
        noteContentField.addEventListener('input', () => {
            if (noteContentField.validity.tooShort) {
                noteContentError.textContent = 'Content needs to be at least 3 characters';
                noteContentError.classList.add('active');
                noteContentField.style.border = '2px solid var(--error-color)';
            }
            else if (noteContentField.validity.valueMissing) {
                noteContentError.textContent = 'Content is required';
                noteContentError.classList.add('active');
                noteContentField.style.border = '2px solid var(--error-color)';
            }
            else if (noteContentField.checkValidity()) {
                noteContentError.textContent = '';
                noteContentError.classList.remove('active');
                noteContentField.style.border = '2px solid var(--valid-color)';
            }
        });

        // Validates create note submission. Passes user input to handler if valid.
        createNoteForm.addEventListener('submit', (e) => {
            if (noteTitleField.validity.valueMissing) {
                noteTitleError.textContent = 'Title is required';
                noteTitleError.classList.add('active');
                noteTitleField.style.border = '2px solid var(--error-color)';
            }

            if (noteContentField.validity.valueMissing) {
                noteContentError.textContent = 'Content is required';
                noteContentError.classList.add('active');
                noteContentField.style.border = '2px solid var(--error-color)';
            }

            if (createNoteForm.checkValidity()) {
                e.preventDefault();
                noteTitleError.classList.remove('active');
                noteContentError.classList.remove('active');
                noteTitleError.textContent = '';
                noteContentError.textContent = '';
                this.handleAddNoteModal(noteTitleField.value, noteContentField.value);
            }
            else {
                e.preventDefault();
            }
        });
    }

    static initCreateTaskValidation() {
        const taskNameField = document.getElementById('task-name-field');
        const taskNameError = document.getElementById('task-name-error');
        const dueDateField = document.getElementById('due-date-field');
        const dueDateError = document.getElementById('due-date-error');
        const createTaskForm = document.getElementById('create-task-form');

        // Validates task name field input and displays error messages.
        taskNameField.addEventListener('input', () => {
            if (taskNameField.validity.tooShort) {
                taskNameError.textContent = 'Name needs to have at least 3 characters';
                taskNameError.classList.add('active');
                taskNameField.style.border = '2px solid var(--error-color)';
            }
            else if (taskNameField.validity.valueMissing) {
                taskNameError.textContent = 'Name is required';
                taskNameError.classList.add('active');
                taskNameField.style.border = '2px solid var(--error-color)';
            }
            else if (taskNameField.checkValidity()) {
                taskNameError.textContent = '';
                taskNameError.classList.remove('active');
                taskNameField.style.border = '2px solid var(--valid-color)';
            }
        });

        // Validates create task submission. Passes user input to handler if valid.
        createTaskForm.addEventListener('submit', (e) => {
            if (taskNameField.validity.valueMissing) {
                taskNameError.textContent = 'Name is required';
                taskNameError.classList.add('active');
                taskNameField.style.border = '2px solid var(--error-color)';
            }

            if (dueDateField.validity.valueMissing) {
                dueDateError.textContent = 'Due date is required';
                dueDateError.classList.add('active');
                dueDateField.style.border = "2px solid var(--error-color)";
            }

            if (isPast(new Date(dueDateField.value))) {
                if (!isToday(new Date(dueDateField.value))) {
                    dueDateError.textContent = 'Due date is in the past';
                    dueDateError.classList.add('active');
                    dueDateField.style.border = "2px solid var(--error-color)";
                    return;
                }
            }

            if (createTaskForm.checkValidity()) {
                e.preventDefault();
                taskNameError.classList.remove('active');
                dueDateError.classList.remove('active');
                taskNameError.textContent = '';
                dueDateError.textContent = '';
                this.handleAddTaskModal(taskNameField.value, dueDateField.value);
            }
            else {
                e.preventDefault();
            }
        });
    }

    static initCreateProjectValidation() {
        const projectNameField = document.getElementById('project-name-field');
        const projectNameError = document.getElementById('project-name-error');
        const createProjectForm = document.getElementById('create-project-form');

        // Validates project name field input and displays error messages.
        projectNameField.addEventListener('input', () => {
            if (projectNameField.validity.tooShort) {
                projectNameError.textContent = 'Name needs to have at least 3 characters';
                projectNameError.classList.add('active');
                projectNameField.style.border = '2px solid var(--error-color)';
            }
            else if (projectNameField.validity.valueMissing) {
                projectNameError.textContent = 'Name is required';
                projectNameError.classList.add('active');
                projectNameField.style.border = '2px solid var(--error-color)';
            }
            else if (projectNameField.checkValidity()) {
                projectNameError.textContent = '';
                projectNameError.classList.remove('active');
                projectNameField.style.border = '2px solid var(--valid-color)';
            }
        });

        // Validates create project submission. Passes user input to handler if valid.
        createProjectForm.addEventListener('submit', (e) => {
            if (projectNameField.validity.valueMissing) {
                projectNameError.textContent = 'Name is required';
                projectNameError.classList.add('active');
                projectNameField.style.border = '2px solid var(--error-color)';
                return;
            }

            const newProjectName = document.getElementById('project-name-field').value;
            const projectNames = [];
            this.toDoList.getProjects().forEach((project) => {
                projectNames.push(project.getName());
            });

            if (projectNames.includes(newProjectName)) {
                projectNameError.classList.add('active');
                projectNameError.textContent = 'Project already created';
                return;
            }

            if (createProjectForm.checkValidity(e)) {
                e.preventDefault();
                projectNameError.classList.remove('active');
                projectNameError.textContent = '';
                this.handleAddProjectModal(newProjectName);
            }
            else {
                e.preventDefault();
            }
        });
    }

    // Initializes the modals.
    static initModals() {
        const cancelButtons = document.querySelectorAll('.btn-cancel-form');
        const overlay = document.getElementById('overlay');

        this.initCreateProjectValidation();
        this.initCreateTaskValidation();
        this.initCreateNoteValidation();

        cancelButtons.forEach((cancelBtn) => {
            cancelBtn.addEventListener('click', () => {
                this.closeAllModals();
            });
        });

        overlay.addEventListener('click', () => this.closeAllModals());
    }

    // Initializes tool bar buttons.
    static initToolBarButtons() {
        const createProject = document.getElementById('btn-create-project');
        const createTask = document.getElementById('btn-create-task');
        const createNote = document.getElementById('btn-create-note');
        const showTasks = document.getElementById('btn-show-tasks');
        const showNotes = document.getElementById('btn-show-notes');

        // Opens associated modal onclick / displays tasks or notes.
        createProject.addEventListener('click', () => {
            this.openModal('create-project-modal');
        });

        createTask.addEventListener('click', () => {
            const projectHeading = document.getElementById('project-heading');
            this.openModal('create-task-modal');
        });

        createNote.addEventListener('click', () => {
            this.openModal('create-note-modal');
        });

        showTasks.addEventListener('click', () => {
            this.displayProjectTasks();
        })

        showNotes.addEventListener('click', () => {
            this.displayProjectNotes();
        });
    }

    // Updates the generated projects list.
    static updateGeneratedProjects() {
        const createTaskBtn = document.getElementById('btn-create-task');
        const createNoteBtn = document.getElementById('btn-create-note');
        const showNotesBtn = document.getElementById('btn-show-notes');
        const displayProjectContainer = document.getElementById('display-project');

        this.setToDoList(Storage.getToDoList());
        const generatedProjectsContainer = document.getElementById('generated-projects');
        // Places header back before project placement.
        generatedProjectsContainer.innerHTML = '<h2>Projects</h2>';

        // Don't include agenda, today or this week.
        const projects = this.toDoList.getProjects().filter((project) => {
            if (project.getName() !== 'Agenda' &&
            project.getName() !== 'Today' &&
            project.getName() !== 'This Week') {
                return true;
            }
            return false;
        });

        // For each retrieved project from local storage, add view project button.
        projects.forEach((project) => {
            const projectButton = document.createElement('button');
            const projectIcon = document.createElement('i');
            const deleteIconContainer = document.createElement('div');
            const deleteIcon = document.createElement('i');

            projectButton.classList.add('btn-view-project');
            projectButton.textContent = project.getName();

            projectIcon.classList.add('fa-solid');
            projectIcon.classList.add('fa-calendar');
            projectIcon.classList.add('icon');

            deleteIcon.classList.add('fa-solid');
            deleteIcon.classList.add('fa-trash');
            deleteIcon.classList.add('icon');

            deleteIconContainer.appendChild(deleteIcon);

            deleteIconContainer.addEventListener('click', (e) => {
                const projectName = document.getElementById('project-heading').textContent;
                Storage.deleteProject(projectName);
                this.updateGeneratedProjects();
                this.displayProject('Agenda');
            });

            projectButton.prepend(projectIcon);
            projectButton.appendChild(deleteIconContainer);
            generatedProjectsContainer.appendChild(projectButton);
        });

        const viewProjectButtons = document.querySelectorAll('.btn-view-project');

        // For each view project button.
        viewProjectButtons.forEach(button => {
            // Display the shown project onclick.
            button.addEventListener('click', (e) => {
                if (e.target.classList.contains('btn-view-project')) {
                this.displayProject(e.target.textContent);
                e.target.classList.add('active');

                // If the displayed project is today or this week, disable tool bar buttons and hides notes grid.
                if (e.target.textContent === 'Today' || e.target.textContent === 'This Week') {
                    createTaskBtn.classList.add('disabled');
                    createNoteBtn.classList.add('disabled');
                    showNotesBtn.classList.add('disabled');
                    displayProjectContainer.classList.remove('show-notes');
                }
                else {
                    createTaskBtn.classList.remove('disabled');
                    createNoteBtn.classList.remove('disabled');
                    showNotesBtn.classList.remove('disabled');
                    displayProjectContainer.classList.add('show-notes');
                }

                // Remove active from view project buttons that are not the button clicked.
                const nonActiveButtons = Array.from(viewProjectButtons).filter((button) => button !== e.target);
                nonActiveButtons.forEach((button) => button.classList.remove('active'));
                }
            });
        });
    }

    // Initialize sidebar buttons.
    static initSideBarButtons() {
        this.updateGeneratedProjects();
        const addProject = document.getElementById('btn-add-project');
        addProject.addEventListener('click', () => {
            this.openModal('create-project-modal');
        });
    }

    // Initialize toDoList.
    static initToDoList() {
        this.setToDoList(Storage.getToDoList());
    }

    // Initialize Web App.
    static initApp() {
        // localStorage.clear();
        this.initToDoList();
        this.initToolBarButtons();
        this.initSideBarButtons();
        this.initModals();
        this.initKeyboardInput();
        this.displayProject('Agenda');
    }
}

// Starts the App.
display.initApp();