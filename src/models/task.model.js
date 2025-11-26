import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
    title: { type: String, required: true, minlength: 3, maxlength: 100 },
    description: { type: String, maxlength: 500 },
    status: { type: String, required: true, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
    dueDate: { type: Date, default: null },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });
    
export const TaskModel = mongoose.model("Task", TaskSchema);