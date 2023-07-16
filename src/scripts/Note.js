export class Note {
    constructor(name, content = '') {
        this.name = name;
        this.content = content;
    }

    getName() {
        return this.name;
    }

    setName(newName) {
        this.name = newName;
    }

    getContent() {
        return this.content;
    }

    setContent(newContent) {
        this.content = newContent;
    }
}