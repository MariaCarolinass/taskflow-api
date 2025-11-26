import Joi from "joi";

export const createTaskSchema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().max(500).optional(),
    status: Joi.string().valid("pending", "in-progress", "completed").optional(),
    dueDate: Joi.date().optional()
});

export const updateTaskSchema = Joi.object({
    title: Joi.string().min(3).max(100).optional(),
    description: Joi.string().max(500).optional(),
    status: Joi.string().valid("pending", "in-progress", "completed").optional(),
    dueDate: Joi.date().optional()
});

export const validateBody = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) return res.status(400).json({ errors: error.details.map(d => d.message) });
    next();
};