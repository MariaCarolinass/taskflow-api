export class CreateUserDTO {
    constructor({ name, email, password, role = "user" }) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
    }
}

export class UpdateUserDTO {
    constructor({ name, email, role }) {
        this.name = name;
        this.email = email;
        this.role = role;
    }
}