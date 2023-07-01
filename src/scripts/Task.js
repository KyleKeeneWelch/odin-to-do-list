export class Task {
    constructor(name, dueDate = 'No date') {
        this.name = name;
        this.dueDate = dueDate;
    }

    getName() {
        return this.name;
    }

    setName(newName) {
        this.name = newName;
    }

    getDueDate() {
        return this.dueDate;
    }

    setDueDate(newDate) {
        this.dueDate = newDate;
    }

    getDueDateFormatted() {
        const day = this.dueDate.split('/')[0];
        const month = this.dueDate.split('/')[1];
        const year = this.dueDate.split('/')[2];
        return `${month}/${day}/${year}`;
    }
}