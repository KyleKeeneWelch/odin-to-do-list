import { Project } from './Project.js';
import { compareAsc, toDate } from "date-fns";
import { Task } from './Task.js';

export class ToDoList {
    constructor() {
        this.projects = [];
        this.projects.push(new Project('Agenda'));
        this.projects.push(new Project('Today'));
        this.projects.push(new Project('This Week'));
    }

    setProjects(projects) {
        this.projects = projects;
    }

    getProjects() {
        return this.projects;
    }

    getProject(projectName) {
        return this.projects.find((project) => project.getName() === projectName);
    }

    contains(projectName) {
        return this.projects.some((project) => project.getName() === projectName);
    }

    addProject(newProject) {
        if (this.projects.find((project) => project.name === newProject.name)) return;
        this.projects.push(newProject);
    }

    deleteProject(projectName) {
        const deleteProject = this.projects.find((project) => project.getName() === projectName);
        this.projects.splice(this.projects.indexOf(deleteProject), 1);
    }

    updateToday() {
        this.getProject('Today').tasks = [];

        this.projects.forEach((project) => {
            if (project.getName() === 'Today' || project.getName() === 'This week') return;
            const todayTasks = project.getTasksToday();
            todayTasks.forEach((task) => {
                const taskName = `${task.getName()} (${project.getName()})`;
                this.getProject('Today').addTask(new Task(taskName, task.getDueDate()));
            });
        });
    }

    updateThisWeek() {
        this.getProject('This Week').tasks = [];

        this.projects.forEach((project) => {
            if (project.getName() === 'Today' || project.getName() === 'This Week') return;
            const weekTasks = project.getTasksThisWeek();
            weekTasks.forEach((task) => {
                const taskName = `${task.getName()} (${project.getName()})`;
                this.getProject('This Week').addTask(new Task(taskName, task.getDueDate()));
            });
        })
        this.getProject('This Week').setTasks(
            this.getProject('This Week').getTasks()
            .sort((a, b) => compareAsc(
                toDate(new Date(a.getDueDateFormatted())), 
                toDate(new Date(b.getDueDateFormatted()))))
        );
    }
}