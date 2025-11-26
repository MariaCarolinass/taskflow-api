import { TaskModel } from "../models/task.model.js";

class TaskRepository {
  async create(data) {
    return await TaskModel.create(data);
  }

  async findAll(filter = {}) {
    return TaskModel.find(filter).sort({ createdAt: -1 });
  }
  
  async findById(id) {
    return await TaskModel.findById(id).populate("userId", "name email role");
  }

  async update(id, data) {
    const updateData = {};
    Object.keys(data).forEach(key => {
      if (data[key] !== undefined) {
        updateData[key] = data[key];
      }
    });
    
    const result = await TaskModel.findByIdAndUpdate(
      id, 
      { $set: updateData }, 
      { new: true, runValidators: true }
    ).populate("userId", "name email role");
    
    return result;
  }

  async delete(id) {
    return await TaskModel.findByIdAndDelete(id);
  }
}

export default TaskRepository;
