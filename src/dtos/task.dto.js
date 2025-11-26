export class CreateTaskDTO {
    constructor({ title, description = "", status = "pending", dueDate, userId }) {
        this.title = title;
        this.description = description;
        this.status = status;
        this.dueDate = dueDate ? new Date(dueDate) : null;
        this.userId = userId;
    }
}

export class UpdateTaskDTO {
    constructor({ title, description, status, dueDate }) {
        this.title = title;
        this.description = description;
        this.status = status;
        this.dueDate = dueDate ? new Date(dueDate) : null;
    }
}