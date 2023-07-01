import { ToDoList } from './ToDoList.js';
import { Project } from './Project.js';
import { Task } from './Task.js';

class Storage {
    static saveToDoList(data) {
        localStorage.setItem('toDoList', JSON.stringify(data));
    }

    static getToDoList() {
        const toDoList = Object.assign(
            new ToDoList(), JSON.parse(localStorage.getItem('toDoList'))
        );
        
        toDoList.setProjects(
            toDoList.getProjects()
            .map((project) => Object.assign(new Project(), project))
        );

        toDoList.getProjects().forEach((project) => {
            project.setTasks(project.getTasks()
            .map((task) => Object.assign(new Task(), task))
            );
        });

        return toDoList
    }

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
        toDoList.saveToDoList();
    }

    static renameTask(projectName, taskName, newTaskName) {
        const toDoList = Storage.getToDoList();
        toDoList.getProject(projectName).getTask(taskName).setName(newTaskName);
        Storage.saveToDoList();
    }

    static setTaskDate(projectName, taskName, newDueDate) {
        const toDoList = Storage.getToDoList();
        toDoList.getProject(projectName).getTask(taskName).setDueDate(newDueDate);
        toDoList.saveToDoList();
    }

    static updateToday() {
        const toDoList = Storage.getToDoList();
        toDoList.updateToday();
        Storage.saveToDoList();
    }

    static updateThisWeek() {
        const toDoList = Storage.getToDoList();
        toDoList.updateThisWeek();
        Storage.saveToDoList();
    }
}