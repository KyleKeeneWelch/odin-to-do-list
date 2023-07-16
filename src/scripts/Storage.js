import { ToDoList } from './ToDoList.js';
import { Project } from './Project.js';
import { Task } from './Task.js';

export class Storage {
    // Save to local storage.
    static saveToDoList(data) {
        localStorage.setItem('toDoList', JSON.stringify(data));
    }

    static getToDoList() {
        // Retrieve local storage.
        const toDoList = Object.assign(
            new ToDoList(), JSON.parse(localStorage.getItem('toDoList'))
        );

        // Init toDoList.
        if (toDoList === null) {
            const newToDoList = new ToDoList();
            const agenda = new Project('Agenda');
            const today = new Project('Today');
            const thisWeek = new Project('This Week');
            newToDoList.addProject(agenda);
            newToDoList.addProject(today);
            newToDoList.addProject(thisWeek);
            this.saveToDoList(newToDoList);
            return newToDoList;
        }
        
        // Assign projects from local storage.
        toDoList.setProjects(
            toDoList.getProjects()
            .map((project) => Object.assign(new Project(), project))
        );

        // Assign tasks to projects from local storage.
        toDoList.getProjects().forEach((project) => {
            project.setTasks(project.getTasks()
            .map((task) => Object.assign(new Task(), task))
            );
        });

        return toDoList
    }

    // Get toDoList, make addition/modification, save.
    static addProject(project) {
        const toDoList = Storage.getToDoList();
        toDoList.addProject(project);
        Storage.saveToDoList(toDoList);
    }

    static deleteProject(projectName) {
        const toDoList = Storage.getToDoList()
        toDoList.deleteProject(projectName);
        Storage.saveToDoList(toDoList);
    }

    static addTask(projectName, task) {
        const toDoList = Storage.getToDoList();
        toDoList.getProject(projectName).addTask(task);
        Storage.saveToDoList(toDoList);
    }

    static deleteTask(projectName, taskName) {
        const toDoList = Storage.getToDoList();
        toDoList.getProject(projectName).deleteTask(taskName);
        Storage.saveToDoList(toDoList);
    }

    static addNote(projectName, note) {
        const toDoList = Storage.getToDoList();
        toDoList.getProject(projectName).addNote(note);
        Storage.saveToDoList(toDoList);
    }

    static deleteNote(projectName, noteName) {
        const toDoList = Storage.getToDoList();
        toDoList.getProject(projectName).deleteNote(noteName);
        Storage.saveToDoList(toDoList);
    }

    static renameNote(projectName, noteName, newNoteName) {
        const toDoList = Storage.getToDoList();
        toDoList.getProject(projectName).getNote(noteName).setName(newNoteName);
        Storage.saveToDoList(toDoList);
    }

    static renameTask(projectName, taskName, newTaskName) {
        const toDoList = Storage.getToDoList();
        toDoList.getProject(projectName).getTask(taskName).setName(newTaskName);
        Storage.saveToDoList(toDoList);
    }

    static setTaskDate(projectName, taskName, newDueDate) {
        const toDoList = Storage.getToDoList();
        toDoList.getProject(projectName).getTask(taskName).setDueDate(newDueDate);
        toDoList.saveToDoList(toDoList);
    }

    static updateToday() {
        const toDoList = Storage.getToDoList();
        toDoList.updateToday();
        Storage.saveToDoList(toDoList);
    }

    static updateThisWeek() {
        const toDoList = Storage.getToDoList();
        toDoList.updateThisWeek();
        Storage.saveToDoList(toDoList);
    }
}