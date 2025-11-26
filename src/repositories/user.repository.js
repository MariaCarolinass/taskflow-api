import { UserModel } from "../models/user.model.js";

class UserRepository {
  async create(user) {
    return await UserModel.create(user);
  }

  async findByEmail(email) {
    return await UserModel.findOne({ email });
  }

  async findById(id) {
    return TaskModel.findById(id).populate("userId", "name email role");
  }  

  async findAll() {
    return await UserModel.find().select("-password");
  }

  async update(id, data) {
    return await UserModel.findByIdAndUpdate(id, data, { new: true }).select("-password");
  }

  async delete(id) {
    return await UserModel.findByIdAndDelete(id);
  }
}

export default UserRepository;