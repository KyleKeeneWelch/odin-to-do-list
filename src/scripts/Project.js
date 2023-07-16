import { isToday, isThisWeek } from "date-fns";
import { Task } from './Task.js';
import { Note } from './Note.js';

export class Project {
    constructor (name) {
        this.name = name;
        this.tasks = [];
        this.notes = [];
    }

    setName(name) {
        this.name = name;
    }

    getName() {
        return this.name;
    }

    setTasks(tasks) {
        this.tasks = tasks;
    }

    getTasks() {
        return this.tasks;
    }

    getTask(taskName) {
        return this.tasks.find((task) => task.getName() === taskName);
    }

    getNotes() {
        return this.notes;
    }

    getNote(noteName) {
        return this.notes.find((note) => note.getName() === noteName);
    }

    setNotes(notes) {
        this.notes = notes;
    }

    contains(taskName) {
        return this.tasks.some((task) => task.getName() === taskName);
    }

    addTask(newTask) {
        if (this.tasks.find((task) => task.getName() === newTask.name)) return;
        this.tasks.push(newTask);
    }

    addNote(newNote) {
        this.notes.push(newNote);
    }

    deleteTask(taskName) {
        this.tasks = this.tasks.filter((task) => task.getName() !== taskName);
    }

    deleteNote(noteName) {
        this.notes = this.notes.filter((note) => note.name !== noteName);
    }

    // Returns tasks in this project that have a due date that is today.
    getTasksToday() {
        return this.tasks.filter((task) => {
            const taskDate = new Date(task.getDueDateFormatted());
            return isToday(taskDate);
        })
    }

    // Returns tasks in this project that have a due date that is this week.
    getTasksThisWeek() {
        return this.tasks.filter((task) => {
            const taskDate = new Date(task.getDueDateFormatted());
            return isThisWeek(taskDate);
        })
    }
}