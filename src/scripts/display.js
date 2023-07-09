import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/brands';
import '@fortawesome/fontawesome-free/js/solid';
import '../styles/main.css';
import { Storage } from './Storage.js';
import { Project } from './Project.js';
import { Task } from './Task.js';
import { isPast } from 'date-fns/esm';
import { isToday } from 'date-fns';

class display {
    static getToDoList() {
        return this.toDoList;
    }

    static setToDoList(toDoList) {
        this.toDoList = toDoList;
    }

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

        if (!task.getStatus()) {
            iconCircle.classList.add('fa-solid');
            iconCircle.classList.add('fa-circle');
        }
        else {
            iconCircle.classList.add('fa-solid');
            iconCircle.classList.add('fa-circle-check');
            taskContainer.classList.add('complete');
        }

        taskName.id = 'task-name';
        taskName.textContent = task.getName();

        taskNameEditForm.noValidate = true;
        taskNameEditForm.id = 'task-name-edit-form';
        taskNameEditForm.action = '#';

        taskNameEdit.id = 'task-name-edit';
        taskNameEdit.type = 'text';
        taskNameEdit.placeholder = 'Enter new task name...';
        taskNameEdit.minLength = 3;
        taskNameEdit.autocomplete = false;
        taskNameEdit.maxLength = 200;
        taskNameEdit.required = true;

        taskNameEditSubmit.type = 'submit';
        taskNameEditSubmit.id = 'task-name-edit-submit';

        taskNameEditCancel.type = 'button';
        taskNameEditCancel.id = 'task-name-edit-cancel';

        taskNameEditSubmitIcon.classList.add('fa-solid');
        taskNameEditSubmitIcon.classList.add('fa-check');
        taskNameEditSubmitIcon.classList.add('icon');

        taskNameEditCancelIcon.classList.add('fa-solid');
        taskNameEditCancelIcon.classList.add('fa-x');
        taskNameEditCancelIcon.classList.add('icon');

        taskNameEditError.classList.add('error');
        taskNameEditError.id = 'task-name-edit-error';

        iconTrash.classList.add('fa-solid');
        iconTrash.classList.add('fa-trash');

        dueDate.id = 'due-date';
        dueDate.textContent = task.getDueDate();

        dueDateEditForm.noValidate = true;
        dueDateEditForm.id = 'due-date-edit-form';
        dueDateEditForm.action = '#';

        dueDateEdit.id = 'due-date-edit';
        dueDateEdit.type = 'date';

        dueDateEditSubmit.type = 'submit';
        dueDateEditSubmit.id = 'due-date-edit-submit';

        dueDateEditCancel.type = 'button';
        dueDateEditCancel.id = 'due-date-edit-cancel';

        dueDateEditSubmitIcon.classList.add('fa-solid');
        dueDateEditSubmitIcon.classList.add('fa-check');
        dueDateEditSubmitIcon.classList.add('icon');

        dueDateEditCancelIcon.classList.add('fa-solid');
        dueDateEditCancelIcon.classList.add('fa-x');
        dueDateEditCancelIcon.classList.add('icon');

        dueDateEditError.classList.add('error');
        dueDateEditError.id = 'due-date-edit-error';

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

        iconTrashContainer.addEventListener('click', (e) => {
            const projectHeading = document.getElementById('project-heading');
            const project = this.toDoList.getProject(projectHeading.textContent);
            Storage.deleteTask(project.getName(), e.target.parentNode.parentNode.parentNode.children[1].textContent);
            this.displayProject(project.getName());
        });

        taskName.addEventListener('click', () => {
            taskName.style.display = 'none';
            taskNameEditForm.style.display = 'grid';
        });

        dueDate.addEventListener('click', () => {
            dueDate.style.display = 'none';
            dueDateEditForm.style.display = 'grid';
        });

        taskNameEditCancel.addEventListener('click', () => {
            taskNameEdit.style.border = 'none';
            taskNameEditError.textContent = '';
            taskNameEditError.classList.remove('active');
            taskName.style.display = 'inline-block';
            taskNameEdit.value = '';
            taskNameEditForm.style.display = 'none';
        });

        dueDateEditCancel.addEventListener('click', () => {
            dueDate.style.display = 'inline-block';
            dueDateEdit.value = '';
            dueDateEdit.style.border = 'none';
            dueDateEditError.textContent = '';
            dueDateEditError.classList.remove('active');
            dueDateEditForm.style.display = 'none';
        });

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
        taskContainer.appendChild(dueDate);
        taskContainer.appendChild(dueDateEditForm);
        taskContainer.appendChild(iconTrashContainer);
        taskGrid.appendChild(taskContainer);
    }

    static updateTasks(tasks) {
        const taskGrid = document.getElementById('project-tasks-grid');
        taskGrid.innerHTML = '';
        tasks.forEach((task) => {
            this.createTaskContainer(task);   
        });
    }

    static displayProject(projectName) {
        this.setToDoList(Storage.getToDoList());
        const project = this.toDoList.getProject(projectName);
        const projectHeading = document.getElementById('project-heading');
        projectHeading.textContent = project.getName();
        this.updateTasks(project.getTasks());
    }

    static handleAddProjectModal(newProjectName) {
        this.closeAllModals();
        const newProject = new Project(newProjectName);
        Storage.addProject(newProject);
        this.updateGeneratedProjects();
    }

    static handleAddTaskModal(newTaskName, newDueDate) {
        this.closeAllModals();
        const newTask = new Task(newTaskName, newDueDate);
        const currentProject = document.getElementById('project-heading');
        Storage.addTask(currentProject.textContent, newTask);
        this.setToDoList(Storage.getToDoList());
        this.updateTasks(this.getToDoList().getProject(currentProject.textContent).getTasks());
    }

    static handleAddNoteModal() {
        this.closeAllModals();
    }

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

    static openModal(modalName) {
        const modal = document.getElementById(modalName);
        const overlay = document.getElementById('overlay');
        modal.classList.add('active');
        overlay.classList.add('active');
    }

    static initKeyboardInput() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        })
    }

    static initCreateNoteValidation() {
        const noteTitleField = document.getElementById('note-title-field');
        const noteTitleError = document.getElementById('note-title-error');
        const noteContentField = document.getElementById('note-content-field');
        const noteContentError = document.getElementById('note-content-error');
        const createNoteForm = document.getElementById('create-note-form');

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
                this.handleAddNoteModal();
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

    static initToolBarButtons() {
        const createProject = document.getElementById('btn-create-project');
        const createTask = document.getElementById('btn-create-task');
        const createNote = document.getElementById('btn-create-note');
        const showTasks = document.getElementById('btn-show-tasks');
        const showNotes = document.getElementById('btn-show-notes');

        createProject.addEventListener('click', () => {
            this.openModal('create-project-modal');
        });

        createTask.addEventListener('click', () => {
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

    static updateGeneratedProjects() {
        this.setToDoList(Storage.getToDoList());
        const generatedProjectsContainer = document.getElementById('generated-projects');
        generatedProjectsContainer.innerHTML = '<h2>Projects</h2>';

        const projects = this.toDoList.getProjects().filter((project) => {
            if (project.getName() !== 'Agenda' &&
            project.getName() !== 'Today' &&
            project.getName() !== 'This Week') {
                return true;
            }
            return false;
        });

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

        viewProjectButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                if (e.target.classList.contains('btn-view-project')) {
                this.displayProject(e.target.textContent);
                e.target.classList.add('active');

                const nonActiveButtons = Array.from(viewProjectButtons).filter((button) => button !== e.target);
                nonActiveButtons.forEach((button) => button.classList.remove('active'));
                }
            });
        });
    }

    static initSideBarButtons() {
        this.updateGeneratedProjects();
        const addProject = document.getElementById('btn-add-project');
        addProject.addEventListener('click', () => {
            this.openModal('create-project-modal');
        });
    }

    static initToDoList() {
        this.setToDoList(Storage.getToDoList());
    }

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

display.initApp();