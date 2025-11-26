import UserRepository from "../repositories/user.repository.js";

const repo = new UserRepository();

class UserService {
  async getAll() {
    return await repo.findAll();
  }

  async getById(id) {
    return await repo.findById(id);
  }

  async update(id, data, currentUser) {
    if (currentUser.role !== "admin" && currentUser.id !== id) throw new Error("FORBIDDEN");
    return await repo.update(id, data);
  }

  async delete(id, currentUser) {
    if (currentUser.role !== "admin") throw new Error("FORBIDDEN");
    await repo.delete(id);
    return true;
  }
}

export default UserService;