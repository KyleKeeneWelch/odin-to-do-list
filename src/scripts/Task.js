export class Task {
    constructor(name, dueDate = 'No date') {
        this.name = name;
        this.dueDate = dueDate;
        this.status = false;
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

    getStatus() {
        return this.status;
    }

    setStatus(status) {
        this.status = status;
    }

    // Rearranges due date to be in the date required for imported module.
    getDueDateFormatted() {
        const day = this.dueDate.split('-')[2];
        const year = this.dueDate.split('-')[0];
        const month = this.dueDate.split('-')[1];
        return `${month}-${day}-${year}`;
    }
}