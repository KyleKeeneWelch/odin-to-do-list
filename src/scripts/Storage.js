import { ToDoList } from './ToDoList.js';
import { Project } from './Project.js';
import { Task } from './Task.js';

export class Storage {
    static saveToDoList(data) {
        localStorage.setItem('toDoList', JSON.stringify(data));
    }

    static getToDoList() {
        const toDoList = Object.assign(
            new ToDoList(), JSON.parse(localStorage.getItem('toDoList'))
        );

        // if (toDoList === null) {
        //     const newToDoList = new ToDoList();
        //     const agenda = new Project('Agenda');
        //     const today = new Project('Today');
        //     const thisWeek = new Project('This Week');
        //     newToDoList.addProject(agenda);
        //     newToDoList.addProject(today);
        //     newToDoList.addProject(thisWeek);
        //     this.saveToDoList(newToDoList);
        //     return newToDoList;
        // }
        
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

// const myProject2 = new Project('myProject2');
// Storage.addProject(myProject2);
// const myTask = new Task('myTask', '5/7/2023');
// const myTask2 = new Task('myTask2', '5/7/2023');
// Storage.addTask('myProject', myTask);
// Storage.addTask('myProject', myTask2);